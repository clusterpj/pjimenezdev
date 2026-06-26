# pedrojimenez.dev

Pedro Jimenez's personal portfolio and services site — a dark, premium, AI-integrated
experience. Built with Next.js and deployed to Cloudflare Workers.

See `docs/DESIGN_BRIEF.md`, `docs/BRAND.md`, and `docs/SITEMAP.md` for full specs,
and `CLAUDE.md` for architecture and design tokens.

## Stack

- **Next.js 15 (App Router)** — React 19
- **Tailwind CSS v4** — PostCSS-based (no `tailwind.config.js`)
- **Framer Motion** — animations
- **Cloudflare Workers** — deployed via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
- **AI providers** — DeepSeek / Anthropic / OpenAI (server-side only, selected via `AI_PROVIDER`)

## Local development

```bash
npm install
npm run dev      # Next.js dev server on localhost:3000
npm run lint     # ESLint
```

For AI features locally, copy `.dev.vars.example` to `.dev.vars` and fill in your keys.

## Deployment (Cloudflare Workers)

This site deploys as a **Cloudflare Worker** (not Pages). The OpenNext adapter builds a
Worker (`.open-next/worker.js`) plus a static-assets directory (`.open-next/assets`),
which is served through the `ASSETS` binding configured in `wrangler.toml`.

> **Why Workers, not Pages?** An earlier Pages + `_worker.js` hybrid (`pages_build_output_dir`
> + `run_worker_first`) routed every request through the OpenNext worker, but static assets are
> only served via an `ASSETS` binding that exists in a real Workers deployment. The result was
> all `/_next/static/*` requests returning 404 and the site rendering unstyled. The Workers
> setup below is the official, supported path and fixes this.

### Commands

```bash
npm run build:cf     # build the Worker + assets bundle
npm run preview:cf   # build + preview locally in the workerd runtime (127.0.0.1:8787)
npm run deploy       # build + deploy to Cloudflare
npm run cf-typegen   # regenerate cloudflare-env.d.ts from wrangler bindings
```

### First-time setup

```bash
npx wrangler login                          # authenticate (browser OAuth)
npx wrangler secret put DEEPSEEK_API_KEY    # set secrets (repeat for ANTHROPIC_API_KEY / OPENAI_API_KEY)
npm run deploy
```

Secrets live in Cloudflare only — never in `wrangler.toml` or the repo. The non-secret
`AI_PROVIDER` var is set in `wrangler.toml` under `[vars]`.

### Configuration

`wrangler.toml` defines the Worker:

```toml
main = ".open-next/worker.js"        # the OpenNext-built Worker
[assets]
directory = ".open-next/assets"      # static assets (_next/static, fonts, images)
binding = "ASSETS"                   # serves static files — required for CSS/JS to load
```

Build artifacts (`.open-next/`, `.wrangler/`) are gitignored.

### Custom domain

Point `pedrojimenez.dev` at the Worker in the Cloudflare dashboard:
**Workers & Pages → `pjimenezdev` → Settings → Domains & Routes → Add custom domain**.

### Git-based deploys (optional)

To deploy automatically on push, set up [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
in the dashboard with build command `npm run build:cf` and deploy command `npx wrangler deploy`.
