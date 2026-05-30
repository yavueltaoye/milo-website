import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("Footer", () => {
  it("renders navigation links to the interior pages", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /Proyectos/i }),
    ).toHaveAttribute("href", "/proyectos");
    expect(
      screen.getByRole("link", { name: /Sobre Nosotros/i }),
    ).toHaveAttribute("href", "/sobre-nosotros");
    expect(
      screen.getByRole("link", { name: /Diario/i }),
    ).toHaveAttribute("href", "/diario");
  });

  it("renders the WhatsApp link with the built deep link and safe target", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /WhatsApp/i });
    expect(link).toHaveAttribute(
      "href",
      buildWhatsAppUrl(SITE.whatsappPhone),
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("renders an email mailto link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: SITE.email });
    expect(link).toHaveAttribute("href", `mailto:${SITE.email}`);
  });

  it("renders the copyright text containing MILO", () => {
    render(<Footer />);
    expect(screen.getByText(/MILO/)).toBeInTheDocument();
  });
});
