"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  waUrl: string;
  children: ReactNode;
  className?: string;
  /** Where the QR popover appears relative to the trigger. Default: "below". */
  placement?: "above" | "below";
  /** Horizontal alignment of the popover. Default: "center". */
  popoverAlign?: "left" | "center" | "right";
};

/**
 * On mobile shows a direct WhatsApp link; on desktop (≥md) shows a QR-code
 * popover so users can scan without having WhatsApp Web open.
 * Detection is CSS-only — no JS, no hydration mismatch.
 */
export function WhatsAppContact({
  waUrl,
  children,
  className,
  placement = "below",
  popoverAlign = "center",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const verticalClass =
    placement === "above"
      ? "bottom-[calc(100%+10px)]"
      : "top-[calc(100%+10px)]";

  const horizontalClass =
    popoverAlign === "left"
      ? "left-0"
      : popoverAlign === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

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

      {/* Desktop: QR code popover */}
      <div ref={wrapRef} className="relative hidden md:inline-block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn("cursor-pointer", className)}
        >
          {children}
        </button>

        {open && (
          <div
            className={cn(
              "absolute z-50 w-52 rounded-sm border border-petroleum/10 bg-paper p-4 shadow-lg",
              "flex flex-col items-center gap-3",
              verticalClass,
              horizontalClass,
            )}
          >
            <Image
              src="/assets/qr-whatsapp.jpeg"
              alt="WhatsApp QR — Milo Estudio Creativo"
              width={160}
              height={160}
              className="h-40 w-40 object-contain"
            />
            <p className="text-center text-[10px] uppercase leading-relaxed tracking-[0.16em] text-petroleum/60">
              Escanea con tu celular para chatear
            </p>
          </div>
        )}
      </div>
    </>
  );
}
