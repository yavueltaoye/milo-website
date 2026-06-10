import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AudioProvider } from "@/lib/audio";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

const humanSans = localFont({
  src: [
    { path: "../../public/fonts/HumanSans-Thin.woff2",             weight: "100", style: "normal"  },
    { path: "../../public/fonts/HumanSans-ThinOblique.woff2",      weight: "100", style: "oblique" },
    { path: "../../public/fonts/HumanSans-ExtraLight.woff2",       weight: "200", style: "normal"  },
    { path: "../../public/fonts/HumanSans-ExtraLightOblique.woff2",weight: "200", style: "oblique" },
    { path: "../../public/fonts/HumanSans-Light.woff2",            weight: "300", style: "normal"  },
    { path: "../../public/fonts/HumanSans-LightOblique.woff2",     weight: "300", style: "oblique" },
    { path: "../../public/fonts/HumanSans-Regular.woff2",          weight: "400", style: "normal"  },
    { path: "../../public/fonts/HumanSans-RegularOblique.woff2",   weight: "400", style: "oblique" },
    { path: "../../public/fonts/HumanSans-Medium.woff2",           weight: "500", style: "normal"  },
    { path: "../../public/fonts/HumanSans-MediumOblique.woff2",    weight: "500", style: "oblique" },
    { path: "../../public/fonts/HumanSans-Bold.woff2",             weight: "700", style: "normal"  },
    { path: "../../public/fonts/HumanSans-BoldOblique.woff2",      weight: "700", style: "oblique" },
    { path: "../../public/fonts/HumanSans-Black.woff2",            weight: "900", style: "normal"  },
    { path: "../../public/fonts/HumanSans-BlackOblique.woff2",     weight: "900", style: "oblique" },
  ],
  variable: "--font-human-sans",
  display: "swap",
  adjustFontFallback: false,
});

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${humanSans.variable}`}>
      <body className="min-h-full flex flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <AudioProvider>
          <SmoothScroll>
            <div id="contenido" tabIndex={-1} className="outline-none">
              {children}
            </div>
            {modal}
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
