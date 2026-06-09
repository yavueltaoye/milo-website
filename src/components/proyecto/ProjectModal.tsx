"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectCarousel } from "./ProjectCarousel";
import { FichaTecnica } from "./FichaTecnica";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/components/SmoothScroll";

type ProjectModalProps = {
  project: Project;
};

/**
 * Popup de proyecto montado por la ruta interceptora `@modal`. Superpone el
 * índice con un carrusel horizontal (estilo BIG) y la ficha del proyecto. Cierra
 * con botón, backdrop, Escape o el botón Atrás del navegador (`router.back()`);
 * anima su salida antes de navegar. Bloquea el scroll de fondo (Lenis + body).
 */
export function ProjectModal({ project }: ProjectModalProps) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const lenisRef = useLenis();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), []);

  // Hero primero, luego galería; dedupe → soporta N imágenes.
  const images = useMemo(
    () => Array.from(new Set([project.hero, ...project.gallery])),
    [project.hero, project.gallery],
  );

  // Body scroll lock: se libera en cuanto open=false (no espera el desmontaje).
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Lenis: se detiene al montar el modal y se reanuda al desmontarlo
  // (después de que router.back() complete), sin interferir con la animación de salida.
  useEffect(() => {
    const lenis = lenisRef?.current;
    lenis?.stop();
    return () => { lenis?.start(); };
  }, [lenisRef]);

  // Foco inicial + trampa de foco + Escape para cerrar.
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [close]);

  const overlayTransition = { duration: reduced ? 0 : 0.24 };
  const panelInitial = reduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.985, y: 10 };
  const panelAnimate = reduced
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, y: 0 };
  const panelTransition = reduced
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <AnimatePresence onExitComplete={() => router.back()}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            aria-label="Cerrar el proyecto tocando fuera"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-petroleum/55 backdrop-blur-[3px]"
          />

          <div className="pointer-events-none absolute inset-0 flex items-stretch md:items-center md:justify-center md:p-6 lg:p-10">
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelInitial}
              transition={panelTransition}
              className="pointer-events-auto relative flex h-full w-full flex-col overflow-hidden bg-paper text-petroleum outline-none md:h-[min(860px,88vh)] md:w-[min(1240px,94vw)] md:flex-row md:rounded-3xl md:shadow-2xl"
            >
              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar proyecto"
                className="absolute right-4 top-4 z-20 flex min-h-[44px] items-center gap-2 rounded-full bg-milo-white/85 px-4 py-2 text-sm tracking-wide text-petroleum backdrop-blur-sm transition hover:bg-milo-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum"
              >
                close
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Carrusel */}
              <div className="relative h-[46vh] min-h-[260px] w-full shrink-0 md:h-auto md:min-h-0 md:w-[62%]">
                <ProjectCarousel images={images} title={project.title} />
              </div>

              {/* Información */}
              <div data-lenis-prevent className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-6 py-8 md:px-10 md:py-14">
                <header className="flex flex-col gap-3 pr-20">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-petroleum/75">
                    {project.code} · {project.type}
                  </span>
                  <h2
                    id={titleId}
                    className="text-balance text-3xl font-light leading-tight tracking-tight md:text-[2.5rem]"
                  >
                    {project.title}
                  </h2>
                  <p className="text-sm font-light text-petroleum/80">
                    {project.loc} · {project.year} · {project.area}
                  </p>
                </header>

                <FichaTecnica project={project} />

                <div className="flex flex-col gap-4">
                  {project.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[15px] font-light leading-relaxed text-petroleum/85"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <blockquote className="mt-2 border-t border-petroleum/15 pt-6 text-xl font-extralight italic leading-snug text-petroleum">
                  {project.quote}
                </blockquote>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
