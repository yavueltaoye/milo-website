import type { Metadata } from "next";
import { Orbe } from "@/components/chrome/Orbe";
import { IndiceProyectos } from "@/components/home/IndiceProyectos";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Proyectos — MILO Estudio",
  description:
    "El índice completo de proyectos de MILO Estudio: vivienda, interiorismo, gastronomía, oficinas e instalaciones.",
};

export default function ProyectosPage() {
  return (
    <main className="min-h-screen bg-paper text-petroleum">
      <Orbe variant="petroleum" />
      <header className="projects pb-2">
        <h1 className="projects__title">Proyectos</h1>
      </header>
      <IndiceProyectos />
      <Footer />
    </main>
  );
}
