import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTracker } from "@/components/PageTracker";
import { Analytics } from "@/components/Analytics";
import { CF_BEACON_TOKEN, SITE_URL, asLang, langs } from "@/lib/content";

// Self-hosted by next/font at build time — subsetted WOFF2, no Google request at
// runtime. latin-ext is required for the ES copy (á é í ó ú ñ ü).
// next/font only accepts literal options, so the subset list is repeated.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/assets/logos/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/logos/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/assets/logos/favicon.svg",
    apple: "/apple-icon.png",
  },
  other: {
    "facebook-domain-verification": "unjmj69cgycb6mazblh1s7pg1wiicm",
  },
};

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { children } = props;
  const lang = asLang((await props.params).lang);

  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Analytics />
        <PageTracker />
        <Nav />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer lang={lang} />
        {/* Cloudflare Web Analytics — renders only once CF_BEACON_TOKEN is set.
            Deferred and last in the body so it never competes with content. */}
        {CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
