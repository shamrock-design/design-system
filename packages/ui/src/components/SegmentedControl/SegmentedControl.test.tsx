import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "ibp", label: "IBP" },
  { value: "ecc", label: "ECC" },
];

function pressed(name: string) {
  return screen.getByRole("button", { name }).getAttribute("aria-pressed");
}

describe("SegmentedControl", () => {
  it("selects the first option by default and switches on click (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} onValueChange={onValueChange} aria-label="Source" />);
    expect(pressed("All")).toBe("true");
    expect(pressed("IBP")).toBe("false");

    await userEvent.click(screen.getByRole("button", { name: "IBP" }));
    expect(pressed("IBP")).toBe("true");
    expect(pressed("All")).toBe("false");
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("ibp");
  });

  it("honors defaultValue", () => {
    render(<SegmentedControl options={OPTIONS} defaultValue="ecc" aria-label="Source" />);
    expect(pressed("ECC")).toBe("true");
  });

  it("never deselects: re-clicking the active segment is a no-op", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} onValueChange={onValueChange} aria-label="Source" />);
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(pressed("All")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports the controlled pattern", async () => {
    function Harness() {
      const [view, setView] = useState("all");
      return <SegmentedControl options={OPTIONS} value={view} onValueChange={setView} aria-label="Source" />;
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "ECC" }));
    expect(pressed("ECC")).toBe("true");
    expect(pressed("All")).toBe("false");
  });

  it("moves focus between segments with arrow keys", async () => {
    render(<SegmentedControl options={OPTIONS} aria-label="Source" />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "All" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "IBP" })).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(pressed("IBP")).toBe("true");
  });

  it("disables the whole group and individual options", async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <SegmentedControl options={OPTIONS} disabled onValueChange={onValueChange} aria-label="Disabled group" />
        <SegmentedControl
          options={[OPTIONS[0]!, { ...OPTIONS[1]!, disabled: true }]}
          onValueChange={onValueChange}
          aria-label="Partially disabled"
        />
      </>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    const partiallyDisabledIbp = buttons[4]!;
    expect(partiallyDisabledIbp).toBeDisabled();
    await userEvent.click(partiallyDisabledIbp).catch(() => undefined);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
