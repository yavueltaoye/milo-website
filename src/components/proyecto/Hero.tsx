import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { blurMap } from "@/data/blurMap";

type HeroProps = {
  project: Project;
};

/**
 * Project detail header: breadcrumb back to the index, eyebrow ({type} · {year}),
 * title, a short lede drawn from the first body paragraph, and the 16:9 hero image.
 */
export function Hero({ project }: HeroProps) {
  return (
    <header>
      <nav className="detail__crumb" aria-label="Migas de pan">
        <Link href="/proyectos">Proyectos</Link>
        <span className="sep" aria-hidden="true">
          /
        </span>
        <span>{project.title}</span>
      </nav>

      <div className="detail__head">
        <span className="t-eyebrow">
          {project.type} · {project.year}
        </span>
        <h1 className="detail__title">{project.title}</h1>
        <p className="detail__sub">{project.body[0]}</p>
      </div>

      <figure className="detail__hero">
        <Image
          src={project.hero}
          alt={project.title}
          width={1600}
          height={900}
          priority
          sizes="100vw"
          className="detail__hero-img"
          placeholder={blurMap[project.hero] ? "blur" : "empty"}
          blurDataURL={blurMap[project.hero]}
        />
      </figure>
    </header>
  );
}
