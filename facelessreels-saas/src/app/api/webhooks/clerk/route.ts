import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) return new Response("Missing webhook secret", { status: 500 });

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses } = event.data;
    const email = email_addresses[0]?.email_address ?? "";
    await prisma.user.create({
      data: {
        clerkId: id,
        email,
        creditsBalance: 3,
        transactions: {
          create: {
            type: "BONUS",
            credits: 3,
            description: "Welcome bonus — 3 free credits",
          },
        },
      },
    });
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;
    if (id) await prisma.user.deleteMany({ where: { clerkId: id } });
  }

  return new Response("OK", { status: 200 });
}
