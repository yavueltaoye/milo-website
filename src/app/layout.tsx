import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/lib/audio";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

const TITLE = "MILO — Estudio Arquitectónico";
const DESCRIPTION =
  "Diseñamos espacios que se habitan con los sentidos. Arquitectura e interiorismo en Lima, Perú.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — MILO Estudio",
  },
  description: DESCRIPTION,
  applicationName: "MILO Estudio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "MILO Estudio Arquitectónico",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AudioProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
