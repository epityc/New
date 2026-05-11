/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.pexels.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // Allow large response bodies for video rendering
  experimental: {
    serverActions: { bodySizeLimit: "50mb" },
  },
};

module.exports = nextConfig;
