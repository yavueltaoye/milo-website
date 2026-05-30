"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Linear proximity falloff. Returns 1 at the center, 0 at/after `radius`.
 * Pure function — easy to unit test.
 */
export function proximityFactor(distance: number, radius: number): number {
  if (radius <= 0) return 0;
  const t = 1 - distance / radius;
  return Math.max(0, Math.min(1, t));
}

export type ProximityStyle = { scale: number; brightness: number };

/** Map a proximity factor to a dock-like scale + brightness style. */
export function proximityStyle(factor: number): ProximityStyle {
  return { scale: 1 + factor * 0.35, brightness: 1 - factor * 0.25 };
}

/**
 * Wires a pointermove listener (rAF-throttled) and applies a proximity-based
 * scale + brightness to each direct child of the ref'd element, based on the
 * 2D distance from the cursor to each child's center. Disabled under
 * prefers-reduced-motion.
 */
export function useProximity<T extends HTMLElement>(radius = 220) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      frame = 0;
      const children = Array.from(el.children) as HTMLElement[];
      for (const child of children) {
        const r = child.getBoundingClientRect();
        const dx = lastX - (r.left + r.width / 2);
        const dy = lastY - (r.top + r.height / 2);
        const f = proximityFactor(Math.hypot(dx, dy), radius);
        const { scale, brightness } = proximityStyle(f);
        child.style.transform = `scale(${scale})`;
        child.style.filter = `brightness(${brightness})`;
      }
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [radius, reduced]);

  return ref;
}
