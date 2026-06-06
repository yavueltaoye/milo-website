import { DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp";

export const SITE = {
  name: "MILO Estudio Arquitectónico",
  whatsappPhone: "51978919059",
  whatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
  email: "hola@miloestudio.com", // placeholder — pending client
  audioSrc: "/audio/ambiente_natural.mp3",
  portalCopy: "Diseñamos espacios que se habitan con los sentidos",
  portalCta: "Bienvenido al mundo de MILO",
  /** Cifras de "Sobre Nosotros" — propuesta editable. Valores numéricos para
      que rendericen limpios a escala display; la unidad/contexto va en la etiqueta. */
  stats: [
    { n: "10", l: "Años de oficio" },
    { n: "12", l: "Proyectos construidos" },
    { n: "2,800", l: "m² intervenidos" },
    { n: "5", l: "Ciudades y distritos" },
    { n: "2026", l: "Selección CasaCor" },
  ],
} as const;
