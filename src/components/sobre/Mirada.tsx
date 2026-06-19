"use client";

import Image from "next/image";
import { blurMap } from "@/data/blurMap";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

type MiradaProps = {
  src: string;
  alt: string;
  eyebrow: string;
  quote: string;
};

/** Asymmetric image-and-quote pairing — a close look at the obsession behind one detail. */
export function Mirada({ src, alt, eyebrow, quote }: MiradaProps) {
  const ref = useStaggerReveal<HTMLElement>();

  return (
    <section ref={ref} className="studio__mirada">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={1125}
        sizes="(max-width: 1024px) 100vw, 42vw"
        className="studio__mirada-img"
        placeholder={blurMap[src] ? "blur" : "empty"}
        blurDataURL={blurMap[src]}
      />
      <div className="studio__mirada-quote">
        <span className="t-eyebrow">{eyebrow}</span>
        <p className="t-quote">{quote}</p>
      </div>
    </section>
  );
}
