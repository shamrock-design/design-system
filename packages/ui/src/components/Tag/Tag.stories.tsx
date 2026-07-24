import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Stack, Text } from "../../index";
import { Tag } from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  args: { children: "IBP", tone: "info" },
} satisfies Meta<typeof Tag>;

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
            <Tag size={size}>General Ledger</Tag>
            <Tag size={size} tone="accent">
              Popular
            </Tag>
            <Tag size={size} tone="info">
              IBP
            </Tag>
            <Tag size={size} tone="success">
              L2
            </Tag>
            <Tag size={size} tone="warning">
              ECC
            </Tag>
            <Tag size={size} tone="critical">
              P1
            </Tag>
            <Tag size={size} mono>
              /IBP/MDMR_EXECUTE
            </Tag>
          </Inline>
        </Stack>
      ))}
    </Stack>
  ),
};
