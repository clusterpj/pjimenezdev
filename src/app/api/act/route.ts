import { NextRequest } from "next/server";
import { act, verify } from "@/lib/growth";

export const dynamic = "force-dynamic";

/**
 * The one-click links in Pedro's inbox: approve/reject a draft, stop chasing a
 * lead. Auth is an HMAC in the URL — no login, because the only thing holding
 * the link is the mailbox it was sent to.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const q = req.nextUrl.searchParams;
  const action = q.get("a") ?? "";
  const id = q.get("id") ?? "";
  const token = q.get("t") ?? "";

  const ok = id && token && (await verify(action, id, token));
  const message = ok ? await act(action, id) : "That link isn't valid.";

  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>pedrojimenez.dev</title></head>
<body style="font-family:system-ui,sans-serif;background:#08080F;color:#C8C8D0;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="background:#101019;border:1px solid rgba(255,178,62,.30);border-radius:16px;padding:32px 40px;text-align:center;max-width:420px">
<div style="font:500 11px monospace;color:#FFB23E;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">${ok ? "Done" : "Nope"}</div>
<div style="font:400 16px/1.6 system-ui,sans-serif">${message}</div>
</div></body></html>`,
    { status: ok ? 200 : 403, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
