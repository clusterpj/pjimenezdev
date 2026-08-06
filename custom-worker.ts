// `.open-next/worker.js` only exists after a build, so this import is unresolved
// on a clean checkout and resolved after one — @ts-expect-error would itself
// error in the second case, which is why this is @ts-ignore.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as handler } from "./.open-next/worker.js";

/**
 * Cron entry. Each trigger self-fetches `/api/cron` through the generated
 * OpenNext fetch handler rather than calling the job directly: the jobs need a
 * real Next request context for `getCloudflareContext()` (bindings) to resolve,
 * and a `scheduled()` invocation has none.
 */
const SCHEDULE: Record<string, string> = {
  "0 13 * * *": "followups", // daily 09:00 AST — nudge quiet leads
  "0 14 * * *": "content",   // daily 10:00 AST — note Mon/Thu, promo Tue/Wed/Fri/Sat
  "20 * * * *": "publish",   // hourly — ship whatever Pedro approved
};

const worker = {
  fetch: handler.fetch,

  async scheduled(event: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext) {
    const job = SCHEDULE[event.cron];
    if (!job) return;
    const secret = (env as unknown as { GROWTH_SECRET?: string }).GROWTH_SECRET ?? "";
    const req = new Request(`https://pedrojimenez.dev/api/cron?job=${job}`, {
      headers: { "x-cron-key": secret },
    });
    ctx.waitUntil(
      handler.fetch(req, env, ctx).then(async (res: Response) => {
        console.log(`[cron] ${job} → ${res.status} ${await res.text()}`);
      }),
    );
  },
};

export default worker;
