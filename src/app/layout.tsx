import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/lib/audio";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "MILO — Estudio Arquitectónico",
  description:
    "Diseñamos espacios que se habitan con los sentidos. Arquitectura e interiorismo en Lima, Perú.",
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
