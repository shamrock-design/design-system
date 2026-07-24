import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs, TabsPanel } from "./Tabs";

afterEach(cleanup);

const items = [
  { value: "overview", label: "Overview" },
  { value: "runs", label: "Runs", count: 128 },
  { value: "archive", label: "Archive", disabled: true },
];

describe("Tabs", () => {
  it("activates the first enabled item by default and switches panels on click", async () => {
    render(<Tabs items={items} renderPanel={(value) => <span>panel:{value}</span>} />);
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("panel:overview")).toBeInTheDocument();
    expect(screen.queryByText("panel:runs")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /Runs/ }));
    expect(screen.getByRole("tab", { name: /Runs/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("panel:runs")).toBeInTheDocument();
    expect(screen.queryByText("panel:overview")).not.toBeInTheDocument();
  });

  it("renders the count as a counter and moves activation with arrow keys", async () => {
    render(<Tabs items={items} />);
    expect(screen.getByText("128")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /Overview/ }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Runs/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Archive/ })).toHaveAttribute("aria-disabled", "true");
  });

  it("supports controlled value with onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} value="runs" onValueChange={onValueChange} />);
    expect(screen.getByRole("tab", { name: /Runs/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(screen.getByRole("tab", { name: /Overview/ }));
    expect(onValueChange).toHaveBeenCalledWith("overview");
    // still controlled to "runs"
    expect(screen.getByRole("tab", { name: /Runs/ })).toHaveAttribute("aria-selected", "true");
  });

  it("accepts TabsPanel children", () => {
    render(
      <Tabs items={items} defaultValue="runs">
        <TabsPanel value="overview">custom overview</TabsPanel>
        <TabsPanel value="runs">custom runs</TabsPanel>
      </Tabs>,
    );
    expect(screen.getByText("custom runs")).toBeInTheDocument();
    expect(screen.queryByText("custom overview")).not.toBeInTheDocument();
  });
});
