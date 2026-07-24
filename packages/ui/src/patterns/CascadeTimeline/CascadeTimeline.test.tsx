import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CascadeTimeline } from "./CascadeTimeline";
import {
  barState,
  buildTicks,
  dependencySort,
  egoGraph,
  kinSet,
  pxPerMinute,
  scaleTime,
  timeBounds,
  type CascadeStep,
} from "./helpers";

/* fixed local wall-clock times so differences are timezone-independent */
const T = (h: number, m = 0) => new Date(2026, 6, 22, h, m);

function makeSteps(): CascadeStep[] {
  return [
    { id: "md", label: "Master Data Sync", start: T(8, 0), end: T(8, 30), status: "success", needs: [] },
    { id: "rbp", label: "RBP Load", start: T(8, 30), end: T(9, 0), status: "success", needs: ["md"] },
    { id: "srr", label: "Exclude SRR", start: T(9, 0), end: T(9, 20), status: "running", needs: ["rbp"] },
    { id: "snap", label: "Demand Snapshot", start: T(9, 20), end: T(9, 50), status: "pending", needs: ["srr"] },
    { id: "cap", label: "Capacity", start: T(9, 50), end: T(10, 20), status: "pending", needs: ["snap"], gate: true },
    { id: "cm", label: "CM Commit", start: T(9, 10), end: T(9, 30), status: "critical", needs: ["rbp"], gate: true },
    { id: "intransit", label: "Intransit Copy", start: T(10, 20), end: T(10, 40), status: "pending", needs: ["cap"], ghost: true },
  ];
}

describe("helpers · dependencySort", () => {
  it("places every step after all of its upstream needs", () => {
    const sorted = dependencySort(makeSteps());
    const pos = new Map(sorted.map((s, i) => [s.id, i]));
    for (const s of sorted) {
      for (const need of s.needs ?? []) {
        expect(pos.get(need)!).toBeLessThan(pos.get(s.id)!);
      }
    }
    expect(sorted).toHaveLength(7);
  });

  it("is stable: independent roots keep their original order", () => {
    const steps: CascadeStep[] = [
      { id: "b", label: "B", start: T(8), status: "pending" },
      { id: "a", label: "A", start: T(8), status: "pending" },
      { id: "c", label: "C", start: T(8), status: "pending", needs: ["a", "b"] },
    ];
    expect(dependencySort(steps).map((s) => s.id)).toEqual(["b", "a", "c"]);
  });

  it("resolves order from explicit unlocks too", () => {
    const steps: CascadeStep[] = [
      { id: "x", label: "X", start: T(8), status: "pending", unlocks: ["y"] },
      { id: "y", label: "Y", start: T(8), status: "pending" },
    ];
    expect(dependencySort(steps).map((s) => s.id)).toEqual(["x", "y"]);
  });

  it("is cycle-safe: never drops nodes and never loops", () => {
    const steps: CascadeStep[] = [
      { id: "a", label: "A", start: T(8), status: "pending", needs: ["b"] },
      { id: "b", label: "B", start: T(8), status: "pending", needs: ["a"] },
      { id: "c", label: "C", start: T(8), status: "pending" },
    ];
    const sorted = dependencySort(steps);
    expect(sorted).toHaveLength(3);
    expect(new Set(sorted.map((s) => s.id))).toEqual(new Set(["a", "b", "c"]));
  });
});

describe("helpers · egoGraph", () => {
  it("resolves upstream needs and derives downstream unlocks", () => {
    const steps = makeSteps();
    const { needs, unlocks } = egoGraph(steps, "rbp");
    expect(needs.map((s) => s.id)).toEqual(["md"]);
    // rbp is needed by srr and cm (derived, in step order)
    expect(unlocks.map((s) => s.id)).toEqual(["srr", "cm"]);
  });

  it("prefers explicit unlocks when present", () => {
    const steps: CascadeStep[] = [
      { id: "a", label: "A", start: T(8), status: "pending", unlocks: ["b", "c"] },
      { id: "b", label: "B", start: T(8), status: "pending" },
      { id: "c", label: "C", start: T(8), status: "pending" },
    ];
    expect(egoGraph(steps, "a").unlocks.map((s) => s.id)).toEqual(["b", "c"]);
  });

  it("returns empty sets for an unknown id", () => {
    expect(egoGraph(makeSteps(), "nope")).toEqual({ needs: [], unlocks: [] });
  });

  it("kinSet is the step plus immediate neighbours", () => {
    expect(kinSet(makeSteps(), "rbp")).toEqual(new Set(["rbp", "md", "srr", "cm"]));
  });
});

describe("helpers · time scale", () => {
  it("computes bounds from the data extent and honors overrides", () => {
    const b = timeBounds(makeSteps());
    expect(b.start.getTime()).toBe(T(8, 0).getTime());
    expect(b.end.getTime()).toBe(T(10, 40).getTime());
    const pinned = timeBounds(makeSteps(), T(7, 0), T(12, 0));
    expect(pinned.start.getTime()).toBe(T(7, 0).getTime());
    expect(pinned.end.getTime()).toBe(T(12, 0).getTime());
  });

  it("scaleTime maps minutes to pixels", () => {
    const ppm = pxPerMinute(T(8, 0), T(10, 0), 240); // 120 min over 240px => 2 px/min
    expect(ppm).toBe(2);
    expect(scaleTime(T(9, 0), T(8, 0), ppm)).toBe(120);
  });

  it("builds hour-aligned ticks with a major at midnight", () => {
    const ticks = buildTicks(T(8, 0), T(11, 0), 1.6);
    expect(ticks.map((t) => t.time.getHours())).toEqual([8, 9, 10, 11]);
    expect(ticks[0]!.major).toBe(false);
  });
});

describe("helpers · barState", () => {
  it("maps the status enum onto calm/exception treatments", () => {
    expect(barState({ status: "success" })).toBe("done");
    expect(barState({ status: "running" })).toBe("run");
    expect(barState({ status: "warning" })).toBe("late");
    expect(barState({ status: "critical" })).toBe("fail");
    expect(barState({ status: "info" })).toBe("ready");
    expect(barState({ status: "pending" })).toBe("locked");
    expect(barState({ status: "neutral" })).toBe("locked");
    expect(barState({ status: "success", ghost: true })).toBe("ghost");
  });
});

describe("CascadeTimeline", () => {
  it("renders one dependency-sorted row per step", () => {
    const { container } = render(<CascadeTimeline steps={makeSteps()} />);
    const rows = [...container.querySelectorAll("[data-step-id]")];
    expect(rows).toHaveLength(7);
    const order = rows.map((r) => r.getAttribute("data-step-id"));
    // md and rbp precede everything that needs them
    expect(order.indexOf("md")).toBeLessThan(order.indexOf("rbp"));
    expect(order.indexOf("rbp")).toBeLessThan(order.indexOf("srr"));
    expect(order.indexOf("rbp")).toBeLessThan(order.indexOf("cm"));
    expect(order.indexOf("snap")).toBeLessThan(order.indexOf("cap"));
  });

  it("expands and collapses the ego-graph on row click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<CascadeTimeline steps={makeSteps()} />);
    expect(screen.queryByRole("region", { name: /Dependencies for/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Exclude SRR/ }));
    const panel = screen.getByRole("region", { name: /Dependencies for Exclude SRR/ });
    expect(within(panel).getByText("needs · 1")).toBeInTheDocument();
    expect(within(panel).getByText("unlocks · 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Exclude SRR/ }));
    expect(screen.queryByRole("region", { name: /Dependencies for/ })).not.toBeInTheDocument();
  });

  it("keeps only one ego-graph open at a time", async () => {
    const user = userEvent.setup();
    const { container } = render(<CascadeTimeline steps={makeSteps()} />);
    await user.click(screen.getByRole("button", { name: /Exclude SRR/ }));
    expect(screen.getByRole("region", { name: /Dependencies for Exclude SRR/ })).toBeInTheDocument();

    // click the Demand Snapshot row (scoped by data-step-id — its label also
    // appears as an unlock chip inside the open Exclude SRR panel)
    await user.click(container.querySelector('[data-step-id="snap"]') as HTMLElement);
    expect(screen.queryByRole("region", { name: /Dependencies for Exclude SRR/ })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Dependencies for Demand Snapshot/ })).toBeInTheDocument();
  });

  it("walks the chain when an ego-graph chip is clicked", async () => {
    const user = userEvent.setup();
    render(<CascadeTimeline steps={makeSteps()} />);
    await user.click(screen.getByRole("button", { name: /Exclude SRR/ }));
    const panel = screen.getByRole("region", { name: /Dependencies for Exclude SRR/ });
    // upstream chip "RBP Load" walks selection to rbp
    await user.click(within(panel).getByRole("button", { name: /RBP Load/ }));
    expect(screen.getByRole("region", { name: /Dependencies for RBP Load/ })).toBeInTheDocument();
  });

  it("supports a controlled ego-graph via expandedId / onExpandedChange", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <CascadeTimeline steps={makeSteps()} expandedId="srr" onExpandedChange={onExpandedChange} />,
    );
    expect(screen.getByRole("region", { name: /Dependencies for Exclude SRR/ })).toBeInTheDocument();

    // clicking another row reports the change but does not move (still controlled to srr)
    await user.click(screen.getByRole("button", { name: /Master Data Sync/ }));
    expect(onExpandedChange).toHaveBeenCalledWith("md");
    expect(screen.getByRole("region", { name: /Dependencies for Exclude SRR/ })).toBeInTheDocument();

    rerender(<CascadeTimeline steps={makeSteps()} expandedId="md" onExpandedChange={onExpandedChange} />);
    expect(screen.getByRole("region", { name: /Dependencies for Master Data Sync/ })).toBeInTheDocument();
  });

  it("collapses the ego-graph on Escape", async () => {
    const user = userEvent.setup();
    render(<CascadeTimeline steps={makeSteps()} />);
    await user.click(screen.getByRole("button", { name: /Exclude SRR/ }));
    expect(screen.getByRole("region", { name: /Dependencies for/ })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: /Dependencies for/ })).not.toBeInTheDocument();
  });

  it("fires onStepClick with the activated step", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<CascadeTimeline steps={makeSteps()} onStepClick={onStepClick} />);
    await user.click(screen.getByRole("button", { name: /Capacity/ }));
    expect(onStepClick).toHaveBeenCalledTimes(1);
    expect(onStepClick.mock.calls[0]![0].id).toBe("cap");
  });

  it("draws the NOW line at the projected position only when now is provided", () => {
    const { container, rerender } = render(<CascadeTimeline steps={makeSteps()} now={T(9, 0)} />);
    const nowLine = container.querySelector("[data-nowline]");
    expect(nowLine).not.toBeNull();
    // 60 min after start (08:00) at 96px/hour => 96px
    expect(nowLine!.getAttribute("data-now-x")).toBe("96");
    expect(container.querySelector("[data-nowtag]")).not.toBeNull();

    rerender(<CascadeTimeline steps={makeSteps()} />);
    expect(container.querySelector("[data-nowline]")).toBeNull();
  });

  it("renders gate and ghost affordances", () => {
    const { container } = render(<CascadeTimeline steps={makeSteps()} />);
    const ghostRow = container.querySelector('[data-step-id="intransit"]');
    expect(ghostRow?.getAttribute("data-ghost")).toBe("true");
    expect(ghostRow?.getAttribute("data-bar-state")).toBe("ghost");
    expect(within(ghostRow as HTMLElement).getByText("GHOST")).toBeInTheDocument();

    const gateRow = container.querySelector('[data-step-id="cm"]');
    expect(gateRow?.getAttribute("data-gate")).toBe("true");
    expect(within(gateRow as HTMLElement).getByText("GATE")).toBeInTheDocument();
  });

  it("gives kin rows a kin marker when a neighbour is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<CascadeTimeline steps={makeSteps()} />);
    await user.click(screen.getByRole("button", { name: /RBP Load/ }));
    // md (need) and srr/cm (unlocks) become kin; the selected row itself is not kin
    expect(container.querySelector('[data-step-id="md"]')?.getAttribute("data-kin")).toBe("true");
    expect(container.querySelector('[data-step-id="srr"]')?.getAttribute("data-kin")).toBe("true");
    expect(container.querySelector('[data-step-id="rbp"]')?.getAttribute("data-kin")).toBeNull();
  });
});
