import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToggleVista } from "./ToggleVista";

describe("ToggleVista", () => {
  it("calls onChange('list') when clicking 'list'", () => {
    const onChange = vi.fn();
    render(<ToggleVista value="spiral" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /list/i }));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("calls onChange('spiral') when clicking 'spiral'", () => {
    const onChange = vi.fn();
    render(<ToggleVista value="list" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /spiral/i }));
    expect(onChange).toHaveBeenCalledWith("spiral");
  });

  it("marks the active value", () => {
    render(<ToggleVista value="spiral" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /spiral/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: /list/i })).not.toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
