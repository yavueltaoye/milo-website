import { describe, it, expect } from "vitest";
import { rotationVelocity, BASE_IDLE_SPEED } from "./useScrollRotation";

describe("rotationVelocity", () => {
  it("is 0 under reduced motion", () => {
    expect(rotationVelocity({ scrollDelta: 100, reducedMotion: true })).toBe(0);
  });

  it("idles downward (negative, non-zero) with no scroll", () => {
    const v = rotationVelocity({ scrollDelta: 0, reducedMotion: false });
    expect(v).toBe(-BASE_IDLE_SPEED);
    expect(v).toBeLessThan(0);
  });

  it("accelerates downward when scrolling down (delta > 0)", () => {
    const idle = rotationVelocity({ scrollDelta: 0, reducedMotion: false });
    const down = rotationVelocity({ scrollDelta: 120, reducedMotion: false });
    expect(down).toBeLessThan(idle); // more negative = faster downward
  });

  it("slows / reverses upward when scrolling up (delta < 0)", () => {
    const idle = rotationVelocity({ scrollDelta: 0, reducedMotion: false });
    const up = rotationVelocity({ scrollDelta: -120, reducedMotion: false });
    expect(up).toBeGreaterThan(idle);
  });
});
