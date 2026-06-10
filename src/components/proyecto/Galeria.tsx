"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { blurMap } from "@/data/blurMap";

type GaleriaProps = {
  images: string[];
  title: string;
};

const SHAPES = [
  { className: "g--tall", aspect: "aspect-[4/5]", sizes: "(max-width: 768px) 100vw, 42vw" },
  { className: "g--wide", aspect: "aspect-[16/10]", sizes: "(max-width: 768px) 100vw, 58vw" },
  { className: "g--sq", aspect: "aspect-square", sizes: "(max-width: 768px) 100vw, 42vw" },
] as const;

/** Three-image project gallery on a 12-column grid with a staggered reveal. */
export function Galeria({ images, title }: GaleriaProps) {
  const ref = useStaggerReveal<HTMLElement>();

  return (
    <section ref={ref} className="detail__gallery" aria-label="Galería">
      {images.map((src, i) => {
        const shape = SHAPES[i] ?? SHAPES[SHAPES.length - 1];
        return (
          <div key={src} className={cn("relative", shape.className, shape.aspect)}>
            <Image
              src={src}
              alt={`${title} — imagen ${i + 1}`}
              fill
              sizes={shape.sizes}
              className="gallery-img"
              placeholder={blurMap[src] ? "blur" : "empty"}
              blurDataURL={blurMap[src]}
            />
          </div>
        );
      })}
    </section>
  );
}
