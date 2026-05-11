import path from "path";
import os from "os";
import fs from "fs/promises";
import { uploadVideo } from "./storage";
import type { FacelessVideoProps } from "../remotion/types";

const FPS = 30;

// Cache the bundle URL across requests in the same Node.js process
let bundleUrlCache: string | null = null;

async function getServeUrl(): Promise<string> {
  if (bundleUrlCache) return bundleUrlCache;

  // Dynamic imports — these are heavy Node.js packages not suitable for the edge
  const { bundle } = await import("@remotion/bundler");

  bundleUrlCache = await bundle({
    entryPoint: path.resolve(process.cwd(), "src/remotion/Root.tsx"),
    // Carry over the @/ alias used in Remotion components (none currently, but safe to have)
    webpackOverride: (config) => config,
    enableCaching: true,
  });

  return bundleUrlCache;
}

export async function renderVideo(
  videoId: string,
  props: FacelessVideoProps
): Promise<string> {
  const { renderMedia, selectComposition } = await import("@remotion/renderer");

  const serveUrl = await getServeUrl();
  const durationInFrames = Math.ceil(props.durationTarget * FPS) + FPS; // +1s buffer

  const composition = await selectComposition({
    serveUrl,
    id: "FacelessVideo",
    inputProps: props,
    timeoutInMilliseconds: 30_000,
  });

  // Override duration with our calculated value so it matches the audio
  composition.durationInFrames = durationInFrames;

  const outputPath = path.join(os.tmpdir(), `${videoId}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: props,
    timeoutInMilliseconds: 600_000, // 10 min max
    chromiumOptions: { disableWebSecurity: true }, // needed for cross-origin Pexels videos
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) {
        console.log(`[Remotion] ${videoId}: ${Math.round(progress * 100)}%`);
      }
    },
  });

  const buffer = await fs.readFile(outputPath);
  const videoUrl = await uploadVideo(buffer, videoId);

  await fs.unlink(outputPath).catch(() => {});

  return videoUrl;
}
