import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Momento } from "./Momento";

describe("Momento", () => {
  it("renders the image with its alt text and the credit caption", () => {
    render(
      <Momento
        src="/images/projects/quilmana/g2.jpg"
        alt="Cocina de Casa Quilmaná"
        credit="Casa Quilmaná — Cañete, 2025"
      />,
    );

    expect(screen.getByAltText("Cocina de Casa Quilmaná")).toBeInTheDocument();
    expect(screen.getByText("Casa Quilmaná — Cañete, 2025")).toBeInTheDocument();
  });
});
