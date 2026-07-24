import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FolderTree, type TreeNode } from "./FolderTree";

/** Nested treeitem accessible names include descendant text — query by row label instead. */
function item(label: string): HTMLElement {
  return screen.getByText(label).closest('[role="treeitem"]') as HTMLElement;
}

const nodes: TreeNode[] = [
  {
    id: "a",
    label: "Alpha",
    count: 3,
    children: [
      { id: "a1", label: "Alpha one" },
      { id: "a2", label: "Alpha two", disabled: true },
    ],
  },
  {
    id: "b",
    label: "Beta",
    children: [{ id: "b1", label: "Beta one" }],
  },
  { id: "c", label: "Gamma" },
];

describe("FolderTree", () => {
  it("renders tree/treeitem/group roles and hides collapsed children", () => {
    render(<FolderTree nodes={nodes} defaultExpanded={["a"]} />);
    expect(screen.getByRole("tree", { name: "Folders" })).toBeInTheDocument();
    const items = screen.getAllByRole("treeitem");
    // a, a1, a2, b, c visible; b1 hidden (b collapsed)
    expect(items).toHaveLength(5);
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.queryByText("Beta one")).not.toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: /Alpha/, expanded: true })).toBeInTheDocument();
    expect(item("Beta")).toHaveAttribute("aria-expanded", "false");
  });

  it("renders count as trailing text and title for truncation", () => {
    render(<FolderTree nodes={nodes} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toHaveAttribute("title", "Alpha");
  });

  it("renders consistent machine-face level prefixes when levelPrefixes is set", () => {
    render(<FolderTree nodes={nodes} defaultExpanded={["a"]} levelPrefixes />);
    expect(screen.getAllByText("L1:")).toHaveLength(3); // a, b, c
    expect(screen.getAllByText("L2:")).toHaveLength(2); // a1, a2
  });

  it("selects on row click and reflects aria-selected (controlled)", async () => {
    function Harness() {
      const [selected, setSelected] = useState<string | null>(null);
      return <FolderTree nodes={nodes} selected={selected} onSelect={setSelected} />;
    }
    render(<Harness />);
    await userEvent.click(screen.getByText("Gamma"));
    expect(item("Gamma")).toHaveAttribute("aria-selected", "true");
    expect(item("Beta")).toHaveAttribute("aria-selected", "false");
  });

  it("caret click toggles expansion without selecting", async () => {
    const onSelect = vi.fn();
    const onExpandedChange = vi.fn();
    render(
      <FolderTree
        nodes={nodes}
        expanded={new Set<string>()}
        onExpandedChange={onExpandedChange}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByTestId("caret-a"));
    expect(onExpandedChange).toHaveBeenCalledOnce();
    expect([...onExpandedChange.mock.calls[0]![0]]).toEqual(["a"]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("supports uncontrolled expansion via defaultExpanded and row click expands closed parents", async () => {
    const onSelect = vi.fn();
    render(<FolderTree nodes={nodes} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Beta"));
    expect(screen.getByText("Beta one")).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("moves focus over visible nodes with ArrowUp/ArrowDown (roving tabindex)", async () => {
    render(<FolderTree nodes={nodes} defaultExpanded={["a"]} />);
    await userEvent.tab();
    const alpha = screen.getByRole("treeitem", { name: /Alpha/, expanded: true });
    expect(alpha).toHaveFocus();
    expect(alpha).toHaveAttribute("tabindex", "0");

    await userEvent.keyboard("{ArrowDown}");
    expect(item("Alpha one")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(item("Beta")).toHaveFocus();
    // b is collapsed → next visible is Gamma, not Beta one
    await userEvent.keyboard("{ArrowDown}");
    expect(item("Gamma")).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(item("Beta")).toHaveFocus();
  });

  it("ArrowRight expands then moves into children; ArrowLeft collapses then moves to parent", async () => {
    render(<FolderTree nodes={nodes} />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    const alpha = screen.getByRole("treeitem", { name: /Alpha/, expanded: true });
    expect(alpha).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(item("Alpha one")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(alpha).toHaveFocus(); // leaf → parent
    await userEvent.keyboard("{ArrowLeft}");
    expect(item("Alpha")).toHaveAttribute("aria-expanded", "false");
  });

  it("Enter selects the focused node", async () => {
    const onSelect = vi.fn();
    render(<FolderTree nodes={nodes} onSelect={onSelect} />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("c");
  });

  it("disabled nodes are focusable but not selectable", async () => {
    const onSelect = vi.fn();
    render(<FolderTree nodes={nodes} defaultExpanded={["a"]} onSelect={onSelect} />);
    const disabledItem = item("Alpha two");
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(disabledItem).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Alpha two"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
