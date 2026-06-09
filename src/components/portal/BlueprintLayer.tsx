"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Curvas ────────────────────────────────────────────────────────────────────

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO:  [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Paleta — ivory sobre negro, muy contenido (6–13 %) ──────────────────────

const C = {
  grid:  "rgba(237,242,208,0.06)",   // grilla fina
  major: "rgba(237,242,208,0.09)",   // grilla major (cada 5ª línea)
  line:  "rgba(237,242,208,0.12)",   // marco + detalles
  dim:   "rgba(237,242,208,0.13)",   // líneas de cota (ligeramente más visibles)
} as const;

// ─── Timings ──────────────────────────────────────────────────────────────────
//
//  El blueprint empieza a dibujarse ANTES que el lockup MILO para que el logo
//  aparezca ya sobre una hoja completa, como si el arquitecto lo hubiera trazado.
//
//  t = 0.15s  Grilla: fade-in (0.8s EASE_QUART)
//  t = 0.33s  Marco inset: se dibuja (1.1s EASE_EXPO)
//  t = 0.51s  Líneas de cota + ticks
//  t = 0.69s  Crosshair + barra de escala
//  t ≈ 1.02s  Logo MILO aterrizado (staggerContainer del portal)

const T = { GRID: 0.15, FRAME: 0.33, DIM: 0.51, DETAILS: 0.69 } as const;

// ─── Factories de variantes ────────────────────────────────────────────────────

/** Líneas y formas con trazo: se dibujan mediante pathLength 0→1. */
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

/** Formas rellenas (flechas): aparecen con fade. */
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

// ─── SVG del plano ─────────────────────────────────────────────────────────────
//
//  viewBox 1000×1000 (unidades abstractas). Todos los elementos viven en los
//  márgenes (≥8 % desde los bordes) y nunca invaden la zona central del lockup.
//
//  Elementos:
//   1. Marco inset  — la "hoja de trabajo" del arquitecto
//   2. Cota H       — línea de dimensión horizontal con ticks y flechas (margen superior)
//   3. Cota V       — línea de dimensión vertical con ticks y flechas (margen izquierdo)
//   4. Crosshair    — marca de registro, esquina inferior derecha
//   5. Barra escala — graphic scale, esquina inferior izquierda

function BlueprintSvg() {
  const sFrame   = drawAt(T.FRAME);
  const sDim     = drawAt(T.DIM);
  const fDim     = fadeAt(T.DIM + 0.6); // flechas: aparecen cuando las cotas ya están trazadas
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

      {/* ── 2. Cota horizontal (top, y=88) ───────────────────────────────── */}
      {/* Línea principal */}
      <motion.line variants={sDim} x1={50}  y1={88} x2={950} y2={88} {...SW_DIM} />
      {/* Ticks extremos */}
      <motion.line variants={sDim} x1={50}  y1={81} x2={50}  y2={95} {...SW_DIM} />
      <motion.line variants={sDim} x1={950} y1={81} x2={950} y2={95} {...SW_DIM} />
      {/* Flechas en el tercio izquierdo — lejos del lockup centrado */}
      <motion.path variants={fDim} d="M210,88 L221,83 L221,93 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M250,88 L239,83 L239,93 Z" fill={C.dim} stroke="none" />

      {/* ── 3. Cota vertical (left, x=88) ────────────────────────────────── */}
      {/* Línea principal */}
      <motion.line variants={sDim} x1={88} y1={50}  x2={88} y2={950} {...SW_DIM} />
      {/* Ticks extremos */}
      <motion.line variants={sDim} x1={81} y1={50}  x2={95} y2={50}  {...SW_DIM} />
      <motion.line variants={sDim} x1={81} y1={950} x2={95} y2={950} {...SW_DIM} />
      {/* Flechas en el tercio superior — lejos del lockup centrado */}
      <motion.path variants={fDim} d="M88,210 L83,221 L93,221 Z" fill={C.dim} stroke="none" />
      <motion.path variants={fDim} d="M88,250 L83,239 L93,239 Z" fill={C.dim} stroke="none" />

      {/* ── 4. Crosshair / registration mark (esquina inf-derecha) ───────── */}
      <motion.line   variants={sDetails} x1={900} y1={920} x2={940} y2={920} {...SW} />
      <motion.line   variants={sDetails} x1={920} y1={900} x2={920} y2={940} {...SW} />
      <motion.circle variants={sDetails} cx={920} cy={920} r={10}            {...SW} />

      {/* ── 5. Barra de escala (esquina inf-izquierda) ────────────────────── */}
      <motion.line variants={sDetails} x1={60}  y1={940} x2={200} y2={940} {...SW} />
      <motion.line variants={sDetails} x1={60}  y1={934} x2={60}  y2={946} {...SW} />
      <motion.line variants={sDetails} x1={95}  y1={934} x2={95}  y2={946} {...SW} />
      <motion.line variants={sDetails} x1={130} y1={934} x2={130} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={165} y1={934} x2={165} y2={946} {...SW} />
      <motion.line variants={sDetails} x1={200} y1={934} x2={200} y2={946} {...SW} />
    </svg>
  );
}

// ─── Componente público ────────────────────────────────────────────────────────

/**
 * Capa de plano arquitectónico para el PortalBienvenida.
 *
 * Renderiza: una grilla de papel de calco (CSS) + elementos SVG animados
 * (marco, cotas, crosshair, barra de escala) que se "dibujan" antes de que
 * aparezca el lockup MILO, como trazos de un arquitecto sobre vellum.
 *
 * Decorativo: `aria-hidden`, `pointer-events-none`. No toca el árbol a11y.
 * Al subir el telón, sube con él automáticamente (es hijo del curtain).
 * Respeta `prefers-reduced-motion`: sin animación, estado final visible.
 */
export function BlueprintLayer() {
  const reduced = usePrefersReducedMotion();

  // Con reduced motion: estado "visible" desde el frame 0, sin interpolación.
  // Con animación: los hijos heredan "hidden" → animan a "visible" con sus delays.
  const init = reduced ? "visible" : "hidden";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={init}
      animate="visible"
    >
      {/* Grilla CSS — cheapísima, no requiere path animation */}
      <motion.div variants={gridFade} className="absolute inset-0">
        <div className="absolute inset-0" style={GRID_STYLE} />
      </motion.div>

      {/* Elementos SVG del plano */}
      <BlueprintSvg />
    </motion.div>
  );
}
