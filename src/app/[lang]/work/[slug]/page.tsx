import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EMAIL, SITE_URL, asLang, getDict, getProject, langPrefix, langs, projects } from "@/lib/content";

export function generateStaticParams() {
  return langs.flatMap((lang) => projects[lang].map((p) => ({ lang, slug: p.id })));
}

export async function generateMetadata(props: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await props.params;
  const lang = asLang(rawLang);
  const p = getProject(lang, slug);
  if (!p) return {};
  const t = getDict(lang).caseStudy;
  return {
    title: t.metaTitle(p.name),
    description: p.desc,
    alternates: {
      canonical: `${langPrefix(lang)}/work/${p.id}`,
      languages: { en: `/work/${p.id}`, es: `/es/work/${p.id}` },
    },
    openGraph: { type: "article", title: t.metaTitle(p.name), description: p.desc, url: `${SITE_URL}${langPrefix(lang)}/work/${p.id}` },
  };
}

const eyebrow: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
  textTransform: "uppercase", letterSpacing: ".14em", margin: "0 0 14px",
};

const prose: React.CSSProperties = {
  font: "400 16px/1.75 var(--font-body), sans-serif", color: "var(--text-body)", maxWidth: 600,
};

export default async function CaseStudy(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await props.params;
  const lang = asLang(rawLang);
  const all = projects[lang];
  const i = all.findIndex((p) => p.id === slug);
  if (i === -1) notFound();

  const p = all[i];
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const t = getDict(lang).caseStudy;
  const pre = langPrefix(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    description: p.desc,
    url: `${SITE_URL}${pre}/work/${p.id}`,
    dateCreated: p.year,
    creator: { "@type": "Person", name: "Pedro Jimenez", url: `${SITE_URL}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ CASE HERO ══ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(116px,15vw,160px) clamp(20px,5vw,48px) clamp(32px,5vw,56px)" }}>
        <Link href={`${pre}/work`} style={{
          font: "500 12px var(--font-mono), monospace", color: "var(--text-muted)", textDecoration: "none",
          textTransform: "uppercase", letterSpacing: ".1em", display: "inline-flex",
          alignItems: "center", gap: 8, marginBottom: 26, minHeight: 44,
        }}>
          <span>←</span> {t.allWork}
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{
            font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
            textTransform: "uppercase", letterSpacing: ".1em", background: "var(--accent-subtle)",
            border: "1px solid var(--border-accent)", borderRadius: "var(--radius-sm)", padding: "5px 10px",
          }}>
            {p.category}
          </span>
          <span style={{ font: "500 12px var(--font-mono), monospace", color: "var(--text-muted)", letterSpacing: ".06em" }}>
            {p.year} · {t.inProduction}
          </span>
        </div>
        <h1 style={{ font: "700 clamp(36px,6vw,60px)/1.04 var(--font-display), sans-serif", letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px" }}>
          {p.name}
        </h1>
        <p style={{ font: "400 clamp(16px,2.2vw,19px)/1.6 var(--font-body), sans-serif", color: "var(--text-body)", maxWidth: 640, margin: 0 }}>
          {p.desc}
        </p>
      </section>

      {/* ══ BODY ══ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(56px,8vw,96px)" }}>
        <div className="grid-cs">
          <article>
            <div style={eyebrow}>{t.problem}</div>
            <p style={{ ...prose, margin: "0 0 40px" }}>{p.problem}</p>

            <div style={eyebrow}>{t.build}</div>
            <p style={{ ...prose, margin: "0 0 20px" }}>{p.build}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "0 0 40px" }}>
              {p.points.map((pt) => (
                <div key={pt} style={{
                  display: "flex", gap: 12, alignItems: "flex-start", background: "var(--bg-surface)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 18px",
                }}>
                  <span style={{ font: "600 13px var(--font-mono), monospace", color: "var(--accent)", flexShrink: 0, paddingTop: 2 }}>›</span>
                  <span style={{ font: "400 14px/1.6 var(--font-body), sans-serif", color: "var(--text-body)" }}>{pt}</span>
                </div>
              ))}
            </div>

            <div style={eyebrow}>{t.shipped}</div>
            <p style={{ ...prose, margin: 0 }}>{p.outcome}</p>
          </article>

          <aside>
            <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
                <div style={{
                  font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
                  textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14,
                }}>
                  {t.stack}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {p.tags.map((tag) => (
                    <span key={tag} style={{
                      font: "500 11px var(--font-mono), monospace", color: "var(--text-body)",
                      background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)", padding: "5px 10px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                background: "var(--bg-surface)", border: "1px solid var(--border-accent)",
                borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-accent)", padding: 22,
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  font: "500 11px var(--font-mono), monospace", color: "var(--success)",
                  textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success-glow)" }} />
                  {t.available}
                </div>
                <p style={{ font: "400 14px/1.6 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 16px" }}>
                  {t.scopeIt(p.name)}
                </p>
                <a className="cta-solid" href={`mailto:${EMAIL}`} style={{ width: "100%", justifyContent: "center", padding: 12 }}>
                  {t.startProject}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ══ PREV / NEXT ══ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(64px,9vw,110px)" }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
          <Link href={`${pre}/work/${prev.id}`} style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: "20px 22px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 6,
          }}>
            <span style={{ font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{t.prev}</span>
            <span style={{ font: "600 18px var(--font-display), sans-serif", color: "#fff" }}>{prev.name}</span>
          </Link>
          <Link href={`${pre}/work/${next.id}`} style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: "20px 22px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 6, textAlign: "right",
          }}>
            <span style={{ font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{t.next}</span>
            <span style={{ font: "600 18px var(--font-display), sans-serif", color: "#fff" }}>{next.name}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
