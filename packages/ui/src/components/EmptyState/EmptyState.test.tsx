import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import styles from "./EmptyState.module.css";

describe("EmptyState", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders title, description, and action", () => {
    render(
      <EmptyState
        title="No workflows yet."
        description="Create your first workflow to generate test cases from documents."
        action={<button type="button">Create workflow</button>}
      />,
    );
    expect(screen.getByText("No workflows yet.")).toBeInTheDocument();
    expect(screen.getByText(/Create your first workflow/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create workflow" })).toBeInTheDocument();
  });

  it("defaults to md and switches to the sm inline variant", () => {
    const { container, rerender } = render(<EmptyState title="No runs yet." description="Runs appear after the first window." />);
    expect(container.firstElementChild).toHaveClass(styles.md!);

    rerender(<EmptyState size="sm" title="No runs yet." description="Runs appear after the first window." />);
    expect(container.firstElementChild).toHaveClass(styles.sm!);
  });

  it("warns in dev when the title ends with an exclamation mark", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<EmptyState title="No workflows yet!" description="Create one to get started." />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("exclamation"));
  });

  it("warns in dev when the title contains 'Oops'", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<EmptyState title="Oops, nothing here." description="Items appear once created." />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Oops"));
  });

  it("does not warn for copy that follows the formula", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<EmptyState title="No jobs match 'MDMR'." description="Clear the search to see all 104 jobs." />);
    expect(warn).not.toHaveBeenCalled();
  });
});
