import type { Metadata } from "next";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { IndiceProyectos } from "@/components/home/IndiceProyectos";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "El índice completo de proyectos de MILO Estudio: vivienda, interiorismo, gastronomía, oficinas e instalaciones.",
  alternates: { canonical: "/proyectos" },
};

export default function ProyectosPage() {
  return (
    <>
      <InteriorNav section="Proyectos" />
      <main className="min-h-screen bg-paper text-petroleum">
        <header className="projects pb-2">
          <h1 className="projects__title">Proyectos</h1>
        </header>
        <IndiceProyectos />
        <Footer />
      </main>
    </>
  );
}
