import type { Project } from "@/data/projects";

type FichaTecnicaProps = {
  project: Project;
};

/** Technical sheet for a project rendered as a definition list. */
export function FichaTecnica({ project }: FichaTecnicaProps) {
  const facts = [
    { label: "Estado", value: project.status },
    { label: "Cliente", value: project.client },
    { label: "Equipo", value: project.team },
  ].filter((f) => f.value && f.value.toLowerCase() !== "privado");

  return (
    <div className="detail__facts">
      <dl>
        {facts.map((fact) => (
          <div key={fact.label} className="contents">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
