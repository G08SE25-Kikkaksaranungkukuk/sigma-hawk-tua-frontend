import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins : ["http://localhost:8080"],
  output: "standalone", // Enable standalone output for Docker optimization
};

export default nextConfig;
