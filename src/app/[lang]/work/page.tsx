import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL, SITE_URL, asLang, getDict, langPrefix } from "@/lib/content";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).work;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: { canonical: `${langPrefix(lang)}/work`, languages: { en: "/work", es: "/es/work" } },
    openGraph: { type: "website", title: t.metaTitle, description: t.metaDesc, url: `${SITE_URL}${langPrefix(lang)}/work` },
  };
}

export default async function WorkPage(props: { params: Promise<{ lang: string }> }) {
  const lang = asLang((await props.params).lang);
  const t = getDict(lang).work;
  const pre = langPrefix(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Work — Pedro Jimenez`,
    url: `${SITE_URL}${pre}/work`,
    about: { "@type": "Person", name: "Pedro Jimenez", url: `${SITE_URL}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(120px,16vw,168px) clamp(20px,5vw,48px) clamp(28px,4vw,44px)" }}>
        <div style={{
          font: "500 12px var(--font-mono), monospace", color: "var(--accent)",
          textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 18,
        }}>
          {t.eyebrow}
        </div>
        <h1 style={{
          font: "700 clamp(36px,6vw,60px)/1.04 var(--font-display), sans-serif",
          letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px", maxWidth: 720,
        }}>
          {t.title1}<br /><span style={{ color: "var(--text-muted)" }}>{t.title2}</span>
        </h1>
        <p style={{ font: "400 clamp(15px,2vw,17px)/1.65 var(--font-body), sans-serif", color: "var(--text-body)", maxWidth: 520, margin: 0 }}>
          {t.sub}
        </p>
      </section>

      <WorkGrid lang={lang} />

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(64px,9vw,110px)", textAlign: "center" }}>
        <Reveal style={{
          position: "relative", background: "var(--bg-surface)", border: "1px solid var(--border-accent)",
          borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-accent)",
          padding: "clamp(32px,5vw,52px)", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
            width: 520, height: 280, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ font: "700 clamp(26px,4vw,38px)/1.1 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 12px" }}>
              {t.ctaTitle}
            </h2>
            <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 auto 28px", maxWidth: 420 }}>
              {t.ctaSub}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a className="cta-solid" href={`mailto:${EMAIL}`} style={{ padding: "14px 26px", fontSize: 16 }}>{EMAIL}</a>
              <Link className="cta-ghost" href={pre || "/"}>{t.ctaAsk}</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
