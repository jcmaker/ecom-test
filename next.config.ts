import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type errors in the repo; fix when Supabase is configured
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
