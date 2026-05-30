import Link from "next/link";
import { JOURNAL, type JournalEntry } from "@/data/journal";

type ListadoProps = {
  entries?: JournalEntry[];
};

/**
 * The Diario index: each journal entry as a grid row that links to its
 * detail page. Reuses the design-system `.entry` classes.
 */
export function Listado({ entries = JOURNAL }: ListadoProps) {
  return (
    <ul className="journal__list">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link href={`/diario/${entry.slug}`} className="entry">
            <span className="entry__date">{entry.date}</span>
            <span className="entry__code">{entry.code}</span>
            <h2 className="entry__title">{entry.title}</h2>
            <span className="entry__tag">{entry.tag}</span>
            <span className="entry__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
