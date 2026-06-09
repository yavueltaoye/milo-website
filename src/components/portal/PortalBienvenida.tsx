"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useAudio } from "@/lib/audio";
import { SITE } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BlueprintLayer } from "./BlueprintLayer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "exiting" | "done";

type FlyConfig = {
  endCx: number; endCy: number; // centro de la M destino (wordmark del nav), en viewport
  w0: number; h0: number;       // tamaño del iso a scale=1 → su M coincide con la M del nav
  dx: number; dy: number;       // desplazamiento inicial (M del lockup − M del nav)
  scale0: number;               // escala inicial (M del lockup / M del nav)
};

// ─── Métricas del glifo "M" dentro de cada asset ───────────────────────────────
//
//  Fracciones 0–1 medidas sobre los PNG reales. Permiten que la M despegue
//  exactamente desde la M del lockup del welcome y aterrice exactamente sobre la
//  M del wordmark del nav — misma posición y tamaño, sin saltos.
//
//  (Reservadas para el modo isotipo. En modo wordmark completo se usa el bounding
//  rect directo de los elementos del DOM, sin necesidad de estas fracciones.)
//
const ISO_M  = { cx: 0.492, cy: 0.509, w: 0.650 }; // iso-ivory.png
const WORD_M = { cx: 0.251, cy: 0.501, w: 0.3375 }; // logo-primary.png (nav)
const LOCK_M = { cx: 0.251, cy: 0.428, w: 0.3375 }; // lockup-v-ivory.png (welcome)
const ISO_ASPECT = 2474 / 2216; // ancho/alto natural del iso

// ─── Modo de vuelo ────────────────────────────────────────────────────────────
//  "iso"      → vuela solo el isotipo (M + pájaro)
//  "wordmark" → vuela el wordmark completo "MILO"
const FLY_MODE = "iso" as "iso" | "wordmark";

// ─── Curvas ───────────────────────────────────────────────────────────────────

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO:  [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Timings ──────────────────────────────────────────────────────────────────
//
//  Todo arranca al mismo tiempo en t=0 — un único gesto unificado.
//
//  t = 0.00s  Click. Lockup se desvanece (0.28s suave). M despega. Telón sube.
//             Los tres ocurren simultáneamente: no hay fases separadas.
//  t = 1.00s  La M aterriza sobre la M del wordmark del nav.
//  t = 1.05s  Telón alzado — llega justo después que la M, sin esperas.
//  t = 1.05s→ La M marfil se disuelve (0.30s) sobre el fondo claro,
//             descubriendo la M petróleo real del wordmark.
//
const ISO_TRAVEL    = 1.0;   // coincide con la duración del telón → llegan juntos
const CURTAIN_DELAY = 0;     // sin pausa — empieza exactamente en el clic
const CURTAIN_DUR   = 1.05;  // ligeramente mayor que ISO_TRAVEL: M aterriza antes de revelar
const TOTAL         = CURTAIN_DELAY + CURTAIN_DUR; // 1.05s — telón alzado
const ISO_FADE      = 0.3;                         // disolvencia final reveladora

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
  const lockupRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (reduced) { enter(); return; }

    const el = lockupRef.current;
    const navImg = document.querySelector(".nav__logo img") as HTMLElement | null;
    const nr = navImg?.getBoundingClientRect();
    if (!el || !nr) { enter(); return; }

    const lr = el.getBoundingClientRect();

    let endCx: number, endCy: number, w0: number, h0: number;
    let startCx: number, startCy: number, scale0: number;

    if (FLY_MODE === "wordmark") {
      // Wordmark completo: el flying element tiene el mismo tamaño que el nav logo.
      // El centro de origen es el centro del lockup del welcome.
      w0      = nr.width;
      h0      = nr.height;
      endCx   = nr.left + nr.width  / 2;
      endCy   = nr.top  + nr.height / 2;
      startCx = lr.left + lr.width  / 2;
      startCy = lr.top  + lr.height / 2;
      scale0  = lr.width / w0;
    } else {
      // Modo isotipo: alinea el glifo M de ambos assets con precisión de subpixel.
      const endMw = WORD_M.w * nr.width;
      w0      = endMw / ISO_M.w;
      h0      = w0 / ISO_ASPECT;
      endCx   = nr.left + WORD_M.cx * nr.width;
      endCy   = nr.top  + WORD_M.cy * nr.height;
      const startMw = LOCK_M.w * lr.width;
      startCx = lr.left + LOCK_M.cx * lr.width;
      startCy = lr.top  + LOCK_M.cy * lr.height;
      scale0  = startMw / endMw;
    }

    setFly({
      endCx, endCy, w0, h0,
      dx: startCx - endCx,
      dy: startCy - endCy,
      scale0,
    });
    setPhase("exiting");
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
            animate={phase === "idle" ? { y: 0 } : { y: "-100%" }}
            exit={{ y: "-100%", transition: { duration: 0 } }}
            transition={
              phase === "idle"
                ? { duration: 0 }
                : { duration: CURTAIN_DUR, delay: CURTAIN_DELAY, ease: EASE_EXPO }
            }
            onAnimationComplete={() => {
              if (phase !== "idle") enter();
            }}
          >
            {/* Capa de plano arquitectónico — ivory sobre negro, decorativa */}
            <BlueprintLayer />

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
              {/* Lockup: se desvanece rápido para dejar la M volar sola */}
              <motion.div
                ref={lockupRef}
                variants={reduced ? undefined : logoEntry}
                animate={
                  phase !== "idle"
                    ? { opacity: 0, transition: { duration: 0.28, ease: EASE_QUART } }
                    : undefined
                }
              >
                <Image
                  src="/assets/lockup-v-ivory.png"
                  alt={SITE.name}
                  width={376}
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

      {/* ══════════════════════════════════════════════════════════════════════
          ISOTIPO VOLADOR — z-90, por encima del telón (z-80).
          Despega ivory del lockup y hace un crossfade → petróleo DURANTE el
          viaje, de modo que al aterrizar sobre el nav ya tiene el color exacto
          del wordmark real. Integración seamless: no hay corte ni dissolve final
          visible, la M simplemente "se convierte" en el logotipo mientras vuela.
          ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "exiting" && fly && (
          <motion.div
            key="flying-iso"
            style={{
              position: "fixed",
              left: fly.endCx,
              top: fly.endCy,
              width: fly.w0,
              height: fly.h0,
              marginLeft: -fly.w0 / 2,
              marginTop: -fly.h0 / 2,
              zIndex: 90,
              pointerEvents: "none",
            }}
            initial={{ x: fly.dx, y: fly.dy, scale: fly.scale0 }}
            animate={{ x: 0, y: 0, scale: 1 }}
            transition={{
              x:     { duration: ISO_TRAVEL, ease: EASE_EXPO },
              y:     { duration: ISO_TRAVEL, ease: EASE_EXPO },
              scale: { duration: ISO_TRAVEL, ease: EASE_EXPO },
            }}
          >
            {/* Capa ivory — sale opaca y se desvanece linealmente durante el vuelo */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: ISO_TRAVEL, ease: "linear" }}
            >
              <Image
                src={FLY_MODE === "wordmark" ? "/assets/logo-ivory.png" : "/assets/iso-ivory.png"}
                alt=""
                fill
                sizes={`${Math.round(fly.w0 * 3)}px`}
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Capa petróleo — aparece durante el vuelo (crossfade con ivory),
                llega completa al destino y se disuelve brevemente al revelar nav */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: ISO_TRAVEL + ISO_FADE,
                times: [
                  0,
                  ISO_TRAVEL / (ISO_TRAVEL + ISO_FADE),            // peak: llega al nav
                  (ISO_TRAVEL + 0.05) / (ISO_TRAVEL + ISO_FADE),   // hold breve
                  1,                                                 // fade final
                ],
                ease: ["linear", "linear", "easeIn"],
              }}
              onAnimationComplete={() => setPhase("done")}
            >
              <Image
                src={FLY_MODE === "wordmark" ? "/assets/logo-primary.png" : "/assets/iso-primary.png"}
                alt=""
                fill
                sizes={`${Math.round(fly.w0 * 3)}px`}
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
