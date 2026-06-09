"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Shares a ref to the live Lenis instance (or `null` under reduced motion /
 * before init) so overlays can pause/resume smooth scrolling — e.g. a modal
 * locking the background. A ref keeps consumers re-render-free.
 */
const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Ref to the active Lenis instance; read `.current` (null when disabled). */
export function useLenis(): RefObject<Lenis | null> | null {
  return useContext(LenisContext);
}

/** Wraps the app in Lenis smooth scrolling (disabled under reduced motion). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = instance;

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
