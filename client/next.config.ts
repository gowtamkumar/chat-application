import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // <-- increase limit (e.g., 10mb, 20mb)
    },
  },
  images: {
    remotePatterns: [{ protocol: "http", hostname: "**" }],
  },
};

export default nextConfig;
