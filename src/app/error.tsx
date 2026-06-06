"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Route-level error boundary: a calm, on-brand recovery screen. */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Surface the error for monitoring; replace with a real logger in prod.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-milo-white px-6 text-center text-petroleum">
      <p className="t-eyebrow mb-6">Algo se interpuso</p>
      <h1 className="max-w-2xl text-balance text-3xl font-light leading-snug sm:text-4xl">
        Tuvimos un tropiezo cargando esto
      </h1>
      <p className="mt-6 max-w-md text-pretty text-base font-light leading-relaxed text-petroleum/70">
        Nada grave. Vuelve a intentarlo y, si insiste, escríbenos y lo
        resolvemos contigo.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <button type="button" onClick={reset} className="btn btn--primary">
          Reintentar
        </button>
        <Link href="/" className="btn btn--ghost">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
