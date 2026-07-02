import type { Metadata } from "next";
import { EMAIL, FACEBOOK_URL, GITHUB_URL, LINKEDIN_URL, SITE_URL, asLang, getDict, langPrefix } from "@/lib/content";
import { ContactConcierge } from "@/components/ai/ContactConcierge";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).about;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: { canonical: `${langPrefix(lang)}/about`, languages: { en: "/about", es: "/es/about" } },
    openGraph: {
      type: "profile", title: t.metaTitle, description: t.metaDesc,
      url: `${SITE_URL}${langPrefix(lang)}/about`,
      images: [{ url: "/images/og/about.png", width: 1200, height: 630 }],
    },
  };
}

const monoLabel: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: ".1em",
};

const bodyP: React.CSSProperties = {
  font: "400 16px/1.75 var(--font-body), sans-serif", color: "var(--text-body)",
  margin: "0 0 16px", maxWidth: 480,
};

export default async function AboutPage(props: { params: Promise<{ lang: string }> }) {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang);
  const a = t.about;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Pedro Jimenez",
      jobTitle: "Full-stack & AI Developer",
      url: `${SITE_URL}/`,
      address: { "@type": "PostalAddress", addressLocality: "Santiago", addressCountry: "DO" },
      knowsLanguage: ["en", "es"],
      email: EMAIL,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ ABOUT ══ */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "clamp(120px,16vw,168px) clamp(20px,5vw,48px) clamp(48px,7vw,80px)" }}>
        <div className="split-a">
          <div>
            <div style={{
              font: "500 12px var(--font-mono), monospace", color: "var(--accent)",
              textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 18,
            }}>
              {a.eyebrow}
            </div>
            <h1 style={{ font: "700 clamp(34px,5.5vw,54px)/1.06 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 22px" }}>
              {a.title}<br />
              <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: ".68em" }}>{a.subtitle}</span>
            </h1>
            <p style={bodyP}>{a.p1}</p>
            <p style={bodyP}>{a.p2}</p>
            <p style={{ ...bodyP, marginBottom: 32 }}>{a.p3}</p>
            <div style={{ ...monoLabel, marginBottom: 14 }}>{a.stackLabel}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {a.skills.map((s) => (
                <span key={s} style={{
                  font: "500 12px var(--font-mono), monospace", color: "var(--text-body)",
                  background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "7px 12px",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP, no optimizer on Workers */}
            <img
              src="/images/pedro/portrait.webp"
              alt={a.portraitAlt}
              width={1400}
              height={1750}
              style={{
                display: "block", width: "100%", height: "auto",
                borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {t.stats.map((st) => (
                <div key={st.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
                  <div style={{ font: "700 32px var(--font-display), sans-serif", color: "var(--accent)", letterSpacing: "-.02em", lineHeight: 1, marginBottom: 8 }}>{st.value}</div>
                  <div style={{ font: "400 13px/1.4 var(--font-body), sans-serif", color: "var(--text-muted)" }}>{st.label}</div>
                </div>
              ))}
            </div>
            <div style={{
              background: "var(--bg-surface)", border: "1px solid var(--border-accent)",
              borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-accent)", padding: 24,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                font: "500 11px var(--font-mono), monospace", color: "var(--success)",
                textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 10px var(--success-glow)" }} />
                {a.availableTitle}
              </div>
              <p style={{ font: "400 14px/1.6 var(--font-body), sans-serif", color: "var(--text-body)", margin: 0 }}>{a.availableDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(72px,10vw,120px)", scrollMarginTop: 80 }}>
        <div style={{
          font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
          textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 16,
        }}>
          {a.contactEyebrow}
        </div>
        <h2 style={{ font: "700 clamp(28px,4.5vw,44px)/1.08 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 14px" }}>
          {a.contactTitle}
        </h2>
        <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 32px", maxWidth: 520 }}>
          {a.contactSub}
        </p>
        <div className="split-a">
          <ContactConcierge lang={lang} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href={`mailto:${EMAIL}`} style={{
              display: "flex", flexDirection: "column", gap: 6, background: "var(--bg-surface)",
              border: "1px solid var(--border-accent)", borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-accent)", padding: 24, textDecoration: "none",
            }}>
              <span style={monoLabel}>{a.emailLabel}</span>
              <span style={{ font: "600 clamp(16px,2.4vw,20px) var(--font-display), sans-serif", color: "var(--accent)" }}>{EMAIL}</span>
              <span style={{ font: "400 13px/1.5 var(--font-body), sans-serif", color: "var(--text-body)" }}>{a.emailDesc}</span>
            </a>
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
              <span style={{ ...monoLabel, display: "block", marginBottom: 12 }}>{a.includeLabel}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {a.includes.map((it) => (
                  <div key={it} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ font: "600 13px var(--font-mono), monospace", color: "var(--accent)" }}>›</span>
                    <span style={{ font: "400 14px/1.55 var(--font-body), sans-serif", color: "var(--text-body)" }}>{it}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[["GitHub", GITHUB_URL], ["LinkedIn", LINKEDIN_URL], ["Facebook", FACEBOOK_URL]].map(([label, href]) => (
                <a key={label} className="navlink" href={href} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", minHeight: 44, display: "inline-flex", alignItems: "center" }}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
