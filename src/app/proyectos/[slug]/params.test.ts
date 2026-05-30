import { describe, it, expect } from "vitest";
import { generateStaticParams } from "./page";
import { PROJECTS } from "@/data/projects";

describe("generateStaticParams", () => {
  it("returns one entry per project with a slug", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(12);
    expect(params).toHaveLength(PROJECTS.length);
    for (const entry of params) {
      expect(typeof entry.slug).toBe("string");
      expect(entry.slug.length).toBeGreaterThan(0);
    }
  });

  it("matches the slugs in PROJECTS", () => {
    const params = generateStaticParams();
    expect(params.map((p) => p.slug).sort()).toEqual(
      PROJECTS.map((p) => p.slug).sort(),
    );
  });
});
