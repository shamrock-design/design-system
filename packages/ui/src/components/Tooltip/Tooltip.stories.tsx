import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { Button } from "../Button/Button";
import { Tooltip, TooltipProvider } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Re-runs the last sync with the same scope",
    children: <Button variant="outline">Run Sync</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          sides
        </Text>
        <Inline gap={4}>
          {(["top", "bottom", "left", "right"] as const).map((side) => (
            <Tooltip key={side} side={side} content={`Opens on the ${side}`}>
              <Button variant="outline">{side}</Button>
            </Tooltip>
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          truncated value (the canonical use)
        </Text>
        <Tooltip content={<Text variant="machine" tone="inverse">PLNG-ALL-PLNG-PRD-2026-Q3-FORECAST-TC-01</Text>}>
          <Text
            variant="machine"
            tabIndex={0}
            style={{ display: "block", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            PLNG-ALL-PLNG-PRD-2026-Q3-FORECAST-TC-01
          </Text>
        </Tooltip>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          grouped (provider — adjacent tooltips open instantly)
        </Text>
        <TooltipProvider>
          <Inline gap={2}>
            <Tooltip content="Run">
              <Button variant="ghost" iconOnly aria-label="Run">
                <Icon name="run" size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Search">
              <Button variant="ghost" iconOnly aria-label="Search">
                <Icon name="search" size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Notifications">
              <Button variant="ghost" iconOnly aria-label="Notifications">
                <Icon name="bell" size={14} />
              </Button>
            </Tooltip>
          </Inline>
        </TooltipProvider>
      </Stack>
    </Stack>
  ),
};
