import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",          // خروجی استاتیک در پوشه out
  images: { unoptimized: true },
  trailingSlash: true,

  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
