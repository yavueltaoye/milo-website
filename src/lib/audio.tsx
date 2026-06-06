"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SITE } from "@/data/site";

type AudioState = {
  /** Whether ambient sound is currently playing. */
  enabled: boolean;
  /** Whether the user has entered the site (passed the portal). */
  entered: boolean;
  /** Enter the site and start ambient sound. Called by the portal CTA. */
  enter: () => void;
  /** Toggle ambient sound on/off. */
  toggle: () => void;
};

const Ctx = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  // Always starts as false — portal shows on every page load.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (enabled) {
      el.volume = 0.6;
      void el.play().catch(() => setEnabled(false));
    } else {
      el.pause();
    }
  }, [enabled]);

  const enter = () => {
    setEntered(true);
    setEnabled(true);
  };
  const toggle = () => setEnabled((v) => !v);

  return (
    <Ctx.Provider value={{ enabled, entered, enter, toggle }}>
      {/* Never autoplays: only starts after the user gesture in enter(). */}
      <audio ref={ref} src={SITE.audioSrc} loop preload="auto" />
      {children}
    </Ctx.Provider>
  );
}

export function useAudio(): AudioState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
}
