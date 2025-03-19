import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        './document.js': './components/reader/document.tsx',
        canvas: "./empty-module.ts",
      },
    },
  },
};

export default nextConfig;
