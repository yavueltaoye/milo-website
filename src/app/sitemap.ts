import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { JOURNAL } from "@/data/journal";
import { SITE_URL } from "@/lib/seo";

/** Full sitemap: the static sections plus every SSG project and journal entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/proyectos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/sobre-nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/diario`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}/proyectos/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const journalRoutes: MetadataRoute.Sitemap = JOURNAL.map((entry) => ({
    url: `${SITE_URL}/diario/${entry.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...journalRoutes];
}
