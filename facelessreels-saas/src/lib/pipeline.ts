import { prisma } from "./prisma";
import { generateScript } from "./openai";
import { generateAudio } from "./elevenlabs";
import { fetchPexelsFootage } from "./pexels";
import { uploadAudio } from "./storage";
import { startLambdaRender } from "./render";
import type { WordTimestamp } from "../remotion/types";

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
      data: { audioUrl, wordTimestamps: wordTimestamps as object[] },
    });

    // ── 3. B-roll footage ──────────────────────────────────────────────────
    await prisma.video.update({ where: { id: videoId }, data: { status: "FETCHING_FOOTAGE" } });

    const backgroundUrls = await fetchPexelsFootage(video.artStyle, video.niche, 5);

    await prisma.video.update({
      where: { id: videoId },
      data: { backgroundUrls },
    });

    // ── 4. Start Lambda render (async — completion handled via webhook) ────
    const freshVideo = await prisma.video.findUniqueOrThrow({ where: { id: videoId } });

    const { renderId, bucketName } = await startLambdaRender(videoId, {
      audioUrl: freshVideo.audioUrl!,
      backgroundUrls: freshVideo.backgroundUrls,
      wordTimestamps: (freshVideo.wordTimestamps ?? []) as unknown as WordTimestamp[],
      captionStyle: freshVideo.captionStyle,
      durationTarget: freshVideo.durationTarget,
    });

    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "RENDERING",
        remotionRenderId: renderId,
        remotionBucketName: bucketName,
      },
    });

    // Pipeline ends here — Remotion Lambda calls /api/webhooks/remotion when done

  } catch (err: any) {
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "FAILED", errorMessage: err?.message ?? "Unknown error" },
    }).catch(() => {});
  }
}
