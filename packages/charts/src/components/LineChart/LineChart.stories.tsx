import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./LineChart";
import type { LineSeries } from "../../lib/types";

const day = (d: number) => new Date(2026, 6, d);

// Median run duration (minutes) across three pipelines over two weeks.
const runDurations: LineSeries[] = [
  {
    id: "ibp",
    label: "IBP Load",
    data: [72, 74, 69, 78, 81, 76, 70, 68, 71, 66, 64, 69, 72, 70].map((y, i) => ({ x: day(i + 1), y })),
  },
  {
    id: "mdmr",
    label: "MDMR Execute",
    data: [45, 48, 44, 51, 47, 43, 46, 49, 52, 50, 47, 45, 44, 46].map((y, i) => ({ x: day(i + 1), y })),
  },
  {
    id: "fcst",
    label: "Forecast Sync",
    data: [30, 28, 33, 29, 27, 31, 34, 32, 28, 26, 29, 31, 30, 28].map((y, i) => ({ x: day(i + 1), y })),
  },
];

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const minutes = (n: number) => `${n}m`;

export const Default: Story = {
  args: {
    series: runDurations,
    height: 280,
    yFormat: minutes,
    curve: "monotone",
  },
  render: (args) => (
    <div style={{ maxWidth: 720 }}>
      <LineChart {...args} />
    </div>
  ),
};

export const SingleSeriesNoLegend: Story = {
  name: "Single series (no legend)",
  args: {
    series: [runDurations[0]!],
    height: 220,
    yFormat: minutes,
    curve: "monotone",
    showDots: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <LineChart {...args} />
    </div>
  ),
};

export const LinearNumericAxis: Story = {
  name: "Linear x-axis (numeric)",
  args: {
    series: [
      { id: "p50", label: "p50 latency", data: [12, 18, 22, 19, 25, 31, 28, 24].map((y, i) => ({ x: i * 100, y })) },
      { id: "p95", label: "p95 latency", data: [40, 52, 61, 58, 70, 88, 79, 72].map((y, i) => ({ x: i * 100, y })) },
    ],
    height: 240,
    yFormat: (n) => `${n}ms`,
    xFormat: (v) => `${v}`,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <LineChart {...args} />
    </div>
  ),
};
