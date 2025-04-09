import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  },
  images: {
    domains: [
      "uninav-media.c8c3.va01.idrivee2-92.com", // 👈 Add this
    ],
  },
};

export default nextConfig;
