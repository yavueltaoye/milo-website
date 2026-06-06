import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListaProyectosBIG } from "./ListaProyectosBIG";
import { PROJECTS } from "@/data/projects";

describe("ListaProyectosBIG", () => {
  it("renders all 12 project rows when the filter is Todos", () => {
    // Arrange / Act
    render(<ListaProyectosBIG filter="Todos" />);

    // Assert
    expect(screen.getAllByRole("listitem")).toHaveLength(PROJECTS.length);
    expect(PROJECTS).toHaveLength(12);
  });

  it("renders only the projects matching the active type filter", () => {
    // Arrange
    const expected = PROJECTS.filter((p) => p.type === "Vivienda");

    // Act
    render(<ListaProyectosBIG filter="Vivienda" />);

    // Assert
    expect(screen.getAllByRole("listitem")).toHaveLength(expected.length);
    for (const project of expected) {
      expect(
        screen.getByRole("heading", { name: project.title }),
      ).toBeInTheDocument();
    }
  });

  it("links each row to its project detail page", () => {
    // Arrange / Act
    render(<ListaProyectosBIG filter="Todos" />);

    // Assert
    const first = PROJECTS[0];
    expect(
      screen.getByRole("link", { name: new RegExp(first.title, "i") }),
    ).toHaveAttribute("href", `/proyectos/${first.slug}`);
  });
});
