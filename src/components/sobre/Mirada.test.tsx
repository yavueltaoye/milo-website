import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mirada } from "./Mirada";

describe("Mirada", () => {
  it("renders the image, eyebrow, and quote together", () => {
    render(
      <Mirada
        src="/images/projects/eliana/g1.jpg"
        alt="Detalle de mesa de noche en madera maciza"
        eyebrow="Departamento Eliana, Lima"
        quote="No puede verse ningún tornillo ni anclaje desde el frente."
      />,
    );

    expect(
      screen.getByAltText("Detalle de mesa de noche en madera maciza"),
    ).toBeInTheDocument();
    expect(screen.getByText("Departamento Eliana, Lima")).toBeInTheDocument();
    expect(
      screen.getByText("No puede verse ningún tornillo ni anclaje desde el frente."),
    ).toBeInTheDocument();
  });
});
