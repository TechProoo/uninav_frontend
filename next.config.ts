import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
  images: {
    domains: [
      "uninav-media.c8c3.va01.idrivee2-92.com",
      "img.freepik.com",
      "randomuser.me",
    ],
  },
  experimental: {
    turbo: {
      loaders: {
        // Configure loaders to be used by turbo
        ".svg": ["@svgr/webpack"],
      },
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
