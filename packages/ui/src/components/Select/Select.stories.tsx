import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Stack, Text } from "../../index";
import { Select } from "./Select";

const systems = [
  { value: "ibp-prd", label: "IBP Production", description: "PLNG-ALL-PLNG-PRD" },
  { value: "ibp-qas", label: "IBP Quality", description: "PLNG-ALL-PLNG-QAS" },
  { value: "ecc-prd", label: "ECC Production", description: "ERP-CORE-PRD" },
  { value: "ecc-dev", label: "ECC Development", description: "ERP-CORE-DEV", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    options: systems,
    placeholder: "Select target system…",
    size: "md",
    "aria-label": "Target system",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          sizes
        </Text>
        <Inline gap={4}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Select key={size} size={size} options={systems} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          states
        </Text>
        <Inline gap={4}>
          <Select options={systems} defaultValue="ibp-prd" aria-label="With value" />
          <Select options={systems} invalid placeholder="Required" aria-label="Invalid" />
          <Select options={systems} disabled placeholder="Disabled" aria-label="Disabled" />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          full width
        </Text>
        <Select options={systems} fullWidth defaultValue="ecc-prd" aria-label="Full width" />
      </Stack>
    </Stack>
  ),
};
