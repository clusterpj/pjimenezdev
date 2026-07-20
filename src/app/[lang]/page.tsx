import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL, SITE_URL, GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL, asLang, getDict, langPrefix, projects } from "@/lib/content";
import { HomeHero, AskSiteButton } from "@/components/sections/HomeHero";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).home;
  const path = langPrefix(lang) || "/";
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: { canonical: path, languages: { en: "/", es: "/es" } },
    openGraph: {
      type: "website",
      title: t.metaTitle,
      description: t.metaDesc,
      url: `${SITE_URL}${langPrefix(lang)}/`,
      images: [{ url: "/images/og/home.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

const eyebrow: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
  textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 16,
};

const h2: React.CSSProperties = {
  font: "700 clamp(30px,5vw,48px)/1.05 var(--font-display), sans-serif",
  letterSpacing: "-.03em", color: "#fff", margin: "0 0 14px",
};

const tagStyle: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
  background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", padding: "4px 9px",
};

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang);
  const pre = langPrefix(lang);
  const featured = projects[lang].slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Jimenez",
    jobTitle: "Full-stack & AI Developer",
    url: `${SITE_URL}/`,
    address: { "@type": "PostalAddress", addressLocality: "Santiago", addressCountry: "DO" },
    knowsLanguage: ["en", "es"],
    knowsAbout: ["AI integrations", "Automation", "Web development", "Mobile development", "3D & motion"],
    email: EMAIL,
    sameAs: [GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HomeHero lang={lang} />

      {/* ══ WORK ══ */}
      <section id="work" className="sec-pad" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20, marginBottom: 44,
        }}>
          <div>
            <div style={eyebrow}>{t.home.workEyebrow}</div>
            <h2 style={h2}>{t.home.workTitle}</h2>
            <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", maxWidth: 460, margin: 0 }}>
              {t.home.workSub}
            </p>
          </div>
          <Link className="cta-ghost" href={`${pre}/work`}>
            {t.home.workCta} <span style={{ fontFamily: "var(--font-mono)" }}>→</span>
          </Link>
        </Reveal>
        <Reveal className="grid-work">
          {featured.map((p) => (
            <Link key={p.id} data-card href={`${pre}/work/${p.id}`} style={{
              display: "flex", flexDirection: "column", background: "var(--bg-surface)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)", overflow: "hidden", textDecoration: "none",
            }}>
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element -- external client-site photo, no optimizer on Workers
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block", borderBottom: "1px solid var(--border)" }}
                />
              )}
              <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <h3 style={{ font: "600 21px var(--font-display), sans-serif", letterSpacing: "-.01em", color: "#fff", margin: 0 }}>{p.name}</h3>
                <span style={{ font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)", letterSpacing: ".06em", flexShrink: 0, paddingTop: 4 }}>{p.year}</span>
              </div>
              <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 18px", flex: 1 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {p.tags.map((tag) => <span key={tag} style={tagStyle}>{tag}</span>)}
              </div>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="sec-pad" style={{ background: "linear-gradient(180deg, transparent, rgba(16,16,25,.4), transparent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44, maxWidth: 560 }}>
            <div style={eyebrow}>{t.home.servicesEyebrow}</div>
            <h2 style={h2}>{t.home.servicesTitle}</h2>
            <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: 0 }}>
              {t.home.servicesSub}
            </p>
          </Reveal>
          <Reveal className="grid-svc">
            {t.home.services.map((svc) => (
              <div key={svc.title} data-card style={{
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 26,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "var(--radius-sm)", background: "var(--accent-subtle)",
                  border: "1px solid var(--border-accent)", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "var(--accent)",
                  font: "600 13px var(--font-mono), monospace", marginBottom: 18,
                }}>
                  {svc.icon}
                </div>
                <h3 style={{ font: "600 18px var(--font-display), sans-serif", color: "#fff", margin: "0 0 8px" }}>{svc.title}</h3>
                <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: 0 }}>{svc.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ ABOUT teaser ══ */}
      <section id="about" className="sec-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal className="split-about">
          <div>
            <div style={{ ...eyebrow, marginBottom: 18 }}>{t.home.aboutEyebrow}</div>
            <h2 style={{ font: "700 clamp(28px,4.5vw,42px)/1.1 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 20px" }}>
              {t.home.aboutTitle}
            </h2>
            <p style={{ font: "400 16px/1.7 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 16px", maxWidth: 480 }}>{t.home.aboutP1}</p>
            <p style={{ font: "400 16px/1.7 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 28px", maxWidth: 480 }}>{t.home.aboutP2}</p>
            <Link className="cta-ghost" href={`${pre}/about`}>
              {t.home.aboutCta} <span style={{ fontFamily: "var(--font-mono)" }}>→</span>
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP, no optimizer on Workers */}
            <img
              src="/images/pedro/working.webp"
              alt={t.home.workingAlt}
              width={1600}
              height={1000}
              loading="lazy"
              style={{
                display: "block", width: "100%", height: "auto",
                borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {t.stats.map((st) => (
                <div key={st.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
                  <div style={{ font: "700 34px var(--font-display), sans-serif", color: "var(--accent)", letterSpacing: "-.02em", lineHeight: 1, marginBottom: 8 }}>{st.value}</div>
                  <div style={{ font: "400 13px/1.4 var(--font-body), sans-serif", color: "var(--text-muted)" }}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="sec-pad" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Reveal style={{
          position: "relative", background: "var(--bg-surface)", border: "1px solid var(--border-accent)",
          borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-accent)",
          padding: "clamp(36px,6vw,64px) clamp(24px,5vw,56px)", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
            width: 520, height: 280, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              font: "500 11px var(--font-mono), monospace", color: "var(--success)",
              textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 20,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success-glow)" }} />
              {t.home.contactBadge}
            </div>
            <h2 style={h2}>{t.home.contactTitle}</h2>
            <p style={{ font: "400 17px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 32px", maxWidth: 440 }}>
              {t.home.contactSub}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a className="cta-solid" href={`mailto:${EMAIL}`} style={{ padding: "14px 26px", fontSize: 16 }}>{EMAIL}</a>
              <AskSiteButton label={t.home.contactAsk} />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
