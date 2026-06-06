import type { ReactElement } from "react";

/**
 * Monochrome project glyphs — one small pictogram per project, in the spirit of
 * the BIG.dk index. Pure inline SVG (no binary assets), drawn with `currentColor`
 * so they inherit the petroleum text tone and dim/brighten on hover with the row.
 *
 * Each mark is a reductive, geometric read of the project: a house for a home, a
 * plate for a restaurant, a grid for offices, a frame for an installation. When a
 * slug has no bespoke mark we fall back to a sensible per-type glyph.
 */

const SVG_PROPS = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Per-type fallbacks. */
const TYPE_GLYPHS: Record<string, ReactElement> = {
  Vivienda: (
    <svg {...SVG_PROPS}>
      <path d="M8 18 20 8l12 10" />
      <path d="M11 16v16h18V16" />
      <path d="M17 32v-8h6v8" />
    </svg>
  ),
  Interior: (
    <svg {...SVG_PROPS}>
      <path d="M8 30h24" />
      <path d="M11 30v-8h7v8" />
      <path d="M11 22l3.5-4h0" />
      <path d="M22 30v-13h7v13" />
    </svg>
  ),
  Gastronomía: (
    <svg {...SVG_PROPS}>
      <circle cx="20" cy="20" r="11" />
      <circle cx="20" cy="20" r="5" />
    </svg>
  ),
  Oficinas: (
    <svg {...SVG_PROPS}>
      <rect x="9" y="9" width="22" height="22" />
      <path d="M20 9v22M9 20h22" />
    </svg>
  ),
  Instalación: (
    <svg {...SVG_PROPS}>
      <rect x="9" y="9" width="22" height="22" />
      <path d="M9 16h22M9 24h22M16 9v22M24 9v22" />
    </svg>
  ),
};

/** Bespoke marks keyed by slug. */
const SLUG_GLYPHS: Record<string, ReactElement> = {
  // Casa Casuarinas — house with the planted roof as a fifth garden.
  casuarinas: (
    <svg {...SVG_PROPS}>
      <path d="M8 18 20 8l12 10" />
      <path d="M11 16v16h18V16" />
      <path d="M14 12c2 1.5 5 1.5 7 0M19 12c2 1.5 5 1.5 7 0" />
    </svg>
  ),
  // Oficinas Eurorenting — the 60cm reception grid.
  eurorenting: TYPE_GLYPHS.Oficinas,
  // Lesley Stuart — the kitchen as centre of gravity (island + counter).
  "lesley-stuart": (
    <svg {...SVG_PROPS}>
      <rect x="9" y="22" width="22" height="6" />
      <path d="M14 22v-9h12v9" />
      <path d="M9 25h22" />
    </svg>
  ),
  // Monótono — one restricted palette: the plate, taken to the limit.
  monotono: TYPE_GLYPHS.Gastronomía,
  // Sabrina — warmth without ornament: a soft seat profile.
  sabrina: (
    <svg {...SVG_PROPS}>
      <path d="M10 30v-9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v9" />
      <path d="M10 25h20" />
      <path d="M13 30v2M27 30v2" />
    </svg>
  ),
  // Casa República — the garden as the main room (house + horizon line).
  "casa-republica": (
    <svg {...SVG_PROPS}>
      <path d="M11 19 20 11l9 8" />
      <path d="M13 17v13h14V17" />
      <path d="M7 33h26" />
    </svg>
  ),
  // Cecilia Lizárraga — the suspended console floating off the wall.
  "cecilia-lizarraga": (
    <svg {...SVG_PROPS}>
      <rect x="9" y="17" width="22" height="7" />
      <path d="M14 24v3M26 24v3" />
      <path d="M20 17v7" />
    </svg>
  ),
  // Eliana — craft as the argument: a hand-knotted weave.
  eliana: (
    <svg {...SVG_PROPS}>
      <rect x="10" y="10" width="20" height="20" />
      <path d="M10 17h20M10 23h20M17 10v20M23 10v20" />
    </svg>
  ),
  // Quilmaná — the field through precision: an island under a thick edge.
  quilmana: (
    <svg {...SVG_PROPS}>
      <path d="M9 18h22l-2 4H11z" />
      <path d="M13 22v9M27 22v9" />
    </svg>
  ),
  // Tomo — darkness is the design: nested square rooms.
  tomo: (
    <svg {...SVG_PROPS}>
      <rect x="9" y="9" width="22" height="22" />
      <rect x="15" y="15" width="10" height="16" />
    </svg>
  ),
  // CasaCor 2026 — an ephemeral frame, a laboratory grid.
  casacor: TYPE_GLYPHS.Instalación,
  // Casa Trujillo — read the sun before the plan: house with deep eaves.
  trujillo: (
    <svg {...SVG_PROPS}>
      <path d="M6 18h28" />
      <path d="M9 18 20 9l11 9" />
      <path d="M12 18v14h16V18" />
    </svg>
  ),
};

type ProjectGlyphProps = {
  slug: string;
  type: string;
  className?: string;
};

/**
 * The mark for a project, BIG-style: a solid black square with the pictogram
 * knocked out in white (white stroke over black). Bespoke by slug, else by
 * type, else a neutral framed square.
 */
export function ProjectGlyph({ slug, type, className }: ProjectGlyphProps) {
  const glyph = SLUG_GLYPHS[slug] ??
    TYPE_GLYPHS[type] ?? (
      <svg {...SVG_PROPS}>
        <rect x="9" y="9" width="22" height="22" />
      </svg>
    );

  return (
    <span className={`home-glyph ${className ?? ""}`.trim()} aria-hidden="true">
      {glyph}
    </span>
  );
}
