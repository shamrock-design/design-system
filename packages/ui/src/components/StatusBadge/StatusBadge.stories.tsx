import type { Meta, StoryObj } from "@storybook/react-vite";
import { STATUSES } from "../../constants/status";
import { Inline, Stack, Text } from "../../index";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  args: { status: "success" },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      {(["md", "sm"] as const).map((size) => (
        <Stack key={size} gap={2}>
          <Text variant="label-caps" tone="subtle">
            {size}
          </Text>
          <Inline gap={3}>
            {STATUSES.map((status) => (
              <StatusBadge key={status} status={status} size={size} />
            ))}
          </Inline>
        </Stack>
      ))}
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Label override (color still from status)
        </Text>
        <Inline gap={3}>
          <StatusBadge status="warning" label="Overdue" />
          <StatusBadge status="critical" label="Breached" />
          <StatusBadge status="running" label="Executing · step 3/9" />
        </Inline>
      </Stack>
    </Stack>
  ),
};
