import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { Tabs } from "./Tabs";

const items = [
  { value: "overview", label: "Overview" },
  { value: "runs", label: "Runs", count: 128 },
  { value: "alerts", label: "Alerts", iconStart: <Icon name="warn" size={14} />, count: 3 },
  { value: "archive", label: "Archive", disabled: true },
];

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    items,
    variant: "underline",
    size: "md",
    renderPanel: (value: string) => <Text tone="secondary">Panel content for “{value}”.</Text>,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      {(["underline", "pill"] as const).map((variant) => (
        <Stack key={variant} gap={4}>
          <Text variant="label-caps" tone="subtle">
            {variant}
          </Text>
          <Inline gap={8} align="flex-start">
            {(["md", "sm"] as const).map((size) => (
              <Tabs
                key={size}
                variant={variant}
                size={size}
                items={items}
                renderPanel={(value) => (
                  <Text variant="meta" tone="secondary">
                    {size} · {value}
                  </Text>
                )}
              />
            ))}
          </Inline>
        </Stack>
      ))}
    </Stack>
  ),
};
