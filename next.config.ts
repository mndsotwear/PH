import type { NextConfig } from "next";

// GitHub Pages serves the site under /PH; `next dev` serves it from the root.
const basePath = process.env.NODE_ENV === "production" ? "/PH" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
