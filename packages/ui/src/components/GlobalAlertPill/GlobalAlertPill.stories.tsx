import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { GlobalAlertPill } from "./GlobalAlertPill";

const meta = {
  title: "Components/GlobalAlertPill",
  component: GlobalAlertPill,
  args: {
    count: 7,
    label: "orphans detected",
    status: "warning",
    onClick: () => undefined,
  },
} satisfies Meta<typeof GlobalAlertPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          statuses
        </Text>
        <Inline gap={4}>
          <GlobalAlertPill count={7} label="orphans detected" onClick={() => undefined} />
          <GlobalAlertPill count={3} label="runs failed" status="critical" onClick={() => undefined} />
          <GlobalAlertPill count={12} label="syncs in flight" status="running" onClick={() => undefined} />
          <GlobalAlertPill count={2} label="notes posted" status="info" onClick={() => undefined} />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          dismissible
        </Text>
        <Inline gap={4}>
          <GlobalAlertPill
            count={7}
            label="orphans detected"
            onClick={() => undefined}
            onDismiss={() => undefined}
          />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          custom icon slot
        </Text>
        <Inline gap={4}>
          <GlobalAlertPill
            count={4}
            label="schedules overdue"
            icon={<Icon name="clock" size={12} />}
            onClick={() => undefined}
          />
        </Inline>
      </Stack>
    </Stack>
  ),
};
