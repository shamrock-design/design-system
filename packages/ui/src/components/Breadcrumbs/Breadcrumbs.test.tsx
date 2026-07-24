import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders a labeled nav with links and a non-link current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Operate", href: "#operate" },
          { label: "Runs", href: "#runs" },
          { label: "Run 4211" },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Operate" })).toHaveAttribute("href", "#operate");
    const current = screen.getByText("Run 4211");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).toBe("SPAN");
    expect(screen.queryByRole("link", { name: "Run 4211" })).not.toBeInTheDocument();
  });

  it("renders onClick-only crumbs as buttons and fires the handler", async () => {
    const onClick = vi.fn();
    render(
      <Breadcrumbs
        items={[
          { label: "Model", onClick },
          { label: "Mapping" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Model" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("collapses trails deeper than 4 to first + … + last two, with the full trail as title", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "A", href: "#a" },
          { label: "B", href: "#b" },
          { label: "C", href: "#c" },
          { label: "D", href: "#d" },
          { label: "E" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(screen.queryByText("C")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "D" })).toBeInTheDocument();
    expect(screen.getByText("E")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("…")).toHaveAttribute("title", "A › B › C › D › E");
  });

  it("does not collapse a trail of exactly 4", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "A", href: "#a" },
          { label: "B", href: "#b" },
          { label: "C", href: "#c" },
          { label: "D" },
        ]}
      />,
    );
    expect(screen.queryByText("…")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "B" })).toBeInTheDocument();
  });
});
