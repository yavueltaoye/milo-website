import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppContact } from "@/components/chrome/WhatsAppContact";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__rule" />
      <div className="footer__grid">
        <div>
          <Image
            className="footer__iso"
            src="/assets/iso-primary.png"
            alt="MILO"
            width={56}
            height={56}
          />
          <p className="footer__tag">
            Diseñamos espacios que se habitan con los sentidos.
          </p>
        </div>

        <nav className="footer__col">
          <span className="t-eyebrow">Navegación</span>
          <Link href="/proyectos">Proyectos</Link>
          <Link href="/sobre-nosotros">Sobre Nosotros</Link>
          <Link href="/diario">Diario</Link>
        </nav>

        <div className="footer__col">
          <span className="t-eyebrow">Contacto</span>
          <WhatsAppContact
            waUrl={buildWhatsAppUrl(SITE.whatsappPhone)}
            placement="above"
            popoverAlign="left"
          >
            WhatsApp
          </WhatsAppContact>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </div>

        <div className="footer__col">
          <span className="t-eyebrow">Estudio</span>
          <span>Lima, Perú</span>
          <span>Atención con cita previa</span>
        </div>
      </div>

      <div className="footer__base">
        <span>© 2026 {SITE.name}</span>
        <span>Hecho en Lima</span>
      </div>
    </footer>
  );
}
