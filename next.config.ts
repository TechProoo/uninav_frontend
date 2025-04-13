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
    // Add SVG handling configuration
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add specific rule for SVG files
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
    // Enable turbo specific optimizations
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
