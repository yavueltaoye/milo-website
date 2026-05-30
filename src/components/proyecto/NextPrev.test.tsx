import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextPrev } from "./NextPrev";
import { PROJECTS } from "@/data/projects";

describe("NextPrev", () => {
  it("links to the next project in PROJECTS order", () => {
    const current = PROJECTS[0];
    const next = PROJECTS[1];
    render(<NextPrev current={current} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/proyectos/${next.slug}`);
    expect(screen.getByText(next.title)).toBeInTheDocument();
  });

  it("wraps from the last project to the first", () => {
    const current = PROJECTS[PROJECTS.length - 1];
    const first = PROJECTS[0];
    render(<NextPrev current={current} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/proyectos/${first.slug}`);
    expect(screen.getByText(first.title)).toBeInTheDocument();
  });
});
