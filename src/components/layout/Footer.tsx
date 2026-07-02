import Link from "next/link";
import { EMAIL, GITHUB_URL, type Lang, getDict, langPrefix } from "@/lib/content";

export function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pre = langPrefix(lang);
  const other = lang === "en" ? "es" : "en";

  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "48px clamp(20px,5vw,48px)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 28,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ font: "600 19px var(--font-display), sans-serif", color: "#fff", marginBottom: 6 }}>
            pedrojimenez<span style={{ color: "var(--accent)" }}>.dev</span>
          </div>
          <div style={{ font: "400 13px var(--font-body), sans-serif", color: "var(--text-muted)" }}>
            {t.footer.tagline}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Link className="navlink" href={`${pre}/work`}>{t.nav.work}</Link>
          <Link className="navlink" href={`${pre}/services`}>{t.nav.services}</Link>
          <Link className="navlink" href={`${pre}/about`}>{t.nav.about}</Link>
          <a className="navlink" href={`mailto:${EMAIL}`}>{t.footer.email}</a>
          <a className="navlink" href={GITHUB_URL}>{t.footer.github}</a>
          <span style={{ width: 1, height: 18, background: "var(--border)", margin: "0 6px" }} />
          <Link className="navlink" href={langPrefix(other) || "/"} style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>
            {other}
          </Link>
        </div>
      </div>
      <div style={{
        maxWidth: 1200, margin: "32px auto 0",
        font: "400 12px var(--font-mono), monospace", color: "var(--text-muted)", letterSpacing: ".03em",
      }}>
        {t.footer.copyright}
      </div>
    </footer>
  );
}
