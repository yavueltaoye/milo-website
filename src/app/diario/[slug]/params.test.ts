import { describe, it, expect } from "vitest";
import { generateStaticParams } from "./page";

describe("diario generateStaticParams", () => {
  it("returns all 6 slugs as { slug: string }", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(6);
    for (const p of params) {
      expect(typeof p.slug).toBe("string");
      expect(p.slug.length).toBeGreaterThan(0);
    }
  });

  it("includes the real casacor-2026 slug", () => {
    const slugs = generateStaticParams().map((p) => p.slug);
    expect(slugs).toContain("casacor-2026");
  });
});
