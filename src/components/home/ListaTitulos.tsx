"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, type Project } from "@/data/projects";

/**
 * The "list" view of the home: the project names on the same dark surface.
 * Hovering a name brightens it (white) while the rest dim, and the project's
 * photo — the same image shown in the spiral — fades in behind, centered.
 * Faithful to the reference. Colour is inline because the design-system
 * `a { color: petroleum }` rule beats Tailwind's layered text utilities.
 */
export function ListaTitulos() {
  const [hovered, setHovered] = useState<Project | null>(null);

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

      {/* Project photo that surfaces on hover, centered behind the names. */}
      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-[46vh] w-[34vw] max-w-[460px] overflow-hidden rounded-md opacity-85 shadow-2xl">
            <Image
              src={hovered.hero}
              alt=""
              fill
              sizes="460px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <ul className="relative z-10 flex flex-col items-center text-center">
        {PROJECTS.map((project) => {
          const isHovered = hovered?.slug === project.slug;
          const isDim = hovered !== null && !isHovered;
          return (
            <li key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                onMouseEnter={() => setHovered(project)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  color: isHovered ? "var(--milo-white)" : "var(--milo-ivory)",
                }}
                className={`block py-0.5 font-light leading-[1.18] tracking-tight text-[clamp(1.75rem,3.4vw,2.75rem)] transition-opacity duration-300 ${
                  isDim ? "opacity-25" : "opacity-95"
                }`}
              >
                {project.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
