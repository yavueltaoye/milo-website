/**
 * Canonical site origin used for absolute URLs (metadataBase, sitemap, robots,
 * Open Graph). Override per environment with NEXT_PUBLIC_SITE_URL; the fallback
 * is the studio's production domain (editable once the domain is confirmed).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://miloestudio.com";

/** Default social-share image: a strong project hero (1200×630-friendly crop). */
export const DEFAULT_OG_IMAGE = "/images/projects/casuarinas/hero.jpg";
