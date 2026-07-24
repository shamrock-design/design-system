import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Run Sync", variant: "primary", size: "md" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      {(["primary", "outline", "ghost", "destructive", "link"] as const).map((variant) => (
        <Stack key={variant} gap={2}>
          <Text variant="label-caps" tone="subtle">
            {variant}
          </Text>
          <Inline gap={4}>
            {(["sm", "md", "lg"] as const).map((size) => (
              <Button key={size} variant={variant} size={size}>
                Run Sync
              </Button>
            ))}
            <Button variant={variant} iconStart={<Icon name="run" size={14} />}>
              Run Sync
            </Button>
            <Button variant={variant} loading>
              Running
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} iconOnly aria-label="Run">
              <Icon name="run" size={14} />
            </Button>
          </Inline>
        </Stack>
      ))}
    </Stack>
  ),
};
