import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root to this folder (a parent lockfile exists one level up).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve modern formats; AVIF first, WebP fallback. Sources are pre-capped at
    // 2400px (scripts/optimize-images.mjs) so these device sizes never upscale.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 2_592_000, // 30 days
  },
};

export default nextConfig;
