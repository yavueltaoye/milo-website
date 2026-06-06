"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Progressive-enhancement fade-up reveal.
 *
 * Content is ALWAYS visible by default (no gating). This hook:
 * 1. Checks if the element is already in the viewport on mount → if so, no
 *    animation needed, leave it visible.
 * 2. If it's below the fold AND IntersectionObserver is available AND the user
 *    hasn't requested reduced motion → add `.will-animate` (hides + prepares
 *    the transition) then `.is-active` when it scrolls into view.
 * 3. Under reduced motion or missing IO → content stays visible immediately.
 *
 * This guarantees SEO crawlers, headless renderers, and social-preview bots
 * always see all content, never a blank page.
 */
export function useStaggerReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No animation in reduced-motion or test/SSR environments.
    if (reduced || typeof IntersectionObserver === "undefined") return;

    // Check if already in viewport — if so, skip the animation entirely.
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    // Element is off-screen: set up the fade-up entrance.
    el.classList.add("will-animate");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-active");
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, reduced]);

  return ref;
}
