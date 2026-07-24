import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { Button, Stack, Text } from "../../index";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: {
    title: "No workflows yet.",
    description: "Create your first workflow to generate test cases from documents.",
    action: <Button>Create workflow</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8} style={{ maxWidth: 640 }}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          md · nothing created yet (noun + how + CTA)
        </Text>
        <EmptyState
          title="No workflows yet."
          description="Create your first workflow to generate test cases from documents."
          action={<Button>Create workflow</Button>}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          md · with illustration slot · not wired (fact, no CTA)
        </Text>
        <EmptyState
          title="Not instrumented yet."
          description="Runs will appear once this stage reports data."
          illustration={<Icon name="layers" size={28} />}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          md · filter returned nothing (echo the query + reset)
        </Text>
        <EmptyState
          title="No jobs match 'MDMR'."
          description="Clear the search to see all 104 jobs."
          action={<Button variant="outline">Clear search</Button>}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          sm · inline table-cell version
        </Text>
        <EmptyState
          size="sm"
          title="No runs yet."
          description="Runs appear here after the first scheduled window."
          action={
            <Button variant="link" size="sm">
              Schedule run
            </Button>
          }
        />
      </Stack>
    </Stack>
  ),
};
