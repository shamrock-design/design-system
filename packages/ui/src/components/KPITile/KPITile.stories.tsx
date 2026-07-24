import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Grid, Stack, Text } from "../../index";
import { KPITile } from "./KPITile";

const meta = {
  title: "Components/KPITile",
  component: KPITile,
  args: {
    label: "Avg duration",
    value: "1h 21m",
    delta: { text: "+35 min vs plan", sentiment: "negative" },
  },
} satisfies Meta<typeof KPITile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Delta sentiments
        </Text>
        <Grid gap={6} minChildWidth="200px">
          <KPITile label="Runs" value="104" delta={{ text: "+12 vs last week", sentiment: "neutral" }} />
          <KPITile label="Avg duration" value="1h 21m" delta={{ text: "+35 min vs plan", sentiment: "negative" }} />
          <KPITile label="Steps nominal" value="31 / 34" delta={{ text: "+2 vs yesterday", sentiment: "positive" }} />
          <KPITile
            label="Abort rate"
            value="4.6%"
            delta={{ text: "on plan", sentiment: "neutral" }}
            icon={<Icon name="clock" size={14} />}
          />
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          No accent bar · clickable (hover lift) · missing delta (dev hint)
        </Text>
        <Grid gap={6} minChildWidth="200px">
          <KPITile
            label="Queued jobs"
            value="17"
            delta={{ text: "+3 vs 08:00", sentiment: "neutral" }}
            accentBar={false}
          />
          <KPITile
            label="Open incidents"
            value="3"
            delta={{ text: "-2 vs yesterday", sentiment: "positive" }}
            onClick={() => {}}
          />
          <KPITile label="Naked number" value="42" />
        </Grid>
      </Stack>
    </Stack>
  ),
};
