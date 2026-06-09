"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuOverlay } from "./MenuOverlay";

type InteriorNavProps = {
  /** Etiqueta centrada — ej. "El estudio", "Diario", "Proyectos" */
  section?: string;
};

/**
 * Barra de navegación para páginas interiores: mismo ADN visual que NavHome.
 * Logo MILO a la izquierda (vuelve al inicio), nombre de sección centrado,
 * hamburguesa a la derecha → MenuOverlay. Frosted glass al hacer scroll.
 */
export function InteriorNav({ section }: InteriorNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("nav", scrolled && "is-scrolled")}>
        {/* Izquierda: wordmark MILO — mismo asset y tamaño que NavHome */}
        <Link href="/" aria-label="Milo — inicio" className="nav__logo">
          <Image
            src="/assets/logo-primary.png"
            alt="Milo Estudio"
            width={111}
            height={50}
            priority
            className="select-none"
          />
        </Link>

        {/* Centro: etiqueta de sección (oculta en móvil) */}
        {section ? (
          <span className="nav__section t-eyebrow">{section}</span>
        ) : (
          <span aria-hidden="true" />
        )}

        {/* Derecha: menú hamburguesa */}
        <div className="nav__end">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Abrir menú"
            className="nav__menu"
          >
            <span className="nav__burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
