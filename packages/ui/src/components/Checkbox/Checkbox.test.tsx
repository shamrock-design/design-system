import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles when the label text is clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Show inactive</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Show inactive" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.click(screen.getByText("Show inactive"));
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("toggles with Space when focused", async () => {
    render(<Checkbox>Notify me</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Notify me" });
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("supports the controlled pattern", async () => {
    function Harness() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          Controlled
        </Checkbox>
      );
    }
    render(<Harness />);
    const checkbox = screen.getByRole("checkbox", { name: "Controlled" });
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("exposes indeterminate as aria-checked=mixed and still reports clicks", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox indeterminate onCheckedChange={onCheckedChange}>
        Some selected
      </Checkbox>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Some selected" });
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("ignores interaction when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        Locked
      </Checkbox>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Locked" });
    await userEvent.click(screen.getByText("Locked")).catch(() => undefined);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });
});
