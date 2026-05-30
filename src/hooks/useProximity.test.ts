import { describe, it, expect } from "vitest";
import { proximityFactor, proximityStyle } from "./useProximity";

describe("proximityFactor", () => {
  it("is 1 at the center (distance 0)", () => {
    expect(proximityFactor(0, 220)).toBe(1);
  });

  it("is 0 at or beyond the radius", () => {
    expect(proximityFactor(220, 220)).toBe(0);
    expect(proximityFactor(400, 220)).toBe(0);
  });

  it("is ~0.5 at the midpoint", () => {
    expect(proximityFactor(110, 220)).toBeCloseTo(0.5, 5);
  });

  it("guards against a non-positive radius", () => {
    expect(proximityFactor(10, 0)).toBe(0);
  });
});

describe("proximityStyle", () => {
  it("scales up and darkens as the factor grows", () => {
    expect(proximityStyle(0)).toEqual({ scale: 1, brightness: 1 });
    expect(proximityStyle(1)).toEqual({ scale: 1.35, brightness: 0.75 });
  });
});
