import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL, SITE_URL, asLang, getDict, langPrefix } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).services;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: { canonical: `${langPrefix(lang)}/services`, languages: { en: "/services", es: "/es/services" } },
    openGraph: {
      type: "website", title: t.metaTitle, description: t.metaDesc,
      url: `${SITE_URL}${langPrefix(lang)}/services`,
      images: [{ url: "/images/og/home.png", width: 1200, height: 630 }],
    },
  };
}

const eyebrow: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
  textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 16,
};

const toolTag: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
  background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", padding: "4px 9px",
};

export default async function ServicesPage(props: { params: Promise<{ lang: string }> }) {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).services;
  const pre = langPrefix(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Person", name: "Pedro Jimenez", url: `${SITE_URL}/` },
    serviceType: [
      "AI integration", "Automation", "Web application development",
      "Mobile application development", "SaaS development", "3D and motion design",
    ],
    areaServed: "Worldwide",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ HEADER ══ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(120px,16vw,168px) clamp(20px,5vw,48px) clamp(36px,5vw,56px)" }}>
        <div style={{ ...eyebrow, fontSize: 12, marginBottom: 18 }}>{t.eyebrow}</div>
        <h1 style={{
          font: "700 clamp(36px,6vw,60px)/1.04 var(--font-display), sans-serif",
          letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px", maxWidth: 760,
        }}>
          {t.title1}<br /><span style={{ color: "var(--text-muted)" }}>{t.title2}</span>
        </h1>
        <p style={{ font: "400 clamp(15px,2vw,17px)/1.65 var(--font-body), sans-serif", color: "var(--text-body)", maxWidth: 540, margin: 0 }}>
          {t.sub}
        </p>
      </section>

      {/* ══ SERVICES ══ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(56px,8vw,90px)" }}>
        <div className="grid-svc">
          {t.cards.map((svc) => {
            const external = svc.href.startsWith("mailto:");
            const href = external ? svc.href : `${pre}${svc.href}`;
            const CtaTag = external ? "a" : Link;
            return (
              <div key={svc.title} data-card style={{
                display: "flex", flexDirection: "column", background: "var(--bg-surface)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)", padding: 26,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "var(--radius-sm)", background: "var(--accent-subtle)",
                  border: "1px solid var(--border-accent)", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "var(--accent)",
                  font: "600 13px var(--font-mono), monospace", marginBottom: 18,
                }}>
                  {svc.icon}
                </div>
                <h2 style={{ font: "600 20px var(--font-display), sans-serif", color: "#fff", margin: "0 0 10px" }}>{svc.title}</h2>
                <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 16px", flex: 1 }}>{svc.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                  {svc.tools.map((tool) => <span key={tool} style={toolTag}>{tool}</span>)}
                </div>
                <CtaTag href={href} style={{
                  font: "600 13px var(--font-body), sans-serif", color: "var(--accent)", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44,
                }}>
                  {svc.cta} <span style={{ fontFamily: "var(--font-mono)" }}>→</span>
                </CtaTag>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ HOW I WORK ══ */}
      <section style={{ background: "linear-gradient(180deg, transparent, rgba(16,16,25,.4), transparent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px,8vw,90px) clamp(20px,5vw,48px)" }}>
          <Reveal style={{ marginBottom: 40, maxWidth: 560 }}>
            <div style={eyebrow}>{t.howEyebrow}</div>
            <h2 style={{ font: "700 clamp(28px,4.5vw,42px)/1.08 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 14px" }}>
              {t.howTitle}
            </h2>
            <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: 0 }}>{t.howSub}</p>
          </Reveal>
          <Reveal className="grid-steps">
            {t.steps.map((stp) => (
              <div key={stp.n} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
                <div style={{ font: "700 30px var(--font-display), sans-serif", color: "var(--accent)", letterSpacing: "-.02em", marginBottom: 14 }}>{stp.n}</div>
                <h3 style={{ font: "600 18px var(--font-display), sans-serif", color: "#fff", margin: "0 0 8px" }}>{stp.title}</h3>
                <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: 0 }}>{stp.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ ENGAGEMENT ══ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px,8vw,90px) clamp(20px,5vw,48px)" }}>
        <Reveal style={{ marginBottom: 40, maxWidth: 560 }}>
          <div style={eyebrow}>{t.engageEyebrow}</div>
          <h2 style={{ font: "700 clamp(28px,4.5vw,42px)/1.08 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: 0 }}>
            {t.engageTitle}
          </h2>
        </Reveal>
        <Reveal style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
          {t.models.map((m) => (
            <div key={m.title} style={{
              background: "var(--bg-surface)",
              border: `1px solid ${m.featured ? "var(--border-accent)" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: m.featured ? "var(--shadow-accent)" : "var(--shadow-md)",
              padding: 28, display: "flex", flexDirection: "column",
            }}>
              <div style={{
                font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
                textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12,
              }}>
                {m.tag}
              </div>
              <h3 style={{ font: "600 22px var(--font-display), sans-serif", color: "#fff", margin: "0 0 10px" }}>{m.title}</h3>
              <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 20px", flex: 1 }}>{m.desc}</p>
              <a className="cta-ghost" href={`mailto:${EMAIL}`} style={{ alignSelf: "flex-start" }}>{m.cta}</a>
            </div>
          ))}
        </Reveal>
        <p style={{ font: "400 13px/1.6 var(--font-body), sans-serif", color: "var(--text-muted)", margin: "20px 0 0", maxWidth: 560 }}>
          {t.pricingNote1}
          <Link href={pre || "/"} style={{ color: "var(--accent)", textDecoration: "none" }}>{t.pricingNoteLink}</Link>
          {t.pricingNote2}
        </p>
      </section>
    </>
  );
}
