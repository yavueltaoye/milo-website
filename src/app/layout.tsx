import type { Metadata, Viewport } from "next";
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#003a4c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <AudioProvider>
          <SmoothScroll>
            <div id="contenido" tabIndex={-1} className="outline-none">
              {children}
            </div>
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
