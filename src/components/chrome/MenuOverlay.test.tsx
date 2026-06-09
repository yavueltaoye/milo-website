import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MenuOverlay } from "./MenuOverlay";

describe("MenuOverlay", () => {
  it("renders the destinations when open", () => {
    render(<MenuOverlay open onClose={() => {}} />);
    expect(
      screen.getByRole("link", { name: /sobre nosotros/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contacto/i })).toBeInTheDocument();
    // "Proyectos" se removió del menú: el home ya es el índice de proyectos.
    expect(
      screen.queryByRole("link", { name: /^proyectos$/i }),
    ).not.toBeInTheDocument();
  });

  it("points 'Contacto' to the WhatsApp url, opening in a new tab safely", () => {
    render(<MenuOverlay open onClose={() => {}} />);
    const contacto = screen.getByRole("link", { name: /contacto/i });
    expect(contacto).toHaveAttribute(
      "href",
      buildWhatsAppUrl(SITE.whatsappPhone),
    );
    expect(contacto).toHaveAttribute("target", "_blank");
    expect(contacto.getAttribute("rel")).toContain("noopener");
  });

  it("calls onClose when clicking the close button", () => {
    const onClose = vi.fn();
    render(<MenuOverlay open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when pressing Escape", () => {
    const onClose = vi.fn();
    render(<MenuOverlay open onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders an inactive EN language selector", () => {
    render(<MenuOverlay open onClose={() => {}} />);
    const en = screen.getByText("EN");
    expect(en).toHaveAttribute("aria-disabled", "true");
  });
});
