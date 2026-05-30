"use client";

import { useState } from "react";
import { Orbe } from "@/components/chrome/Orbe";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { ToggleSonido } from "@/components/chrome/ToggleSonido";
import { ToggleVista, type Vista } from "@/components/chrome/ToggleVista";
import { PortalBienvenida } from "@/components/portal/PortalBienvenida";
import { Constelacion } from "@/components/home/Constelacion";
import { IndiceProyectos } from "@/components/home/IndiceProyectos";
import { DiscoDiario } from "@/components/home/DiscoDiario";

export default function Home() {
  const [view, setView] = useState<Vista>("spiral");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-milo-black text-ivory">
      <PortalBienvenida />

      {view === "spiral" ? (
        <Constelacion />
      ) : (
        <div className="min-h-screen bg-paper text-petroleum">
          <IndiceProyectos />
        </div>
      )}

      {/* Fixed chrome */}
      <Orbe />
      <ToggleVista value={view} onChange={setView} />

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed right-(--gutter) top-5 z-50 flex items-center gap-2 text-sm tracking-wide text-ivory transition-opacity duration-200 hover:opacity-70"
      >
        menu <span className="opacity-50">•</span>
      </button>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ToggleSonido />
      <DiscoDiario />
    </main>
  );
}
