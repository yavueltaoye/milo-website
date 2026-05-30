import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("uses the default pre-filled MILO message", () => {
    expect(buildWhatsAppUrl("51978919059")).toBe(
      "https://wa.me/51978919059?text=" +
        encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE),
    );
  });

  it("encodes a custom message (accents, commas, spaces)", () => {
    expect(buildWhatsAppUrl("51978919059", "Hola, año & café")).toBe(
      "https://wa.me/51978919059?text=" +
        encodeURIComponent("Hola, año & café"),
    );
  });

  it("omits text= when the message is empty", () => {
    expect(buildWhatsAppUrl("51978919059", "")).toBe(
      "https://wa.me/51978919059",
    );
  });

  it("strips non-digit characters from the phone", () => {
    expect(buildWhatsAppUrl("+51 978 919 059", "")).toBe(
      "https://wa.me/51978919059",
    );
  });
});
