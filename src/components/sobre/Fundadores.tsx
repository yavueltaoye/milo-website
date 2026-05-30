import Image from "next/image";
import { FOUNDERS } from "@/data/team";

/** Las fichas de los socios fundadores: retrato, nombre, rol, bio y su frase. */
export function Fundadores() {
  return (
    <section>
      <div className="studio__teamhead">
        <span>Los fundadores</span>
        <span>{FOUNDERS.length} socios</span>
      </div>
      <div className="studio__teamgrid">
        {FOUNDERS.map((founder) => (
          <article key={founder.name} className="tmember">
            <Image
              className="tmember__photo"
              src={founder.photo}
              alt={`Retrato de ${founder.name}`}
              width={640}
              height={640}
            />
            <h3>{founder.name}</h3>
            <p className="role">{founder.role}</p>
            <p className="bio">{founder.bio}</p>
            <p className="t-quote">{founder.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
