"use client";

import Image from "next/image";
import { blurMap } from "@/data/blurMap";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

type MomentoProps = {
  src: string;
  alt: string;
  credit: string;
};

/** Cinematic image break that punctuates the Sobre Nosotros narrative with a real project moment. */
export function Momento({ src, alt, credit }: MomentoProps) {
  const ref = useStaggerReveal<HTMLElement>();

  return (
    <figure ref={ref} className="studio__momento">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes="100vw"
        className="studio__momento-img"
        placeholder={blurMap[src] ? "blur" : "empty"}
        blurDataURL={blurMap[src]}
      />
      <figcaption className="studio__momento-cap">{credit}</figcaption>
    </figure>
  );
}
