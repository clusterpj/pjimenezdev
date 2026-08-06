import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Safely retrieves an environment variable or Cloudflare Worker secret.
 * Checks process.env first (for local node dev) and falls back to
 * getCloudflareContext().env (for Cloudflare Workers runtime).
 */
export function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    const ctx = getCloudflareContext();
    if (ctx && ctx.env) {
      const val = (ctx.env as unknown as Record<string, string | undefined>)[key];
      if (val) return val;
    }
  } catch {
    // getCloudflareContext may throw outside worker execution context (e.g. build time or plain node)
  }
  return undefined;
}
