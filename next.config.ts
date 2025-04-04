import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    }
    return config;
  }
  /* config options here */
};

export default nextConfig;
