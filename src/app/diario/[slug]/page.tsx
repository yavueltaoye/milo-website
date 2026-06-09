import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL } from "@/data/journal";
import { InteriorNav } from "@/components/chrome/InteriorNav";
import { Entrada } from "@/components/diario/Entrada";
import { Footer } from "@/components/Footer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return JOURNAL.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = JOURNAL.find((e) => e.slug === slug);
  if (!entry) return { title: "Diario" };

  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: { canonical: `/diario/${entry.slug}` },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.excerpt,
      url: `/diario/${entry.slug}`,
    },
  };
}

export default async function EntradaPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = JOURNAL.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <>
      <InteriorNav section="Diario" />
      <main className="detail">
        <Entrada entry={entry} />
        <p className="detail__crumb mt-16 mb-24">
          <Link href="/diario">← Volver al diario</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
