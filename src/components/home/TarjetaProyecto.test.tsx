import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TarjetaProyecto } from "./TarjetaProyecto";
import { PROJECTS } from "@/data/projects";

describe("TarjetaProyecto", () => {
  const project = PROJECTS[0];

  it("renders the project title", () => {
    render(<TarjetaProyecto project={project} />);
    expect(screen.getByText(project.title)).toBeInTheDocument();
  });

  it("links to the project detail page", () => {
    render(<TarjetaProyecto project={project} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/proyectos/${project.slug}`);
  });
});
