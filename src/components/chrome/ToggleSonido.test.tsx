import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AudioProvider } from "@/lib/audio";
import { ToggleSonido } from "./ToggleSonido";

// jsdom does not implement media playback; stub it so AudioProvider's effect
// (which calls play().catch(...)) does not throw.
beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

function renderToggle() {
  return render(
    <AudioProvider>
      <ToggleSonido />
    </AudioProvider>,
  );
}

describe("ToggleSonido", () => {
  it("starts muted (audio disabled) and reflects state in label/aria-pressed", () => {
    renderToggle();
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveAccessibleName(/activar sonido/i);
  });

  it("toggles state when clicked", () => {
    renderToggle();
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveAccessibleName(/silenciar sonido/i);
  });
});
