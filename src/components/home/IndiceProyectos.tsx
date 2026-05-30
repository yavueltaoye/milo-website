"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  PROJECTS,
  PROJECT_TYPES,
  type Project,
  type ProjectStatus,
} from "@/data/projects";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  Construido: "status--construido",
  "En obra": "status--enobra",
  Proyecto: "status--proyecto",
};

/**
 * Editorial index of every project as a filterable table. Type chips narrow
 * the rows ("Todos" shows all 12) and the count reflects the active filter.
 * Each row navigates to the project detail; the title stays a real link so
 * the table is keyboard accessible.
 */
export function IndiceProyectos() {
  const [type, setType] = useState<string>("Todos");

  const rows = useMemo<Project[]>(
    () =>
      type === "Todos"
        ? PROJECTS
        : PROJECTS.filter((project) => project.type === type),
    [type],
  );

  return (
    <section className="projects pb-24">
      <div className="projects__filters">
        {PROJECT_TYPES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={cn("chip", option === type && "is-active")}
          >
            {option}
          </button>
        ))}
        <span className="projects__count">
          {rows.length} {rows.length === 1 ? "proyecto" : "proyectos"}
        </span>
      </div>

      <table className="projects__table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Proyecto</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th className="num">Año</th>
            <th className="num">Área</th>
            <th>Estado</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {rows.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const href = `/proyectos/${project.slug}`;

  return (
    <tr
      onClick={(event) => {
        // Forward bare row clicks to the title link so the whole row is a
        // hit target, while the link keeps the navigation accessible.
        if (event.target instanceof HTMLAnchorElement) return;
        linkRef.current?.click();
      }}
    >
      <td className="code">{project.code}</td>
      <td className="title">
        <Link
          ref={linkRef}
          href={href}
          className="underline-offset-4 hover:underline"
        >
          {project.title}
        </Link>
      </td>
      <td>{project.type}</td>
      <td>{project.loc}</td>
      <td className="num">{project.year}</td>
      <td className="num">{project.area}</td>
      <td>
        <span className={cn("status", STATUS_CLASS[project.status])}>
          {project.status}
        </span>
      </td>
      <td className="arrow" aria-hidden="true">
        →
      </td>
    </tr>
  );
}
