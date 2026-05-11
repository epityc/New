import { prisma } from "./prisma";
import { generateScript } from "./openai";
import { generateAudio } from "./elevenlabs";
import { fetchPexelsFootage } from "./pexels";
import { uploadAudio } from "./storage";

export async function runGenerationPipeline(videoId: string): Promise<void> {
  try {
    const video = await prisma.video.findUniqueOrThrow({ where: { id: videoId } });

    // ── 1. Script ──────────────────────────────────────────────────────────
    await prisma.video.update({ where: { id: videoId }, data: { status: "SCRIPTING" } });

    const script = await generateScript(
      video.topic,
      video.niche,
      video.language,
      video.durationTarget
    );

    await prisma.video.update({ where: { id: videoId }, data: { script } });

    // ── 2. Audio + word timestamps ─────────────────────────────────────────
    await prisma.video.update({ where: { id: videoId }, data: { status: "GENERATING_AUDIO" } });

    const voiceId = video.voiceId ?? "pNInz6obpgDQGcFmaJgB"; // Adam default
    const { audioBuffer, wordTimestamps } = await generateAudio(script, voiceId);
    const audioUrl = await uploadAudio(audioBuffer, videoId);

    await prisma.video.update({
      where: { id: videoId },
      data: { audioUrl, wordTimestamps },
    });

    // ── 3. B-roll footage ──────────────────────────────────────────────────
    await prisma.video.update({ where: { id: videoId }, data: { status: "FETCHING_FOOTAGE" } });

    const backgroundUrls = await fetchPexelsFootage(video.artStyle, video.niche, 5);

    await prisma.video.update({
      where: { id: videoId },
      data: { backgroundUrls, status: "RENDERING" },
    });

    // ── 4. Rendering ───────────────────────────────────────────────────────
    // Remotion rendering is handled in Step 4.
    // For now, mark as COMPLETED so the UI can show the assets are ready.
    // TODO: replace with actual Remotion render call
    await prisma.video.update({ where: { id: videoId }, data: { status: "COMPLETED" } });

  } catch (err: any) {
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "FAILED", errorMessage: err?.message ?? "Unknown error" },
    }).catch(() => {}); // ignore DB errors in error handler
  }
}
