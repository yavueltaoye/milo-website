import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavHome } from "./NavHome";
import { PROJECT_TYPES } from "@/data/projects";

describe("NavHome", () => {
  it("renders a filter button for every project type", () => {
    render(<NavHome filter="Todos" onFilter={() => {}} />);
    for (const type of PROJECT_TYPES) {
      expect(screen.getByRole("button", { name: type })).toBeInTheDocument();
    }
  });

  it("marks the active filter with aria-pressed", () => {
    render(<NavHome filter="Vivienda" onFilter={() => {}} />);
    expect(screen.getByRole("button", { name: "Vivienda" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onFilter with the chosen type when a filter is clicked", () => {
    const onFilter = vi.fn();
    render(<NavHome filter="Todos" onFilter={onFilter} />);

    fireEvent.click(screen.getByRole("button", { name: "Gastronomía" }));

    expect(onFilter).toHaveBeenCalledWith("Gastronomía");
  });

  it("exposes the logo as a home link and a menu trigger", () => {
    render(<NavHome filter="Todos" onFilter={() => {}} />);
    expect(screen.getByRole("link", { name: /inicio/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("button", { name: /abrir menú/i }),
    ).toBeInTheDocument();
  });
});
