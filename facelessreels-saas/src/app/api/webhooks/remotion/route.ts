import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "@remotion/lambda/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("X-Remotion-Signature") ?? "";

  // Verify the payload came from Remotion Lambda
  try {
    validateWebhookSignature({
      secret: process.env.REMOTION_WEBHOOK_SECRET!,
      body,
      signatureHeader: signature,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const { type, renderId, outputUrl, errors } = payload;

  // Find the video by its remotionRenderId
  const video = await prisma.video.findFirst({
    where: { remotionRenderId: renderId },
  });

  if (!video) {
    // Unknown render — acknowledge to avoid retries
    return NextResponse.json({ ok: true });
  }

  if (type === "success") {
    await prisma.video.update({
      where: { id: video.id },
      data: { status: "COMPLETED", finalVideoUrl: outputUrl },
    });
  } else if (type === "error" || type === "timeout") {
    const message = errors?.[0]?.message ?? type;
    await prisma.video.update({
      where: { id: video.id },
      data: { status: "FAILED", errorMessage: message },
    });
  }

  return NextResponse.json({ ok: true });
}
