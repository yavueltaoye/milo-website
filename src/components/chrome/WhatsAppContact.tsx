"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  waUrl: string;
  children: ReactNode;
  className?: string;
};

/**
 * On mobile shows a direct WhatsApp link; on desktop (≥md) opens a centered
 * modal with the QR code so visitors can scan without WhatsApp Web.
 * Detection is CSS-only — no JS, no hydration mismatch.
 */
export function WhatsAppContact({ waUrl, children, className }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-petroleum/55 backdrop-blur-[2px]" />

            {/* card */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="WhatsApp QR"
              className="relative z-10 flex flex-col items-center gap-6 rounded-2xl bg-paper px-12 py-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="absolute right-5 top-5 cursor-pointer transition-opacity hover:opacity-50"
              >
                <X className="h-5 w-5 text-petroleum" />
              </button>

              <Image
                src="/assets/qr-whatsapp.jpeg"
                alt="WhatsApp QR — Milo Estudio Creativo"
                width={292}
                height={497}
                className="h-auto w-56 object-contain"
                priority
              />

              <p className="text-center text-[11px] uppercase leading-loose tracking-[0.22em] text-petroleum/60">
                Escanea con tu celular para chatear
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
