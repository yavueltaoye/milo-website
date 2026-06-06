import { describe, it, expect } from "vitest";
import { SITE_URL, DEFAULT_OG_IMAGE } from "./seo";

describe("seo", () => {
  it("exposes an absolute site origin with no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("points the default OG image at a real public asset path", () => {
    expect(DEFAULT_OG_IMAGE.startsWith("/")).toBe(true);
    expect(DEFAULT_OG_IMAGE).toMatch(/\.(jpe?g|png|webp|avif)$/i);
  });
});
