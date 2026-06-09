"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type ProjectCarouselProps = {
  /** Ordered image URLs (hero first, then gallery). Length N — scales freely. */
  images: string[];
  /** Project title, used to build accessible image alt text. */
  title: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Fracción del desfase que se traslada la foto respecto al slide. Menor que el
// margen del overscale (scale-[1.15] ≈ 7.5%/lado) para no descubrir bordes.
const PARALLAX_FACTOR = 6;

/**
 * Horizontal, BIG-style image carousel. Fills its parent's height; each slide is
 * a full-bleed cover image with a subtle drag parallax (the photo trails the
 * slide). Drag/swipe (Embla), prev/next arrows, ←/→ keyboard, live counter and
 * dots. Honours reduced motion (no inertia, no parallax).
 */
export function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    dragFree: false,
    duration: reduced ? 0 : 24,
  });

  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    // Sync inicial diferido para no llamar setState dentro del cuerpo del efecto.
    const id = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Parallax: cada foto se traslada en sentido contrario a su desfase con el
  // viewport. Solo escribe DOM (transform), nunca estado.
  const applyParallax = useCallback(
    (api: EmblaCarouselType, eventName?: string) => {
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScroll = eventName === "scroll";

      api.scrollSnapList().forEach((snap, index) => {
        if (isScroll && !slidesInView.includes(index)) return;
        const diff = snap - scrollProgress;
        const layer = layersRef.current[index];
        if (layer) {
          layer.style.transform = `translateX(${diff * -PARALLAX_FACTOR}%)`;
        }
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi || reduced) return;
    const handler = (api: EmblaCarouselType, evt?: string) =>
      applyParallax(api, evt);
    applyParallax(emblaApi);
    emblaApi.on("scroll", handler);
    emblaApi.on("reInit", handler);
    emblaApi.on("slideFocus", handler);
    return () => {
      emblaApi.off("scroll", handler);
      emblaApi.off("reInit", handler);
      emblaApi.off("slideFocus", handler);
    };
  }, [emblaApi, reduced, applyParallax]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  const hasMany = images.length > 1;

  return (
    <div className="group relative h-full w-full overflow-hidden bg-milo-black">
      {/* Viewport */}
      <div
        ref={emblaRef}
        className="h-full w-full overflow-hidden"
        role="group"
        aria-roledescription="carrusel"
        aria-label={`Imágenes de ${title}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="flex h-full touch-pan-y">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative h-full min-w-0 flex-[0_0_100%] cursor-grab overflow-hidden active:cursor-grabbing"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${pad(i + 1)} de ${pad(images.length)}`}
            >
              <div
                ref={(el) => {
                  layersRef.current[i] = el;
                }}
                className="relative h-full w-full will-change-transform"
              >
                <Image
                  src={src}
                  alt={`${title} — imagen ${i + 1}`}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="scale-[1.15] select-none object-cover"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasMany && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label="Imagen anterior"
            className={cn(
              "absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full",
              "bg-milo-white/85 text-petroleum backdrop-blur-sm transition",
              "hover:bg-milo-white disabled:pointer-events-none disabled:opacity-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-milo-white",
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            aria-label="Imagen siguiente"
            className={cn(
              "absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full",
              "bg-milo-white/85 text-petroleum backdrop-blur-sm transition",
              "hover:bg-milo-white disabled:pointer-events-none disabled:opacity-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-milo-white",
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Soft scrim to keep counter/dots legible on any photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-milo-black/45 to-transparent"
          />

          {/* Counter */}
          <div
            aria-live="polite"
            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.18em] text-milo-white tabular-nums [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
          >
            {pad(selected + 1)} <span className="opacity-60">/ {pad(images.length)}</span>
          </div>

          {/* Dots */}
          <div className="absolute bottom-[18px] right-5 z-10 hidden items-center gap-2 md:flex">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "h-1.5 rounded-full bg-milo-white transition-all duration-300",
                  i === selected ? "w-6 opacity-100" : "w-1.5 opacity-50 hover:opacity-80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
