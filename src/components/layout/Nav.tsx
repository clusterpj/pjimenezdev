"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { asLang, getDict, langPrefix } from "@/lib/content";

export function Nav() {
  const params = useParams();
  const pathname = usePathname();
  const lang = asLang((params.lang as string) || "en");
  const t = getDict(lang);
  const pre = langPrefix(lang);
  const isHome = pathname === "/" || pathname === "/es";

  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page the nav starts transparent and links resolve in on scroll;
  // subpages are always solid with links visible.
  const resolved = !isHome || scrolled;
  const contactHref = isHome ? "#contact" : `${pre}/about#contact`;

  const links = [
    { label: t.nav.work, href: `${pre}/work`, active: pathname.startsWith(`${pre}/work`) },
    { label: t.nav.services, href: `${pre}/services`, active: pathname.startsWith(`${pre}/services`) },
    { label: t.nav.about, href: `${pre}/about`, active: pathname.startsWith(`${pre}/about`) },
    { label: t.nav.contact, href: contactHref, active: false },
  ];

  const fadeStyle: React.CSSProperties = {
    opacity: resolved ? 1 : 0,
    transform: resolved ? "translateY(0)" : "translateY(-6px)",
    pointerEvents: resolved ? "auto" : "none",
    transition: "opacity .35s var(--ease-default), transform .35s var(--ease-default)",
  };

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: resolved ? "rgba(8,8,15,.88)" : "rgba(8,8,15,0)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${resolved ? "var(--border)" : "rgba(255,255,255,0)"}`,
          transition: "background .3s var(--ease-default), border-color .3s var(--ease-default)",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 clamp(20px,5vw,48px)", height: 64,
        }}>
          <Link href={pre || "/"} style={{
            font: "600 21px var(--font-display), sans-serif", letterSpacing: "-.5px",
            color: "#fff", textDecoration: "none",
          }}>
            pedrojimenez<span style={{ color: "var(--accent)" }}>.dev</span>
          </Link>

          <nav className="nav-desktop" style={{ alignItems: "center", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2, ...fadeStyle }}>
              {links.map((l) => (
                <Link key={l.label} className="navlink" href={l.href} aria-current={l.active ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
              <span style={{ width: 1, height: 22, background: "var(--border)", margin: "0 12px" }} />
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              font: "500 11px var(--font-mono), monospace", color: "var(--success)",
              textTransform: "uppercase", letterSpacing: ".06em", marginRight: 14,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success-glow)" }} />
              {t.nav.available}
            </span>
            <a className="cta-solid" href={contactHref} style={fadeStyle}>{t.nav.startProject}</a>
          </nav>

          <button
            className="nav-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t.nav.menu}
            style={{
              alignItems: "center", justifyContent: "center", width: 42, height: 42,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", cursor: "pointer", color: "#fff",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300, background: "rgba(5,5,9,.72)",
            backdropFilter: "blur(10px)", display: "flex", flexDirection: "column",
            padding: "80px 28px 28px",
          }}
        >
          {links.map((l, i) => (
            <Link
              key={l.label}
              className="navlink"
              href={l.href}
              style={{
                fontSize: 22, color: l.active ? "var(--accent)" : "#fff", padding: "16px 4px",
                borderBottom: "1px solid var(--border)",
                marginBottom: i === links.length - 1 ? 24 : 0,
              }}
            >
              {l.label}
            </Link>
          ))}
          <a className="cta-solid" href={contactHref} style={{ justifyContent: "center", padding: 15, fontSize: 16 }}>
            {t.nav.startProject}
          </a>
        </div>
      )}
    </>
  );
}
