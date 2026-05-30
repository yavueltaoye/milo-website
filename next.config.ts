import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root to this folder (a parent lockfile exists one level up).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
