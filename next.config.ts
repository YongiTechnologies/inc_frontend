import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server build (server.js + only the files it needs) for the
  // Docker image used on the Hetzner server.
  output: "standalone",
};

export default nextConfig;
