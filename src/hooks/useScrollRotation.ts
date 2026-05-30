"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Base idle angular speed (radians/frame). Negative = downward tornado spin. */
export const BASE_IDLE_SPEED = 0.0016;
/** How strongly scroll delta modulates the spin. */
export const SCROLL_GAIN = 0.00012;

/**
 * Target angular velocity for the constellation.
 * - reducedMotion → 0 (no auto-rotation)
 * - scrollDelta 0 → idle downward spin (negative, non-zero) on web AND mobile
 * - scrollDelta > 0 (scroll down) → faster downward (more negative)
 * - scrollDelta < 0 (scroll up) → slower / reversed upward (greater than idle)
 * Pure function — unit tested.
 */
export function rotationVelocity({
  scrollDelta,
  reducedMotion,
}: {
  scrollDelta: number;
  reducedMotion: boolean;
}): number {
  if (reducedMotion) return 0;
  return -BASE_IDLE_SPEED - scrollDelta * SCROLL_GAIN;
}

/**
 * Tracks an accumulated rotation angle driven by wheel input over a base idle
 * downward spin, with inertial decay of the scroll contribution. Returns the
 * current angle (radians). Disabled (frozen at 0) under prefers-reduced-motion.
 */
export function useScrollRotation() {
  const reduced = usePrefersReducedMotion();
  const [angle, setAngle] = useState(0);
  const scrollDelta = useRef(0);

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    const tick = () => {
      const v = rotationVelocity({
        scrollDelta: scrollDelta.current,
        reducedMotion: false,
      });
      setAngle((a) => a + v);
      scrollDelta.current *= 0.9; // inertia: scroll contribution decays back to idle
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      scrollDelta.current += e.deltaY;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return angle;
}
