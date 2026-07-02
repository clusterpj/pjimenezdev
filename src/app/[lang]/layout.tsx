import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, asLang, langs } from "@/lib/content";

const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/Inter-VariableFont.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
        <Nav />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
