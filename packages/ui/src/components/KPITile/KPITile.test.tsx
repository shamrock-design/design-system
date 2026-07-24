import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KPITile } from "./KPITile";
import styles from "./KPITile.module.css";

describe("KPITile", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders label, value, and delta text", () => {
    render(<KPITile label="Avg duration" value="1h 21m" delta={{ text: "+35 min vs plan", sentiment: "negative" }} />);
    expect(screen.getByText("Avg duration")).toBeInTheDocument();
    expect(screen.getByText("1h 21m")).toBeInTheDocument();
    expect(screen.getByText("+35 min vs plan")).toBeInTheDocument();
  });

  it("colors the delta by sentiment, defaulting to neutral", () => {
    const { rerender } = render(<KPITile label="L" value="1" delta={{ text: "worse", sentiment: "negative" }} />);
    expect(screen.getByText("worse")).toHaveClass(styles.deltaNegative!);

    rerender(<KPITile label="L" value="1" delta={{ text: "better", sentiment: "positive" }} />);
    expect(screen.getByText("better")).toHaveClass(styles.deltaPositive!);

    rerender(<KPITile label="L" value="1" delta={{ text: "on plan" }} />);
    expect(screen.getByText("on plan")).toHaveClass(styles.deltaNeutral!);
  });

  it("warns and renders the no-baseline hint when delta is omitted", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<KPITile label="Runs" value="104" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no naked numbers"));
    expect(screen.getByText(/no baseline/)).toBeInTheDocument();
  });

  it("does not warn or hint when delta is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<KPITile label="Runs" value="104" delta={{ text: "+12 vs last week" }} />);
    expect(warn).not.toHaveBeenCalled();
    expect(screen.queryByText(/no baseline/)).not.toBeInTheDocument();
  });

  it("becomes a type=button with button semantics when onClick is given", async () => {
    const onClick = vi.fn();
    render(<KPITile label="Runs" value="104" delta={{ text: "+12 vs last week" }} onClick={onClick} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is not a button without onClick", () => {
    render(<KPITile label="Runs" value="104" delta={{ text: "+12 vs last week" }} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
