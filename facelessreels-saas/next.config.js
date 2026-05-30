/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.pexels.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
  // Exclude heavy Remotion server packages from the serverless bundle.
  // The local renderer is only used for dev/desktop; Lambda handles prod rendering.
  experimental: {
    serverComponentsExternalPackages: [
      "@remotion/renderer",
      "@remotion/bundler",
      "@remotion/cli",
      "remotion",
    ],
  },
};

module.exports = nextConfig;
