import Link from "next/link";
import { Orbe } from "@/components/chrome/Orbe";

/** Branded 404: keeps the visitor inside the studio's world with a way back. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-milo-white px-6 text-center text-petroleum">
      <Orbe variant="petroleum" />

      <p className="t-eyebrow mb-6">Error 404</p>
      <h1 className="max-w-2xl text-balance text-3xl font-light leading-snug sm:text-4xl md:text-5xl">
        Esta página se nos perdió en el camino
      </h1>
      <p className="mt-6 max-w-md text-pretty text-base font-light leading-relaxed text-petroleum/70">
        Como ese restaurante escondido que cambió de dirección sin avisar. Te
        llevamos de vuelta a terreno conocido.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <Link href="/" className="btn btn--primary">
          Volver al inicio
        </Link>
        <Link href="/proyectos" className="btn btn--ghost">
          Ver los proyectos
        </Link>
      </div>
    </main>
  );
}
