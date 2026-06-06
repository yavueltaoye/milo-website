import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MILO Estudio Arquitectónico",
    short_name: "MILO",
    description:
      "Diseñamos espacios que se habitan con los sentidos. Arquitectura e interiorismo en Lima, Perú.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#003a4c",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
