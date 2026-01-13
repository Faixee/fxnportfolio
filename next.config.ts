import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.5", "localhost"],
  turbopack: {
    root: path.resolve("."),
    resolveAlias: {
      "tailwindcss": path.resolve("./node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
