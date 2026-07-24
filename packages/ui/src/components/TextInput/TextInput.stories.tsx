import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Inline, Stack, Text } from "../../index";
import { TextInput } from "./TextInput";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  args: { size: "md", placeholder: "Job name", "aria-label": "Job name" },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function SearchDemo() {
  const [query, setQuery] = useState("MDMR_EXECUTE");
  return (
    <TextInput
      search
      placeholder="Search jobs…"
      aria-label="Search jobs"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onClear={() => setQuery("")}
    />
  );
}

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          sizes
        </Text>
        <Inline gap={4}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <TextInput key={size} size={size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
          ))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          icons
        </Text>
        <Inline gap={4}>
          <TextInput iconStart={<Icon name="clock" size={14} />} placeholder="Schedule" aria-label="Schedule" />
          <TextInput iconEnd={<Icon name="chevron-down" size={14} />} placeholder="System" aria-label="System" />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          search (clearable)
        </Text>
        <Inline gap={4}>
          <SearchDemo />
          <TextInput search placeholder="Search jobs…" aria-label="Search jobs (empty)" />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          states
        </Text>
        <Inline gap={4}>
          <TextInput invalid defaultValue="not-a-cron" aria-label="Invalid value" />
          <TextInput disabled defaultValue="Locked" aria-label="Disabled value" />
          <TextInput readOnly defaultValue="Read only" aria-label="Read only value" />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          full width
        </Text>
        <TextInput fullWidth search placeholder="Search jobs…" aria-label="Search jobs (full width)" />
      </Stack>
    </Stack>
  ),
};
