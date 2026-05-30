import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { IndiceProyectos } from "./IndiceProyectos";
import { PROJECTS } from "@/data/projects";

describe("IndiceProyectos", () => {
  it("renders all 12 project rows by default", () => {
    render(<IndiceProyectos />);
    const body = screen.getAllByRole("rowgroup")[1]; // tbody
    expect(within(body).getAllByRole("row")).toHaveLength(PROJECTS.length);
    expect(PROJECTS).toHaveLength(12);
  });

  it("filters to only Vivienda projects when the Vivienda chip is clicked", () => {
    render(<IndiceProyectos />);
    fireEvent.click(screen.getByRole("button", { name: /^vivienda$/i }));

    const expected = PROJECTS.filter((p) => p.type === "Vivienda");
    const body = screen.getAllByRole("rowgroup")[1];
    expect(within(body).getAllByRole("row")).toHaveLength(expected.length);

    for (const project of expected) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it("updates the count when filtering", () => {
    render(<IndiceProyectos />);
    const vivienda = PROJECTS.filter((p) => p.type === "Vivienda").length;
    fireEvent.click(screen.getByRole("button", { name: /^vivienda$/i }));
    expect(screen.getByText(new RegExp(`\\b${vivienda}\\b`))).toBeInTheDocument();
  });

  it("restores all 12 rows when Todos is clicked", () => {
    render(<IndiceProyectos />);
    fireEvent.click(screen.getByRole("button", { name: /^vivienda$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^todos$/i }));
    const body = screen.getAllByRole("rowgroup")[1];
    expect(within(body).getAllByRole("row")).toHaveLength(PROJECTS.length);
  });
});
