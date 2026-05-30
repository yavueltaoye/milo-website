"use client";

import { useState } from "react";
import { Orbe } from "./Orbe";
import { MenuOverlay } from "./MenuOverlay";

/**
 * Minimal top bar for interior (light) pages: the petroleum iso mark on the
 * left (links home) and a "menu" trigger on the right that opens the shared
 * MenuOverlay. Manages its own open state; reused across detail pages.
 */
export function InteriorNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Orbe variant="petroleum" />
      <header className="fixed right-(--gutter) top-5 z-50">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="text-sm tracking-wide text-petroleum cursor-pointer transition-opacity duration-200 hover:opacity-60"
        >
          menu
        </button>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
