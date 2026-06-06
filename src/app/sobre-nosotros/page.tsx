import type { Metadata } from "next";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { Columnas } from "@/components/sobre/Columnas";
import { Cifras } from "@/components/sobre/Cifras";
import { Fundadores } from "@/components/sobre/Fundadores";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "MILO Estudio Arquitectónico: dos arquitectos y una obsesión por los espacios que se habitan con los sentidos.",
  alternates: { canonical: "/sobre-nosotros" },
};

export default function SobreNosotrosPage() {
  return (
    <>
      <InteriorNav />
      <main className="studio">
        <div className="studio__head">
          <span className="t-eyebrow">El estudio</span>
          <h1 className="studio__title">
            Arquitectura que se habita con los sentidos
          </h1>
          <p className="studio__lede">
            MILO nace de dos arquitectos que entienden la casa como un lugar
            para vivir despacio: la luz justa, el material noble, el detalle que
            no se ve pero se siente. Diseñamos espacios con sabor a hogar.
          </p>
        </div>
        <Columnas />
        <Cifras />
        <Fundadores />
      </main>
      <Footer />
    </>
  );
}
