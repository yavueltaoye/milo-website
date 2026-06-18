"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type Props = {
  waUrl: string;
  children: ReactNode;
  className?: string;
};

/**
 * On mobile shows a direct WhatsApp link; on desktop (≥md) opens a centered
 * modal with the QR code so visitors can scan without WhatsApp Web open.
 * Mobile/desktop detection is CSS-only — no JS, no hydration mismatch.
 */
export function WhatsAppContact({ waUrl, children, className }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const backdropTransition = { duration: reduced ? 0 : 0.22 };
  const cardInitial = reduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.94, y: 10 };
  const cardAnimate = reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const cardTransition = {
    duration: reduced ? 0 : 0.32,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <>
      {/* Mobile: direct WhatsApp link */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("md:hidden", className)}
      >
        {children}
      </a>

      {/* Desktop: trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("hidden cursor-pointer md:inline-flex", className)}
      >
        {children}
      </button>

      {/* Desktop: centered QR modal via portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[70] flex items-center justify-center px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={backdropTransition}
                role="presentation"
                onClick={() => setOpen(false)}
              >
                <div className="absolute inset-0 bg-petroleum/60 backdrop-blur-[3px]" />

                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Código QR de WhatsApp"
                  initial={cardInitial}
                  animate={cardAnimate}
                  exit={cardInitial}
                  transition={cardTransition}
                  className="relative z-10 flex w-full max-w-[300px] flex-col items-center gap-5 rounded-[28px] bg-paper px-9 py-9 text-center shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar"
                    className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-petroleum/50 transition-colors hover:bg-petroleum/[0.06] hover:text-petroleum"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <Image
                    src="/assets/logo-primary.png"
                    alt="Milo"
                    width={4933}
                    height={2216}
                    className="h-12 w-auto select-none"
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-medium tracking-tight text-petroleum">
                      Escríbenos por WhatsApp
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-petroleum/45">
                      Escanea con tu celular
                    </p>
                  </div>

                  <div className="rounded-2xl border border-petroleum/10 bg-milo-white p-3 shadow-sm">
                    <Image
                      src="/assets/qr-whatsapp.jpeg"
                      alt="Código QR de WhatsApp — Milo Estudio Creativo"
                      width={249}
                      height={247}
                      className="h-44 w-44 object-contain"
                      priority
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
