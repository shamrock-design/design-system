import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackedBarChart } from "./StackedBarChart";
import type { BarSeries } from "../../lib/types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Nightly job outcomes across a week.
const outcomes: BarSeries[] = [
  { id: "passed", label: "Passed", data: [42, 38, 45, 40, 47, 20, 18].map((y, i) => ({ x: days[i]!, y })) },
  { id: "retried", label: "Retried", data: [6, 9, 4, 7, 5, 3, 2].map((y, i) => ({ x: days[i]!, y })) },
  { id: "failed", label: "Failed", data: [3, 5, 2, 4, 1, 1, 0].map((y, i) => ({ x: days[i]!, y })) },
];

const meta = {
  title: "Charts/StackedBarChart",
  component: StackedBarChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof StackedBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: outcomes,
    height: 300,
    yFormat: (n) => `${n}`,
  },
  render: (args) => (
    <div style={{ maxWidth: 720 }}>
      <StackedBarChart {...args} />
    </div>
  ),
};

export const TwoSeries: Story = {
  name: "Pass / fail",
  args: {
    series: [outcomes[0]!, outcomes[2]!],
    height: 260,
    yFormat: (n) => `${n}`,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <StackedBarChart {...args} />
    </div>
  ),
};
