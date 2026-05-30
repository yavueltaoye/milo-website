import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Listado } from "./Listado";
import { JOURNAL } from "@/data/journal";

describe("Listado", () => {
  it("renders all 6 journal entries as links to their detail page", () => {
    render(<Listado />);
    expect(JOURNAL).toHaveLength(6);
    for (const entry of JOURNAL) {
      const link = screen.getByRole("link", { name: new RegExp(entry.title) });
      expect(link).toHaveAttribute("href", `/diario/${entry.slug}`);
    }
  });

  it("includes the real CasaCor 2026 entry", () => {
    render(<Listado />);
    const link = screen.getByRole("link", { name: /CasaCor Perú 2026/ });
    expect(link).toHaveAttribute("href", "/diario/casacor-2026");
  });
});
