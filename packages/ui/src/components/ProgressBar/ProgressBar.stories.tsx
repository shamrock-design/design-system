import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  args: { value: 62, label: "31 of 34 done" },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8} style={{ maxWidth: 360 }}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Values (default accent fill)
        </Text>
        <ProgressBar value={0} label="0 of 34 done" />
        <ProgressBar value={62} label="21 of 34 done" />
        <ProgressBar value={100} label="34 of 34 done" />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Status fills
        </Text>
        <ProgressBar value={40} status="running" label="running" />
        <ProgressBar value={75} status="warning" label="warning" />
        <ProgressBar value={90} status="critical" label="critical" />
        <ProgressBar value={100} status="success" label="success" />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Sizes (sm 4px · md 6px)
        </Text>
        <ProgressBar value={62} size="sm" />
        <ProgressBar value={62} size="md" />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Segmented pass/fail proportion bar
        </Text>
        <ProgressBar
          label="120 pass · 8 warn · 4 fail"
          segments={[
            { value: 90, status: "success" },
            { value: 6, status: "warning" },
            { value: 4, status: "critical" },
          ]}
        />
      </Stack>
    </Stack>
  ),
};
