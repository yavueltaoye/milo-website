import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { PROJECTS } from "@/data/projects";
import { JOURNAL } from "@/data/journal";
import { SITE_URL } from "@/lib/seo";

describe("sitemap", () => {
  it("lists the static sections plus every project and journal entry", () => {
    const entries = sitemap();
    // 4 static routes + 12 projects + 6 journal entries
    expect(entries).toHaveLength(4 + PROJECTS.length + JOURNAL.length);
  });

  it("includes the home, a project and a journal URL as absolute origins", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/proyectos/${PROJECTS[0].slug}`);
    expect(urls).toContain(`${SITE_URL}/diario/${JOURNAL[0].slug}`);
  });

  it("emits only absolute URLs under the site origin", () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(`${SITE_URL}/`)).toBe(true);
    }
  });
});
