import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, ICON_NAMES } from "@shamrock-design/icons";
import { Grid, Stack, Text } from "@shamrock-design/ui";

const meta = {
  title: "Foundations/Icons",
} satisfies Meta;

export default meta;

export const Gallery: StoryObj = {
  render: () => (
    <Grid gap={4} minChildWidth="120px">
      {ICON_NAMES.map((name) => (
        <Stack
          key={name}
          gap={3}
          align="center"
          style={{
            border: "1px solid var(--sh-color-border-hairline)",
            padding: "var(--sh-space-6)",
            background: "var(--sh-surface-card)",
          }}
        >
          <Icon name={name} size={20} />
          <Text variant="machine">{name}</Text>
        </Stack>
      ))}
    </Grid>
  ),
};
