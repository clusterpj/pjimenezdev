"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { asLang, getDict, langPrefix } from "@/lib/content";

export default function NotFound() {
  const pathname = usePathname();
  const lang = asLang(pathname?.startsWith("/es") ? "es" : "en");
  const t = getDict(lang).notFound;
  const pre = langPrefix(lang);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
      }}
    >
      <div
        style={{
          font: "500 13px var(--font-mono), monospace",
          color: "var(--accent)",
          letterSpacing: ".06em",
          marginBottom: 20,
        }}
      >
        {t.eyebrow}
      </div>
      <h1
        style={{
          font: "700 clamp(32px,5vw,56px) var(--font-display), sans-serif",
          color: "#fff",
          letterSpacing: "-.02em",
          marginBottom: 16,
        }}
      >
        {t.title}
      </h1>
      <p
        style={{
          font: "400 17px var(--font-body), sans-serif",
          color: "var(--text-body)",
          maxWidth: 440,
          lineHeight: "var(--leading-body)",
          marginBottom: 36,
        }}
      >
        {t.message}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link className="cta-solid" href={pre || "/"} style={{ textDecoration: "none" }}>
          {t.ctaHome}
        </Link>
        <Link className="cta-ghost" href={`${pre}/work`} style={{ textDecoration: "none" }}>
          {t.ctaWork}
        </Link>
      </div>
    </div>
  );
}
