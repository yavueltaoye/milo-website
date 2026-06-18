"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECT_TYPES } from "@/data/projects";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { WhatsAppContact } from "@/components/chrome/WhatsAppContact";
import { cn } from "@/lib/utils";

type NavHomeProps = {
  /** Active project-type filter ("Todos" = all). */
  filter: string;
  onFilter: (type: string) => void;
};

const SECTIONS: { label: string; href: string }[] = [
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Diario", href: "/diario" },
];

/**
 * Sober, BIG-style top bar for the home: the MILO mark at the left, the project
 * types as centred filters, and the site sections at the right. Reuses the
 * `.nav*` design-system classes from globals.css (sticky, blurred, hairline).
 * On mobile the rows collapse to the logo and a "menu" trigger that opens the
 * shared MenuOverlay.
 */
export function NavHome({ filter, onFilter }: NavHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado inicial correcto
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("nav", scrolled && "is-scrolled")}>
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

        {/* Centre — type filters (desktop). */}
        <nav className="nav__links" aria-label="Filtrar proyectos por tipo">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={type === filter}
              onClick={() => onFilter(type)}
              className={cn("nav__link", type === filter && "is-active")}
            >
              {type}
            </button>
          ))}
        </nav>

        {/* Right — sections (desktop) + menu trigger (mobile). */}
        <div className="nav__end">
          <nav className="nav__sections" aria-label="Secciones del sitio">
            {SECTIONS.map((section) => (
              <Link key={section.label} href={section.href} className="nav__link">
                {section.label}
              </Link>
            ))}
            <WhatsAppContact
              waUrl={buildWhatsAppUrl(SITE.whatsappPhone)}
              className="nav__link"
              placement="below"
              popoverAlign="right"
            >
              Contacto
            </WhatsAppContact>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
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

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
