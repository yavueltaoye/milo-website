"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/projects";

/**
 * The "list" view of the home: just the project names, centered, over the SAME
 * dark constellation (which stays mounted behind). Mirrors the reference — no
 * separate page, no data table. Hovering a title brightens it and dims the rest.
 */
export function ListaTitulos() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-milo-black/45">
      <ul className="pointer-events-auto group/list flex flex-col items-center gap-1 text-center">
        {PROJECTS.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/proyectos/${project.slug}`}
              className="block font-light leading-[1.18] tracking-tight text-ivory text-[clamp(1.75rem,3.4vw,2.75rem)] opacity-80 transition-opacity duration-300 hover:opacity-100 group-hover/list:opacity-45 hover:!opacity-100"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
