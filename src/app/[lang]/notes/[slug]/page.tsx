import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, asLang } from "@/lib/content";
import { publishedPost } from "@/lib/growth";
import { md } from "@/lib/markdown";

// Notes live in D1, written by the weekly drafting cron and published only
// after Pedro approves one from his inbox. Nothing to rebuild — approve a
// draft and the page exists.
export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (asLang(lang) !== "en") return {};
  const post = await publishedPost(slug);
  if (!post) return {};
  const description = post.body.replace(/[#*`>[\]()]/g, "").replace(/\s+/g, " ").trim().slice(0, 155);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/notes/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${SITE_URL}/notes/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      images: [{ url: "/images/og/home.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function Note(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await props.params;
  // Notes are written in one language; ES gets the case studies, not a machine
  // translation of a machine-written note.
  if (asLang(lang) !== "en") notFound();

  const post = await publishedPost(slug);
  if (!post) notFound();

  const date = post.published_at ? new Date(post.published_at) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: `${SITE_URL}/notes/${post.slug}`,
    datePublished: post.published_at ?? undefined,
    author: { "@type": "Person", name: "Pedro Jimenez", url: `${SITE_URL}/` },
    publisher: { "@type": "Person", name: "Pedro Jimenez", url: `${SITE_URL}/` },
    mainEntityOfPage: `${SITE_URL}/notes/${post.slug}`,
  };

  return (
    <main style={{ padding: "140px 24px 96px", maxWidth: 720, margin: "0 auto" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p style={{ font: "500 11px var(--font-mono), monospace", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".14em", margin: "0 0 14px" }}>
        <Link href="/notes" style={{ color: "var(--accent)", textDecoration: "none" }}>Notes</Link>
        {date ? ` · ${date.toISOString().slice(0, 10)}` : ""}
      </p>

      <h1 style={{ font: "700 clamp(32px, 6vw, 48px)/1.1 var(--font-display), sans-serif", color: "var(--text-display)", margin: "0 0 36px", letterSpacing: "-.02em" }}>
        {post.title}
      </h1>

      <div
        style={{ font: "400 17px/1.75 var(--font-body), sans-serif", color: "var(--text-body)" }}
        dangerouslySetInnerHTML={{ __html: md(post.body) }}
      />

      <div style={{ marginTop: 56, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
        <p style={{ font: "400 16px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 16px" }}>
          Building something like this? Tell me what you need and I&apos;ll scope it.
        </p>
        <Link href="/about#contact" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 10, border: "1px solid var(--border-accent)", color: "var(--accent)", textDecoration: "none", font: "500 13px var(--font-mono), monospace", letterSpacing: ".06em", textTransform: "uppercase" }}>
          Start a project
        </Link>
      </div>
    </main>
  );
}
