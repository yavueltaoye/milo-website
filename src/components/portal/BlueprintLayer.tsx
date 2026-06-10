"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Curvas ────────────────────────────────────────────────────────────────────

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO:  [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Paleta ────────────────────────────────────────────────────────────────────

const C = {
  grid:  "rgba(237,242,208,0.06)",
  major: "rgba(237,242,208,0.09)",
  line:  "rgba(237,242,208,0.12)",
  dim:   "rgba(237,242,208,0.13)",
} as const;

// ─── Timings ──────────────────────────────────────────────────────────────────

const T = { GRID: 0.15, FRAME: 0.33, DIM: 0.51, DETAILS: 0.69 } as const;

// ─── Factories de variantes ────────────────────────────────────────────────────

function drawAt(delay: number): Variants {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, ease: EASE_EXPO, delay },
        opacity:    { duration: 0.2, delay },
      },
    },
  };
}

function fadeAt(delay: number): Variants {
  return {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, delay } },
  };
}

const gridFade: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE_QUART, delay: T.GRID } },
};

// ─── CSS grilla ────────────────────────────────────────────────────────────────

const GRID_STYLE: React.CSSProperties = {
  backgroundImage: [
    `repeating-linear-gradient(0deg,  ${C.grid}  0 1px, transparent 1px 32px)`,
    `repeating-linear-gradient(90deg, ${C.grid}  0 1px, transparent 1px 32px)`,
    `repeating-linear-gradient(0deg,  ${C.major} 0 1px, transparent 1px 160px)`,
    `repeating-linear-gradient(90deg, ${C.major} 0 1px, transparent 1px 160px)`,
  ].join(", "),
};

// ─── Atributos SVG ─────────────────────────────────────────────────────────────

const SW     = { stroke: C.line, strokeWidth: 0.75, fill: "none", vectorEffect: "non-scaling-stroke" } as const;
const SW_DIM = { ...SW, stroke: C.dim } as const;

// ─── SVG del plano — zona segura universal ─────────────────────────────────────
//
//  viewBox 1000×1000. Con preserveAspectRatio="xMidYMid slice" cada dispositivo
//  recorta un área distinta del SVG:
//
//   iPhone 390×844  → x visible: 269–731  /  y visible: 0–1000
//   iPad  768×1024  → x visible: 125–875  /  y visible: 0–1000
//   Desktop 1440×900→ x visible: 0–1000   /  y visible: 188–813
//   Desktop 1920×1080→x visible: 0–1000   /  y visible: 219–781
//
//  Zona segura (siempre visible en todos los dispositivos): x=270–730, y=220–780
//
//  Diseño: isotipo MILO enmarcado entre DOS LÍNEAS VERTICALES de cota, simétricas
//  respecto al eje x=500. El logo ocupa aprox. x=420–580, y=460–540 en unidades SVG.
//  Las líneas en x=350 y x=650 le dan ~70 unidades de margen a cada lado.
//
//  Elementos — todos dentro de la zona segura:
//   1. Dos cotas verticales   x=350 y x=650 (y=240→760)
//   2. Cap horizontal superior y=240 con ticks y flechas hacia adentro
//   3. Cap horizontal inferior y=760 (espejo)
//   4. Tick de punto medio en y=500 sobre cada cota vertical
//   5. Marcas de esquina en los 4 vértices del rectángulo de medición
//   6. Barra de escala centrada en y=730 (entre las dos cotas)

function BlueprintSvg() {
  const sFrame   = drawAt(T.FRAME);
  const sDim     = drawAt(T.DIM);
  const fDim     = fadeAt(T.DIM + 0.6);
  const sDetails = drawAt(T.DETAILS);

  // Coordenadas del rectángulo de medición
  const L = 350;  // cota izquierda
  const R = 650;  // cota derecha
  const T_ = 240; // cap superior
  const B  = 760; // cap inferior
  const M  = 500; // eje central

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* ── 1. Cota vertical izquierda (x=350) ───────────────────────────── */}
      <motion.line variants={sDim} x1={L} y1={T_} x2={L} y2={B} {...SW_DIM} />

      {/* ── 2. Cota vertical derecha (x=650) ─────────────────────────────── */}
      <motion.line variants={sDim} x1={R} y1={T_} x2={R} y2={B} {...SW_DIM} />

      {/* ── 3. Cap horizontal SUPERIOR (y=240) ───────────────────────────── */}
      {/* Línea principal */}
      <motion.line variants={sDim} x1={L - 10} y1={T_} x2={R + 10} y2={T_} {...SW_DIM} />
      {/* Ticks en cada extremo de las cotas verticales */}
      <motion.line variants={sDim} x1={L} y1={T_ - 12} x2={L} y2={T_ + 12} {...SW_DIM} />
      <motion.line variants={sDim} x1={R} y1={T_ - 12} x2={R} y2={T_ + 12} {...SW_DIM} />
      {/* Flechas apuntando hacia adentro (← y →, simétricas respecto a x=500) */}
      {/* Flecha izquierda: punta en x=390, base en x=379 → apunta hacia la derecha */}
      <motion.path variants={fDim} d={`M${L + 40},${T_} L${L + 29},${T_ - 5} L${L + 29},${T_ + 5} Z`} fill={C.dim} stroke="none" />
      {/* Flecha derecha: punta en x=610, base en x=621 → apunta hacia la izquierda */}
      <motion.path variants={fDim} d={`M${R - 40},${T_} L${R - 29},${T_ - 5} L${R - 29},${T_ + 5} Z`} fill={C.dim} stroke="none" />

      {/* ── 4. Cap horizontal INFERIOR (y=760) — espejo exacto ───────────── */}
      <motion.line variants={sDim} x1={L - 10} y1={B} x2={R + 10} y2={B} {...SW_DIM} />
      <motion.line variants={sDim} x1={L} y1={B - 12} x2={L} y2={B + 12} {...SW_DIM} />
      <motion.line variants={sDim} x1={R} y1={B - 12} x2={R} y2={B + 12} {...SW_DIM} />
      <motion.path variants={fDim} d={`M${L + 40},${B} L${L + 29},${B - 5} L${L + 29},${B + 5} Z`} fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d={`M${R - 40},${B} L${R - 29},${B - 5} L${R - 29},${B + 5} Z`} fill={C.dim} stroke="none" />

      {/* ── 5. Tick de punto medio en y=500 sobre cada cota vertical ─────── */}
      <motion.line variants={sDetails} x1={L - 8} y1={M} x2={L + 8} y2={M} {...SW} />
      <motion.line variants={sDetails} x1={R - 8} y1={M} x2={R + 8} y2={M} {...SW} />

      {/* ── 6. Marcas de esquina en los 4 vértices del rectángulo ────────── */}
      {/* Superior izquierda */}
      <motion.line variants={sDetails} x1={L}      y1={T_}      x2={L + 20} y2={T_}      {...SW} />
      <motion.line variants={sDetails} x1={L}      y1={T_}      x2={L}      y2={T_ + 20} {...SW} />
      {/* Superior derecha */}
      <motion.line variants={sDetails} x1={R}      y1={T_}      x2={R - 20} y2={T_}      {...SW} />
      <motion.line variants={sDetails} x1={R}      y1={T_}      x2={R}      y2={T_ + 20} {...SW} />
      {/* Inferior izquierda */}
      <motion.line variants={sDetails} x1={L}      y1={B}       x2={L + 20} y2={B}       {...SW} />
      <motion.line variants={sDetails} x1={L}      y1={B}       x2={L}      y2={B - 20}  {...SW} />
      {/* Inferior derecha */}
      <motion.line variants={sDetails} x1={R}      y1={B}       x2={R - 20} y2={B}       {...SW} />
      <motion.line variants={sDetails} x1={R}      y1={B}       x2={R}      y2={B - 20}  {...SW} />

      {/* ── 7. Barra de escala — centrada en x=500, dentro del marco ─────── */}
      <motion.line variants={sDetails} x1={440} y1={730} x2={560} y2={730} {...SW} />
      <motion.line variants={sDetails} x1={440} y1={724} x2={440} y2={736} {...SW} />
      <motion.line variants={sDetails} x1={470} y1={724} x2={470} y2={736} {...SW} />
      <motion.line variants={sDetails} x1={500} y1={724} x2={500} y2={736} {...SW} />
      <motion.line variants={sDetails} x1={530} y1={724} x2={530} y2={736} {...SW} />
      <motion.line variants={sDetails} x1={560} y1={724} x2={560} y2={736} {...SW} />
    </svg>
  );
}

// ─── Componente público ────────────────────────────────────────────────────────

export function BlueprintLayer() {
  const reduced = usePrefersReducedMotion();
  const init = reduced ? "visible" : "hidden";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={init}
      animate="visible"
    >
      <motion.div variants={gridFade} className="absolute inset-0">
        <div className="absolute inset-0" style={GRID_STYLE} />
      </motion.div>

      <BlueprintSvg />
    </motion.div>
  );
}
