import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "./DonutChart";
import type { DonutSlice } from "../../lib/types";

const distribution: DonutSlice[] = [
  { label: "Success", value: 28 },
  { label: "Running", value: 9 },
  { label: "Failed", value: 5 },
  { label: "Pending", value: 3 },
];

const meta = {
  title: "Charts/DonutChart",
  component: DonutChart,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slices: distribution,
    height: 220,
    centerLabel: "Status Distribution",
  },
};

export const TwoSlices: Story = {
  name: "Capacity used",
  args: {
    slices: [
      { label: "Used", value: 68 },
      { label: "Free", value: 32 },
    ],
    height: 200,
    centerLabel: "GB Used",
    total: 68,
    valueFormat: (n) => `${n}`,
  },
};
