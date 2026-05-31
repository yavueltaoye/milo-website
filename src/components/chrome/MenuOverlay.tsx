"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Camera, Globe, Send, X } from "lucide-react";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

type Destination = {
  label: string;
  href: string;
  external?: boolean;
};

const SOCIALS: { label: string; href: string; Icon: typeof Camera }[] = [
  { label: "Instagram", href: "#", Icon: Camera },
  { label: "X", href: "#", Icon: AtSign },
  { label: "Behance", href: "#", Icon: Globe },
  { label: "LinkedIn", href: "#", Icon: Send },
];

/** Right-side drawer menu over the dimmed constellation. */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const reduced = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const destinations: Destination[] = [
    { label: "Proyectos", href: "/proyectos" },
    { label: "Sobre Nosotros", href: "/sobre-nosotros" },
    {
      label: "Contacto",
      href: buildWhatsAppUrl(SITE.whatsappPhone),
      external: true,
    },
  ];

  // Close on Escape and trap focus within the panel while open.
  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Restore focus to the trigger when the menu closes.
  useEffect(() => {
    if (open) return;
    restoreRef.current?.focus?.();
  }, [open]);

  const panelTransition = reduced ? { duration: 0 } : { duration: 0.36 };
  const panelInitial = reduced ? { opacity: 0 } : { opacity: 0, x: "100%" };
  const panelAnimate = reduced ? { opacity: 1 } : { opacity: 1, x: 0 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.24 }}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <button
            type="button"
            aria-label="Cerrar el menú tocando fuera"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-petroleum/55 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={panelTransition}
            className={cn(
              "absolute inset-0 flex flex-col bg-paper text-petroleum shadow-2xl outline-none",
              "px-8 py-10",
              "md:inset-y-4 md:right-4 md:left-auto md:w-[min(420px,34vw)] md:rounded-3xl md:px-11 md:py-11",
            )}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="flex items-center gap-2 text-sm tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-60"
              >
                close
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-auto flex flex-col gap-3">
              {destinations.map((destination) =>
                destination.external ? (
                  <a
                    key={destination.label}
                    href={destination.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl font-light tracking-tight transition-opacity duration-200 hover:opacity-60 md:text-[2.5rem]"
                  >
                    {destination.label}
                  </a>
                ) : (
                  <Link
                    key={destination.label}
                    href={destination.href}
                    onClick={onClose}
                    className="text-3xl font-light tracking-tight transition-opacity duration-200 hover:opacity-60 md:text-[2.5rem]"
                  >
                    {destination.label}
                  </Link>
                ),
              )}
            </nav>

            <footer className="mt-auto flex flex-col gap-6 pt-12">
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm tracking-wide underline-offset-4 transition-opacity duration-200 hover:opacity-60 hover:underline"
              >
                {SITE.email}
              </a>

              <div className="flex items-center justify-between">
                <ul className="flex items-center gap-4">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        className="block transition-opacity duration-200 hover:opacity-60"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                  <span className="font-medium">ES</span>
                  <span className="opacity-30">/</span>
                  <span aria-disabled="true" className="opacity-40">
                    EN
                  </span>
                </div>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
