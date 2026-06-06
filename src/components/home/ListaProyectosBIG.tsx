"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, type Project } from "@/data/projects";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { ProjectGlyph } from "./glyphs";

type ListaProyectosBIGProps = {
  /** Active project-type filter ("Todos" = all). */
  filter: string;
};

/**
 * The home, BIG-style: a calm, image-led scroll. Each project is a centred
 * image with its meta (glyph · title · location) hung to the left, right-aligned
 * and hugging the image — exactly the BIG mechanism (the image is the in-flow,
 * centred element; the meta is absolutely positioned beside it). Rows reveal
 * with a soft fade-up as they enter the viewport. The list reacts to the type
 * filter set in the nav.
 */
export function ListaProyectosBIG({ filter }: ListaProyectosBIGProps) {
  const rows = useMemo<Project[]>(
    () =>
      filter === "Todos"
        ? PROJECTS
        : PROJECTS.filter((project) => project.type === filter),
    [filter],
  );

  return (
    <section className="home-list" aria-label="Proyectos">
      <ul className="home-list__items">
        {rows.map((project, index) => (
          <ProjectRow key={project.slug} project={project} eager={index === 0} />
        ))}
      </ul>
    </section>
  );
}

type ProjectRowProps = {
  project: Project;
  eager: boolean;
};

function ProjectRow({ project, eager }: ProjectRowProps) {
  const revealRef = useStaggerReveal<HTMLLIElement>();

  return (
    <li ref={revealRef} className="home-row-item">
      <Link href={`/proyectos/${project.slug}`} className="home-row">
        <div className="home-row__stage">
          <div className="home-row__meta">
            <ProjectGlyph slug={project.slug} type={project.type} />
            <div className="home-row__text">
              <h2 className="home-row__title">{project.title}</h2>
              <p className="home-row__loc">{project.loc}</p>
            </div>
          </div>

          <div className="home-row__media">
            <Image
              src={project.hero}
              alt=""
              fill
              priority={eager}
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover"
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
