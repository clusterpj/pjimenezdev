import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // BotForge was renamed to Melow after launch — keep the old, already-indexed URL alive.
      { source: "/work/botforge", destination: "/work/melow", permanent: true },
      { source: "/es/work/botforge", destination: "/es/work/melow", permanent: true },
    ];
  },
};

export default nextConfig;
