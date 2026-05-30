import { renderMediaOnLambda } from "@remotion/lambda/client";
import type { AwsRegion } from "@remotion/lambda";
import type { FacelessVideoProps } from "../remotion/types";

export async function startLambdaRender(
  videoId: string,
  props: FacelessVideoProps
): Promise<{ renderId: string; bucketName: string }> {
  const region = (process.env.REMOTION_AWS_REGION ?? "us-east-1") as AwsRegion;

  const { renderId, bucketName } = await renderMediaOnLambda({
    region,
    functionName: process.env.REMOTION_FUNCTION_NAME!,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition: "FacelessVideo",
    codec: "h264",
    inputProps: props as unknown as Record<string, unknown>,
    framesPerLambda: 20,
    outName: `${videoId}.mp4`,
    webhook: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/remotion`,
      secret: process.env.REMOTION_WEBHOOK_SECRET!,
    },
    chromiumOptions: { disableWebSecurity: true },
  });

  return { renderId, bucketName };
}
