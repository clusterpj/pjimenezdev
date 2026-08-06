import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asLang } from "@/lib/content";
import { publishedPosts } from "@/lib/growth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short technical notes from Pedro Jimenez — real constraints, tradeoffs and things that broke while shipping AI, automation and web work.",
  alternates: { canonical: "/notes" },
};

export default async function Notes(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  if (asLang(lang) !== "en") notFound();

  const posts = await publishedPosts();

  return (
    <main style={{ padding: "140px 24px 96px", maxWidth: 720, margin: "0 auto" }}>
      <p style={{ font: "500 11px var(--font-mono), monospace", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".14em", margin: "0 0 14px" }}>
        Notes
      </p>
      <h1 style={{ font: "700 clamp(32px, 6vw, 48px)/1.1 var(--font-display), sans-serif", color: "var(--text-display)", margin: "0 0 40px", letterSpacing: "-.02em" }}>
        Things I hit while building
      </h1>

      {posts.length === 0 ? (
        <p style={{ font: "400 16px/1.7 var(--font-body), sans-serif", color: "var(--text-muted)" }}>
          Nothing published yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {posts.map((p) => (
            <li key={p.id} style={{ borderTop: "1px solid var(--border)", padding: "22px 0" }}>
              <Link href={`/notes/${p.slug}`} style={{ textDecoration: "none" }}>
                <h2 style={{ font: "600 21px/1.3 var(--font-display), sans-serif", color: "var(--text-display)", margin: "0 0 6px" }}>
                  {p.title}
                </h2>
              </Link>
              <p style={{ font: "400 12px var(--font-mono), monospace", color: "var(--text-muted)", margin: 0 }}>
                {p.published_at?.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
