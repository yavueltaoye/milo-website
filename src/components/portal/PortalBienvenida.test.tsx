import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { AudioProvider } from "@/lib/audio";
import { SITE } from "@/data/site";
import { PortalBienvenida } from "./PortalBienvenida";

// jsdom does not implement media playback; AudioProvider calls play()/.catch().
beforeAll(() => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  HTMLMediaElement.prototype.pause = () => {};
});

function renderPortal() {
  return render(
    <AudioProvider>
      <PortalBienvenida />
    </AudioProvider>,
  );
}

describe("PortalBienvenida", () => {
  it("renders the portal copy and the CTA button", () => {
    renderPortal();
    expect(screen.getByText(SITE.portalCopy)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: SITE.portalCta })).toBeInTheDocument();
  });

  it("renders the copy inside an <h1>", () => {
    renderPortal();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(SITE.portalCopy);
  });

  it("removes the portal after clicking the CTA (enter() sets entered)", async () => {
    renderPortal();
    const button = screen.getByRole("button", { name: SITE.portalCta });
    fireEvent.click(button);
    await waitForElementToBeRemoved(() => screen.queryByText(SITE.portalCopy));
    expect(screen.queryByText(SITE.portalCopy)).not.toBeInTheDocument();
  });
});
