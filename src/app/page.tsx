"use client";

import { useState } from "react";
import { Orbe } from "@/components/chrome/Orbe";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { ToggleSonido } from "@/components/chrome/ToggleSonido";
import { ToggleVista, type Vista } from "@/components/chrome/ToggleVista";
import { PortalBienvenida } from "@/components/portal/PortalBienvenida";
import { Constelacion } from "@/components/home/Constelacion";
import { ListaTitulos } from "@/components/home/ListaTitulos";
import { DiscoDiario } from "@/components/home/DiscoDiario";

export default function Home() {
  const [view, setView] = useState<Vista>("spiral");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-[100dvh] bg-milo-black text-ivory">
      <PortalBienvenida />

      {/* The galaxy stays mounted in both views — the background never changes. */}
      <Constelacion />
      {view === "list" && <ListaTitulos />}

      {/* Fixed chrome (always ivory — the surface is always dark). */}
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
