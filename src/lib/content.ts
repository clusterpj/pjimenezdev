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
}

const projectsEn: Project[] = [
  {
    id: "melow", name: "Melow", year: "2026", category: "AI · SaaS", cats: ["AI", "SaaS"],
    tags: ["AI integration", "SaaS", "Next.js", "Fastify", "Qdrant", "Vapi"],
    desc: "Multi-tenant AI agent platform deploying chatbots across WhatsApp and website widgets. Flagship deployment: an AI Clinical Copilot that runs a dentist's patient records hands-free, mid-consultation.",
    problem: "During a consultation, dentists are hands-on with patients. Stopping to type clinical notes, update an odontogram, or write a prescription breaks focus, slows the visit down, and means touching a keyboard with gloved hands.",
    build: "A ReAct-based Clinical Copilot that acts as the dentist's assistant: it listens to spoken observations and manages the patient's electronic medical record in real time, on a provider-agnostic multi-tenant platform with RAG grounding and reliable background job processing.",
    points: [
      "Automated WhatsApp intake: patients complete a 13-step medical questionnaire — history, allergies, medications — before the appointment, structured straight into the record.",
      "Hands-free charting: the dentist calls out a finding in plain language (\"caries on tooth 16, mesial and occlusal\"), the Copilot parses the FDI notation and updates the interactive odontogram itself.",
      "Proactive tool-calling across 13+ backend actions — log an extraction, cross-check allergies, draft the prescription and SOAP note — without being asked twice; voice calls escalate to an AI agent via Vapi when a patient prefers to call instead of message.",
    ],
    outcome: "Natural-language observations become structured medical data — SOAP notes, treatment plans, phased budgets, odontograms — cutting the administrative load so the dentist stays focused on the patient, not the keyboard.",
  },
  {
    id: "c21-perdomo", name: "C21 Perdomo", year: "2026", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "WordPress", "Meta CAPI", "GA4"],
    desc: "Production multilingual real-estate site for Century 21 DR — headless WordPress + Next.js, 4-locale routing, and a dual-track Meta/Google analytics layer feeding ad algorithms with server-side conversion events.",
    problem: "A real-estate operation serving four language markets needed more than a brochure site: agents manage listings daily, and ad spend was flying blind because browser-side analytics kept losing conversions to blockers and iOS privacy changes.",
    build: "Headless WordPress for the team's familiar editing workflow, Next.js for the storefront.",
    points: [
      "4-locale routing with per-locale SEO — localized metadata, hreflang, and sitemaps.",
      "Dual-track analytics: server-side Meta CAPI + GA4 events that survive ad blockers and feed the ad algorithms real conversion signals.",
      "Listing pages statically generated for speed, revalidated as agents edit in WordPress.",
    ],
    outcome: "In production for Century 21 Dominican Republic — the marketing team edits in WordPress, buyers browse a fast multilingual storefront, and ad platforms finally see accurate conversions.",
  },
  {
    id: "moneyguard", name: "MoneyGuard", year: "2025", category: "Mobile · AI", cats: ["Mobile", "AI"],
    tags: ["Mobile App", "AI integration", "Flutter", "FastAPI", "DeepSeek"],
    desc: "A financial intervention app that stops you from overspending before it happens — 3-gate AI engine, OCR receipt scanning, offline-first. Built for the Dominican market.",
    problem: "Budget apps tell you what you already spent. By then it's too late. For cash-heavy Dominican spending habits, most tools also assume bank feeds that don't exist here.",
    build: "An intervention engine, not a report card — it gets in the way of the purchase.",
    points: [
      "3-gate AI engine that evaluates a purchase against budget, patterns, and stated goals before approving it.",
      "OCR receipt scanning so cash spending counts — no bank feed required.",
      "Offline-first Flutter app with a FastAPI + DeepSeek backend for the decision layer.",
    ],
    outcome: "Shipped for the Dominican market: an app that argues with you at the moment of purchase, not a spreadsheet that shames you at the end of the month.",
  },
  {
    id: "cabarete-villas", name: "Cabarete Villas", year: "2025", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "Firebase", "PayPal"],
    desc: "Full-stack vacation rental platform for a Dominican villa business — listings, iCal sync with Airbnb/VRBO, PayPal booking flow, and AI-automated bilingual translations.",
    problem: "A villa business juggling Airbnb, VRBO, and direct bookings kept double-booking properties and paying platform commissions on guests who came direct. Every listing edit meant updating three places, in two languages.",
    build: "One platform that owns the calendar and the direct-booking flow.",
    points: [
      "iCal sync with Airbnb and VRBO so every channel shares one source of truth for availability.",
      "PayPal booking flow for direct reservations — no commission on the business's own guests.",
      "AI-automated bilingual translations: edit a listing once, publish in both languages.",
    ],
    outcome: "In production for the Cabarete business — direct bookings with zero double-booking incidents and listings maintained in one place instead of six.",
  },
  {
    id: "ruleta", name: "Ruleta", year: "2025", category: "Mobile app", cats: ["Mobile"],
    tags: ["Mobile App", "Flutter", "Hive"],
    desc: "Promotional prize-wheel app for events and marketing activations — weighted probability engine, admin dashboard, participant tracking, and full theme customization.",
    problem: "Brands running activations needed a prize wheel that looks premium on a big screen, works with no venue Wi-Fi, and doesn't give away more inventory than the campaign budgeted.",
    build: "A Flutter app built for the event floor.",
    points: [
      "Weighted probability engine — prize odds match the campaign's actual inventory and budget.",
      "Participant tracking and an admin dashboard for post-event reporting.",
      "Full theme customization so the wheel wears the brand, not mine. Hive storage keeps it fully offline.",
    ],
    outcome: "Used at live events and activations — spins, prizes, and participant data captured with or without a connection.",
  },
  {
    id: "luxedrive", name: "LuxeDrive", year: "2024", category: "Web · SaaS", cats: ["Web", "SaaS"],
    tags: ["Web App", "SaaS", "Next.js", "MongoDB", "NextAuth"],
    desc: "Multi-tenant car rental SaaS for the Dominican market — vehicle discovery, full booking flow, fleet management dashboard, and role-based admin controls.",
    problem: "Local rental agencies were managing fleets in WhatsApp chats and Excel. International platforms don't serve the Dominican market's payment and operational realities.",
    build: "A multi-tenant SaaS where each agency runs its own branded rental operation.",
    points: [
      "Vehicle discovery and a full booking flow for renters.",
      "Fleet management dashboard: availability, maintenance, and utilization per vehicle.",
      "Role-based admin controls with NextAuth — owners, agents, and staff see exactly what they should.",
    ],
    outcome: "In production as a multi-tenant platform — agencies onboard with their own fleet, branding, and staff roles from day one.",
  },
  {
    id: "social-command", name: "Social Command Center", year: "2024", category: "Automation · AI", cats: ["Automation", "AI"],
    tags: ["Automation", "AI integration", "Bun", "Claude", "fal.ai"],
    desc: "Telegram bot that generates AI copy and images then publishes directly to Instagram, LinkedIn, Facebook, and X — from a single chat interface.",
    problem: "Posting consistently across Instagram, LinkedIn, Facebook, and X means four editors, four formats, four logins — so most small teams simply stop posting.",
    build: "The entire pipeline collapsed into one chat.",
    points: [
      "Telegram as the interface: describe the post, approve the draft, done.",
      "Claude generates platform-tuned copy; fal.ai generates the imagery.",
      "Direct publishing to all four platforms from a single Bun service.",
    ],
    outcome: "One chat message becomes four platform-native posts — the social presence runs from a phone.",
  },
  {
    id: "seo-blog", name: "SEO Blog Generator", year: "2024", category: "AI integration", cats: ["AI"],
    tags: ["AI integration", "Flask", "Python", "Ollama", "spaCy"],
    desc: "Content platform that generates SEO-optimized blog posts using local LLMs — keyword analysis, readability scoring, and a built-in content manager.",
    problem: "Content agencies burn hours per article and per-token API costs add up at volume. For SEO content, the bottleneck is structure and keyword discipline more than prose genius.",
    build: "A generation platform that runs on local models — zero per-article API cost.",
    points: [
      "Ollama-served local LLMs generate drafts; spaCy handles keyword analysis and extraction.",
      "Readability scoring keeps output within target reading levels.",
      "Built-in content manager for review, edits, and publishing workflow.",
    ],
    outcome: "A working content pipeline where the marginal cost of an article is electricity — keyword-disciplined drafts arrive ready for human polish.",
  },
];

const projectsEs: Project[] = [
  {
    id: "melow", name: "Melow", year: "2026", category: "IA · SaaS", cats: ["AI", "SaaS"],
    tags: ["Integración IA", "SaaS", "Next.js", "Fastify", "Qdrant", "Vapi"],
    desc: "Plataforma multi-tenant de agentes de IA que despliega chatbots en WhatsApp y widgets web. Implementación insignia: un Copiloto Clínico de IA que lleva el expediente del paciente con las manos libres, en plena consulta.",
    problem: "Durante una consulta, el dentista tiene las manos ocupadas con el paciente. Detenerse a escribir notas clínicas, actualizar un odontograma o redactar una receta rompe la concentración, ralentiza la visita y significa tocar un teclado con guantes puestos.",
    build: "Un Copiloto Clínico basado en ReAct que actúa como asistente del dentista: escucha las observaciones habladas y gestiona el expediente médico electrónico del paciente en tiempo real, sobre una plataforma multi-tenant agnóstica de proveedor con RAG y procesamiento confiable de tareas en segundo plano.",
    points: [
      "Admisión automatizada por WhatsApp: los pacientes completan un cuestionario médico de 13 pasos — historial, alergias, medicamentos — antes de la cita, estructurado directo en el expediente.",
      "Registro con las manos libres: el dentista dice un hallazgo en lenguaje natural (\"caries en el diente 16, mesial y oclusal\"), el Copiloto interpreta la notación FDI y actualiza el odontograma interactivo por su cuenta.",
      "Ejecución proactiva de herramientas entre más de 13 acciones del backend — registrar una extracción, cruzar alergias, redactar la receta y la nota SOAP — sin que se lo pidan dos veces; las llamadas escalan a un agente de voz por IA vía Vapi cuando el paciente prefiere llamar en vez de escribir.",
    ],
    outcome: "Las observaciones en lenguaje natural se convierten en datos médicos estructurados — notas SOAP, planes de tratamiento, presupuestos por fases, odontogramas — reduciendo la carga administrativa para que el dentista se enfoque en el paciente, no en el teclado.",
  },
  {
    id: "c21-perdomo", name: "C21 Perdomo", year: "2026", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "WordPress", "Meta CAPI", "GA4"],
    desc: "Sitio inmobiliario multilingüe en producción para Century 21 RD — WordPress headless + Next.js, rutas en 4 idiomas y una capa de analítica dual Meta/Google que alimenta los algoritmos de anuncios con conversiones del lado del servidor.",
    problem: "Una operación inmobiliaria que atiende cuatro mercados de idioma necesitaba más que un sitio-folleto: los agentes gestionan propiedades a diario, y la inversión en anuncios iba a ciegas porque la analítica del navegador perdía conversiones por bloqueadores y los cambios de privacidad de iOS.",
    build: "WordPress headless para el flujo de edición que el equipo ya conocía, Next.js para la vitrina.",
    points: [
      "Rutas en 4 idiomas con SEO por idioma — metadata localizada, hreflang y sitemaps.",
      "Analítica dual: eventos server-side de Meta CAPI + GA4 que sobreviven a los bloqueadores y le dan a los algoritmos de anuncios señales de conversión reales.",
      "Páginas de propiedades generadas estáticamente por velocidad, revalidadas cuando los agentes editan en WordPress.",
    ],
    outcome: "En producción para Century 21 República Dominicana — el equipo de marketing edita en WordPress, los compradores navegan una vitrina multilingüe rápida, y las plataformas de anuncios por fin ven conversiones precisas.",
  },
  {
    id: "moneyguard", name: "MoneyGuard", year: "2025", category: "Móvil · IA", cats: ["Mobile", "AI"],
    tags: ["App móvil", "Integración IA", "Flutter", "FastAPI", "DeepSeek"],
    desc: "Una app de intervención financiera que te frena antes de gastar de más — motor de IA de 3 compuertas, escaneo OCR de recibos, offline-first. Construida para el mercado dominicano.",
    problem: "Las apps de presupuesto te dicen lo que ya gastaste. Para entonces es tarde. Con hábitos de gasto dominicanos donde manda el efectivo, la mayoría de las herramientas además asumen conexiones bancarias que aquí no existen.",
    build: "Un motor de intervención, no una libreta de calificaciones — se interpone en la compra.",
    points: [
      "Motor de IA de 3 compuertas que evalúa una compra contra presupuesto, patrones y metas declaradas antes de aprobarla.",
      "Escaneo OCR de recibos para que el gasto en efectivo cuente — sin necesidad de conexión bancaria.",
      "App Flutter offline-first con backend FastAPI + DeepSeek para la capa de decisión.",
    ],
    outcome: "Publicada para el mercado dominicano: una app que discute contigo en el momento de la compra, no una hoja de cálculo que te regaña a fin de mes.",
  },
  {
    id: "cabarete-villas", name: "Cabarete Villas", year: "2025", category: "Web app", cats: ["Web"],
    tags: ["Web App", "Next.js", "Firebase", "PayPal"],
    desc: "Plataforma full-stack de alquiler vacacional para un negocio de villas dominicano — listados, sincronización iCal con Airbnb/VRBO, reservas con PayPal y traducciones bilingües automatizadas con IA.",
    problem: "Un negocio de villas haciendo malabares entre Airbnb, VRBO y reservas directas duplicaba reservas y pagaba comisiones de plataforma por huéspedes que llegaban directo. Cada edición de un listado significaba actualizar tres lugares, en dos idiomas.",
    build: "Una plataforma que es dueña del calendario y del flujo de reserva directa.",
    points: [
      "Sincronización iCal con Airbnb y VRBO para que todos los canales compartan una sola fuente de verdad de disponibilidad.",
      "Flujo de reserva con PayPal para reservaciones directas — cero comisión por los huéspedes propios del negocio.",
      "Traducciones bilingües automatizadas con IA: editas el listado una vez, se publica en ambos idiomas.",
    ],
    outcome: "En producción para el negocio de Cabarete — reservas directas con cero incidentes de doble reserva y listados mantenidos en un solo lugar en vez de seis.",
  },
  {
    id: "ruleta", name: "Ruleta", year: "2025", category: "App móvil", cats: ["Mobile"],
    tags: ["App móvil", "Flutter", "Hive"],
    desc: "App de ruleta de premios para eventos y activaciones de marketing — motor de probabilidad ponderada, panel de administración, registro de participantes y personalización total de tema.",
    problem: "Las marcas que corren activaciones necesitaban una ruleta que se vea premium en pantalla grande, funcione sin Wi-Fi del local y no regale más inventario del que la campaña presupuestó.",
    build: "Una app Flutter construida para el piso del evento.",
    points: [
      "Motor de probabilidad ponderada — las probabilidades de premio corresponden al inventario y presupuesto reales de la campaña.",
      "Registro de participantes y panel de administración para reportes post-evento.",
      "Personalización total de tema para que la ruleta vista la marca del cliente, no la mía. Almacenamiento en Hive la mantiene completamente offline.",
    ],
    outcome: "Usada en eventos y activaciones en vivo — giros, premios y datos de participantes capturados con o sin conexión.",
  },
  {
    id: "luxedrive", name: "LuxeDrive", year: "2024", category: "Web · SaaS", cats: ["Web", "SaaS"],
    tags: ["Web App", "SaaS", "Next.js", "MongoDB", "NextAuth"],
    desc: "SaaS multi-tenant de alquiler de vehículos para el mercado dominicano — descubrimiento de vehículos, flujo completo de reserva, panel de gestión de flota y controles de administración por rol.",
    problem: "Las agencias locales de alquiler gestionaban sus flotas en chats de WhatsApp y Excel. Las plataformas internacionales no atienden las realidades de pago y operación del mercado dominicano.",
    build: "Un SaaS multi-tenant donde cada agencia opera su propio negocio de alquiler con su marca.",
    points: [
      "Descubrimiento de vehículos y flujo completo de reserva para los clientes.",
      "Panel de gestión de flota: disponibilidad, mantenimiento y utilización por vehículo.",
      "Controles de administración por rol con NextAuth — dueños, agentes y personal ven exactamente lo que deben.",
    ],
    outcome: "En producción como plataforma multi-tenant — las agencias entran con su propia flota, marca y roles de personal desde el día uno.",
  },
  {
    id: "social-command", name: "Social Command Center", year: "2024", category: "Automatización · IA", cats: ["Automation", "AI"],
    tags: ["Automatización", "Integración IA", "Bun", "Claude", "fal.ai"],
    desc: "Bot de Telegram que genera textos e imágenes con IA y publica directo en Instagram, LinkedIn, Facebook y X — desde una sola interfaz de chat.",
    problem: "Publicar con constancia en Instagram, LinkedIn, Facebook y X significa cuatro editores, cuatro formatos, cuatro sesiones — así que la mayoría de los equipos pequeños simplemente dejan de publicar.",
    build: "Todo el pipeline colapsado en un solo chat.",
    points: [
      "Telegram como interfaz: describes la publicación, apruebas el borrador, listo.",
      "Claude genera el texto afinado por plataforma; fal.ai genera las imágenes.",
      "Publicación directa a las cuatro plataformas desde un solo servicio en Bun.",
    ],
    outcome: "Un mensaje de chat se convierte en cuatro publicaciones nativas por plataforma — la presencia social se maneja desde el teléfono.",
  },
  {
    id: "seo-blog", name: "SEO Blog Generator", year: "2024", category: "Integración IA", cats: ["AI"],
    tags: ["Integración IA", "Flask", "Python", "Ollama", "spaCy"],
    desc: "Plataforma de contenido que genera artículos de blog optimizados para SEO usando LLMs locales — análisis de keywords, puntuación de legibilidad y gestor de contenido integrado.",
    problem: "Las agencias de contenido queman horas por artículo y los costos de API por token se acumulan a volumen. Para contenido SEO, el cuello de botella es la estructura y la disciplina de keywords más que el genio de la prosa.",
    build: "Una plataforma de generación que corre sobre modelos locales — costo de API por artículo: cero.",
    points: [
      "LLMs locales servidos con Ollama generan los borradores; spaCy maneja el análisis y extracción de keywords.",
      "Puntuación de legibilidad mantiene el contenido dentro del nivel de lectura objetivo.",
      "Gestor de contenido integrado para revisión, ediciones y flujo de publicación.",
    ],
    outcome: "Un pipeline de contenido funcional donde el costo marginal de un artículo es la electricidad — borradores disciplinados en keywords listos para el pulido humano.",
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
  home: {
    metaTitle: "Pedro Jimenez — I build the AI layer your product is missing | Full-stack + AI developer, Santiago DO",
    metaDesc: "Solo full-stack & AI developer in Santiago, Dominican Republic. AI integrations, automations, web & mobile apps — shipped, not demoed. Ask the site anything.",
    heroBadge: "pedro.ai · online",
    heroTitle1: "Skip the scroll.", heroTitle2: "Ask the site.",
    heroSub: "This site runs on the same AI layer Pedro builds for clients. Ask it anything — it knows every project, the stack, and whether he's free.",
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
    { value: "8", label: "projects shipped this year" },
    { value: "1", label: "developer — you talk to me" },
    { value: "EN/ES", label: "fully bilingual delivery" },
    { value: "24h", label: "typical reply time" },
  ],
  work: {
    metaTitle: "Work — 8 shipped projects | Pedro Jimenez, full-stack + AI developer",
    metaDesc: "AI integrations, SaaS platforms, mobile apps, and automations shipped by Pedro Jimenez — Melow, C21 Perdomo, MoneyGuard, Cabarete Villas, LuxeDrive and more. All in production.",
    eyebrow: "// work — 8 projects, all in production",
    title1: "Built and shipped.", title2: "Not demoed.",
    sub: "Every project here is live, with real users. Click one for the full story — problem, build, and what shipped.",
    filterLabel: "Filter projects",
    all: "All",
    filters: { AI: "AI", Web: "Web", Mobile: "Mobile", SaaS: "SaaS", Automation: "Automation" },
    readCaseStudy: "Read the case study",
    ctaTitle: "Your project could be number 9.",
    ctaSub: "Most of these started as a two-line email. Send yours.",
    ctaAsk: "Ask the site instead",
  },
  caseStudy: {
    allWork: "All work",
    inProduction: "in production",
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
      { title: "Automations", icon: "</>", desc: "Bots and pipelines that do the boring work: WhatsApp and Telegram bots, social publishing, data reconciliation, report generation. If your team does it weekly by hand, it can probably run itself.", tools: ["WhatsApp API", "Telegram", "Bun", "n8n"], cta: "See Social Command Center", href: "/work/social-command" },
      { title: "Web apps", icon: "{ }", desc: "Next.js front to back — multilingual, SEO-tuned, statically fast, with server-side analytics that feed your ad algorithms real conversions. Headless CMS when your team needs to edit content themselves.", tools: ["Next.js", "WordPress", "Firebase", "GA4", "Meta CAPI"], cta: "See C21 Perdomo", href: "/work/c21-perdomo" },
      { title: "Mobile apps", icon: "[ ]", desc: "Flutter apps that ship to both stores from one codebase. Offline-first for markets where connectivity isn't a given, OCR, payments, and AI features that work on-device and off.", tools: ["Flutter", "FastAPI", "Hive", "OCR"], cta: "See MoneyGuard", href: "/work/moneyguard" },
      { title: "SaaS platforms", icon: "##", desc: "Multi-tenant from day one: auth, roles, billing, admin dashboards, tenant isolation. The architecture decisions that are expensive to retrofit, made correctly at the start.", tools: ["Next.js", "MongoDB", "NextAuth", "Node.js"], cta: "See LuxeDrive", href: "/work/luxedrive" },
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
    p1: "Based in Santiago, Dominican Republic. I ship AI integrations, automations, and full-stack web and mobile apps — production-grade, fast, without the agency overhead. Eight projects shipped this year, all live with real users.",
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
  },
  concierge: {
    fallback: `Not sure how to answer that — email ${EMAIL} and he'll reply within a day.`,
    error: `Connection hiccup on my end. Try again in a sec, or just email ${EMAIL}.`,
    you: "You", ai: "Pedro.ai",
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
  home: {
    metaTitle: "Pedro Jimenez — Construyo la capa de IA que le falta a tu producto | Desarrollador full-stack + IA, Santiago RD",
    metaDesc: "Desarrollador full-stack e IA en Santiago, República Dominicana. Integraciones de IA, automatizaciones, apps web y móviles — entregadas en producción, no demos. Pregúntale al sitio lo que quieras.",
    heroBadge: "pedro.ai · en línea",
    heroTitle1: "Sáltate el scroll.", heroTitle2: "Pregúntale al sitio.",
    heroSub: "Este sitio corre sobre la misma capa de IA que Pedro construye para sus clientes. Pregúntale lo que quieras — conoce cada proyecto, el stack y si está disponible.",
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
    servicesSub: "Sin intermediarios ni gerentes de cuenta. Hablas con la persona que escribe el código.",
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
    aboutTitle: "Entrego software de producción, solo — rápido, sin el overhead de agencia.",
    aboutP1: "Desde Santiago, República Dominicana. Este año he entregado 8 proyectos — integraciones de IA, SaaS multi-tenant, apps móviles y automatizaciones. Bilingüe EN/ES, y construyo para el mercado dominicano con la misma fluidez que para el estadounidense.",
    aboutP2: "Si necesitas una capa inteligente entre tus datos y tus usuarios, eso es exactamente lo que construyo.",
    aboutCta: "Más sobre Pedro",
    contactBadge: "Abierto desde julio 2026 · responde en 24h",
    contactTitle: "¿Tienes algo que construir?",
    contactSub: "Cuéntame en qué estás trabajando. Te diré qué construiría yo y si soy la persona indicada para hacerlo.",
    contactAsk: "O pregúntale al sitio ↑",
  },
  stats: [
    { value: "8", label: "proyectos entregados este año" },
    { value: "1", label: "desarrollador — hablas conmigo" },
    { value: "EN/ES", label: "entrega totalmente bilingüe" },
    { value: "24h", label: "tiempo típico de respuesta" },
  ],
  work: {
    metaTitle: "Proyectos — 8 proyectos entregados | Pedro Jimenez, desarrollador full-stack + IA",
    metaDesc: "Integraciones de IA, plataformas SaaS, apps móviles y automatizaciones entregadas por Pedro Jimenez — Melow, C21 Perdomo, MoneyGuard, Cabarete Villas, LuxeDrive y más. Todo en producción.",
    eyebrow: "// proyectos — 8 proyectos, todos en producción",
    title1: "Construido y entregado.", title2: "No demos.",
    sub: "Cada proyecto aquí está en vivo, con usuarios reales. Haz clic en uno para la historia completa — problema, construcción y qué se entregó.",
    filterLabel: "Filtrar proyectos",
    all: "Todos",
    filters: { AI: "IA", Web: "Web", Mobile: "Móvil", SaaS: "SaaS", Automation: "Automatización" },
    readCaseStudy: "Leer el caso de estudio",
    ctaTitle: "Tu proyecto podría ser el número 9.",
    ctaSub: "La mayoría de estos empezaron con un email de dos líneas. Manda el tuyo.",
    ctaAsk: "O pregúntale al sitio",
  },
  caseStudy: {
    allWork: "Todos los proyectos",
    inProduction: "en producción",
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
    sub: "Sin intermediarios, sin gerentes de cuenta, sin margen de agencia. Hablas con la persona que escribe el código — y se entrega en semanas, no en trimestres.",
    cards: [
      { title: "Integraciones de IA", icon: "AI", desc: "RAG sobre tus documentos, agentes de IA, chat que conoce tu negocio, generación de notas clínicas — integrados a tu producto, no pegados encima. Si el modelo necesita tus datos para ser útil, este es el trabajo.", tools: ["DeepSeek", "Claude", "Ollama", "RAG", "LangChain"], cta: "Ver Melow", href: "/work/melow" },
      { title: "Automatizaciones", icon: "</>", desc: "Bots y pipelines que hacen el trabajo aburrido: bots de WhatsApp y Telegram, publicación en redes, conciliación de datos, generación de reportes. Si tu equipo lo hace a mano cada semana, probablemente puede correr solo.", tools: ["WhatsApp API", "Telegram", "Bun", "n8n"], cta: "Ver Social Command Center", href: "/work/social-command" },
      { title: "Apps web", icon: "{ }", desc: "Next.js de punta a punta — multilingüe, afinado para SEO, estáticamente rápido, con analítica server-side que alimenta tus algoritmos de anuncios con conversiones reales. CMS headless cuando tu equipo necesita editar contenido por su cuenta.", tools: ["Next.js", "WordPress", "Firebase", "GA4", "Meta CAPI"], cta: "Ver C21 Perdomo", href: "/work/c21-perdomo" },
      { title: "Apps móviles", icon: "[ ]", desc: "Apps Flutter que llegan a ambas tiendas desde un solo código. Offline-first para mercados donde la conectividad no está garantizada, OCR, pagos y funciones de IA que trabajan con y sin conexión.", tools: ["Flutter", "FastAPI", "Hive", "OCR"], cta: "Ver MoneyGuard", href: "/work/moneyguard" },
      { title: "Plataformas SaaS", icon: "##", desc: "Multi-tenant desde el día uno: autenticación, roles, cobros, paneles de administración, aislamiento de tenants. Las decisiones de arquitectura que cuestan caro corregir después, tomadas bien desde el principio.", tools: ["Next.js", "MongoDB", "NextAuth", "Node.js"], cta: "Ver LuxeDrive", href: "/work/luxedrive" },
      { title: "3D y motion", icon: "//", desc: "Identidad de marca que se mueve — animación de logos, visuales hero en loop y kits para redes construidos en Blender. La capa final que hace que un producto se sienta caro.", tools: ["Blender", "Motion"], cta: "Pregunta por trabajo de motion", href: `mailto:${EMAIL}` },
    ],
    howEyebrow: "// cómo trabajo",
    howTitle: "Tres pasos. Sin ceremonia.",
    howSub: "El overhead al que te acostumbraron las agencias es justo lo que eliminé.",
    steps: [
      { n: "01", title: "Dimensionar", desc: "Describes el problema en lenguaje sencillo. En días recibes un plan concreto: qué se construye, qué cuesta, cuándo se entrega. Sin facturas por 'fase de descubrimiento'." },
      { n: "02", title: "Construir", desc: "Ciclos cortos, software funcionando cada semana. Ves el progreso en tus manos, no en presentaciones de estado. Los cambios son conversaciones, no órdenes de cambio." },
      { n: "03", title: "Entregar", desc: "Despliegue a producción, monitoreo y una entrega que de verdad entiendes. Sigo disponible después del lanzamiento — el punto es software que sigue funcionando." },
    ],
    engageEyebrow: "// trabajar juntos",
    engageTitle: "Dos formas de contratar.",
    models: [
      { tag: "La más común", title: "Proyecto de alcance fijo", desc: "Una construcción definida con un precio definido y una fecha de entrega definida. Ideal cuando conoces el problema — una app, una integración, una automatización — y quieres certeza de costo y tiempo.", cta: "Dimensionar mi proyecto", featured: true },
      { tag: "Continuo", title: "Retainer", desc: "Un bloque de horas dedicadas cada mes para productos que evolucionan — nuevas funciones, mejoras de IA, mantenimiento y respuesta prioritaria. Ideal después de que un primer proyecto se entrega y sigue creciendo.", cta: "Pregunta por retainers", featured: false },
    ],
    pricingNote1: "El precio se dimensiona por proyecto — describe lo que estás construyendo y recibirás una cotización concreta, no una tarifa genérica. ¿No sabes qué necesitas? ",
    pricingNoteLink: "Pregúntale al sitio",
    pricingNote2: " — sabe lo que Pedro ha construido antes.",
  },
  about: {
    metaTitle: "Sobre mí — Pedro Jimenez, desarrollador full-stack + IA en Santiago, RD",
    metaDesc: "Pedro Jimenez entrega integraciones de IA, automatizaciones y apps full-stack desde Santiago, República Dominicana. Bilingüe EN/ES. Abierto a proyectos — habla con el sitio o escribe directo.",
    eyebrow: "// sobre mí",
    portraitAlt: "Retrato de Pedro Jimenez",
    title: "Pedro Jimenez.",
    subtitle: "Desarrollador solo. Producto completo.",
    p1: "Desde Santiago, República Dominicana. Entrego integraciones de IA, automatizaciones y apps web y móviles full-stack — calidad de producción, rápido, sin el overhead de agencia. Ocho proyectos entregados este año, todos en vivo con usuarios reales.",
    p2: "Trabajo bilingüe — EN y ES — y construyo para el mercado dominicano con la misma fluidez que para el estadounidense. Flujos de pago donde manda el efectivo, móvil offline-first, WhatsApp como canal principal: restricciones que la mayoría de los desarrolladores remotos nunca han enfrentado.",
    p3: "Si necesitas una capa inteligente entre tus datos y tus usuarios, eso es exactamente lo que construyo. Este sitio está corriendo una ahora mismo.",
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
      "Cualquier fecha límite o realidad de presupuesto que deba saber",
    ],
  },
  concierge: {
    fallback: `No estoy seguro de cómo responder eso — escribe a ${EMAIL} y te responde en un día.`,
    error: `Se me cayó la conexión un segundo. Inténtalo de nuevo, o escribe directo a ${EMAIL}.`,
    you: "Tú", ai: "Pedro.ai",
  },
};

export const dict: Record<Lang, typeof en> = { en, es };

export const asLang = (lang: string): Lang => (lang === "es" ? "es" : "en");
export const getDict = (lang: string) => dict[asLang(lang)];
