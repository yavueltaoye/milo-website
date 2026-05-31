"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/projects";

/**
 * The "list" view of the home: ONLY the project names, centered on the same
 * dark surface (no constellation, no data table) — faithful to the reference.
 * Colour is set inline because the design-system `a { color: petroleum }` rule
 * is unlayered and would otherwise beat Tailwind's layered `text-*` utilities.
 */
export function ListaTitulos() {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-milo-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--milo-petroleum) 1px, transparent 1px), linear-gradient(90deg, var(--milo-petroleum) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <ul className="relative flex flex-col items-center gap-1 text-center">
        {PROJECTS.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/proyectos/${project.slug}`}
              style={{ color: "var(--milo-ivory)" }}
              className="block font-light leading-[1.18] tracking-tight text-[clamp(1.75rem,3.4vw,2.75rem)] opacity-90 transition-opacity duration-300 hover:opacity-100"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
