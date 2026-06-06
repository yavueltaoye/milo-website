"use client";

import { useState } from "react";
import { PortalBienvenida } from "@/components/portal/PortalBienvenida";
import { NavHome } from "@/components/home/NavHome";
import { ListaProyectosBIG } from "@/components/home/ListaProyectosBIG";
import { ToggleSonido } from "@/components/chrome/ToggleSonido";
import { DiscoDiario } from "@/components/home/DiscoDiario";

/**
 * Home — a sober, BIG-inspired editorial index on a light surface: a fixed top
 * nav (logo · type filters · sections) over a calm scroll of project rows. The
 * filter chosen in the nav narrows the list. Replaces the previous WebGL tornado.
 */
export default function Home() {
  const [filter, setFilter] = useState<string>("Todos");

  return (
    <main className="min-h-[100dvh] bg-milo-white text-petroleum">
      <PortalBienvenida />

      <h1 className="sr-only">
        MILO — Estudio de arquitectura e interiorismo en Perú. Proyectos.
      </h1>

      <NavHome filter={filter} onFilter={setFilter} />
      <ListaProyectosBIG filter={filter} />

      <DiscoDiario tone="petroleum" />
      <ToggleSonido className="border-petroleum/30 bg-paper/70 text-petroleum" />
    </main>
  );
}
