import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { Timeline, type TimelineItem } from "./Timeline";

/** July 20 2026 (Mon) and July 21 (Tue) — a within-week run. Month is 0-indexed. */
const mon = (h: number, m = 0) => new Date(2026, 6, 20, h, m);
const tue = (h: number, m = 0) => new Date(2026, 6, 21, h, m);

const runItems: TimelineItem[] = [
  // IBP — integrated business planning
  { id: "ibp-mdmr", lane: "IBP", label: "MDMR_EXECUTE", system: "IBP", status: "success", start: mon(18, 0), end: mon(19, 20) },
  { id: "ibp-demand", lane: "IBP", label: "Demand upload", system: "IBP", status: "success", start: mon(19, 30), end: mon(20, 10) },
  { id: "ibp-supply", lane: "IBP", label: "Supply heuristic", system: "IBP", status: "running", start: mon(20, 15), end: mon(21, 40) },
  { id: "ibp-release", lane: "IBP", label: "Release checkpoint", system: "IBP", status: "success", gate: true, start: mon(21, 45), end: mon(21, 58) },

  // ECC — the exception lane
  { id: "ecc-idoc", lane: "ECC", label: "IDoc inbound", system: "ECC", status: "success", start: mon(18, 10), end: mon(18, 40) },
  { id: "ecc-delta", lane: "ECC", label: "Delta extract", system: "ECC", status: "warning", start: mon(19, 0), end: mon(20, 40) },
  { id: "ecc-posting", lane: "ECC", label: "Posting run", system: "ECC", status: "critical", start: mon(20, 40), end: mon(21, 5) },
  { id: "ecc-recon", lane: "ECC", label: "Reconcile", system: "ECC", status: "pending", ghost: true, start: mon(21, 15), end: mon(21, 45) },

  // BW — warehouse
  { id: "bw-chain", lane: "BW", label: "Chain PLNG_D", system: "BW", status: "success", start: mon(18, 20), end: mon(19, 10) },
  { id: "bw-dtp", lane: "BW", label: "DTP load", system: "BW", status: "success", start: mon(19, 15), end: mon(20, 5) },
  { id: "bw-cache", lane: "BW", label: "Query cache warmed", system: "BW", status: "success", start: mon(20, 30) }, // milestone
  { id: "bw-agg", lane: "BW", label: "Aggregate", system: "BW", status: "pending", start: mon(21, 45), end: tue(0, 30) },
];

const meta = {
  title: "Patterns/Timeline",
  component: Timeline,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A realistic weekly run — IBP/ECC/BW lanes, a gate, a ghost, and a live NOW line. */
export const WeeklyRun: Story = {
  args: {
    items: runItems,
    lanes: ["IBP", "ECC", "BW"],
    now: mon(20, 48),
    tickEvery: "hour",
    "aria-label": "Weekly run timeline",
  },
  render: (args) => (
    <Stack gap={3}>
      <Text variant="body" tone="secondary">
        All times PST. Bar left edge = start, width = run duration. Nominal steps stay grey; only late (warning) and
        aborted (critical) light up.
      </Text>
      <div style={{ maxHeight: 360, display: "flex" }}>
        <Timeline {...args} />
      </div>
    </Stack>
  ),
};

export const Default: Story = { ...WeeklyRun };

/** Interactive — items become buttons (focusable, keyboard-activatable). */
export const Interactive: Story = {
  args: {
    items: runItems,
    lanes: ["IBP", "ECC", "BW"],
    now: mon(20, 48),
    tickEvery: "hour",
    onItemClick: (item) => {
      // eslint-disable-next-line no-alert
      window.alert(`${item.lane} · ${item.label}`);
    },
  },
};

const dayItems: TimelineItem[] = [
  { id: "d1", lane: "Extract", label: "Full extract", status: "success", start: new Date(2026, 6, 20, 2), end: new Date(2026, 6, 20, 9) },
  { id: "d2", lane: "Extract", label: "Delta window", status: "success", start: new Date(2026, 6, 21, 2), end: new Date(2026, 6, 21, 6) },
  { id: "d3", lane: "Extract", label: "Delta window", status: "warning", start: new Date(2026, 6, 22, 2), end: new Date(2026, 6, 22, 11) },
  { id: "d4", lane: "Load", label: "Warehouse load", status: "success", start: new Date(2026, 6, 20, 10), end: new Date(2026, 6, 20, 16) },
  { id: "d5", lane: "Load", label: "Warehouse load", status: "critical", start: new Date(2026, 6, 22, 12), end: new Date(2026, 6, 22, 15) },
  { id: "d6", lane: "Load", label: "Cutover", status: "pending", start: new Date(2026, 6, 24, 8) }, // milestone
];

export const AllVariants: Story = {
  args: { items: runItems },
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Hour ticks (within-day window)
        </Text>
        <div style={{ maxHeight: 320, display: "flex" }}>
          <Timeline items={runItems} lanes={["IBP", "ECC", "BW"]} now={mon(20, 48)} tickEvery="hour" />
        </div>
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Day ticks (multi-day window)
        </Text>
        <div style={{ maxHeight: 260, display: "flex" }}>
          <Timeline
            items={dayItems}
            lanes={["Extract", "Load"]}
            now={new Date(2026, 6, 22, 13, 0)}
            tickEvery="day"
          />
        </div>
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Empty
        </Text>
        <Timeline items={[]} emptyMessage="No runs in this window. Runs appear here once a schedule fires." />
      </Stack>
    </Stack>
  ),
};
