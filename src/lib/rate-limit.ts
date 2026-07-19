import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimiter = { limit(opts: { key: string }): Promise<{ success: boolean }> };

/** Per-IP limiter for the AI/email endpoints (see [[ratelimits]] in wrangler.toml).
 *  Fail-open when the binding is absent (plain `next dev`) so local work never
 *  needs Cloudflare. */
export async function rateLimited(req: Request): Promise<boolean> {
  try {
    const env = getCloudflareContext().env as { AI_RATE_LIMITER?: RateLimiter };
    if (!env.AI_RATE_LIMITER) return false;
    const key = req.headers.get("cf-connecting-ip") ?? "unknown";
    return !(await env.AI_RATE_LIMITER.limit({ key })).success;
  } catch {
    return false;
  }
}
