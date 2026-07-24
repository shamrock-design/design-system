import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { CascadeTimeline } from "./CascadeTimeline";
import type { CascadeStep } from "./helpers";

/* A slice of a weekly supply replan — Jul 22, times on a real clock. */
const D = (h: number, m = 0) => new Date(2026, 6, 22, h, m);

/** Live run: master data flows down into demand + capacity; the CM gate failed. */
const RUN: CascadeStep[] = [
  { id: "md", label: "Master Data Sync", technical: "cif-md.replicate", start: D(8, 0), end: D(8, 20), status: "success", needs: [] },
  { id: "rbp", label: "RBP Load", technical: "rbp.load", start: D(8, 20), end: D(8, 45), status: "success", needs: ["md"] },
  { id: "srr", label: "Exclude SRR", technical: "exclude-srr", start: D(8, 45), end: D(9, 5), status: "success", needs: ["rbp"] },
  { id: "chip", label: "Chip Alloc Sync", technical: "chip.alloc.sync", start: D(8, 50), end: D(9, 10), status: "success", needs: ["rbp"] },
  { id: "cm", label: "CM Commit", technical: "cm.commit.di-check", start: D(9, 0), end: D(9, 20), status: "critical", needs: ["rbp"], gate: true },
  { id: "snap", label: "Demand Snapshot", technical: "demand.snapshot", start: D(9, 20), end: D(9, 55), status: "running", needs: ["srr", "cm"] },
  { id: "cap", label: "Capacity Plan", technical: "capacity.plan", start: D(9, 55), end: D(10, 30), status: "pending", needs: ["snap", "chip"], gate: true },
  { id: "intransit", label: "Intransit Copy", technical: "intransit.ver.copy", start: D(10, 30), end: D(10, 45), status: "pending", needs: ["cap"], ghost: true },
  { id: "publish", label: "Version Cut", technical: "version.cut.publish", start: D(10, 30), end: D(10, 50), status: "pending", needs: ["cap"] },
];

/** Same graph, no failure and no live cursor — a clean forward plan. */
const PLAN: CascadeStep[] = RUN.map((s) => ({
  ...s,
  status: s.id === "cm" ? "pending" : s.status === "success" ? "success" : s.status === "running" ? "info" : "pending",
}));

/** A failed cascade: the RBP load failed, so everything downstream is stuck. */
const FAILED: CascadeStep[] = [
  { id: "md", label: "Master Data Sync", start: D(8, 0), end: D(8, 20), status: "success", needs: [] },
  { id: "rbp", label: "RBP Load", start: D(8, 20), end: D(8, 40), status: "critical", needs: ["md"] },
  { id: "srr", label: "Exclude SRR", start: D(8, 45), end: D(9, 5), status: "pending", needs: ["rbp"] },
  { id: "snap", label: "Demand Snapshot", start: D(9, 20), end: D(9, 55), status: "pending", needs: ["srr"] },
  { id: "cap", label: "Capacity Plan", start: D(9, 55), end: D(10, 30), status: "pending", needs: ["snap"], gate: true },
];

const meta = {
  title: "Patterns/CascadeTimeline",
  component: CascadeTimeline,
  parameters: { layout: "fullscreen" },
  args: {
    steps: RUN,
    now: D(9, 35),
    height: 460,
  },
} satisfies Meta<typeof CascadeTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click any row to bloom its bounded ego-graph (needs · N → step → unlocks · N). */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 24 }}>
      <CascadeTimeline {...args} />
    </div>
  ),
};

/** Controlled expansion — the parent owns which ego-graph is open. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState<string | null>("snap");
    return (
      <div style={{ padding: 24 }}>
        <Stack gap={4} style={{ marginBottom: 12 }}>
          <Text variant="label-caps" tone="subtle">
            expanded: {open ?? "none"}
          </Text>
        </Stack>
        <CascadeTimeline {...args} expandedId={open ?? undefined} onExpandedChange={setOpen} />
      </div>
    );
  },
};

/** With / without the NOW cursor, and a fully failed cascade. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Stack gap={8}>
        <Stack gap={3}>
          <Text variant="label-caps" tone="subtle">
            Live run · NOW cursor
          </Text>
          <CascadeTimeline steps={RUN} now={D(9, 35)} height={360} />
        </Stack>

        <Stack gap={3}>
          <Text variant="label-caps" tone="subtle">
            Forward plan · no NOW
          </Text>
          <CascadeTimeline steps={PLAN} height={340} />
        </Stack>

        <Stack gap={3}>
          <Text variant="label-caps" tone="subtle">
            Failed cascade · RBP load failed, downstream stuck
          </Text>
          <CascadeTimeline steps={FAILED} now={D(9, 0)} height={240} />
        </Stack>
      </Stack>
    </div>
  ),
};
