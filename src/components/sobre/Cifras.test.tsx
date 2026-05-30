import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SITE } from "@/data/site";
import { Cifras } from "./Cifras";

describe("Cifras", () => {
  it("renders all five stats from SITE.stats", () => {
    render(<Cifras />);
    expect(SITE.stats).toHaveLength(5);
    for (const stat of SITE.stats) {
      expect(screen.getByText(stat.n)).toBeInTheDocument();
      expect(screen.getByText(stat.l)).toBeInTheDocument();
    }
  });
});
