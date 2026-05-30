import { SITE } from "@/data/site";

/** La tira de cifras de MILO — años, proyectos, metros, ciudades, hitos. */
export function Cifras() {
  return (
    <section className="studio__numbers">
      {SITE.stats.map((stat) => (
        <div key={stat.l}>
          <span className="n">{stat.n}</span>
          <span className="l">{stat.l}</span>
        </div>
      ))}
    </section>
  );
}
