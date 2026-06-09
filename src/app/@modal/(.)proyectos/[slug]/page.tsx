import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { ProjectModal } from "@/components/proyecto/ProjectModal";

type InterceptedProjectProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Ruta interceptora: cuando se navega a `/proyectos/[slug]` desde el home
 * (navegación suave), este slot `@modal` se monta sobre el índice como popup.
 * En enlace directo o refresh la intercepción no ocurre y se sirve la página
 * completa de `src/app/proyectos/[slug]/page.tsx`.
 */
export default async function InterceptedProjectModal({
  params,
}: InterceptedProjectProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectModal project={project} />;
}
