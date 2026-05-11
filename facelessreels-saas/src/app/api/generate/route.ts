import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runGenerationPipeline } from "@/lib/pipeline";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.creditsBalance < 1) {
    return NextResponse.json(
      { error: "Insufficient credits. Please purchase more." },
      { status: 402 }
    );
  }

  const body = await req.json();
  const { topic, niche, voiceId, artStyle, captionStyle, duration, language } = body;

  if (!topic?.trim() && !niche) {
    return NextResponse.json({ error: "Topic or niche is required" }, { status: 400 });
  }

  // Create video record and deduct credit atomically
  const [video] = await prisma.$transaction([
    prisma.video.create({
      data: {
        userId: user.id,
        topic: topic?.trim() ?? "",
        niche: niche || null,
        voiceId: voiceId || null,
        artStyle: artStyle ?? "cinematic",
        captionStyle: captionStyle ?? "bold_stroke",
        durationTarget: duration ?? 60,
        language: language ?? "en",
        status: "PENDING",
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { creditsBalance: { decrement: 1 } },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "USAGE",
        credits: -1,
        description: `Video generation`,
      },
    }),
  ]);

  // Fire-and-forget pipeline (runs in Node.js background)
  void runGenerationPipeline(video.id);

  return NextResponse.json({ videoId: video.id });
}
