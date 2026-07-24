import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Stack, Text } from "../../index";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "Ada Lovelace", size: "md" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAMES = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Margaret Hamilton"];

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Deterministic identity colors (chart-cat-1..5)
        </Text>
        <Inline gap={4}>
          {NAMES.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Sizes
        </Text>
        <Inline gap={4}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Avatar key={size} name="Grace Hopper" size={size} />
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Muted (hairline ring + ink on glass)
        </Text>
        <Inline gap={4}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Avatar key={size} name="Alan Turing" size={size} muted />
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Image · broken image falls back to initials
        </Text>
        <Inline gap={4}>
          <Avatar
            name="Katherine Johnson"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23808379'/%3E%3C/svg%3E"
            size="lg"
          />
          <Avatar name="Katherine Johnson" src="/definitely-broken.png" size="lg" />
        </Inline>
      </Stack>
    </Stack>
  ),
};
