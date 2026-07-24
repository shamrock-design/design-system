import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { KeyValueList } from "./KeyValueList";

const meta = {
  title: "Components/KeyValueList",
  component: KeyValueList,
  args: {
    items: [
      { key: "L0 Stage", value: "Demand Planning" },
      { key: "Mode", value: "Automated" },
      { key: "Last run", value: "Jul 22, 16:40", mono: true },
      { key: "Duration", value: "1h 21m", mono: true },
    ],
  },
} satisfies Meta<typeof KeyValueList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8} style={{ maxWidth: 640 }}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Vertical · 2 columns · mono values · missing value
        </Text>
        <KeyValueList
          columns={2}
          items={[
            { key: "Job", value: "/IBP/MDMR_EXECUTE", mono: true },
            { key: "Status", value: <StatusBadge status="running" size="sm" /> },
            { key: "Started", value: "Jul 22, 16:40", mono: true },
            { key: "Finished" },
            { key: "Owner", value: "S. Okafor" },
            { key: "Run ID", value: "R-2026-1104", mono: true },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Inline · dot separators
        </Text>
        <KeyValueList
          orientation="inline"
          items={[
            { key: "L0 Stage", value: "Demand Planning" },
            { key: "Mode", value: "Automated" },
            { key: "Runs", value: "104", mono: true },
            { key: "Next window", value: "Tue 19:00", mono: true },
            { key: "Baseline" },
          ]}
        />
      </Stack>
    </Stack>
  ),
};
