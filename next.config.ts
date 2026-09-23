import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages serves this as static files from dist/ (the project's build output directory);
  // the root "/" language redirect lives in functions/index.js, because a static export cannot run proxy.ts.
  output: "export",
  distDir: "dist",
  images: { unoptimized: true },
};

export default nextConfig;
