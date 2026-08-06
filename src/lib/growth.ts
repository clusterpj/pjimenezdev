/**
 * Growth engine — the parts of the site that work while Pedro doesn't.
 *
 * Three jobs, all fired by Cloudflare Cron Triggers through `/api/cron`
 * (see `custom-worker.ts`). They run inside a normal Next request context on
 * purpose, so `getEnv()` / `getProvider()` work unchanged — a scheduled handler
 * has no AsyncLocalStorage context and `getCloudflareContext()` throws there.
 *
 *   followups  daily   — nudge leads who went quiet, in Pedro's voice
 *   draft      weekly  — write a note + per-platform social copy, email for approval
 *   publish    hourly  — push approved posts to Zernio, ping IndexNow
 *
 * Leads are written to D1 *before* the notification email is sent, so a Resend
 * outage loses a notification, never the lead.
 */
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getEnv } from "@/lib/env";
import { getProvider } from "@/lib/ai";
import { EMAIL, SITE_URL, projects } from "@/lib/content";

const RESEND = "https://api.resend.com/emails";
const ZERNIO = "https://zernio.com/api/v1";

/** Platforms to cross-post to. Zernio bills per connected account. */
export const PLATFORMS = ["linkedin", "twitter", "facebook", "instagram"] as const;
export type Platform = (typeof PLATFORMS)[number];

/** Gap before a nudge, and after the 2nd the lead is marked cold.
 *  ponytail: one flat gap for both nudges — a per-step schedule is a config
 *  table for two numbers. Split it when the reply rate says the timing matters. */
const NUDGE_GAP_MS = 3 * 24 * 60 * 60 * 1000;
const MAX_FOLLOWUPS = 2;

export interface LeadRow {
  id: string; email: string; name: string | null; lang: string; source: string;
  headline: string | null; summary: string | null; transcript: string;
  status: string; followups: number; created_at: string; last_touch_at: string;
}

export interface PostRow {
  id: string; slug: string; title: string; body: string; social: string;
  link: string; status: string; created_at: string; published_at: string | null;
}

// ---------------------------------------------------------------- plumbing

function db(): D1Database | null {
  try {
    const env = getCloudflareContext().env as unknown as { DB?: D1Database };
    return env.DB ?? null;
  } catch {
    return null; // plain `next dev` without the binding
  }
}

async function sendEmail(opts: {
  to: string; subject: string; html: string;
  from?: string; cc?: string; bcc?: string; replyTo?: string;
}): Promise<boolean> {
  const key = getEnv("RESEND_API_KEY");
  if (!key) {
    console.error("[growth] RESEND_API_KEY not set");
    return false;
  }
  const res = await fetch(RESEND, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: opts.from ?? `Pedro Jimenez <pedro@pedrojimenez.dev>`,
      to: [opts.to],
      ...(opts.cc ? { cc: [opts.cc] } : {}),
      ...(opts.bcc ? { bcc: [opts.bcc] } : {}),
      ...(opts.replyTo ? { reply_to: [opts.replyTo] } : {}),
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) console.error("[growth] resend", res.status, await res.text());
  return res.ok;
}

/** HMAC over "action:id" — the whole auth story for the one-click links in
 *  Pedro's inbox. ponytail: no sessions, no admin login, no cookie. */
export async function sign(action: string, id: string): Promise<string> {
  const secret = getEnv("GROWTH_SECRET");
  // No secret, no links. importKey throws on an empty key, which would take
  // /api/scope down with it — the lead path must never depend on this.
  if (!secret) return "";
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${action}:${id}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function verify(action: string, id: string, token: string): Promise<boolean> {
  const expected = await sign(action, id);
  if (!expected || expected.length !== token.length) return false;
  // constant-time-ish: compare every char, no early return
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

async function actionLink(action: string, id: string): Promise<string> {
  const t = await sign(action, id);
  return t ? `${SITE_URL}/api/act?a=${action}&id=${id}&t=${t}` : "";
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Site-styled email shell, so growth mail matches the lead notification. */
function shell(inner: string): string {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#08080F;color:#C8C8D0;padding:32px;max-width:640px;margin:0 auto">
<div style="background:#101019;border:1px solid rgba(255,178,62,.30);border-radius:16px;padding:32px">${inner}</div>
</body></html>`;
}

const btn = (href: string, label: string, color: string) =>
  `<a href="${href}" style="display:inline-block;padding:10px 18px;border-radius:10px;border:1px solid ${color};color:${color};text-decoration:none;font:500 13px monospace;letter-spacing:.06em;text-transform:uppercase;margin-right:8px">${label}</a>`;

// ---------------------------------------------------------------- leads

/** Called from /api/scope. Never throws — a lead that can't be stored must
 *  still produce the notification email. */
export async function saveLead(lead: {
  email: string; name?: string; lang: string; source: string;
  headline?: string; summary?: Record<string, string>; transcript: string;
}): Promise<string | null> {
  const d = db();
  if (!d) return null;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await d.prepare(
      `INSERT INTO leads (id,email,name,lang,source,headline,summary,transcript,created_at,last_touch_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      id, lead.email, lead.name ?? null, lead.lang, lead.source,
      lead.headline ?? null, lead.summary ? JSON.stringify(lead.summary) : null,
      lead.transcript, now, now,
    ).run();
    return id;
  } catch (err) {
    console.error("[growth] saveLead", err);
    return null;
  }
}

/** The "stop chasing this one" link for the lead-notification email. */
export const stopLink = (leadId: string) => actionLink("close", leadId);

const FOLLOWUP_PROMPT = `You are Pedro Jimenez — a solo full-stack + AI developer in Santiago, Dominican Republic. You are writing a short follow-up email to someone who contacted you about a project and then went quiet.

Voice: casual, direct, technical. Like a senior dev writing a two-line Slack message, not a salesperson. No greetings like "Hope this finds you well". No "just circling back". No emoji. No bullet lists. No corporate filler.

Rules:
- 3 to 5 sentences, plain text, nothing else. No subject line, no signature block.
- Reference the specific thing they said they wanted. Be concrete about it.
- Offer exactly one next step: a reply with the missing detail, or a short call.
- NEVER state a price, rate, range, or "starts at" figure. If money comes up, ask what budget they have in mind.
- Write in the same language the lead used.`;

export async function runFollowUps(): Promise<string> {
  const d = db();
  if (!d) return "no DB binding";

  const cutoff = new Date(Date.now() - NUDGE_GAP_MS).toISOString();
  const { results } = await d.prepare(
    `SELECT * FROM leads WHERE status IN ('new','nudged') AND followups < ?
     AND last_touch_at <= ? ORDER BY created_at LIMIT 10`,
  ).bind(MAX_FOLLOWUPS, cutoff).all<LeadRow>();

  if (!results.length) return "0 leads due";

  let sent = 0;
  for (const lead of results) {
    const summary = lead.summary ? Object.entries(JSON.parse(lead.summary) as Record<string, string>)
      .filter(([, v]) => v?.trim()).map(([k, v]) => `${k}: ${v}`).join("\n") : "";

    let text: string;
    try {
      text = await getProvider().chat([
        { role: "system", content: FOLLOWUP_PROMPT },
        {
          role: "user",
          content: `Lead language: ${lead.lang}. This is follow-up number ${lead.followups + 1} of ${MAX_FOLLOWUPS}; the last one got no reply, so change the angle — do not repeat the first email.

What they asked about:
${lead.headline ?? "(no headline)"}
${summary}

What they actually wrote:
${lead.transcript.slice(0, 2000)}`,
        },
      ]);
    } catch (err) {
      console.error("[growth] followup draft failed", lead.id, err);
      continue; // leave the row untouched — it retries tomorrow
    }

    const body = esc(text.trim()).replace(/\n/g, "<br>");
    const ok = await sendEmail({
      to: lead.email,
      bcc: EMAIL, // Pedro sees every nudge; the lead does not see him on it
      replyTo: EMAIL,
      subject: lead.lang === "es"
        ? `Re: ${lead.headline ?? "tu proyecto"}`
        : `Re: ${lead.headline ?? "your project"}`,
      html: shell(`<div style="font:400 15px/1.7 system-ui,sans-serif;color:#C8C8D0">${body}</div>
<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);font:400 13px system-ui,sans-serif;color:#7A7A88">
Pedro Jimenez · <a href="${SITE_URL}" style="color:#FFB23E;text-decoration:none">pedrojimenez.dev</a></div>`),
    });
    if (!ok) continue;

    const n = lead.followups + 1;
    await d.prepare(
      `UPDATE leads SET followups=?, status=?, last_touch_at=? WHERE id=?`,
    ).bind(n, n >= MAX_FOLLOWUPS ? "cold" : "nudged", new Date().toISOString(), lead.id).run();
    sent++;
  }
  return `${sent}/${results.length} follow-ups sent`;
}

// ---------------------------------------------------------------- content

interface Draft {
  title: string; slug: string; body: string;
  social: Record<Platform, string>;
}

const DRAFT_SCHEMA = `{
  "title": "headline of the note, under 65 characters, written as something a buyer would search for",
  "slug": "url-safe-kebab-case, max 6 words",
  "body": "the note in markdown, 350-550 words. Plain ## subheads and paragraphs only — no front-matter, no title heading (the page renders the title), no code fences unless the topic needs a snippet.",
  "social": {
    "linkedin": "post text, 60-150 words, no hashtag spam (2 max), no emoji",
    "twitter": "under 240 characters so the link fits",
    "facebook": "40-80 words, plainer than the LinkedIn one",
    "instagram": "40-70 words, up to 5 hashtags at the end"
  }
}`;

/**
 * Daily content cron. Notes and social posts run on different clocks on
 * purpose: a new indexable page every day, drawn from the same seven projects,
 * is thin repetitive content — the thing Google's helpful-content systems
 * demote. Social volume has no such ceiling, because a promo post reuses a page
 * that already exists instead of minting a weak new one.
 *
 * Mon/Thu → a new note. Tue/Wed/Fri/Sat → a promo pointing at something live.
 * Sunday off.
 */
export async function runContent(): Promise<string> {
  const day = new Date().getUTCDay(); // 0 = Sunday
  if (day === 1 || day === 4) return runDraft();
  if (day === 0) return "sunday — nothing scheduled";
  return runPromote();
}

export async function runDraft(): Promise<string> {
  const d = db();
  if (!d) return "no DB binding";

  const { results: recent } = await d.prepare(
    `SELECT title FROM posts WHERE slug IS NOT NULL ORDER BY created_at DESC LIMIT 10`,
  ).all<{ title: string }>();

  const proof = projects.en
    .map((p) => `- ${p.name} (${p.year}, ${p.status}) — ${SITE_URL}/work/${p.id}: ${p.desc} Result: ${p.outcome} Stack: ${p.tags.join(", ")}.`)
    .join("\n");

  // Two attempts: the model occasionally runs long and truncates its own JSON,
  // and this job only gets one shot a week — a silent miss means no content.
  let draft: Draft | null = null;
  for (let attempt = 1; attempt <= 2 && !draft; attempt++) {
    try {
      draft = await getProvider().structured<Draft>([
        {
          role: "system",
        content: `You are Pedro Jimenez — a solo full-stack + AI developer in Santiago, Dominican Republic, writing a short technical note for his own site to attract client work.

Voice: casual, direct, technical. First person. Like a senior dev explaining a real decision, not a content marketer. No emoji, no "in today's fast-paced world", no listicles of generic advice, no invented statistics.

The note must be built out of work Pedro has ACTUALLY shipped (listed below) — a real constraint he hit, a tradeoff he made, a thing that broke. Link to the relevant case study inline with a markdown link at least once. Never claim a prototype or MVP is in production. Never state a price, rate, or range.

It also has to be worth ranking for: pick an angle someone would genuinely type into a search box when they have the problem Pedro solves.

Pedro's shipped work:
${proof}

Notes already published (pick a different angle — do not repeat these):
${recent.map((r) => `- ${r.title}`).join("\n") || "- (none yet)"}`,
        },
        { role: "user", content: "Write this week's note and the social posts that point at it." },
        // Generous on purpose: a 500-word note plus four social posts blows the
        // 500-token default, reasoning tokens come out of the same budget, and
        // 3000 still truncated the JSON on roughly half the runs.
      ], DRAFT_SCHEMA, 8000);
    } catch (err) {
      console.error(`[growth] draft attempt ${attempt} failed`, err);
    }
  }
  if (!draft) return "draft failed";

  const slug = draft.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const id = crypto.randomUUID();
  const link = `${SITE_URL}/notes/${slug}`;

  await d.prepare(
    `INSERT INTO posts (id,slug,title,body,social,link,created_at) VALUES (?,?,?,?,?,?,?)`,
  ).bind(id, slug, draft.title, draft.body, JSON.stringify(draft.social), link, new Date().toISOString()).run();

  const previews = PLATFORMS
    .map((p) => `<div style="margin-bottom:14px"><div style="font:500 11px monospace;color:#FFB23E;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">${p}</div><div style="font:400 14px/1.6 system-ui,sans-serif;color:#C8C8D0;background:#08080F;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px;white-space:pre-wrap">${esc(draft.social[p] ?? "(missing)")}</div></div>`)
    .join("");

  await sendEmail({
    to: EMAIL,
    subject: `Draft: ${draft.title}`,
    html: shell(`<h2 style="color:#FFB23E;margin:0 0 6px;font-size:20px;line-height:1.25">${esc(draft.title)}</h2>
<div style="font:400 13px monospace;color:#7A7A88;margin-bottom:20px">${link}</div>
${previews}
<details style="margin:20px 0"><summary style="color:#7A7A88;font:500 12px monospace;cursor:pointer;text-transform:uppercase;letter-spacing:.1em">The note itself</summary>
<pre style="white-space:pre-wrap;word-wrap:break-word;font:400 13px/1.7 system-ui,sans-serif;color:#C8C8D0;background:#08080F;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;margin-top:10px">${esc(draft.body)}</pre></details>
<div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)">
${btn(await actionLink("approve", id), "Publish it", "#4ADE9A")}${btn(await actionLink("reject", id), "Bin it", "#7A7A88")}
<p style="color:#7A7A88;font-size:12px;margin:12px 0 0">Approved posts go out on the next hourly run — to the site first, then LinkedIn, X, Facebook and Instagram.</p></div>`),
  });

  return `drafted ${slug}`;
}

// ---------------------------------------------------------------- promos

interface Promo {
  target: string; angle: string;
  social: Record<Platform, string>;
}

const PROMO_SCHEMA = `{
  "target": "the exact URL you are promoting, copied character-for-character from the list of pages given to you",
  "angle": "a short internal label for this angle, under 60 characters",
  "social": {
    "linkedin": "post text, 60-150 words, no hashtag spam (2 max), no emoji",
    "twitter": "under 240 characters so the link fits",
    "facebook": "40-80 words, plainer than the LinkedIn one",
    "instagram": "40-70 words, up to 5 hashtags at the end"
  }
}`;

/**
 * A social-only post: no new page, it points at one that already exists.
 * Stored in `posts` with a NULL slug and empty body, which is what keeps it off
 * /notes and out of the sitemap while still riding the same publish path.
 */
export async function runPromote(): Promise<string> {
  const d = db();
  if (!d) return "no DB binding";

  const { results: notes } = await d.prepare(
    `SELECT title, link FROM posts WHERE status='published' AND slug IS NOT NULL ORDER BY published_at DESC LIMIT 20`,
  ).all<{ title: string; link: string }>();

  const targets = [
    ...projects.en.map((p) => ({
      url: `${SITE_URL}/work/${p.id}`,
      blurb: `${p.name} (${p.year}, ${p.status}) case study: ${p.desc} Result: ${p.outcome} Stack: ${p.tags.join(", ")}.`,
    })),
    ...notes.map((n) => ({ url: n.link, blurb: `Note: ${n.title}` })),
    { url: `${SITE_URL}/services`, blurb: "Services: AI integrations, automations, web apps, mobile apps, SaaS platforms, 3D & motion." },
    { url: `${SITE_URL}/work`, blurb: "The full portfolio index, filterable by category." },
  ];
  const allowed = new Set(targets.map((t) => t.url));

  // What we've pushed lately, so the model varies both the page and the angle.
  const { results: recent } = await d.prepare(
    `SELECT title, link FROM posts ORDER BY created_at DESC LIMIT 12`,
  ).all<{ title: string; link: string }>();

  let promo: Promo | null = null;
  for (let attempt = 1; attempt <= 2 && !promo; attempt++) {
    try {
      promo = await getProvider().structured<Promo>([
        {
          role: "system",
          content: `You are Pedro Jimenez — a solo full-stack + AI developer in Santiago, Dominican Republic. You are writing social posts that point at a page which already exists on your site.

Voice: casual, direct, technical. First person. Like a senior dev showing something he built, not a marketer. No emoji except where the Instagram format calls for hashtags. No "excited to announce". No invented statistics. Never state a price, rate, or range. Never claim a prototype or MVP is in production.

Pick ONE page from this list and write posts about it. Lead with the specific technical problem it solved — that is what makes someone click. Do not summarise the whole page; give them one concrete hook.

Pages you may promote:
${targets.map((t) => `- ${t.url} — ${t.blurb}`).join("\n")}

Recently posted (pick a different page, or the same page from a genuinely different angle — never repeat a hook):
${recent.map((r) => `- ${r.link} — ${r.title}`).join("\n") || "- (nothing yet)"}`,
        },
        { role: "user", content: "Write today's promo." },
      ], PROMO_SCHEMA, 4000);
    } catch (err) {
      console.error(`[growth] promo attempt ${attempt} failed`, err);
    }
  }
  if (!promo) return "promo failed";

  // The model gets a list and is told to copy a URL from it; a made-up URL would
  // send every platform to a 404, so fall back rather than trust it.
  const link = allowed.has(promo.target)
    ? promo.target
    : targets[recent.length % targets.length].url;
  if (!allowed.has(promo.target)) {
    console.error("[growth] promo invented a target, fell back", promo.target);
  }

  const id = crypto.randomUUID();
  await d.prepare(
    `INSERT INTO posts (id,slug,title,body,social,link,created_at) VALUES (?,NULL,?,'',?,?,?)`,
  ).bind(id, promo.angle, JSON.stringify(promo.social), link, new Date().toISOString()).run();

  const previews = PLATFORMS
    .map((p) => `<div style="margin-bottom:14px"><div style="font:500 11px monospace;color:#FFB23E;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">${p}</div><div style="font:400 14px/1.6 system-ui,sans-serif;color:#C8C8D0;background:#08080F;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px;white-space:pre-wrap">${esc(promo.social[p] ?? "(missing)")}</div></div>`)
    .join("");

  await sendEmail({
    to: EMAIL,
    subject: `Promo: ${promo.angle}`,
    html: shell(`<div style="font:500 11px monospace;color:#7A7A88;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Social only — no new page</div>
<h2 style="color:#FFB23E;margin:0 0 6px;font-size:20px;line-height:1.25">${esc(promo.angle)}</h2>
<div style="font:400 13px monospace;color:#7A7A88;margin-bottom:20px">→ ${esc(link)}</div>
${previews}
<div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)">
${btn(await actionLink("approve", id), "Post it", "#4ADE9A")}${btn(await actionLink("reject", id), "Bin it", "#7A7A88")}
<p style="color:#7A7A88;font-size:12px;margin:12px 0 0">Goes out on the next hourly run. Nothing new is published on the site — this only points at ${esc(link)}.</p></div>`),
  });

  return `promo drafted → ${link}`;
}

// ---------------------------------------------------------------- publish

async function zernioAccounts(): Promise<Record<string, string>> {
  const key = getEnv("ZERNIO_API_KEY");
  if (!key) return {};
  const res = await fetch(`${ZERNIO}/accounts`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) {
    console.error("[growth] zernio accounts", res.status, await res.text());
    return {};
  }
  const data = await res.json() as { accounts?: { platform: string; _id: string }[] } | { platform: string; _id: string }[];
  const list = Array.isArray(data) ? data : data.accounts ?? [];
  return Object.fromEntries(list.map((a) => [a.platform, a._id]));
}

/** Tells Bing/Yandex/Naver the URL exists the moment it does, instead of
 *  waiting on a crawl. Google ignores IndexNow; its path is the sitemap. */
async function pingIndexNow(url: string): Promise<void> {
  const key = getEnv("INDEXNOW_KEY");
  if (!key) return;
  const host = new URL(SITE_URL).host;
  await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}&keyLocation=${SITE_URL}/${key}.txt&host=${host}`)
    .catch((err) => console.error("[growth] indexnow", err));
}

export async function runPublish(): Promise<string> {
  const d = db();
  if (!d) return "no DB binding";

  const { results } = await d.prepare(
    `SELECT * FROM posts WHERE status='approved' ORDER BY created_at LIMIT 3`,
  ).all<PostRow>();
  if (!results.length) return "0 approved";

  const accounts = await zernioAccounts();
  const key = getEnv("ZERNIO_API_KEY");
  let done = 0;

  for (const post of results) {
    // The note page is live the moment status flips to published, so the link
    // in every social post resolves. Order matters — post first, 404 later.
    await d.prepare(`UPDATE posts SET status='published', published_at=? WHERE id=?`)
      .bind(new Date().toISOString(), post.id).run();
    // Promos have no page of their own; the URL they point at was submitted
    // when it was first published, and re-pinging it would be noise.
    if (post.slug) await pingIndexNow(post.link);

    const social = JSON.parse(post.social) as Record<string, string>;
    for (const platform of PLATFORMS) {
      const accountId = accounts[platform];
      const text = social[platform];
      if (!accountId || !text || !key) continue;
      // One call per platform: Zernio takes a single `content` per request, so
      // per-platform copy means per-platform requests.
      const res = await fetch(`${ZERNIO}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `${text}\n\n${post.link}`,
          publishNow: true,
          platforms: [{ platform, accountId }],
        }),
      });
      if (!res.ok) console.error("[growth] zernio post", platform, res.status, await res.text());
    }
    done++;
  }
  return `${done} published`;
}

// ---------------------------------------------------------------- one-click actions

/** Applied by /api/act after the HMAC checks out. Returns the line Pedro sees. */
export async function act(action: string, id: string): Promise<string> {
  const d = db();
  if (!d) return "No database bound — nothing changed.";

  if (action === "approve") {
    const r = await d.prepare(`UPDATE posts SET status='approved' WHERE id=? AND status='draft'`).bind(id).run();
    return r.meta.changes ? "Queued. It goes out on the next hourly run." : "Already handled — nothing to do.";
  }
  if (action === "reject") {
    const r = await d.prepare(`UPDATE posts SET status='rejected' WHERE id=? AND status='draft'`).bind(id).run();
    return r.meta.changes ? "Binned. A new draft comes next week." : "Already handled — nothing to do.";
  }
  if (action === "close") {
    const r = await d.prepare(`UPDATE leads SET status='replied' WHERE id=? AND status IN ('new','nudged','cold')`).bind(id).run();
    return r.meta.changes ? "Follow-ups stopped for this lead." : "Already closed — nothing to do.";
  }
  return "Unknown action.";
}

// ---------------------------------------------------------------- reads

// Both of these back /notes and the sitemap, so they must exclude promos —
// social-only rows carry a NULL slug and no body, and have no page to show.

export async function publishedPosts(): Promise<PostRow[]> {
  const d = db();
  if (!d) return [];
  try {
    const { results } = await d.prepare(
      `SELECT * FROM posts WHERE status='published' AND slug IS NOT NULL AND body != ''
       ORDER BY published_at DESC LIMIT 100`,
    ).all<PostRow>();
    return results;
  } catch {
    return [];
  }
}

export async function publishedPost(slug: string): Promise<PostRow | null> {
  const d = db();
  if (!d) return null;
  try {
    return await d.prepare(
      `SELECT * FROM posts WHERE slug=? AND status='published' AND body != ''`,
    ).bind(slug).first<PostRow>();
  } catch {
    return null;
  }
}
