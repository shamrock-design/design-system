import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("fires onClick and defaults to type=button", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is click-inert while loading but stays in the document with aria-busy", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button).catch(() => undefined);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("throws in dev when iconOnly lacks aria-label", () => {
    expect(() => render(<Button iconOnly>x</Button>)).toThrow(/aria-label/);
  });
});
