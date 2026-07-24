import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

// No `globals: true` in vitest.config.ts, so RTL's auto-cleanup never registers.
afterEach(cleanup);
import { DataTable, type Column } from "./DataTable";
import { Pagination, paginationItems } from "./Pagination";

interface Row {
  id: string;
  name: string;
  count: number;
}

const rows: Row[] = [
  { id: "a", name: "Alpha", count: 1 },
  { id: "b", name: "Beta", count: 2 },
  { id: "c", name: "Gamma", count: 3 },
];

const columns: Column<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "count", header: "Count", mono: true, align: "right" },
];

const rowKey = (row: Row) => row.id;

describe("DataTable", () => {
  it("renders semantic table with default and custom cells", () => {
    const withRender: Column<Row>[] = [
      ...columns,
      { key: "custom", header: "Custom", render: (row) => `${row.name}!` },
    ];
    render(<DataTable columns={withRender} rows={rows} rowKey={rowKey} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByText("Alpha")).toBeInTheDocument(); // default row[key]
    expect(screen.getByText("Beta!")).toBeInTheDocument(); // custom render
  });

  it("renders 2-line cells with a sub line", () => {
    const twoLine: Column<Row>[] = [{ key: "name", header: "Name", sub: (row) => `sub-${row.id}`, subMono: true }];
    render(<DataTable columns={twoLine} rows={rows} rowKey={rowKey} />);
    expect(screen.getByText("sub-a")).toBeInTheDocument();
  });

  describe("sorting", () => {
    it("emits asc for an unsorted column and sets aria-sort on the active one", async () => {
      const onSortChange = vi.fn();
      const sortable: Column<Row>[] = [
        { key: "name", header: "Name", sortable: true },
        { key: "count", header: "Count", sortable: true },
      ];
      render(
        <DataTable
          columns={sortable}
          rows={rows}
          rowKey={rowKey}
          sort={{ key: "name", dir: "asc" }}
          onSortChange={onSortChange}
        />,
      );
      expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "ascending");
      expect(screen.getByRole("columnheader", { name: "Count" })).toHaveAttribute("aria-sort", "none");
      await userEvent.click(screen.getByRole("button", { name: "Count" }));
      expect(onSortChange).toHaveBeenCalledWith({ key: "count", dir: "asc" });
    });

    it("cycles asc → desc on the active column", async () => {
      const onSortChange = vi.fn();
      const { rerender } = render(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          sort={{ key: "name", dir: "asc" }}
          onSortChange={onSortChange}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: "Name" }));
      expect(onSortChange).toHaveBeenLastCalledWith({ key: "name", dir: "desc" });
      rerender(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          sort={{ key: "name", dir: "desc" }}
          onSortChange={onSortChange}
        />,
      );
      expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "descending");
      await userEvent.click(screen.getByRole("button", { name: "Name" }));
      expect(onSortChange).toHaveBeenLastCalledWith({ key: "name", dir: "asc" });
    });

    it("does not render a sort button for non-sortable columns", () => {
      render(<DataTable columns={columns} rows={rows} rowKey={rowKey} sort={{ key: "name", dir: "asc" }} />);
      expect(screen.queryByRole("button", { name: "Count" })).not.toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Count" })).not.toHaveAttribute("aria-sort");
    });
  });

  describe("selection", () => {
    it("marks the header checkbox indeterminate for a partial selection", () => {
      render(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          selection={{ selected: new Set(["a"]), onChange: vi.fn() }}
        />,
      );
      const selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
      expect(selectAll.indeterminate).toBe(true);
      expect(selectAll.checked).toBe(false);
    });

    it("select-all selects every row when partially selected, clears when all selected", async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          selection={{ selected: new Set(["a"]), onChange }}
        />,
      );
      await userEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
      expect(onChange).toHaveBeenLastCalledWith(new Set(["a", "b", "c"]));

      rerender(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          selection={{ selected: new Set(["a", "b", "c"]), onChange }}
        />,
      );
      const selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
      expect(selectAll.checked).toBe(true);
      expect(selectAll.indeterminate).toBe(false);
      await userEvent.click(selectAll);
      expect(onChange).toHaveBeenLastCalledWith(new Set());
    });

    it("toggles a single row into and out of the selection", async () => {
      const onChange = vi.fn();
      render(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          selection={{ selected: new Set(["a"]), onChange }}
        />,
      );
      const rowBoxes = screen.getAllByRole("checkbox", { name: "Select row" });
      await userEvent.click(rowBoxes[1]!); // "b" → add
      expect(onChange).toHaveBeenLastCalledWith(new Set(["a", "b"]));
      await userEvent.click(rowBoxes[0]!); // "a" → remove
      expect(onChange).toHaveBeenLastCalledWith(new Set());
    });
  });

  describe("expandable", () => {
    const expandable = (row: Row) => (row.id === "a" ? <div>Panel A</div> : null);

    it("only expandable rows get a chevron, and the panel toggles", async () => {
      render(<DataTable columns={columns} rows={rows} rowKey={rowKey} expandable={expandable} />);
      const toggles = screen.getAllByRole("button", { name: "Toggle row details" });
      expect(toggles).toHaveLength(1);
      expect(screen.queryByText("Panel A")).not.toBeInTheDocument();

      await userEvent.click(toggles[0]!);
      expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
      const panelCell = screen.getByText("Panel A").closest("td");
      expect(panelCell).toHaveAttribute("colspan", "3"); // 2 columns + chevron col

      await userEvent.click(toggles[0]!);
      expect(toggles[0]).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    });
  });

  describe("row click", () => {
    it("fires onRowClick for cell clicks but not for inner controls", async () => {
      const onRowClick = vi.fn();
      render(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          onRowClick={onRowClick}
          selection={{ selected: new Set(), onChange: vi.fn() }}
        />,
      );
      await userEvent.click(screen.getByText("Alpha"));
      expect(onRowClick).toHaveBeenCalledWith(rows[0]);
      onRowClick.mockClear();
      await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe("empty and loading", () => {
    it("renders the empty node across all columns when there are no rows", () => {
      render(<DataTable columns={columns} rows={[]} rowKey={rowKey} empty={<div>No jobs yet.</div>} />);
      const cell = screen.getByText("No jobs yet.").closest("td");
      expect(cell).toHaveAttribute("colspan", "2");
    });

    it("renders skeleton rows with aria-busy while loading", () => {
      render(<DataTable columns={columns} rows={rows} rowKey={rowKey} loading />);
      expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    });
  });
});

describe("Pagination", () => {
  it("computes the page window with ellipses (page 7 of 35 → 1 … 6 7 8 … 35)", () => {
    expect(paginationItems(7, 35)).toEqual([1, "ellipsis", 6, 7, 8, "ellipsis", 35]);
    expect(paginationItems(1, 35)).toEqual([1, 2, 3, 4, 5, "ellipsis", 35]);
    expect(paginationItems(4, 35)).toEqual([1, 2, 3, 4, 5, "ellipsis", 35]);
    expect(paginationItems(5, 35)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 35]);
    expect(paginationItems(33, 35)).toEqual([1, "ellipsis", 31, 32, 33, 34, 35]);
    expect(paginationItems(35, 35)).toEqual([1, "ellipsis", 31, 32, 33, 34, 35]);
    expect(paginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(paginationItems(1, 1)).toEqual([1]);
  });

  it("renders window buttons, marks the current page, and emits page changes", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={7} pageCount={35} onPageChange={onPageChange} totalLabel="Showing 49–56 of 11,265" />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(within(nav).getByText("Showing 49–56 of 11,265")).toBeInTheDocument();

    const buttons = within(nav).getAllByRole("button");
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(["‹ Prev", "1", "6", "7", "8", "35", "Next ›"]);
    expect(within(nav).getAllByText("…")).toHaveLength(2);
    expect(within(nav).getByRole("button", { name: "7" })).toHaveAttribute("aria-current", "page");

    await userEvent.click(within(nav).getByRole("button", { name: "8" }));
    expect(onPageChange).toHaveBeenLastCalledWith(8);
    await userEvent.click(within(nav).getByRole("button", { name: "Prev" }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    await userEvent.click(within(nav).getByRole("button", { name: "7" }));
    expect(onPageChange).toHaveBeenCalledTimes(2); // current page is inert
  });

  it("disables Prev on the first page and Next on the last", () => {
    const { rerender } = render(<Pagination page={1} pageCount={35} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    rerender(<Pagination page={35} pageCount={35} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
