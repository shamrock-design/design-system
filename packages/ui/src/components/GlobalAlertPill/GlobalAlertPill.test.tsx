import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GlobalAlertPill } from "./GlobalAlertPill";

describe("GlobalAlertPill", () => {
  it("is a real button named by count + label, and fires onClick", async () => {
    const onClick = vi.fn();
    render(<GlobalAlertPill count={7} label="orphans detected" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "7 orphans detected" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders no dismiss button unless onDismiss is provided", () => {
    render(<GlobalAlertPill count={7} label="orphans detected" onClick={() => undefined} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders a sibling dismiss button that fires onDismiss without triggering onClick", async () => {
    const onClick = vi.fn();
    const onDismiss = vi.fn();
    render(<GlobalAlertPill count={7} label="orphans detected" onClick={onClick} onDismiss={onDismiss} />);
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    // buttons must be siblings, never nested
    expect(screen.getByRole("button", { name: "7 orphans detected" })).not.toContainElement(dismiss);
    await userEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("maps status onto the status token triad (default warning)", () => {
    const { rerender } = render(<GlobalAlertPill count={1} label="issue" onClick={() => undefined} />);
    let button = screen.getByRole("button", { name: "1 issue" });
    expect(button.parentElement).toHaveStyle({
      "--sh-alert-bg": "var(--sh-color-status-warning-bg)",
    });
    rerender(<GlobalAlertPill count={1} label="issue" status="critical" onClick={() => undefined} />);
    button = screen.getByRole("button", { name: "1 issue" });
    expect(button.parentElement).toHaveStyle({
      "--sh-alert-bg": "var(--sh-color-status-critical-bg)",
    });
  });
});
