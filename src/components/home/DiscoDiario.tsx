"use client";

import Image from "next/image";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ORBIT = "diario • 2026 • diario • 2026 • ";

type DiscoDiarioProps = {
  /** Text/border tone: ivory over dark (default), petroleum over light. */
  tone?: "ivory" | "petroleum";
};

/**
 * Small rotating disc fixed bottom-left: a circular thumbnail framed by
 * orbital text that turns slowly, linking to the journal. The spin pauses
 * under prefers-reduced-motion.
 */
export function DiscoDiario({ tone = "ivory" }: DiscoDiarioProps) {
  const reduced = usePrefersReducedMotion();
  const letters = ORBIT.split("");
  const step = 360 / letters.length;
  const textTone = tone === "petroleum" ? "text-petroleum/80" : "text-ivory/80";
  const borderTone =
    tone === "petroleum" ? "border-petroleum/30" : "border-ivory/30";

  return (
    <Link
      href="/diario"
      aria-label="Diario"
      className="fixed bottom-5 left-(--gutter) z-50 block transition-opacity duration-200 hover:opacity-80"
    >
      <style>{
        "@keyframes milo-disc-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"
      }</style>
      {/* md:h-24 md:w-24 en desktop; más pequeño en móvil para no tapar proyectos */}
      <div className="relative h-16 w-16 md:h-24 md:w-24">
        <div
          className="absolute inset-0"
          style={
            reduced
              ? undefined
              : { animation: "milo-disc-spin 18s linear infinite" }
          }
        >
          {letters.map((char, index) => (
            <span
              key={index}
              className={`absolute left-1/2 top-1/2 text-[7px] md:text-[9px] uppercase tracking-[0.05em] ${textTone}`}
              style={{
                transform: `translate(-50%, -50%) rotate(${index * step}deg) translateY(-30px)`,
                transformOrigin: "center",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className={`absolute left-1/2 top-1/2 h-8 w-8 md:h-12 md:w-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border ${borderTone}`}>
          <Image
            src="/images/projects/tomo/hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 32px, 48px"
            className="object-cover"
          />
        </div>
      </div>
    </Link>
  );
}
