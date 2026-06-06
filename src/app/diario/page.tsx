import type { Metadata } from "next";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { Listado } from "@/components/diario/Listado";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Diario",
  description:
    "El diario de MILO Estudio: notas de prensa, futuros proyectos, planes y alianzas del estudio.",
  alternates: { canonical: "/diario" },
};

export default function DiarioPage() {
  return (
    <>
      <InteriorNav />
      <main className="journal">
        <header className="journal__head">
          <span className="t-eyebrow">Diario</span>
          <h1 className="journal__title">Diario</h1>
          <p className="journal__lede">
            El cuaderno abierto del estudio. Aquí van nuestras notas de prensa,
            los proyectos que vienen, los planes a futuro y las alianzas que nos
            mueven — contadas como las contaríamos en la sobremesa.
          </p>
        </header>
        <Listado />
      </main>
      <Footer />
    </>
  );
}
