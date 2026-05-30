"use client";

import { cn } from "@/lib/utils";

export type Vista = "spiral" | "list";

type ToggleVistaProps = {
  value: Vista;
  onChange: (value: Vista) => void;
  className?: string;
};

const OPTIONS: { value: Vista; label: string }[] = [
  { value: "spiral", label: "spiral" },
  { value: "list", label: "list" },
];

/** Segmented text toggle ("spiral • list"), fixed top-center. */
export function ToggleVista({ value, onChange, className }: ToggleVistaProps) {
  return (
    <div
      className={cn(
        "fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 text-sm tracking-wide text-ivory",
        className,
      )}
    >
      {OPTIONS.map((option, index) => {
        const active = option.value === value;
        return (
          <span key={option.value} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-40">•</span>}
            <button
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => onChange(option.value)}
              className={cn(
                "cursor-pointer bg-transparent transition-opacity duration-200 hover:opacity-100",
                active ? "font-medium opacity-100" : "font-normal opacity-50",
              )}
            >
              {option.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
