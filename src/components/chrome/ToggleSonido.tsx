"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/audio";
import { cn } from "@/lib/utils";

type ToggleSonidoProps = {
  className?: string;
};

/** Round audio mute/unmute button, fixed bottom-right. */
export function ToggleSonido({ className }: ToggleSonidoProps) {
  const { enabled, toggle } = useAudio();
  const label = enabled ? "Silenciar sonido" : "Activar sonido";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={enabled}
      className={cn(
        "fixed bottom-5 right-(--gutter) z-50 flex h-11 w-11 items-center justify-center",
        "rounded-full border border-ivory/40 bg-petroleum/40 text-ivory backdrop-blur-md",
        "cursor-pointer transition-opacity duration-200 hover:opacity-70",
        "md:bottom-5 bottom-8",
        className,
      )}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" aria-hidden="true" />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
