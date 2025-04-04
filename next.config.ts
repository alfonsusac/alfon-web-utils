import type { NextConfig } from "next";
import CopyWebpackPlugin from "copy-webpack-plugin";


const nextConfig: NextConfig = {
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,

    }
    // config.plugins.push(
    //   new CopyWebpackPlugin({
    //     patterns: [
    //       {
    //         from: "node_modules/tiktoken/tiktoken_bg.wasm",
    //         to: "tiktoken_bg.wasm",
    //         toType: "file",
    //       },
    //     ],
    //   }),
    // )
    
    return config;
  }
  /* config options here */
};

export default nextConfig;
