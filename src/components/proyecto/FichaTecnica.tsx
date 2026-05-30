import type { Project } from "@/data/projects";

type FichaTecnicaProps = {
  project: Project;
};

/** Technical sheet for a project rendered as a definition list. */
export function FichaTecnica({ project }: FichaTecnicaProps) {
  const facts: { label: string; value: string }[] = [
    { label: "Tipo", value: project.type },
    { label: "Ubicación", value: project.loc },
    { label: "Año", value: project.year },
    { label: "Área", value: project.area },
    { label: "Estado", value: project.status },
    { label: "Cliente", value: project.client },
    { label: "Equipo", value: project.team },
    { label: "Fotografía", value: project.photographer },
  ];

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
