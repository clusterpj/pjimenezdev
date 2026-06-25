# Sitemap & Content Outline — pedrojimenez.dev
 
---
 
## Route Structure
 
```
/                        → Home (single scroll, anchor nav)
/work                    → Portfolio index
/work/[slug]             → Case study detail
/blog                    → Article index
/blog/[slug]             → Article detail
/contact                 → Contact + booking
/api/concierge           → AI Concierge endpoint (Cloudflare Worker)
/api/estimator           → AI Estimator endpoint (Cloudflare Worker)
/api/personalize         → Content surfacing logic (Cloudflare Worker)
```
 
---
 
## Home (/) — Section Breakdown
 
### 1. Nav
- Logo (left)
- Work | Services | Blog | Contact (right)
- Language toggle: EN / ES
- CTA: "Let's talk" / "Hablemos"
- Behavior: transparent on hero, solid on scroll
### 2. Hero
**Job:** Communicate who Pedro is + that something intelligent is present — in under 3 seconds.
**Not:** Headline + subheadline + button. That's the template.
 
- Full-bleed reactive background (WebGL / Canvas) — responds to cursor, scroll, time of day
- Display headline — strong, specific, not generic
- One-line descriptor of the full service spectrum
- Subtle AI presence indicator — ambient, not announced
- Primary CTA: enters the Concierge OR scrolls to Services
- AI Concierge activates from here — feels like the site itself is speaking
**EN Headline directions (pick one in Claude Design):**
- "I build the things most teams can't."
- "Every layer. One builder."
- "From model to deployment. Pedro ships it."
**ES equivalents:** To be written after EN is locked.
 
### 3. Services
6 services — must feel like a system, not a list.
Each card: name, one-line description, micro visual identity, hover state.
 
| # | Service              | EN Description                                      |
|---|----------------------|-----------------------------------------------------|
| 1 | AI & Integrations    | LLM apps, agents, RAG pipelines, API integrations   |
| 2 | Automation           | End-to-end workflow automation, ops pipelines       |
| 3 | Web Apps             | Full-stack applications, SaaS products, dashboards  |
| 4 | Mobile Apps          | iOS & Android — React Native or Flutter             |
| 5 | Motion & 3D          | Motion graphics, 3D visuals, creative tech          |
| 6 | Design & Prototyping | UI/UX, design systems, interactive prototypes       |
 
AI behavior: Concierge can be triggered from any service card — "Tell me more about [service]"
 
### 4. Portfolio Preview
- 3 featured case studies (best work, highest variety)
- Each card: project name, category, one-line result, tech tags, thumbnail
- CTA: "See all work" → /work
- AI behavior: cards re-sort based on what the visitor has been engaging with
### 5. Testimonials
- 3–5 testimonials from real clients
- Not a carousel — static, integrated into the scroll flow
- Format: quote → name → role/company → optional project reference
### 6. Blog Preview
- 3 latest or most relevant articles
- AI behavior: surfaced based on visitor's service/portfolio engagement
- CTA: "Read more" → /blog
### 7. Contact / CTA
- Single focused action — not a full form
- Two paths: Concierge (AI-qualified) or direct calendar booking
- Pedro's time is valuable — design communicates that
- EN: "Let's build something." / ES: "Construyamos algo."
### 8. Footer
- Logo
- Navigation links
- Language toggle
- Social: GitHub, LinkedIn, X (TBD which Pedro uses)
- Copyright: © Pedro Jimenez — pedrojimenez.dev
---
 
## /work — Portfolio Index
 
- Grid of all case studies
- Filter by: All | AI | Web | Mobile | Automation | Motion | 3D
- Each card: name, category tag, one-line result, thumbnail, stack badges
- AI behavior: default sort = personalized based on session, fallback = chronological
---
 
## /work/[slug] — Case Study
 
Structure per project:
1. **Header** — Project name, category, year, client (if public)
2. **The Problem** — What was broken or missing
3. **The Approach** — How Pedro thought about it
4. **The Build** — What was actually made, key technical decisions
5. **The Result** — Measurable outcome or qualitative impact
6. **Stack** — Tech used, badges
7. **Next** — Link to next case study or back to /work
---
 
## /blog — Article Index
 
- Article cards: title, date, category, reading time, excerpt
- Categories: AI, Dev, Design, Behind the Build, Misc
- Language: bilingual — EN/ES toggle or separate routes (/blog/es/[slug])
- AI behavior: related articles surfaced contextually
---
 
## /blog/[slug] — Article
 
- MDX-powered
- Code blocks styled with mono system
- Reading progress indicator
- AI: "Related articles" surfaced semantically, not by tag
- CTA at bottom: Concierge or contact
---
 
## /contact — Contact & Booking
 
- Minimal. One clear action.
- Option A: Trigger AI Concierge → qualifies lead → routes to calendar
- Option B: Direct calendar embed (Cal.com preferred — self-hostable)
- Short form fallback: name, email, project type, message
- Response expectation set clearly — Pedro's time is premium
---
 
## AI Surfaces (non-page)
 
### Concierge
- Activated from: Hero CTA, Nav, Service cards, Contact page, any "Let's talk" trigger
- Opens as: Command palette overlay or side drawer — not a chat bubble
- Knows: All services, case studies, pricing ballparks, Pedro's stack preferences, booking flow
- Personality: Casual, direct, technical — Pedro's voice
- Backend: Cloudflare Worker → Anthropic Claude API
### Estimator
- Activated from: Services section, Contact page
- Flow: Plain language input → AI parses intent → returns scope + timeline + ballpark budget
- Output: Structured brief summary + option to send to Pedro
- Backend: Cloudflare Worker → Anthropic Claude API
### Personalization Engine
- Session-based — no login, no cookies beyond session
- Tracks: service card hovers, portfolio card clicks, scroll depth per section
- Outputs: reordered portfolio cards, surfaced blog posts, adjusted CTAs
- Backend: Cloudflare Worker + Vectorize for embeddings
---
 
## i18n — Bilingual Strategy
 
- Default language: English (EN)
- Spanish (ES): full translation of all UI copy and content
- Strategy: route-based (/es/*) preferred over cookie toggle — better for SEO
- All components designed with ES string length in mind (ES ~20% longer than EN)
- Blog: articles can be EN-only or bilingual — author decides per post