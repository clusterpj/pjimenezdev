import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // BotForge was renamed to Melow after launch — keep the old, already-indexed URL alive.
      { source: "/work/botforge", destination: "/work/melow", permanent: true },
      { source: "/es/work/botforge", destination: "/es/work/melow", permanent: true },
      // seo-blog shipped in f8d7f46, was listed in the sitemap, then dropped
      // from content.ts — leaving an indexed URL 404ing. No replacement case
      // study, so send it to the index.
      // (social-command had the same redirect until the case study was restored
      // from ~/social-ai-app — its real page now serves that URL again.)
      { source: "/work/seo-blog", destination: "/work", permanent: true },
      { source: "/es/work/seo-blog", destination: "/es/work", permanent: true },
    ];
  },
  // Leaks the framework + version to anyone reading response headers.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No strict CSP yet: the design uses React inline style attributes
          // throughout plus inline JSON-LD and gtag init, so any workable policy
          // would need script-src/style-src 'unsafe-inline' and buy almost
          // nothing. Revisit with nonces if the inline styles ever move to CSS.
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
