import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FOUNDERS } from "@/data/team";
import { Fundadores } from "./Fundadores";

describe("Fundadores", () => {
  it("renders both founder names", () => {
    render(<Fundadores />);
    expect(screen.getByText("Michael Castro")).toBeInTheDocument();
    expect(screen.getByText("Jose Fernandez")).toBeInTheDocument();
  });

  it("renders the role of each founder", () => {
    render(<Fundadores />);
    const roles = screen.getAllByText("Socio fundador");
    expect(roles).toHaveLength(FOUNDERS.length);
  });
});
