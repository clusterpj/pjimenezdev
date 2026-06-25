import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-VariableFont.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pedro Jimenez — Full-Stack Developer",
  description:
    "Solo developer. AI integrations, automations, web & mobile apps — shipped, not demoed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
