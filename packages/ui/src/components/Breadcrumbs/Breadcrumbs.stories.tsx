import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { Breadcrumbs } from "./Breadcrumbs";

const meta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      { label: "Operate", href: "#operate" },
      { label: "Runs", href: "#runs" },
      { label: "MDMR_EXECUTE", mono: true },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          links + current page
        </Text>
        <Breadcrumbs
          items={[
            { label: "Operate", href: "#operate" },
            { label: "Runs", href: "#runs" },
            { label: "Run 4211" },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          onClick crumbs (router-driven)
        </Text>
        <Breadcrumbs
          items={[
            { label: "Model", onClick: () => undefined },
            { label: "Interfaces", onClick: () => undefined },
            { label: "Mapping" },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          machine segment
        </Text>
        <Breadcrumbs
          items={[
            { label: "Systems", href: "#systems" },
            { label: "/IBP/MDMR_EXECUTE", href: "#iface", mono: true },
            { label: "run-4211", mono: true },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          deep trail (&gt;4 collapses the middle to …)
        </Text>
        <Breadcrumbs
          items={[
            { label: "Operate", href: "#a" },
            { label: "Systems", href: "#b" },
            { label: "SAP ECC", href: "#c" },
            { label: "Interfaces", href: "#d" },
            { label: "MDMR_EXECUTE", href: "#e", mono: true },
            { label: "Run 4211" },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          single item
        </Text>
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
      </Stack>
    </Stack>
  ),
};
