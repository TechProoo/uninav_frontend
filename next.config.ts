import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for better performance
  compiler: {
    // Enable React server components
    reactRemoveProperties: process.env.NODE_ENV === "production",
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    return config;
  },
  images: {
    domains: ["uninav-media.c8c3.va01.idrivee2-92.com"],
  },
  experimental: {
    // Enable turbo specific optimizations
    turbo: {
      loaders: {
        // Configure loaders to be used by turbo
        ".svg": ["@svgr/webpack"],
      },
    },
  },
};

export default nextConfig;
