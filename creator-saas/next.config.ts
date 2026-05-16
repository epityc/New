import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "external-api.arcads.ai" },
    ],
  },
};

export default nextConfig;
