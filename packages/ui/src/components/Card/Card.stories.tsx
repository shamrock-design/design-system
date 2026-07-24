import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, Stack, StatusBadge, Text } from "../../index";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  args: { variant: "glass", padding: 6 },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <Card.Header title="Demand planning" trailing={<StatusBadge status="running" size="sm" />} />
      <Text variant="body" tone="secondary">
        Nightly replication of master data into the planning area. 31 of 34 steps nominal.
      </Text>
      <Text variant="machine" tone="machine">
        last run 09:41:12 · 14m 03s
      </Text>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Surfaces
        </Text>
        <Grid gap={6} minChildWidth="220px">
          {(["glass", "solid", "faint"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <Card.Header title={variant} />
              <Text variant="body" tone="secondary">
                Hairline border, no resting shadow.
              </Text>
            </Card>
          ))}
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Accent bar · stage color-bar (status)
        </Text>
        <Grid gap={6} minChildWidth="220px">
          <Card accentBar>
            <Card.Header title="Accent bar" />
            <Text variant="body" tone="secondary">
              accentBar
            </Text>
          </Card>
          {(["success", "warning", "critical", "running"] as const).map((status) => (
            <Card key={status} accentBar={status}>
              <Card.Header title="Stage" trailing={<StatusBadge status={status} size="sm" />} />
              <Text variant="body" tone="secondary">
                accentBar="{status}"
              </Text>
            </Card>
          ))}
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Interactive (button / link) · flush padding
        </Text>
        <Grid gap={6} minChildWidth="220px">
          <Card onClick={() => {}}>
            <Card.Header title="Clickable" />
            <Text variant="body" tone="secondary">
              Renders a real button; hover lifts.
            </Text>
          </Card>
          <Card href="#detail">
            <Card.Header title="Linked" />
            <Text variant="body" tone="secondary">
              Renders an anchor.
            </Text>
          </Card>
          <Card padding={0} variant="solid">
            <Text variant="meta" style={{ padding: "var(--sh-space-4)" }}>
              padding=0 for flush content (tables).
            </Text>
          </Card>
        </Grid>
      </Stack>
    </Stack>
  ),
};
