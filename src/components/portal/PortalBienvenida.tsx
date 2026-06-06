"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useAudio } from "@/lib/audio";
import { SITE } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "exiting";

type FlyConfig = {
  x0: number; y0: number; s0: number;
  x1: number; y1: number; s1: number;
  vw: number; vh: number;
};

// ─── Curvas ───────────────────────────────────────────────────────────────────

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO:  [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Timings ──────────────────────────────────────────────────────────────────
//
//  t = 0.00s  Click.
//             • Lockup se desvanece (0.18s).
//             • Nav logo → opacity:0 al instante (oculto para el blend).
//             • Isotipo vuela al M del nav logo (0.55s, expo).
//  t = 0.45s  Telón empieza a subir (1.30s, expo).
//  t = 1.33s  CROSS-FADE: iso opacity 1→0 y nav logo opacity 0→1 simultáneamente (0.42s).
//  t = 1.75s  Telón alzado → enter() → portal desmontado → nav logo a opacity:1.
//
const ISO_TRAVEL    = 0.55;
const CURTAIN_DELAY = 0.45;
const CURTAIN_DUR   = 1.30;
const TOTAL         = CURTAIN_DELAY + CURTAIN_DUR; // 1.75s
const BLEND_START   = TOTAL * 0.76;                // 1.33s — cuando el iso empieza a desvanecerse
// BLEND_DUR = TOTAL - BLEND_START = 0.42s — sincronizado con el cross-fade CSS

// ─── Variantes de entrada ─────────────────────────────────────────────────────

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.12 } },
};
const logoEntry: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE_QUART } },
};
const textEntry: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_QUART } },
};
const buttonEntry: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease: EASE_QUART } },
};

// ─── Componente ────────────────────────────────────────────────────────────────

export function PortalBienvenida() {
  const { entered, enter } = useAudio();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [fly, setFly] = useState<FlyConfig | null>(null);
  const lockupRef  = useRef<HTMLDivElement>(null);
  const blendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Gestión de atributos en el HTML para controlar el nav logo ──────────────
  //
  //  data-milo-transitioning → nav logo opacity:0 (oculto para evitar solapamiento)
  //  data-milo-blending      → nav logo funde opacity 0→1 (cross-fade con el iso)
  //
  useEffect(() => {
    if (phase === "exiting") {
      document.documentElement.setAttribute("data-milo-transitioning", "1");
      document.documentElement.removeAttribute("data-milo-blending");
    }
    return () => {
      // Limpieza al desmontar (cuando entered===true y el portal desaparece).
      if (blendTimer.current) clearTimeout(blendTimer.current);
      document.documentElement.removeAttribute("data-milo-transitioning");
      document.documentElement.removeAttribute("data-milo-blending");
    };
  }, [phase]);

  const handleEnter = () => {
    if (reduced) { enter(); return; }

    const el = lockupRef.current;
    if (!el) { enter(); return; }

    const lr = el.getBoundingClientRect();

    // Centro visual del M en el lockup-v (≈55% del ancho, tercio superior)
    const s0 = lr.width * 0.55;
    const x0 = lr.left + lr.width / 2;
    const y0 = lr.top + s0 * 0.48;

    // Destino: la M de "Milo" en la nav.
    // La M ocupa ≈18% del ancho total del wordmark desde el borde izquierdo.
    const navImg = document.querySelector(".nav__logo img") as HTMLElement | null;
    const nr = navImg?.getBoundingClientRect();
    const s1 = nr ? nr.height : 34;          // iso del mismo alto que el nav logo
    const x1 = nr ? nr.left + nr.width * 0.18 : 34; // centro de la M en "Milo"
    const y1 = nr ? nr.top + nr.height / 2 : 33;

    setFly({ x0, y0, s0, x1, y1, s1, vw: window.innerWidth, vh: window.innerHeight });
    setPhase("exiting");

    // En t=BLEND_START (1.33s): disparar el cross-fade entre iso y nav logo.
    blendTimer.current = setTimeout(() => {
      document.documentElement.setAttribute("data-milo-blending", "1");
    }, BLEND_START * 1000);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════
          TELÓN — sube y se lleva el tagline/botón.
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="portal"
            role="dialog"
            aria-modal="true"
            aria-label="Portal de bienvenida"
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-milo-black px-6 text-center"
            initial={{ y: 0 }}
            animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0 } }}
            transition={
              phase === "exiting"
                ? { duration: CURTAIN_DUR, delay: CURTAIN_DELAY, ease: EASE_EXPO }
                : { duration: 0 }
            }
            onAnimationComplete={() => {
              if (phase === "exiting") enter();
            }}
          >
            {/* Sombra en el borde inferior — efecto cortina física */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }}
            />

            {/* ── Contenido del welcome ── */}
            <motion.div
              className="relative flex flex-col items-center gap-10"
              variants={reduced ? undefined : staggerContainer}
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
            >
              {/* Lockup: se desvanece rápido para dejar el iso volar solo */}
              <motion.div
                ref={lockupRef}
                variants={reduced ? undefined : logoEntry}
                animate={
                  phase === "exiting"
                    ? { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }
                    : undefined
                }
              >
                <Image
                  src="/assets/lockup-v-ivory.png"
                  alt={SITE.name}
                  width={160}
                  height={200}
                  priority
                  className="h-auto w-32 select-none sm:w-40"
                />
              </motion.div>

              {/* Tagline y botón — suben con el telón (sin fade propio) */}
              <motion.h1
                variants={reduced ? undefined : textEntry}
                className="max-w-2xl text-balance text-2xl font-light leading-snug text-ivory sm:text-3xl md:text-4xl"
              >
                {SITE.portalCopy}
              </motion.h1>

              <motion.button
                type="button"
                onClick={handleEnter}
                variants={reduced ? undefined : buttonEntry}
                whileHover={phase === "idle" ? { opacity: 0.85 } : undefined}
                whileTap={phase === "idle" ? { scale: 0.97 } : undefined}
                className="rounded-full bg-ivory px-8 py-3.5 text-sm font-medium tracking-wide text-petroleum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-milo-black"
              >
                {SITE.portalCta}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          ISOTIPO VOLADOR — z-90, por encima del telón (z-80).
          Viaja sobre el negro, aterriza en la M de "Milo",
          y se funde con el nav logo mediante un cross-fade.
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "exiting" && fly && !entered && (
          <motion.div
            key="flying-iso"
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              width: fly.s1,
              height: fly.s1,
              marginLeft: -fly.s1 / 2,
              marginTop: -fly.s1 / 2,
              zIndex: 90,
              pointerEvents: "none",
            }}
            initial={{
              x: fly.x0 - fly.vw / 2,
              y: fly.y0 - fly.vh / 2,
              scale: fly.s0 / fly.s1,
              opacity: 1,
            }}
            animate={{
              x: fly.x1 - fly.vw / 2,
              y: fly.y1 - fly.vh / 2,
              scale: 1,
              // El iso permanece opaco durante el viaje y el barrido del telón.
              // Se desvanece solo en el cross-fade final (t=1.33s → t=1.75s).
              opacity: [1, 1, 0] as [number, number, number],
            }}
            transition={{
              x:     { duration: ISO_TRAVEL, ease: EASE_EXPO },
              y:     { duration: ISO_TRAVEL, ease: EASE_EXPO },
              scale: { duration: ISO_TRAVEL, ease: EASE_EXPO },
              // La opacidad se gestiona en TOTAL segundos para que el fade-out
              // ocurra exactamente en la ventana del cross-fade (t=1.33s → 1.75s).
              opacity: {
                times:    [0, BLEND_START / TOTAL, 1],
                duration: TOTAL,
                ease:     "linear",
              },
            }}
          >
            <Image
              src="/assets/iso-ivory.png"
              alt=""
              fill
              sizes={`${Math.round(fly.s1 * 3)}px`}
              className="object-contain"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
