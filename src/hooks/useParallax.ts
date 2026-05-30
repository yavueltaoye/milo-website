"use client";

/**
 * Pure parallax transform: maps a pointer offset from center (-1..1 on each
 * axis) to a translate/rotate, scaled by depth (0 = far/subtle, 1 = near/strong).
 * Unit-testable; the React wiring lives in components that need it.
 */
export function parallaxTransform(
  offsetX: number,
  offsetY: number,
  depth: number,
  maxShift = 24,
): { x: number; y: number } {
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  return {
    x: clamp(offsetX) * maxShift * depth,
    y: clamp(offsetY) * maxShift * depth,
  };
}
