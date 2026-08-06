import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { runFollowUps, runContent, runDraft, runPromote, runPublish } from "@/lib/growth";

export const dynamic = "force-dynamic";

const JOBS = {
  followups: runFollowUps,
  // What the daily cron calls; it picks draft or promote by weekday.
  content: runContent,
  // Both reachable by hand, for "I want one now" rather than waiting.
  draft: runDraft,
  promote: runPromote,
  publish: runPublish,
} as const;

/**
 * Cron entry point. Invoked by the scheduled handler in `custom-worker.ts`,
 * which self-fetches this route so the jobs run inside a real Next request
 * context (where `getCloudflareContext()` works). Also callable by hand:
 *   curl -H "x-cron-key: $GROWTH_SECRET" 'https://pedrojimenez.dev/api/cron?job=publish'
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = getEnv("GROWTH_SECRET");
  if (!secret || req.headers.get("x-cron-key") !== secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const job = req.nextUrl.searchParams.get("job") ?? "";
  const run = JOBS[job as keyof typeof JOBS];
  if (!run) {
    return NextResponse.json({ error: `Unknown job "${job}"` }, { status: 400 });
  }

  try {
    const result = await run();
    console.log(`[cron] ${job}: ${result}`);
    return NextResponse.json({ ok: true, job, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[cron] ${job} failed`, message);
    return NextResponse.json({ ok: false, job, error: message }, { status: 500 });
  }
}
