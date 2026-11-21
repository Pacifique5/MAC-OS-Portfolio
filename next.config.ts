import type { NextConfig } from "next";
import path from "node:path";

// Pin the project root to this folder. Without this, Next.js picks up the
// package.json / lockfiles in the user's home directory and treats the whole
// home folder as the workspace, which breaks file watching in local dev
// (edits to globals.css were never picked up). Vercel only sees this repo,
// so it was unaffected.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
