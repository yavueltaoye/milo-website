import Link from "next/link";
import { PROJECTS, type Project } from "@/data/projects";

type NextPrevProps = {
  current: Project;
};

/** Link to the next project in PROJECTS order, wrapping last → first. */
export function NextPrev({ current }: NextPrevProps) {
  const index = PROJECTS.findIndex((project) => project.slug === current.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <Link href={`/proyectos/${next.slug}`} className="detail__nextprev">
      <span className="arrow">Siguiente proyecto</span>
      <h3>{next.title}</h3>
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
