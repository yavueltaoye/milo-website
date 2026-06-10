"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Curvas ────────────────────────────────────────────────────────────────────

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO:  [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Paleta — ivory sobre negro, muy contenido (6–13 %) ──────────────────────

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

// ─── CSS background para la grilla ────────────────────────────────────────────

const GRID_STYLE: React.CSSProperties = {
  backgroundImage: [
    `repeating-linear-gradient(0deg,  ${C.grid}  0 1px, transparent 1px 32px)`,
    `repeating-linear-gradient(90deg, ${C.grid}  0 1px, transparent 1px 32px)`,
    `repeating-linear-gradient(0deg,  ${C.major} 0 1px, transparent 1px 160px)`,
    `repeating-linear-gradient(90deg, ${C.major} 0 1px, transparent 1px 160px)`,
  ].join(", "),
};

// ─── Atributos SVG reutilizables ───────────────────────────────────────────────

const SW = {
  stroke: C.line,
  strokeWidth: 0.75,
  fill: "none",
  vectorEffect: "non-scaling-stroke",
} as const;

const SW_DIM = { ...SW, stroke: C.dim } as const;

// ─── SVG del plano — composición simétrica ────────────────────────────────────
//
//  viewBox 1000×1000. Centro en (500, 500). Todos los elementos son simétricos
//  respecto al eje horizontal y vertical, enmarcando el lockup MILO centrado.
//
//  Elementos:
//   1. Marco inset      — rect centrado con igual margen en los 4 lados
//   2. Cota H           — línea horizontal (y=88) con flechas en ambos extremos
//   3. Cota V           — línea vertical (x=88) con flechas en ambos extremos
//   4. Crosshairs ×4    — una marca de registro en cada esquina del marco
//   5. Barra de escala  — centrada en el borde inferior

function BlueprintSvg() {
  const sFrame   = drawAt(T.FRAME);
  const sDim     = drawAt(T.DIM);
  const fDim     = fadeAt(T.DIM + 0.6);
  const sDetails = drawAt(T.DETAILS);

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* ── 1. Marco inset ────────────────────────────────────────────────── */}
      <motion.rect
        variants={sFrame}
        x={50} y={50} width={900} height={900}
        {...SW}
      />

      {/* ── 2. Cota horizontal (y=88) — simétrica, flechas en ambos extremos */}
      <motion.line variants={sDim} x1={50}  y1={88} x2={950} y2={88} {...SW_DIM} />
      {/* Ticks extremos */}
      <motion.line variants={sDim} x1={50}  y1={81} x2={50}  y2={95} {...SW_DIM} />
      <motion.line variants={sDim} x1={950} y1={81} x2={950} y2={95} {...SW_DIM} />
      {/* Par de flechas izquierdo (apuntan ← y →, en x≈210–250) */}
      <motion.path variants={fDim} d="M210,88 L221,83 L221,93 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M250,88 L239,83 L239,93 Z" fill={C.dim} stroke="none" />
      {/* Par de flechas derecho — espejo exacto respecto a x=500 */}
      <motion.path variants={fDim} d="M790,88 L779,83 L779,93 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M750,88 L761,83 L761,93 Z" fill={C.dim} stroke="none" />

      {/* ── 3. Cota vertical (x=88) — simétrica, flechas en ambos extremos ─ */}
      <motion.line variants={sDim} x1={88} y1={50}  x2={88} y2={950} {...SW_DIM} />
      {/* Ticks extremos */}
      <motion.line variants={sDim} x1={81} y1={50}  x2={95} y2={50}  {...SW_DIM} />
      <motion.line variants={sDim} x1={81} y1={950} x2={95} y2={950} {...SW_DIM} />
      {/* Par de flechas superior (en y≈210–250) */}
      <motion.path variants={fDim} d="M88,210 L83,221 L93,221 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M88,250 L83,239 L93,239 Z" fill={C.dim} stroke="none" />
      {/* Par de flechas inferior — espejo exacto respecto a y=500 */}
      <motion.path variants={fDim} d="M88,790 L83,779 L93,779 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M88,750 L83,761 L93,761 Z" fill={C.dim} stroke="none" />

      {/* ── 4. Crosshairs en las 4 esquinas del marco — perfecta simetría ── */}
      {/* Esquina superior-izquierda (80, 80) */}
      <motion.line   variants={sDetails} x1={60}  y1={80}  x2={100} y2={80}  {...SW} />
      <motion.line   variants={sDetails} x1={80}  y1={60}  x2={80}  y2={100} {...SW} />
      <motion.circle variants={sDetails} cx={80}  cy={80}  r={10}             {...SW} />
      {/* Esquina superior-derecha (920, 80) */}
      <motion.line   variants={sDetails} x1={900} y1={80}  x2={940} y2={80}  {...SW} />
      <motion.line   variants={sDetails} x1={920} y1={60}  x2={920} y2={100} {...SW} />
      <motion.circle variants={sDetails} cx={920} cy={80}  r={10}             {...SW} />
      {/* Esquina inferior-izquierda (80, 920) */}
      <motion.line   variants={sDetails} x1={60}  y1={920} x2={100} y2={920} {...SW} />
      <motion.line   variants={sDetails} x1={80}  y1={900} x2={80}  y2={940} {...SW} />
      <motion.circle variants={sDetails} cx={80}  cy={920} r={10}             {...SW} />
      {/* Esquina inferior-derecha (920, 920) */}
      <motion.line   variants={sDetails} x1={900} y1={920} x2={940} y2={920} {...SW} />
      <motion.line   variants={sDetails} x1={920} y1={900} x2={920} y2={940} {...SW} />
      <motion.circle variants={sDetails} cx={920} cy={920} r={10}             {...SW} />

      {/* ── 5. Barra de escala — centrada en el borde inferior ────────────── */}
      <motion.line variants={sDetails} x1={430} y1={940} x2={570} y2={940} {...SW} />
      <motion.line variants={sDetails} x1={430} y1={934} x2={430} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={465} y1={934} x2={465} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={500} y1={934} x2={500} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={535} y1={934} x2={535} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={570} y1={934} x2={570} y2={946} {...SW} />
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
