"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/lib/audio";
import { SITE } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * C3 — Portal de Bienvenida.
 *
 * Full-viewport entry screen shown before the constellation. While the user
 * has not yet "entered", it covers the viewport with the MILO mark, an
 * invitation, and a CTA that unlocks ambient audio. Clicking the CTA calls
 * {@link useAudio}'s `enter()`, which flips `entered`, animating the portal
 * out and unmounting it.
 */
export function PortalBienvenida() {
  const { entered, enter } = useAudio();
  const reduced = usePrefersReducedMotion();

  const exit = reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 };

  return (
    <AnimatePresence>
      {!entered ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Portal de bienvenida"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-10 bg-milo-black px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={exit}
          transition={{ duration: reduced ? 0 : 0.6, ease: "easeInOut" }}
        >
          <Image
            src="/assets/lockup-v-ivory.png"
            alt={SITE.name}
            width={160}
            height={200}
            priority
            className="h-auto w-32 select-none sm:w-40"
          />

          <h1 className="max-w-2xl text-balance text-2xl font-light leading-snug text-ivory sm:text-3xl md:text-4xl">
            {SITE.portalCopy}
          </h1>

          <button
            type="button"
            onClick={enter}
            className="rounded-full bg-ivory px-8 py-3.5 text-sm font-medium tracking-wide text-petroleum transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-milo-black"
          >
            {SITE.portalCta}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
