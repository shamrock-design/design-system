import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { SegmentedControl } from "./SegmentedControl";

const SOURCES = [
  { value: "all", label: "All" },
  { value: "ibp", label: "IBP" },
  { value: "ecc", label: "ECC" },
  { value: "bw", label: "BW" },
];

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  args: { options: SOURCES, "aria-label": "Source system", size: "md" },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ControlledDemo() {
  const [view, setView] = useState("tables");
  return (
    <Stack gap={2}>
      <SegmentedControl
        aria-label="View"
        options={[
          { value: "hierarchy", label: "Hierarchy", iconStart: <Icon name="layers" size={12} /> },
          { value: "tables", label: "Tables" },
          { value: "summary", label: "Summary" },
        ]}
        value={view}
        onValueChange={setView}
      />
      <Text variant="meta" tone="subtle">
        Active view: {view}
      </Text>
    </Stack>
  );
}

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      {(["sm", "md"] as const).map((size) => (
        <Stack key={size} gap={2}>
          <Text variant="label-caps" tone="subtle">
            {size}
          </Text>
          <Inline gap={4}>
            <SegmentedControl size={size} options={SOURCES} aria-label={`Source system (${size})`} />
            <SegmentedControl
              size={size}
              options={SOURCES}
              defaultValue="ibp"
              disabled
              aria-label={`Source system disabled (${size})`}
            />
            <SegmentedControl
              size={size}
              options={[
                { value: "all", label: "All" },
                { value: "ibp", label: "IBP" },
                { value: "ecc", label: "ECC", disabled: true },
              ]}
              aria-label={`Source system with disabled option (${size})`}
            />
          </Inline>
        </Stack>
      ))}
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          controlled + icons
        </Text>
        <ControlledDemo />
      </Stack>
    </Stack>
  ),
};
