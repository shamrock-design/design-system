import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Stack, Text } from "../../index";
import { FolderTree, type TreeNode } from "./FolderTree";

const documents: TreeNode[] = [
  {
    id: "requirements",
    label: "Requirements",
    icon: <Icon name="layers" size={14} />,
    count: 24,
    children: [
      { id: "req-functional", label: "Functional specs", count: 14 },
      {
        id: "req-integration",
        label: "Integration scenarios",
        count: 10,
        children: [
          { id: "req-int-ibp", label: "IBP interfaces", count: 6 },
          { id: "req-int-ecc", label: "ECC batch inputs", count: 4 },
        ],
      },
    ],
  },
  {
    id: "test-cases",
    label: "Test cases",
    icon: <Icon name="check" size={14} />,
    count: 104,
    children: [
      { id: "tc-regression", label: "Regression pack", count: 61 },
      { id: "tc-smoke", label: "Smoke pack", count: 12 },
      { id: "tc-archive", label: "Archived 2024", count: 31, disabled: true },
    ],
  },
  {
    id: "uploads",
    label: "Uploads",
    icon: <Icon name="clock" size={14} />,
    count: 8,
  },
];

const meta = {
  title: "Components/FolderTree",
  component: FolderTree,
  args: {
    nodes: documents,
    defaultExpanded: ["requirements"],
  },
} satisfies Meta<typeof FolderTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>("req-functional");
    return (
      <div style={{ width: 260 }}>
        <FolderTree {...args} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>("req-functional");
    const [expanded, setExpanded] = useState(
      () => new Set(["requirements", "req-integration", "test-cases"]),
    );
    return (
      <Stack gap={8} style={{ maxWidth: 280 }}>
        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            Controlled · selected + disabled row
          </Text>
          <FolderTree
            nodes={documents}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelect={setSelected}
          />
        </Stack>
        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            levelPrefixes (machine-face depth labels)
          </Text>
          <FolderTree
            nodes={documents}
            defaultExpanded={["requirements", "req-integration"]}
            selected="req-int-ibp"
            levelPrefixes
          />
        </Stack>
        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            Long labels truncate (title carries full value)
          </Text>
          <FolderTree
            nodes={[
              {
                id: "long",
                label: "PLNG-ALL-PLNG-PRD-INTEGRATION-SCENARIOS-EMEA",
                count: 3,
                children: [
                  { id: "long-child", label: "PLNG-ALL-PLNG-PRD-INTEGRATION-SCENARIO-TC-01" },
                ],
              },
            ]}
            defaultExpanded={["long"]}
          />
        </Stack>
      </Stack>
    );
  },
};
