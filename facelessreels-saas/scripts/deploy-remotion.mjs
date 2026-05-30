/**
 * deploy-remotion.mjs
 *
 * One-time setup script: deploys the Remotion Lambda function and uploads the
 * Remotion bundle to S3. Run this once before deploying to Vercel, then copy
 * the printed values into your Vercel environment variables.
 *
 * Prerequisites:
 *   - AWS credentials configured (env vars or ~/.aws/credentials)
 *   - AWS_REGION set (or defaults to us-east-1)
 *
 * Usage:
 *   node scripts/deploy-remotion.mjs
 */

import {
  deployFunction,
  deploySite,
  getOrCreateBucket,
} from "@remotion/lambda";

const REGION = process.env.REMOTION_AWS_REGION ?? "us-east-1";
const SITE_NAME = "facelessreels";

async function main() {
  console.log(`\n🚀 Deploying Remotion Lambda to ${REGION}...\n`);

  // 1. Create / reuse S3 bucket
  const { bucketName } = await getOrCreateBucket({ region: REGION });
  console.log(`✅ S3 bucket: ${bucketName}`);

  // 2. Deploy the Lambda function
  const { functionName } = await deployFunction({
    region: REGION,
    timeoutInSeconds: 240,
    memorySizeInMb: 3008,
    createCloudWatchLogGroup: true,
    architecture: "arm64",
  });
  console.log(`✅ Lambda function: ${functionName}`);

  // 3. Bundle and upload the Remotion composition to S3
  const { serveUrl } = await deploySite({
    entryPoint: new URL("../src/remotion/Root.tsx", import.meta.url).pathname,
    bucketName,
    region: REGION,
    siteName: SITE_NAME,
  });
  console.log(`✅ Remotion serve URL: ${serveUrl}`);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add these to your Vercel environment variables:

REMOTION_AWS_REGION=${REGION}
REMOTION_FUNCTION_NAME=${functionName}
REMOTION_SERVE_URL=${serveUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
