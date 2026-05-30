import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type OrbeVariant = "ivory" | "petroleum";

const SRC: Record<OrbeVariant, string> = {
  ivory: "/assets/iso-ivory.png",
  petroleum: "/assets/iso-primary.png",
};

type OrbeProps = {
  /** Mark color: ivory for dark backgrounds (default), petroleum for light. */
  variant?: OrbeVariant;
  className?: string;
};

/** The MILO iso mark, fixed top-left, linking home. */
export function Orbe({ variant = "ivory", className }: OrbeProps) {
  return (
    <Link
      href="/"
      aria-label="MILO — inicio"
      className={cn(
        "fixed left-(--gutter) top-5 z-50 block transition-opacity duration-200 hover:opacity-70",
        className,
      )}
    >
      <Image
        src={SRC[variant]}
        alt=""
        width={44}
        height={44}
        priority
        className="h-11 w-11 select-none"
      />
    </Link>
  );
}
