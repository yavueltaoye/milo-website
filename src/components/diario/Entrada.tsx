import type { JournalEntry } from "@/data/journal";

type EntradaProps = {
  entry: JournalEntry;
};

/**
 * A single Diario entry rendered as an editorial article: eyebrow tag + date,
 * a large title, and the body paragraphs in a readable prose column.
 */
export function Entrada({ entry }: EntradaProps) {
  return (
    <article className="detail__head">
      <header>
        <span className="t-eyebrow">
          {entry.tag} · {entry.date}
        </span>
        <h1 className="detail__title">{entry.title}</h1>
      </header>
      <div className="detail__copy mt-12">
        {entry.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
