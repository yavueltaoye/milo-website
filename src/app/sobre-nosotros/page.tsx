import type { Metadata } from "next";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { Columnas } from "@/components/sobre/Columnas";
import { Cifras } from "@/components/sobre/Cifras";
import { Fundadores } from "@/components/sobre/Fundadores";
import { Momento } from "@/components/sobre/Momento";
import { Mirada } from "@/components/sobre/Mirada";
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
      <InteriorNav section="El estudio" />
      <main className="studio">
        <header className="studio__head">
          <h1 className="studio__title">
            Arquitectura que se habita con los sentidos
          </h1>
          <p className="studio__lede">
            MILO nace de dos arquitectos que entienden la casa como un lugar
            para vivir despacio: la luz justa, el material noble, el detalle que
            no se ve pero se siente. Diseñamos espacios con sabor a hogar.
          </p>
        </header>
        <Momento
          src="/images/projects/quilmana/g2.jpg"
          alt="Cocina de Casa Quilmaná: isla de mármol crema y luz de media tarde entrando por la carpintería de madera"
          credit="Casa Quilmaná — Cañete, 2025"
        />
        <Columnas />
        <Mirada
          src="/images/projects/eliana/g1.jpg"
          alt="Detalle de mesa de noche en madera maciza con veta visible, Departamento Eliana"
          eyebrow="Departamento Eliana, Lima"
          quote="No puede verse ningún tornillo ni anclaje desde el frente. Esa regla, sola, cambia todo lo que viene después."
        />
        <Cifras />
        <div className="studio__bridge">
          <span className="t-eyebrow">Dos arquitectos</span>
          <p>
            Michael y José se conocieron en obra, no en un escritorio. Lo que
            comparten no es un estilo sino una manía: volver al sitio una
            vez más antes de dar por cerrado un detalle.
          </p>
        </div>
        <Momento
          src="/images/projects/tomo/g2.jpg"
          alt="Salón privado de Tomo Restaurante revestido en tablones de nogal de piso a techo"
          credit="Tomo Restaurante — Lima, 2025"
        />
        <Fundadores />
      </main>
      <Footer />
    </>
  );
}
