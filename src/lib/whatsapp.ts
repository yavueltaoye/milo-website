export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola Milo, vengo de tu web y me gustaría conversar sobre un proyecto que tengo en mente.";

/**
 * Build a wa.me deep link.
 * Defaults to the MILO pre-filled message. Pass "" to omit the text param.
 * Non-digit characters in the phone are stripped.
 */
export function buildWhatsAppUrl(
  phone: string,
  message: string = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
