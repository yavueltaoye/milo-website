import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { Hero } from "@/components/proyecto/Hero";
import { FichaTecnica } from "@/components/proyecto/FichaTecnica";
import { Galeria } from "@/components/proyecto/Galeria";
import { Cita } from "@/components/proyecto/Cita";
import { NextPrev } from "@/components/proyecto/NextPrev";
import { Footer } from "@/components/Footer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Proyecto" };

  const description = project.body[0];
  return {
    title: project.title,
    description,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `/proyectos/${project.slug}`,
      images: [{ url: project.hero, width: 1600, height: 900, alt: project.title }],
    },
    twitter: { card: "summary_large_image", images: [project.hero] },
  };
}

export default async function ProyectoPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <InteriorNav />
      <main className="detail">
        <Hero project={project} />

        <section className="detail__intro">
          <FichaTecnica project={project} />
          <div className="detail__copy">
            {project.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <p className="t-quote">{project.quote}</p>
          </div>
        </section>

        <Galeria images={project.gallery} title={project.title} />
        <Cita quote={project.quote} />
        <NextPrev current={project} />
      </main>
      <Footer />
    </>
  );
}
