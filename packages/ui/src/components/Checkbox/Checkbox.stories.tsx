import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Stack, Text } from "../../index";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { children: "Show inactive jobs", size: "md" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      {(["sm", "md"] as const).map((size) => (
        <Stack key={size} gap={2}>
          <Text variant="label-caps" tone="subtle">
            {size}
          </Text>
          <Inline gap={6}>
            <Checkbox size={size}>Unchecked</Checkbox>
            <Checkbox size={size} defaultChecked>
              Checked
            </Checkbox>
            <Checkbox size={size} indeterminate>
              Indeterminate
            </Checkbox>
            <Checkbox size={size} disabled>
              Disabled
            </Checkbox>
            <Checkbox size={size} disabled defaultChecked>
              Disabled checked
            </Checkbox>
          </Inline>
        </Stack>
      ))}
    </Stack>
  ),
};
