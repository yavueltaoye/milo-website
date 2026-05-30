import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type TarjetaProyectoProps = {
  project: Project;
};

/**
 * DOM card for the mobile / reduced-motion fallback of the constellation.
 * A 4:5 hero with the project code and title surfacing on hover, linking to
 * the project detail page. Not WebGL — plain markup so it always renders.
 */
export function TarjetaProyecto({ project }: TarjetaProyectoProps) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="tile group">
      <div className="tile__media relative overflow-hidden">
        <Image
          src={project.hero}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-milo-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-[11px] uppercase tracking-[0.14em] text-ivory/80">
            {project.code}
          </span>
          <span className="text-base font-medium leading-tight text-ivory">
            {project.title}
          </span>
        </div>
      </div>
    </Link>
  );
}
