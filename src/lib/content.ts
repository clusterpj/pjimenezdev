// Single source of truth for site content — consumed by pages, Nav/Footer,
// and the concierge system prompt. EN copy is 1:1 from the production design
// handoff; ES is Pedro-voice translation of the same copy.

export type Lang = "en" | "es";
export const langs: Lang[] = ["en", "es"];
export const defaultLang: Lang = "en";

export const SITE_URL = "https://pedrojimenez.dev";
export const EMAIL = "hello@pedrojimenez.dev";
export const GITHUB_URL = "https://github.com/clusterpj";
export const LINKEDIN_URL = "https://www.linkedin.com/in/pedro-jimenez-97343653/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61591124986626";

/** Booking link (Cal.com / Calendly / whatever). Paste the URL and the "Book a
 *  call" card appears on /about#contact automatically; leave it empty and
 *  nothing renders. A booked call converts far better than an email thread,
 *  so this is worth filling in. */
export const BOOKING_URL = "";

/** URL prefix for a language: EN lives at /, ES at /es */
export const langPrefix = (lang: Lang) => (lang === "en" ? "" : "/es");

export interface Project {
  id: string;
  name: string;
  year: string;
  category: string;
  cats: string[]; // filter keys, language-independent
  tags: string[];
  desc: string;
  problem: string;
  build: string;
  points: string[];
  outcome: string;
  /** Card thumbnail + case-study hero + og:image. Live projects: hotlinked
   *  from the production site itself (Pedro built it, so it's fair use as
   *  proof of work) — swap for a self-hosted copy under
   *  /public/images/work/{slug}/ once available. Omit for no image yet. */
  image?: string;
  /** Additional UI screenshots shown as a gallery on the case study page
   *  only (not on cards). Local paths under /public/images/work/{slug}/. */
  gallery?: string[];
  /** Real shipping status. The case-study hero used to hard-code "in
   *  production" for every project, which was false for the ones that never
   *  deployed — the fastest way to lose a technical buyer is a claim they can
   *  check. Verified per project against the repo and a live HTTP request. */
  status: "production" | "mvp" | "prototype";
  /** Public URL, only where the thing is genuinely reachable. Renders as an
   *  outbound "view it live" link — the strongest proof on the page. */
  liveUrl?: string;
  /** SEO <title>. Keep under ~60 chars of distinct content before the brand
   *  suffix, and lead with what someone would actually search for. Falls back
   *  to the generic "{name} — case study" template when omitted. */
  metaTitle?: string;
  /** SEO meta description, ~150-160 chars. `desc` is written for humans
   *  reading a card; this is written for a search result. */
  metaDesc?: string;
}

const projectsEn: Project[] = [
  {
    id: "melow", name: "Melow", year: "2026", category: "AI · SaaS", cats: ["AI", "SaaS"],
    tags: ["AI integration", "Multi-tenant SaaS", "RAG", "WhatsApp API", "Fastify", "Qdrant", "Vapi"],
    status: "production",
    metaTitle: "Melow — multi-tenant WhatsApp AI agent platform + dental clinical copilot",
    metaDesc: "A multi-tenant AI chatbot platform on WhatsApp and web, with RAG over your own documents and a dental copilot that charts an odontogram from speech. Built by Pedro Jimenez.",
    desc: "Multi-tenant AI agent platform that deploys chatbots to WhatsApp and embeddable website widgets, grounded in each client's own documents. Flagship deployment: a dental Clinical Copilot that updates patient records hands-free, mid-consultation.",
    problem: "Two problems, one platform. Businesses wanting an AI agent on WhatsApp face weeks of Meta Cloud API plumbing, and a bot that hallucinates because it has no grounding in their actual documents. And in the flagship case — a dental clinic — the dentist is hands-on with a patient. Stopping to type clinical notes, update an odontogram, or write a prescription breaks focus, slows the visit, and means touching a keyboard with gloved hands.",
    build: "A multi-tenant platform where each business gets isolated data, config, and its own vector-indexed knowledge base — plus a ReAct-based Clinical Copilot on top of it for the dental vertical.",
    points: [
      "Retrieval-grounded answers: upload PDFs or URLs and they are chunked and embedded into Qdrant, with a 0.40 cosine-similarity floor so the bot stays quiet rather than inventing an answer it cannot support.",
      "Provider-agnostic LLM layer — DeepSeek, OpenAI, Groq, or OpenRouter behind one interface. Switching providers is two environment variables and a restart, not a refactor, so no client is locked to one vendor's pricing.",
      "WhatsApp via the Meta Cloud API with a BullMQ queue absorbing webhook bursts, an embeddable SSE-streaming web widget, and Embedded Signup so a client connects their own phone number through an in-app OAuth flow instead of a support ticket.",
      "Human handoff that actually works: an agent inbox on a live SSE feed, and the bot goes silent the moment a person takes over, so a customer never gets a human and a robot answering at once.",
      "Hands-free dental charting: the dentist says \"caries on tooth 16, mesial and occlusal\", the Copilot parses FDI notation and updates an interactive 32-tooth odontogram itself — across 13+ backend tools covering extractions, allergy cross-checks, prescriptions, and SOAP notes.",
      "A 13-step Spanish WhatsApp intake questionnaire — history, allergies, medications, insurance — landing as structured data in a 6-tab medical record, and voice calls escalating to a Vapi AI agent that runs on the platform's own LLM proxy with knowledge-base tool access.",
    ],
    outcome: "Running in production on a hardened deployment — PM2, Nginx, Let's Encrypt, and Qdrant bound to localhost — with 33 unit tests over the LLM service and conversation engine. Natural-language observations become structured medical data: SOAP notes, treatment plans, phased budgets, odontograms. The dentist stays focused on the patient instead of the keyboard.",
    image: "/images/work/melow/analytics.webp",
    gallery: ["/images/work/melow/odontogram.webp", "/images/work/melow/patients-module.webp"],
  },
  {
    id: "c21-perdomo", name: "C21 Perdomo", year: "2026", category: "Web app", cats: ["Web"],
    tags: ["Next.js 16", "Technical SEO", "next-intl", "Headless WordPress", "Railway", "Cloudflare"],
    status: "production",
    liveUrl: "https://c21perdomo.com",
    metaTitle: "C21 Perdomo — 4-language real estate SEO on headless WordPress",
    metaDesc: "Technical SEO case study: ~1,400 property listings across English, Spanish, French and German. Correct canonicals, hreflang, and HTTP 410s on a headless Next.js + WordPress stack.",
    desc: "Headless Next.js storefront over an existing WordPress catalog, serving ~1,400 property listings in English, Spanish, French, and German — a build where routing and technical SEO are the architecture, not an afterthought.",
    problem: "In real estate nobody buys a house from a page that does not rank, so organic search is the whole game — and it is brutally unforgiving of exactly what a four-language site gets wrong. An Ahrefs crawl surfaced 6,284 hreflang errors, hundreds of 404s, and canonicals pointing at dead URLs. The WordPress backend was built for a single-language brochure, and its RankMath canonical field returned the English URL for every locale, quietly telling Google to ignore the Spanish, French, and German pages entirely.",
    build: "One routing map as the single source of truth, with every SEO signal computed from it instead of trusted from the CMS.",
    points: [
      "Every translated slug is defined once in one routing table; canonicals, hreflang alternates, x-default, sitemaps, and navigation links all derive from it. No duplicated route trees to drift apart — the class of bug that produced 6,284 hreflang errors from a single root cause.",
      "Canonicals computed locally rather than read from WordPress, because RankMath returned the English URL for all four locales. Getting this wrong deindexes three languages.",
      "Deleted listings return a real HTTP 410 Gone instead of WordPress's 200-with-a-\"Property Not Found\"-title — the soft-404 pattern Google explicitly discourages — and are dropped from the sitemap so crawl budget goes to live inventory.",
      "Property pages are statically rendered with hourly ISR: edge-cacheable and fast, but never more than an hour stale on price, with on-demand revalidation for urgent corrections.",
      "Meta Pixel and the Conversions API fire on every property view keyed to the catalog listing ID rather than the WordPress post ID, so retargeting audiences match real inventory instead of silently failing to resolve.",
      "SEO is enforced by scripts, not vibes: a 55-check validator runs against live URLs for canonical, hreflang, html lang, x-default, and redirect correctness, alongside sitemap-coverage and architecture audits before every deploy.",
    ],
    outcome: "Live at c21perdomo.com with sitemap coverage at roughly 99% across all four languages — 345 to 349 listings per locale, up from the handful the audit found indexed. A multilingual real estate site that shows up in search in every market it serves, on top of a legacy CMS that was never designed for headless use. The hard part was never translation strings; it was making Google understand every page in every locale.",
    image: "/images/work/c21-perdomo/home.webp",
    gallery: ["/images/work/c21-perdomo/banner.webp", "/images/work/c21-perdomo/featured.webp", "/images/work/c21-perdomo/blog.webp"],
  },
  {
    id: "moneyguard", name: "MoneyGuard", year: "2025", category: "Mobile · AI", cats: ["Mobile", "AI"],
    tags: ["Flutter", "AI integration", "On-device OCR", "Offline-first", "FastAPI", "DeepSeek"],
    status: "mvp",
    metaTitle: "MoneyGuard — Flutter app that blocks overspending before it happens",
    metaDesc: "An offline-first Flutter finance app with on-device OCR receipt scanning and a 3-gate AI engine that intervenes before a purchase. Built for cash-heavy Dominican spending.",
    desc: "Offline-first Flutter app that intervenes before you overspend instead of reporting on it afterwards — a 3-gate decision engine, on-device OCR receipt scanning, and an AI that argues with you at the moment of purchase.",
    problem: "Budgeting apps tell you what you already spent, which is a report card issued after the damage. They also assume bank feeds — and in a cash-heavy market like the Dominican Republic, a huge share of spending never touches an account the app can read. So the tool is both too late and half-blind.",
    build: "An intervention engine rather than a dashboard: it gets in the way of the purchase, and it works without a signal or a bank.",
    points: [
      "A 3-gate decision cascade where only the last gate costs money: an amount threshold and a safe-to-spend calculation both run locally and instantly, and the LLM is called only when those cannot settle it — which keeps inference under $5/month instead of one API call per expense.",
      "On-device OCR through Google ML Kit at 80–90% extraction accuracy — free, fully offline, and no receipt image ever leaves the phone, so cash spending gets counted without a bank feed or a privacy trade.",
      "Genuinely offline-first on a local Hive database with background sync: every core feature works with no connection, which is a requirement rather than a nice-to-have in the target market.",
      "Quick manual entry in two taps and about five seconds — preset amounts and one-tap categories — because an expense tracker that takes thirty seconds is an expense tracker nobody uses twice.",
      "Selectable intervention tone from gentle nudge to blunt refusal, defaulting to the direct end for the Dominican market: \"NO. Rent is due in 3 days. Buy this and you have RD$400 left for food.\"",
    ],
    outcome: "MVP complete and in beta with a small onboarded test group. Backend, Flutter client, and offline sync all shipped and integrated; the intervention engine is working end to end, OCR is holding above 80% accuracy, and total running cost sits around $5–10/month including hosting and inference.",
    image: "/images/work/moneyguard/home.webp",
    gallery: ["/images/work/moneyguard/ai-agent.webp", "/images/work/moneyguard/ai-agent1.webp", "/images/work/moneyguard/quickadd1.webp", "/images/work/moneyguard/quickadd2.webp", "/images/work/moneyguard/edit-budget.webp"],
  },
  {
    id: "cabarete-villas", name: "Cabarete Villas", year: "2025", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "Firebase", "PayPal", "iCal sync"],
    status: "production",
    liveUrl: "https://www.cabaretevillas.com",
    metaTitle: "Cabarete Villas — direct-booking villa rental platform with iCal sync",
    metaDesc: "A vacation rental platform that ends double-bookings via two-way iCal sync with Airbnb and VRBO, and takes commission-free direct reservations through PayPal.",
    desc: "Full-stack vacation rental platform for a Dominican villa business — listings, two-way iCal sync with Airbnb and VRBO, a commission-free PayPal booking flow, and AI-automated bilingual listings.",
    problem: "A villa business juggling Airbnb, VRBO, and direct enquiries kept double-booking properties, because three calendars with no shared source of truth will eventually disagree. It was also paying platform commission on guests who had found the business directly, and every listing edit meant updating three places in two languages.",
    build: "One platform that owns the calendar and the direct-booking flow, so the channels follow it instead of competing with it.",
    points: [
      "Two-way iCal sync with Airbnb and VRBO so every channel reads one availability truth — the fix for double-bookings at the data layer rather than by staff diligence.",
      "A PayPal direct-booking flow, so a guest who arrives through the business's own site costs no platform commission.",
      "AI-automated bilingual listings: write once, publish in English and Spanish, instead of maintaining six copies by hand.",
    ],
    outcome: "Live at cabaretevillas.com and running the business's direct bookings, with double-booking incidents eliminated and listings maintained in one place instead of six.",
    image: "/images/work/cabarete-villas/featured.webp",
    gallery: ["/images/work/cabarete-villas/home.webp", "/images/work/cabarete-villas/property.webp"],
  },
  {
    id: "ruleta", name: "Ruleta", year: "2025", category: "Mobile app", cats: ["Mobile"],
    tags: ["Mobile App", "Flutter", "Hive", "Offline-first"],
    status: "production",
    metaTitle: "Ruleta — offline prize-wheel app for brand activations and events",
    metaDesc: "A Flutter prize-wheel app for event marketing: weighted odds that respect campaign inventory, full brand theming, and complete offline operation with no venue Wi-Fi.",
    desc: "Promotional prize-wheel app for live events and brand activations — a weighted probability engine tied to campaign inventory, participant tracking, an admin dashboard, and full brand theming.",
    problem: "Brands running activations need a prize wheel that looks premium on a big screen at a venue, keeps working when the venue Wi-Fi does not, and cannot give away more inventory than the campaign budgeted. Most options fail at least one of those, and the third failure is the expensive one.",
    build: "A Flutter app built for the event floor rather than the demo room.",
    points: [
      "A weighted probability engine so prize odds map to the campaign's actual inventory and budget — the wheel cannot over-award a prize the brand does not have.",
      "Participant capture and an admin dashboard, so an activation produces reportable data instead of a vague sense that it went well.",
      "Full theme customization so the wheel wears the client's brand, and Hive local storage so the whole thing runs with no connection at all.",
    ],
    outcome: "Used at live events and activations, capturing spins, prize awards, and participant data with or without a connection.",
    image: "/images/work/ruleta/home.webp",
    gallery: ["/images/work/ruleta/ruleta.webp", "/images/work/ruleta/admin.webp", "/images/work/ruleta/win.webp", "/images/work/ruleta/perfil2.webp", "/images/work/ruleta/perfiles.webp"],
  },
  {
    id: "luxedrive", name: "LuxeDrive", year: "2024", category: "Web · SaaS", cats: ["Web", "SaaS"],
    tags: ["Next.js", "TypeScript", "MongoDB", "Mongoose", "NextAuth", "Jest"],
    status: "prototype",
    metaTitle: "LuxeDrive — car rental booking platform with race-safe availability",
    metaDesc: "A car rental platform where double-booking is prevented in the data layer by a date-overlap check, not by the UI — plus automated service scheduling and server-side fleet KPIs.",
    desc: "Car rental platform with a customer booking flow and an operational fleet dashboard, built around one idea: availability guarantees belong in the database, not in the interface.",
    problem: "Small and mid-size rental businesses in the Dominican Republic run on phone bookings and spreadsheets, with no real-time view of fleet availability, revenue, or utilization. The two failure modes that cost real money are double-bookings and missed maintenance windows — and both are the predictable result of a calendar that lives in someone's head.",
    build: "A self-serve booking site backed by an operational dashboard, with the invariants enforced where they cannot be bypassed.",
    points: [
      "Double-booking prevention in the data layer, not the UI: a pre-save hook runs a date-overlap query against every pending and active rental for that vehicle and rejects a conflicting write. The guarantee holds when two requests race, or when a booking is created outside the normal flow — a front-end availability check holds in neither case.",
      "Fleet maintenance as domain logic rather than a checklist: the last service date drives the next due date on a 90-day interval, and an overdue vehicle is a query instead of a thing someone has to remember.",
      "Role-based authorization at the API boundary — shared middleware validates the session and role claim before any handler runs, so admin-only fleet writes and dashboard aggregates reject non-admins regardless of what the client sends.",
      "Dashboard KPIs computed server-side with MongoDB aggregation pipelines — revenue, active rentals, most-rented vehicles, week- and month-over-month deltas arrive as one payload, so the client renders numbers instead of recomputing them.",
    ],
    outcome: "A complete working prototype: data modeling, REST API, auth and authorization middleware, the customer booking UI, and the admin dashboard, with Jest coverage over the booking rules. Not deployed to a live tenant — it stands as a reference build for how to make availability and access-control guarantees structural rather than advisory.",
  },
];

const projectsEs: Project[] = [
  {
    id: "melow", name: "Melow", year: "2026", category: "IA · SaaS", cats: ["AI", "SaaS"],
    tags: ["Integración de IA", "SaaS multi-tenant", "RAG", "WhatsApp API", "Fastify", "Qdrant", "Vapi"],
    status: "production",
    metaTitle: "Melow — plataforma multi-tenant de agentes IA en WhatsApp + copiloto dental",
    metaDesc: "Plataforma multi-tenant de chatbots con IA en WhatsApp y web, con RAG sobre tus propios documentos y un copiloto dental que llena el odontograma hablando. Por Pedro Jimenez.",
    desc: "Plataforma multi-tenant de agentes de IA que despliega chatbots en WhatsApp y widgets web integrables, fundamentados en los documentos de cada cliente. Despliegue estrella: un Copiloto Clínico dental que actualiza el expediente del paciente sin manos, en plena consulta.",
    problem: "Dos problemas, una plataforma. Un negocio que quiere un agente de IA en WhatsApp se enfrenta a semanas de plomería con la Meta Cloud API, y a un bot que alucina porque no está anclado a sus documentos reales. Y en el caso estrella — una clínica dental — el dentista tiene las manos en el paciente. Parar para escribir notas clínicas, actualizar un odontograma o redactar una receta rompe la concentración, alarga la visita y obliga a tocar un teclado con guantes.",
    build: "Una plataforma multi-tenant donde cada negocio tiene datos, configuración y base de conocimiento vectorial aislados — y encima, un Copiloto Clínico basado en ReAct para el vertical dental.",
    points: [
      "Respuestas ancladas en recuperación: subes PDFs o URLs, se trocean y se indexan en Qdrant, con un piso de similitud coseno de 0.40 para que el bot se calle en lugar de inventar una respuesta que no puede sostener.",
      "Capa de LLM agnóstica del proveedor — DeepSeek, OpenAI, Groq u OpenRouter detrás de una sola interfaz. Cambiar de proveedor son dos variables de entorno y un reinicio, no una refactorización, así que ningún cliente queda atado al precio de un solo vendor.",
      "WhatsApp vía Meta Cloud API con una cola BullMQ que absorbe las ráfagas de webhooks, un widget web integrable con streaming SSE, y Embedded Signup para que el cliente conecte su propio número con un OAuth dentro de la app en vez de un ticket de soporte.",
      "Traspaso a humano que de verdad funciona: bandeja de agente sobre un feed SSE en vivo, y el bot se silencia en el momento en que una persona toma el control, para que el cliente nunca reciba respuesta de un humano y un robot a la vez.",
      "Fichado dental sin manos: el dentista dice \"caries en el diente 16, mesial y oclusal\", el Copiloto interpreta la notación FDI y actualiza él mismo un odontograma interactivo de 32 dientes — con más de 13 herramientas de backend que cubren extracciones, cruce de alergias, recetas y notas SOAP.",
      "Un cuestionario de admisión de 13 pasos por WhatsApp — antecedentes, alergias, medicamentos, seguro — que aterriza como datos estructurados en un expediente de 6 pestañas, y llamadas de voz que escalan a un agente de IA con Vapi corriendo sobre el propio proxy LLM de la plataforma, con acceso a la base de conocimiento.",
    ],
    outcome: "Corriendo en producción sobre un despliegue endurecido — PM2, Nginx, Let's Encrypt y Qdrant atado a localhost — con 33 pruebas unitarias sobre el servicio de LLM y el motor de conversación. Las observaciones en lenguaje natural se vuelven datos médicos estructurados: notas SOAP, planes de tratamiento, presupuestos por fases, odontogramas. El dentista se queda con el paciente, no con el teclado.",
    image: "/images/work/melow/analytics.webp",
    gallery: ["/images/work/melow/odontogram.webp", "/images/work/melow/patients-module.webp"],
  },
  {
    id: "c21-perdomo", name: "C21 Perdomo", year: "2026", category: "Web app", cats: ["Web"],
    tags: ["Next.js 16", "SEO técnico", "next-intl", "WordPress headless", "Railway", "Cloudflare"],
    status: "production",
    liveUrl: "https://c21perdomo.com",
    metaTitle: "C21 Perdomo — SEO inmobiliario en 4 idiomas sobre WordPress headless",
    metaDesc: "Caso de SEO técnico: ~1,400 propiedades en inglés, español, francés y alemán. Canonicals correctos, hreflang y HTTP 410 sobre un stack Next.js + WordPress headless.",
    desc: "Frontend headless en Next.js sobre el catálogo de WordPress que ya existía, sirviendo ~1,400 propiedades en inglés, español, francés y alemán — un proyecto donde el ruteo y el SEO técnico son la arquitectura, no un añadido.",
    problem: "En bienes raíces nadie compra una casa desde una página que no rankea, así que la búsqueda orgánica es todo el juego — y es implacable justo con lo que un sitio de cuatro idiomas hace mal. Un crawl de Ahrefs sacó 6,284 errores de hreflang, cientos de 404 y canonicals apuntando a URLs muertas. El backend de WordPress estaba hecho para un folleto en un idioma, y su campo canonical de RankMath devolvía la URL en inglés para todos los idiomas, diciéndole a Google en silencio que ignorara por completo las páginas en español, francés y alemán.",
    build: "Un mapa de rutas como única fuente de verdad, con todas las señales de SEO calculadas desde ahí en vez de confiar en el CMS.",
    points: [
      "Cada slug traducido se define una sola vez en una tabla de rutas; canonicals, alternates hreflang, x-default, sitemaps y enlaces de navegación se derivan de ella. No hay árboles de rutas duplicados que se desincronicen — la clase de bug que produjo 6,284 errores de hreflang desde una sola causa raíz.",
      "Canonicals calculados localmente en lugar de leídos de WordPress, porque RankMath devolvía la URL en inglés para los cuatro idiomas. Equivocarse aquí desindexa tres idiomas.",
      "Las propiedades borradas devuelven un HTTP 410 Gone real en vez del 200 con título \"Property Not Found\" de WordPress — el patrón de soft-404 que Google desaconseja explícitamente — y salen del sitemap para que el presupuesto de crawl vaya al inventario vivo.",
      "Las páginas de propiedad se renderizan estáticas con ISR cada hora: cacheables en el edge y rápidas, pero nunca con más de una hora de retraso en el precio, con revalidación bajo demanda para correcciones urgentes.",
      "Meta Pixel y la Conversions API disparan en cada vista de propiedad usando el ID de listing del catálogo y no el ID de post de WordPress, para que las audiencias de retargeting coincidan con inventario real en vez de fallar en silencio.",
      "El SEO se verifica con scripts, no con buena fe: un validador de 55 chequeos corre contra URLs en vivo revisando canonical, hreflang, html lang, x-default y redirecciones, junto con auditorías de cobertura de sitemap y de arquitectura antes de cada despliegue.",
    ],
    outcome: "En vivo en c21perdomo.com con cobertura de sitemap cerca del 99% en los cuatro idiomas — entre 345 y 349 propiedades por idioma, contra el puñado que el audit encontraba indexado. Un sitio inmobiliario multilingüe que aparece en búsqueda en cada mercado que atiende, encima de un CMS heredado que nunca se diseñó para uso headless. Lo difícil nunca fueron las cadenas de traducción; fue que Google entendiera cada página en cada idioma.",
    image: "/images/work/c21-perdomo/home.webp",
    gallery: ["/images/work/c21-perdomo/banner.webp", "/images/work/c21-perdomo/featured.webp", "/images/work/c21-perdomo/blog.webp"],
  },
  {
    id: "moneyguard", name: "MoneyGuard", year: "2025", category: "Móvil · IA", cats: ["Mobile", "AI"],
    tags: ["Flutter", "Integración de IA", "OCR en dispositivo", "Offline-first", "FastAPI", "DeepSeek"],
    status: "mvp",
    metaTitle: "MoneyGuard — app Flutter que frena el gasto antes de que ocurra",
    metaDesc: "App de finanzas Flutter offline-first con OCR de recibos en el dispositivo y un motor de IA de 3 compuertas que interviene antes de la compra. Para el gasto en efectivo dominicano.",
    desc: "App Flutter offline-first que interviene antes de que gastes de más en lugar de reportarlo después — un motor de decisión de 3 compuertas, OCR de recibos en el dispositivo y una IA que te discute en el momento de la compra.",
    problem: "Las apps de presupuesto te dicen lo que ya gastaste, que es una boleta de calificaciones emitida después del daño. Además asumen conexión bancaria — y en un mercado de efectivo como República Dominicana, una parte enorme del gasto nunca toca una cuenta que la app pueda leer. Así que la herramienta llega tarde y además ve a medias.",
    build: "Un motor de intervención en vez de un dashboard: se mete en el camino de la compra, y funciona sin señal y sin banco.",
    points: [
      "Una cascada de decisión de 3 compuertas donde solo la última cuesta dinero: un umbral de monto y un cálculo de cuánto es seguro gastar corren local e instantáneo, y al LLM se le llama solo cuando esas dos no alcanzan — lo que mantiene la inferencia bajo $5 al mes en lugar de una llamada de API por gasto.",
      "OCR en el dispositivo con Google ML Kit, con 80–90% de precisión de extracción — gratis, totalmente offline, y ninguna foto de recibo sale del teléfono, así que el gasto en efectivo se cuenta sin conexión bancaria y sin ceder privacidad.",
      "Offline-first de verdad sobre una base local Hive con sincronización en segundo plano: cada función esencial funciona sin conexión, que en este mercado es un requisito y no un lujo.",
      "Registro manual rápido en dos toques y unos cinco segundos — montos predefinidos y categorías de un toque — porque un registrador de gastos que toma treinta segundos es uno que nadie usa dos veces.",
      "Tono de intervención seleccionable, del empujón amable a la negativa seca, con el extremo directo por defecto para el mercado dominicano: \"NO. El alquiler vence en 3 días. Compra eso y te quedan RD$400 para comida.\"",
    ],
    outcome: "MVP completo y en beta con un grupo pequeño de prueba. Backend, cliente Flutter y sincronización offline entregados e integrados; el motor de intervención funciona de punta a punta, el OCR se mantiene sobre 80% de precisión, y el costo total de operación ronda los $5–10 al mes incluyendo hosting e inferencia.",
    image: "/images/work/moneyguard/home.webp",
    gallery: ["/images/work/moneyguard/ai-agent.webp", "/images/work/moneyguard/ai-agent1.webp", "/images/work/moneyguard/quickadd1.webp", "/images/work/moneyguard/quickadd2.webp", "/images/work/moneyguard/edit-budget.webp"],
  },
  {
    id: "cabarete-villas", name: "Cabarete Villas", year: "2025", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "Firebase", "PayPal", "Sincronización iCal"],
    status: "production",
    liveUrl: "https://www.cabaretevillas.com",
    metaTitle: "Cabarete Villas — reservas directas de villas con sincronización iCal",
    metaDesc: "Plataforma de alquiler vacacional que acaba con las dobles reservas mediante sincronización iCal con Airbnb y VRBO, y cobra reservas directas sin comisión vía PayPal.",
    desc: "Plataforma full-stack de alquiler vacacional para un negocio de villas dominicano — listados, sincronización iCal bidireccional con Airbnb y VRBO, reservas directas por PayPal sin comisión y listados bilingües automatizados con IA.",
    problem: "Un negocio de villas haciendo malabares entre Airbnb, VRBO y consultas directas seguía duplicando reservas, porque tres calendarios sin una fuente de verdad compartida terminan contradiciéndose. Además pagaba comisión de plataforma por huéspedes que habían llegado directo al negocio, y cada edición de un listado significaba actualizar tres lugares en dos idiomas.",
    build: "Una sola plataforma dueña del calendario y del flujo de reserva directa, para que los canales la sigan en vez de competir con ella.",
    points: [
      "Sincronización iCal bidireccional con Airbnb y VRBO para que todos los canales lean una sola verdad de disponibilidad — la solución a las dobles reservas en la capa de datos y no en la diligencia del personal.",
      "Flujo de reserva directa con PayPal, para que un huésped que llega por el sitio propio del negocio no cueste comisión de plataforma.",
      "Listados bilingües automatizados con IA: escribes una vez, publicas en inglés y español, en lugar de mantener seis copias a mano.",
    ],
    outcome: "En vivo en cabaretevillas.com y manejando las reservas directas del negocio, con las dobles reservas eliminadas y los listados mantenidos en un solo lugar en vez de seis.",
    image: "/images/work/cabarete-villas/featured.webp",
    gallery: ["/images/work/cabarete-villas/home.webp", "/images/work/cabarete-villas/property.webp"],
  },
  {
    id: "ruleta", name: "Ruleta", year: "2025", category: "App móvil", cats: ["Mobile"],
    tags: ["App móvil", "Flutter", "Hive", "Offline-first"],
    status: "production",
    metaTitle: "Ruleta — app de ruleta de premios offline para activaciones de marca",
    metaDesc: "App Flutter de ruleta de premios para marketing de eventos: probabilidades ponderadas que respetan el inventario de la campaña, temas de marca y operación 100% offline.",
    desc: "App de ruleta de premios para eventos en vivo y activaciones de marca — motor de probabilidad ponderada atado al inventario de la campaña, registro de participantes, panel de administración y personalización completa de marca.",
    problem: "Las marcas que hacen activaciones necesitan una ruleta que se vea premium en una pantalla grande en el local, que siga funcionando cuando el Wi-Fi del local no lo haga, y que no pueda regalar más inventario del que la campaña presupuestó. La mayoría de las opciones falla en al menos una de las tres, y la tercera es la que sale cara.",
    build: "Una app Flutter hecha para el piso del evento, no para la sala de demos.",
    points: [
      "Motor de probabilidad ponderada para que las probabilidades de premio correspondan al inventario y presupuesto reales de la campaña — la ruleta no puede entregar de más un premio que la marca no tiene.",
      "Captura de participantes y panel de administración, para que una activación produzca datos reportables y no una sensación vaga de que salió bien.",
      "Personalización completa de tema para que la ruleta lleve la marca del cliente, y almacenamiento local con Hive para que todo corra sin conexión alguna.",
    ],
    outcome: "Usada en eventos y activaciones en vivo, capturando giros, premios entregados y datos de participantes con o sin conexión.",
    image: "/images/work/ruleta/home.webp",
    gallery: ["/images/work/ruleta/ruleta.webp", "/images/work/ruleta/admin.webp", "/images/work/ruleta/win.webp", "/images/work/ruleta/perfil2.webp", "/images/work/ruleta/perfiles.webp"],
  },
  {
    id: "luxedrive", name: "LuxeDrive", year: "2024", category: "Web · SaaS", cats: ["Web", "SaaS"],
    tags: ["Next.js", "TypeScript", "MongoDB", "Mongoose", "NextAuth", "Jest"],
    status: "prototype",
    metaTitle: "LuxeDrive — renta de autos con disponibilidad a prueba de carreras",
    metaDesc: "Renta de autos donde la doble reserva se evita en la capa de datos con una consulta de solapamiento de fechas, no en la UI — más mantenimiento automático y KPIs en servidor.",
    desc: "Plataforma de renta de autos con flujo de reserva para clientes y panel operativo de flota, construida alrededor de una idea: las garantías de disponibilidad viven en la base de datos, no en la interfaz.",
    problem: "Las rentadoras pequeñas y medianas en República Dominicana funcionan con reservas por teléfono y hojas de cálculo, sin visión en tiempo real de disponibilidad, ingresos ni utilización de la flota. Los dos fallos que cuestan dinero de verdad son las dobles reservas y los mantenimientos vencidos — y ambos son el resultado predecible de un calendario que vive en la cabeza de alguien.",
    build: "Un sitio de reserva self-service respaldado por un panel operativo, con las invariantes aplicadas donde no se pueden esquivar.",
    points: [
      "Prevención de doble reserva en la capa de datos, no en la UI: un hook pre-save corre una consulta de solapamiento de fechas contra toda renta pendiente y activa de ese vehículo y rechaza la escritura en conflicto. La garantía se sostiene cuando dos peticiones compiten, o cuando la reserva se crea fuera del flujo normal — una validación en el frontend no se sostiene en ninguno de los dos casos.",
      "Mantenimiento de flota como lógica de dominio y no como checklist: la fecha del último servicio determina la del próximo en un intervalo de 90 días, y un vehículo vencido es una consulta en lugar de algo que alguien tiene que recordar.",
      "Autorización por roles en la frontera de la API — un middleware compartido valida la sesión y el rol antes de que corra cualquier handler, así que las escrituras de flota y los agregados del panel rechazan a quien no sea admin sin importar lo que mande el cliente.",
      "KPIs del panel calculados en el servidor con pipelines de agregación de MongoDB — ingresos, rentas activas, vehículos más rentados y variaciones semana y mes contra mes llegan en un solo payload, así que el cliente pinta números en vez de recalcularlos.",
    ],
    outcome: "Un prototipo completo y funcional: modelado de datos, API REST, middleware de autenticación y autorización, la UI de reserva del cliente y el panel de administración, con cobertura de Jest sobre las reglas de reserva. No desplegado a un cliente en vivo — queda como build de referencia de cómo hacer que las garantías de disponibilidad y de control de acceso sean estructurales y no advertencias.",
  },
];

export const projects: Record<Lang, Project[]> = { en: projectsEn, es: projectsEs };

export const getProject = (lang: Lang, id: string) =>
  projects[lang].find((p) => p.id === id);

// ─── Page copy ────────────────────────────────────────────────────────────

const en = {
  nav: {
    work: "Work", services: "Services", about: "About", contact: "Contact",
    available: "Available", startProject: "Start a project", menu: "Menu",
  },
  footer: {
    tagline: "Full-stack & AI developer · Santiago, Dominican Republic",
    email: "Email", github: "GitHub",
    copyright: "© 2026 Pedro Jimenez · Built with the same AI layer I ship for clients.",
  },
  notFound: {
    eyebrow: "// 404",
    title: "This page doesn't exist.",
    message: "The work does, though — six shipped projects, four of them live with real users.",
    ctaHome: "Back to home", ctaWork: "See the work",
  },
  home: {
    metaTitle: "Pedro Jimenez — I build the AI layer your product is missing | Full-stack + AI developer, Santiago DO",
    metaDesc: "Solo full-stack & AI developer in Santiago, Dominican Republic. AI integrations, automations, web & mobile apps — shipped, not demoed. Ask the site anything.",
    heroBadge: "pedro.ai · online",
    heroTitle1: "I build the AI layer", heroTitle2: "your product is missing.",
    heroSub: "This site is running one right now. Ask it anything — it knows every project Pedro has shipped, the stack, and whether he's free this week.",
    conciergePlaceholder: "Ask me what Pedro can build for you.",
    send: "Send",
    tryAsking: "Not sure where to start? Try asking:",
    chips: [
      "What can you build for me?",
      "Show me your AI projects",
      "How do you charge?",
      "Are you available right now?",
    ],
    scrollToBrowse: "or scroll to browse",
    workEyebrow: "// selected work",
    workTitle: "Built and shipped.",
    workSub: "A few of the integrations, apps, and systems I've shipped — each one solving a real problem, in production.",
    workCta: "See all 8 projects",
    servicesEyebrow: "// what I build",
    servicesTitle: "One developer. The whole stack.",
    servicesSub: "No handoffs, no account managers. You talk to the person writing the code.",
    services: [
      { title: "AI integrations", icon: "AI", desc: "RAG, chat, agents, clinical notes — wired into your product, not bolted on. DeepSeek, Claude, and local LLMs." },
      { title: "Automations", icon: "</>", desc: "Bots and pipelines that do the boring work. WhatsApp, Telegram, social publishing, data reconciliation." },
      { title: "Web apps", icon: "{ }", desc: "Next.js front to back. Multilingual, SEO-tuned, with analytics that actually feed your ad algorithms." },
      { title: "Mobile apps", icon: "[ ]", desc: "Flutter apps that ship to both stores. Offline-first, OCR, payments — built for real users." },
      { title: "SaaS platforms", icon: "⌘", desc: "Multi-tenant from day one. Auth, billing, admin dashboards, and role-based access control." },
      { title: "3D & motion", icon: "◇", desc: "Brand identity that moves. Logo animation, looping heroes, and social kits in Blender." },
    ],
    aboutEyebrow: "// about",
    workingAlt: "Pedro Jimenez writing code at his desk on an ultrawide monitor",
    aboutTitle: "I ship production software, solo — fast, without the agency overhead.",
    aboutP1: "Based in Santiago, Dominican Republic. I've shipped 8 projects this year alone — AI integrations, multi-tenant SaaS, mobile apps, and automations. Bilingual EN/ES, and I build for the Dominican market as fluently as the US one.",
    aboutP2: "If you need a smart layer between your data and your users, that's exactly what I build.",
    aboutCta: "More about Pedro",
    contactBadge: "Open from July 2026 · replies within 24h",
    contactTitle: "Have something to build?",
    contactSub: "Tell me what you're working on. I'll tell you what I'd build and whether I'm the right person for it.",
    contactAsk: "Or ask the site ↑",
  },
  stats: [
    { value: "6", label: "projects shipped" },
    { value: "1", label: "developer — you talk to me" },
    { value: "EN/ES", label: "fully bilingual delivery" },
    { value: "24h", label: "typical reply time" },
  ],
  work: {
    metaTitle: "Work — 6 shipped projects | Pedro Jimenez, full-stack + AI developer",
    metaDesc: "AI integrations, SaaS platforms, mobile apps, and automations shipped by Pedro Jimenez — Melow, C21 Perdomo, MoneyGuard, Cabarete Villas, LuxeDrive and more. All in production.",
    eyebrow: "// work — 6 projects, 4 live in production",
    title1: "Built and shipped.", title2: "Not demoed.",
    sub: "Every project here is live, with real users. Click one for the full story — problem, build, and what shipped.",
    filterLabel: "Filter projects",
    all: "All",
    filters: { AI: "AI", Web: "Web", Mobile: "Mobile", SaaS: "SaaS", Automation: "Automation" },
    readCaseStudy: "Read the case study",
    ctaTitle: "Your project could be number 7.",
    ctaSub: "Most of these started as a two-line email. Send yours.",
    ctaAsk: "Ask the site instead",
  },
  caseStudy: {
    allWork: "All work",
    // Per-project, from Project.status — no longer a blanket "in production"
    // claim on builds that never deployed.
    statusLabel: { production: "in production", mvp: "MVP · in beta", prototype: "working prototype" },
    viewLive: "View it live",
    problem: "// the problem",
    build: "// the build",
    shipped: "// what shipped",
    stack: "Stack",
    available: "Available",
    scopeIt: (name: string) => `Need something like ${name}? Pedro can scope it this week.`,
    startProject: "Start a project",
    prev: "← Previous", next: "Next →",
    metaTitle: (name: string) => `${name} — case study | Pedro Jimenez`,
  },
  services: {
    metaTitle: "Services — AI integrations, automations, web & mobile apps | Pedro Jimenez",
    metaDesc: "What Pedro Jimenez builds: AI integrations, automations, web apps, mobile apps, SaaS platforms, 3D & motion. One developer, the whole stack — scoped in days, shipped in weeks.",
    eyebrow: "// services",
    title1: "One developer.", title2: "The whole stack.",
    sub: "No handoffs, no account managers, no agency markup. You talk to the person writing the code — and it ships in weeks, not quarters.",
    cards: [
      { title: "AI integrations", icon: "AI", desc: "RAG over your documents, AI agents, chat that knows your business, clinical-note generation — wired into your product, not bolted on. If the model needs your data to be useful, this is the work.", tools: ["DeepSeek", "Claude", "Ollama", "RAG", "LangChain"], cta: "See Melow", href: "/work/melow" },
      { title: "Automations", icon: "</>", desc: "Bots and pipelines that do the boring work: WhatsApp and Telegram bots, social publishing, data reconciliation, report generation. If your team does it weekly by hand, it can probably run itself.", tools: ["WhatsApp API", "Telegram", "Bun", "n8n"], cta: "Ask about automations", href: `mailto:${EMAIL}` },
      { title: "Web apps", icon: "{ }", desc: "Next.js front to back — multilingual, SEO-tuned, statically fast, with server-side analytics that feed your ad algorithms real conversions. Headless CMS when your team needs to edit content themselves.", tools: ["Next.js", "WordPress", "Firebase", "GA4", "Meta CAPI"], cta: "See C21 Perdomo", href: "/work/c21-perdomo" },
      { title: "Mobile apps", icon: "[ ]", desc: "Flutter apps that ship to both stores from one codebase. Offline-first for markets where connectivity isn't a given, OCR, payments, and AI features that work on-device and off.", tools: ["Flutter", "FastAPI", "Hive", "OCR"], cta: "See MoneyGuard", href: "/work/moneyguard" },
      { title: "SaaS platforms", icon: "##", desc: "Multi-tenant from day one: per-tenant data isolation, auth, roles, admin dashboards. The architecture decisions that are expensive to retrofit, made correctly at the start — and the booking-style invariants that have to hold in the database rather than the UI.", tools: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "MongoDB"], cta: "See Melow", href: "/work/melow" },
      { title: "3D & motion", icon: "//", desc: "Brand identity that moves — logo animation, looping hero visuals, and social kits built in Blender. The finishing layer that makes a product feel expensive.", tools: ["Blender", "Motion"], cta: "Ask about motion work", href: `mailto:${EMAIL}` },
    ],
    howEyebrow: "// how I work",
    howTitle: "Three steps. No ceremony.",
    howSub: "The overhead you're used to from agencies is the thing I removed.",
    steps: [
      { n: "01", title: "Scope", desc: "You describe the problem in plain language. Within days you get a concrete plan: what gets built, what it costs, when it ships. No discovery-phase invoices." },
      { n: "02", title: "Build", desc: "Short cycles, working software every week. You see progress in your hands, not in status decks. Changes are conversations, not change orders." },
      { n: "03", title: "Ship", desc: "Production deployment, monitoring, and a handover you actually understand. I stay available after launch — the point is software that keeps working." },
    ],
    engageEyebrow: "// working together",
    engageTitle: "Two ways to engage.",
    models: [
      { tag: "Most common", title: "Fixed-scope project", desc: "A defined build with a defined price and a defined ship date. Best when you know the problem — an app, an integration, an automation — and want certainty on cost and timeline.", cta: "Scope my project", featured: true },
      { tag: "Ongoing", title: "Retainer", desc: "A block of dedicated hours each month for evolving products — new features, AI improvements, maintenance, and priority response. Best after a first project ships and keeps growing.", cta: "Ask about retainers", featured: false },
    ],
    pricingNote1: "Pricing is scoped per project — describe what you're building and you'll get a concrete quote, not a rate card. Not sure what you need? ",
    pricingNoteLink: "Ask the site",
    pricingNote2: " — it knows what Pedro has built before.",
  },
  about: {
    metaTitle: "About — Pedro Jimenez, solo full-stack + AI developer in Santiago, DO",
    metaDesc: "Pedro Jimenez ships AI integrations, automations, and full-stack apps from Santiago, Dominican Republic. Bilingual EN/ES. Open for projects — talk to the site or email directly.",
    eyebrow: "// about",
    portraitAlt: "Portrait of Pedro Jimenez",
    title: "Pedro Jimenez.",
    subtitle: "Solo developer. Whole product.",
    p1: "Based in Santiago, Dominican Republic. I ship AI integrations, automations, and full-stack web and mobile apps — production-grade, fast, without the agency overhead. Six projects shipped, four of them live in production with real users.",
    p2: "I work bilingually — EN and ES — and build for the Dominican market as fluently as for the US. Cash-first payment flows, offline-first mobile, WhatsApp as a primary channel: constraints most remote developers have never met.",
    p3: "If you need a smart layer between your data and your users, that's exactly what I build. This site is running one right now.",
    stackLabel: "Stack & services",
    skills: ["AI integrations", "Automations", "Web apps", "Mobile apps", "SaaS", "3D / Motion", "Next.js", "Flutter", "Python", "Node.js", "DeepSeek", "Claude", "RAG", "WhatsApp API", "Firebase", "MongoDB"],
    availableTitle: "Available for projects",
    availableDesc: "Open from July 2026. Typical reply within 24 hours, in English or Spanish.",
    contactEyebrow: "// contact",
    contactTitle: "Tell me what you're building.",
    contactSub: "Talk to the site — it will scope your idea against what Pedro has shipped before — or skip straight to email.",
    conciergeGreeting: "Hola. Tell me what you're building — I'll tell you what Pedro can do for it, what he's shipped that's similar, and whether he's available.",
    conciergePlaceholder: "Tell me what you're building…",
    stateOnline: "online", stateProcessing: "processing", stateResponding: "responding",
    emailLabel: "Email — fastest route",
    emailDesc: "Two lines about your project is enough. You'll get a real reply, not a form response.",
    includeLabel: "What to include",
    includes: [
      "What the product does and who uses it",
      "What's manual, broken, or missing today",
      "Any deadline or budget reality I should know about",
    ],
    formToggle: "Rather just fill in a form?",
    formTitle: "Send a message",
    formName: "Name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "you@company.com",
    formMessage: "What are you building?",
    formMessagePlaceholder: "A couple of lines is plenty — what it does, what's broken today, and any deadline.",
    formSend: "Send to Pedro",
    formSending: "Sending…",
    formSent: "Sent. Pedro will reply within 24h — there's a copy in your inbox.",
    bookLabel: "Prefer to talk?",
    bookCta: "Book a 20-min call",
    formError: `Couldn't send that. Try again, or email ${EMAIL} directly.`,
  },
  concierge: {
    fallback: `Not sure how to answer that — email ${EMAIL} and he'll reply within a day.`,
    error: `Connection hiccup on my end. Try again in a sec, or just email ${EMAIL}.`,
    you: "You", ai: "Pedro.ai",
    emailLabel: "Your email",
    emailPlaceholder: "you@example.com",
    sendScope: "Send this scope to Pedro",
    sendingScope: "Sending…",
    scopeSent: "Sent! Pedro will reply within 24h — check your inbox for a copy.",
    scopeError: "Couldn't send. Try again or email hello@pedrojimenez.dev directly.",
    scopeHint: "Drop your email and I'll send this conversation to Pedro.",
  },
};

const es: typeof en = {
  nav: {
    work: "Proyectos", services: "Servicios", about: "Sobre mí", contact: "Contacto",
    available: "Disponible", startProject: "Iniciar un proyecto", menu: "Menú",
  },
  footer: {
    tagline: "Desarrollador full-stack e IA · Santiago, República Dominicana",
    email: "Email", github: "GitHub",
    copyright: "© 2026 Pedro Jimenez · Construido con la misma capa de IA que entrego a mis clientes.",
  },
  notFound: {
    eyebrow: "// 404",
    title: "Esta página no existe.",
    message: "El trabajo sí — seis proyectos entregados, cuatro de ellos en vivo con usuarios reales.",
    ctaHome: "Volver al inicio", ctaWork: "Ver los proyectos",
  },
  home: {
    metaTitle: "Pedro Jimenez — Construyo la capa de IA que le falta a tu producto | Desarrollador full-stack + IA, Santiago RD",
    metaDesc: "Desarrollador full-stack e IA en Santiago, República Dominicana. Integraciones de IA, automatizaciones, apps web y móviles — entregadas en producción, no demos. Pregúntale al sitio lo que quieras.",
    heroBadge: "pedro.ai · en línea",
    heroTitle1: "Construyo la capa de IA", heroTitle2: "que le falta a tu producto.",
    heroSub: "Este sitio está corriendo una ahora mismo. Pregúntale lo que quieras — conoce cada proyecto, el stack y si está libre esta semana.",
    conciergePlaceholder: "Pregúntame qué puede construir Pedro para ti.",
    send: "Enviar",
    tryAsking: "¿No sabes por dónde empezar? Prueba con:",
    chips: [
      "¿Qué puedes construir para mí?",
      "Muéstrame tus proyectos de IA",
      "¿Cómo cobras?",
      "¿Estás disponible ahora?",
    ],
    scrollToBrowse: "o haz scroll para explorar",
    workEyebrow: "// proyectos seleccionados",
    workTitle: "Construido y entregado.",
    workSub: "Algunas de las integraciones, apps y sistemas que he entregado — cada uno resolviendo un problema real, en producción.",
    workCta: "Ver los 8 proyectos",
    servicesEyebrow: "// lo que construyo",
    servicesTitle: "Un desarrollador. Todo el stack.",
    servicesSub: "Sin intermediarios ni ejecutivos de cuenta. Hablas con la persona que escribe el código.",
    services: [
      { title: "Integraciones de IA", icon: "AI", desc: "RAG, chat, agentes, notas clínicas — integrados a tu producto, no pegados encima. DeepSeek, Claude y LLMs locales." },
      { title: "Automatizaciones", icon: "</>", desc: "Bots y pipelines que hacen el trabajo aburrido. WhatsApp, Telegram, publicación en redes, conciliación de datos." },
      { title: "Apps web", icon: "{ }", desc: "Next.js de punta a punta. Multilingüe, afinado para SEO, con analítica que de verdad alimenta tus algoritmos de anuncios." },
      { title: "Apps móviles", icon: "[ ]", desc: "Apps Flutter que llegan a ambas tiendas. Offline-first, OCR, pagos — construidas para usuarios reales." },
      { title: "Plataformas SaaS", icon: "⌘", desc: "Multi-tenant desde el día uno. Autenticación, cobros, paneles de administración y control de acceso por rol." },
      { title: "3D y motion", icon: "◇", desc: "Identidad de marca que se mueve. Animación de logos, heros en loop y kits para redes en Blender." },
    ],
    aboutEyebrow: "// sobre mí",
    workingAlt: "Pedro Jimenez escribiendo código en su escritorio frente a un monitor ultrawide",
    aboutTitle: "Entrego software de producción, solo — rápido, sin la carga de una agencia.",
    aboutP1: "Desde Santiago, República Dominicana. Este año he entregado 8 proyectos — integraciones de IA, SaaS multi-tenant, apps móviles y automatizaciones. Bilingüe (inglés y español), y construyo para el mercado dominicano con la misma fluidez que para el estadounidense.",
    aboutP2: "Si necesitas un cerebro entre tus datos y tus usuarios, eso es exactamente lo que construyo.",
    aboutCta: "Más sobre Pedro",
    contactBadge: "Abierto desde julio 2026 · responde en 24h",
    contactTitle: "¿Tienes algo que construir?",
    contactSub: "Cuéntame en qué estás trabajando. Te diré qué construiría yo y si soy la persona indicada para hacerlo.",
    contactAsk: "O mejor, pregúntale al sitio ↑",
  },
  stats: [
    { value: "6", label: "proyectos entregados" },
    { value: "1", label: "desarrollador — hablas conmigo" },
    { value: "EN/ES", label: "entrega totalmente bilingüe" },
    { value: "24h", label: "tiempo típico de respuesta" },
  ],
  work: {
    metaTitle: "Proyectos — 6 proyectos entregados | Pedro Jimenez, desarrollador full-stack + IA",
    metaDesc: "Integraciones de IA, plataformas SaaS, apps móviles y automatizaciones entregadas por Pedro Jimenez — Melow, C21 Perdomo, MoneyGuard, Cabarete Villas, LuxeDrive y más. Todo en producción.",
    eyebrow: "// proyectos — 6 proyectos, 4 en producción",
    title1: "Construido y entregado.", title2: "No demos.",
    sub: "Cada proyecto aquí está en vivo, con usuarios reales. Haz clic en uno para la historia completa — problema, construcción y qué se entregó.",
    filterLabel: "Filtrar proyectos",
    all: "Todos",
    filters: { AI: "IA", Web: "Web", Mobile: "Móvil", SaaS: "SaaS", Automation: "Automatización" },
    readCaseStudy: "Leer el caso de estudio",
    ctaTitle: "Tu proyecto podría ser el número 7.",
    ctaSub: "La mayoría de estos empezaron con un email de dos líneas. Manda el tuyo.",
    ctaAsk: "O mejor, pregúntale al sitio",
  },
  caseStudy: {
    allWork: "Todos los proyectos",
    statusLabel: { production: "en producción", mvp: "MVP · en beta", prototype: "prototipo funcional" },
    viewLive: "Verlo en vivo",
    problem: "// el problema",
    build: "// la construcción",
    shipped: "// qué se entregó",
    stack: "Stack",
    available: "Disponible",
    scopeIt: (name: string) => `¿Necesitas algo como ${name}? Pedro puede dimensionarlo esta semana.`,
    startProject: "Iniciar un proyecto",
    prev: "← Anterior", next: "Siguiente →",
    metaTitle: (name: string) => `${name} — caso de estudio | Pedro Jimenez`,
  },
  services: {
    metaTitle: "Servicios — integraciones de IA, automatizaciones, apps web y móviles | Pedro Jimenez",
    metaDesc: "Lo que construye Pedro Jimenez: integraciones de IA, automatizaciones, apps web, apps móviles, plataformas SaaS, 3D y motion. Un desarrollador, todo el stack — dimensionado en días, entregado en semanas.",
    eyebrow: "// servicios",
    title1: "Un desarrollador.", title2: "Todo el stack.",
    sub: "Sin intermediarios, sin ejecutivos de cuenta, sin el recargo de agencia. Hablas con la persona que escribe el código — y se entrega en semanas, no en trimestres.",
    cards: [
      { title: "Integraciones de IA", icon: "AI", desc: "RAG sobre tus documentos, agentes de IA, chat que conoce tu negocio, generación de notas clínicas — integrados a tu producto, no pegados encima. Si el modelo necesita tus datos para ser útil, este es el trabajo.", tools: ["DeepSeek", "Claude", "Ollama", "RAG", "LangChain"], cta: "Ver Melow", href: "/work/melow" },
      { title: "Automatizaciones", icon: "</>", desc: "Bots y pipelines que hacen el trabajo aburrido: bots de WhatsApp y Telegram, publicación en redes, conciliación de datos, generación de reportes. Si tu equipo lo hace a mano cada semana, probablemente puede correr solo.", tools: ["WhatsApp API", "Telegram", "Bun", "n8n"], cta: "Pregunta por automatizaciones", href: `mailto:${EMAIL}` },
      { title: "Apps web", icon: "{ }", desc: "Next.js de punta a punta — multilingüe, afinado para SEO, estáticamente rápido, con analítica server-side que alimenta tus algoritmos de anuncios con conversiones reales. CMS headless cuando tu equipo necesita editar contenido por su cuenta.", tools: ["Next.js", "WordPress", "Firebase", "GA4", "Meta CAPI"], cta: "Ver C21 Perdomo", href: "/work/c21-perdomo" },
      { title: "Apps móviles", icon: "[ ]", desc: "Apps Flutter que llegan a ambas tiendas desde un solo código. Offline-first para mercados donde la conectividad no está garantizada, OCR, pagos y funciones de IA que trabajan con y sin conexión.", tools: ["Flutter", "FastAPI", "Hive", "OCR"], cta: "Ver MoneyGuard", href: "/work/moneyguard" },
      { title: "Plataformas SaaS", icon: "##", desc: "Multi-tenant desde el día uno: aislamiento de datos por tenant, autenticación, roles, paneles de administración. Las decisiones de arquitectura que cuestan caro corregir después, tomadas bien desde el principio — y las invariantes tipo reserva que tienen que sostenerse en la base de datos y no en la UI.", tools: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "MongoDB"], cta: "Ver Melow", href: "/work/melow" },
      { title: "3D y motion", icon: "//", desc: "Identidad de marca que se mueve — animación de logos, visuales hero en loop y kits para redes construidos en Blender. La capa final que hace que un producto se sienta caro.", tools: ["Blender", "Motion"], cta: "Pregunta por trabajo de motion", href: `mailto:${EMAIL}` },
    ],
    howEyebrow: "// cómo trabajo",
    howTitle: "Tres pasos. Sin ceremonia.",
    howSub: "Esa capa de procesos, reuniones y costos que traen las agencias — la eliminé.",
    steps: [
      { n: "01", title: "Dimensionar", desc: "Describes el problema en lenguaje sencillo. En días recibes un plan concreto: qué se construye, qué cuesta, cuándo se entrega. Sin facturas por 'fase de descubrimiento'." },
      { n: "02", title: "Construir", desc: "Ciclos cortos, software funcionando cada semana. Ves el progreso en tus manos, no en presentaciones de estado. Los cambios son conversaciones, no órdenes de cambio." },
      { n: "03", title: "Entregar", desc: "Despliegue a producción, monitoreo y una entrega que de verdad entiendes. Sigo disponible después del lanzamiento — el punto es software que sigue funcionando." },
    ],
    engageEyebrow: "// trabajar juntos",
    engageTitle: "Dos formas de contratar.",
    models: [
      { tag: "Lo más común", title: "Proyecto de alcance fijo", desc: "Una construcción definida con un precio definido y una fecha de entrega definida. Ideal cuando conoces el problema — una app, una integración, una automatización — y quieres certeza de costo y tiempo.", cta: "Dimensionar mi proyecto", featured: true },
      { tag: "Continuo", title: "Horas reservadas", desc: "Un bloque de horas dedicadas cada mes para productos que evolucionan — nuevas funciones, mejoras de IA, mantenimiento y respuesta prioritaria. Ideal después de que un primer proyecto se entrega y sigue creciendo.", cta: "Pregunta por horas reservadas", featured: false },
    ],
    pricingNote1: "El precio se dimensiona por proyecto — describe lo que estás construyendo y recibirás una cotización concreta, no una tarifa genérica. ¿No sabes qué necesitas? ",
    pricingNoteLink: "Pregúntale al sitio",
    pricingNote2: " — sabe lo que Pedro ha construido antes.",
  },
  about: {
    metaTitle: "Sobre mí — Pedro Jimenez, desarrollador full-stack + IA en Santiago, RD",
    metaDesc: "Pedro Jimenez entrega integraciones de IA, automatizaciones y apps full-stack desde Santiago, República Dominicana. Bilingüe (inglés y español). Abierto a proyectos — habla con el sitio o escribe directo.",
    eyebrow: "// sobre mí",
    portraitAlt: "Retrato de Pedro Jimenez",
    title: "Pedro Jimenez.",
    subtitle: "Un solo desarrollador. Producto completo.",
    p1: "Desde Santiago, República Dominicana. Entrego integraciones de IA, automatizaciones y apps web y móviles completas — calidad de producción, rápido, sin la carga de una agencia. Seis proyectos entregados, cuatro de ellos en producción con usuarios reales.",
    p2: "Trabajo bilingüe — EN y ES — y construyo para el mercado dominicano con la misma fluidez que para el estadounidense. Flujos de pago donde manda el efectivo, móvil offline-first, WhatsApp como canal principal: restricciones que la mayoría de los desarrolladores remotos nunca han enfrentado.",
    p3: "Si necesitas un cerebro entre tus datos y tus usuarios, eso es exactamente lo que construyo. Este sitio está corriendo uno ahora mismo.",
    stackLabel: "Stack y servicios",
    skills: ["Integraciones de IA", "Automatizaciones", "Apps web", "Apps móviles", "SaaS", "3D / Motion", "Next.js", "Flutter", "Python", "Node.js", "DeepSeek", "Claude", "RAG", "WhatsApp API", "Firebase", "MongoDB"],
    availableTitle: "Disponible para proyectos",
    availableDesc: "Abierto desde julio 2026. Respuesta típica en 24 horas, en español o inglés.",
    contactEyebrow: "// contacto",
    contactTitle: "Cuéntame qué estás construyendo.",
    contactSub: "Habla con el sitio — dimensionará tu idea contra lo que Pedro ya ha entregado — o ve directo al email.",
    conciergeGreeting: "Hola. Cuéntame qué estás construyendo — te diré qué puede hacer Pedro, qué ha entregado que se parezca, y si está disponible.",
    conciergePlaceholder: "Cuéntame qué estás construyendo…",
    stateOnline: "en línea", stateProcessing: "procesando", stateResponding: "respondiendo",
    emailLabel: "Email — la ruta más rápida",
    emailDesc: "Dos líneas sobre tu proyecto son suficientes. Recibirás una respuesta real, no una plantilla.",
    includeLabel: "Qué incluir",
    includes: [
      "Qué hace el producto y quién lo usa",
      "Qué es manual, está roto o falta hoy",
      "Cualquier fecha límite o limitación de presupuesto que deba saber",
    ],
    formToggle: "¿Prefieres llenar un formulario?",
    formTitle: "Envía un mensaje",
    formName: "Nombre",
    formNamePlaceholder: "Tu nombre",
    formEmail: "Email",
    formEmailPlaceholder: "tu@empresa.com",
    formMessage: "¿Qué estás construyendo?",
    formMessagePlaceholder: "Con un par de líneas basta — qué hace, qué está roto hoy y si tienes fecha límite.",
    formSend: "Enviar a Pedro",
    formSending: "Enviando…",
    formSent: "Enviado. Pedro te responderá en 24h — tienes una copia en tu bandeja.",
    bookLabel: "¿Prefieres hablar?",
    bookCta: "Agenda una llamada de 20 min",
    formError: `No se pudo enviar. Intenta de nuevo o escribe directo a ${EMAIL}.`,
  },
  concierge: {
    fallback: `No estoy seguro de cómo responder eso — escribe a ${EMAIL} y te responde en un día.`,
    error: `Se me cayó la conexión un segundo. Inténtalo de nuevo, o escribe directo a ${EMAIL}.`,
    you: "Tú", ai: "Pedro.ai",
    emailLabel: "Tu email",
    emailPlaceholder: "tu@ejemplo.com",
    sendScope: "Enviar este alcance a Pedro",
    sendingScope: "Enviando…",
    scopeSent: "¡Enviado! Pedro te responderá en 24h — revisa tu bandeja, tienes una copia.",
    scopeError: "No se pudo enviar. Intenta de nuevo o escribe a hello@pedrojimenez.dev directamente.",
    scopeHint: "Déjame tu email y le envío esta conversación a Pedro.",
  },
};

export const dict: Record<Lang, typeof en> = { en, es };

export const asLang = (lang: string): Lang => (lang === "es" ? "es" : "en");
export const getDict = (lang: string) => dict[asLang(lang)];
