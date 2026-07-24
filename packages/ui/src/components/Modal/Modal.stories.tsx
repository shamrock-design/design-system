import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Inline, Stack, Text } from "../../index";
import { Modal } from "./Modal";
import { ConfirmModal } from "./ConfirmModal";
import { WizardModal } from "./WizardModal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  args: { size: "md" },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Modal {...args} trigger={<Button variant="outline">Open report</Button>}>
      <Modal.Header
        title="Sync report"
        description="Summary of the latest RapidX synchronization run."
      />
      <Modal.Body>
        <Stack gap={4}>
          <Text variant="body" tone="secondary">
            104 jobs were evaluated. 3 finished later than planned; the remaining 101 completed on time.
          </Text>
          <Text variant="machine">2026-07-24 06:12:04 · run #4821 · 38m 12s, +6m vs plan</Text>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost">Download CSV</Button>
        <Button variant="primary">Acknowledge</Button>
      </Modal.Footer>
    </Modal>
  ),
};

const fieldStyle = {
  border: "1px solid var(--sh-color-border-interactive)",
  background: "var(--sh-surface-solid)",
  padding: "var(--sh-space-3) var(--sh-space-4)",
  font: "inherit",
  width: "100%",
} as const;

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      <Text variant="label-caps" tone="subtle">
        sizes
      </Text>
      <Inline gap={4}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <Modal key={size} size={size} trigger={<Button variant="outline">Open {size}</Button>}>
            <Modal.Header title={`Modal ${size}`} description="Header, scrollable body, footer." />
            <Modal.Body>
              <Text variant="body" tone="secondary">
                Body content scrolls when taller than 85vh; header and footer stay pinned.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save</Button>
            </Modal.Footer>
          </Modal>
        ))}
      </Inline>

      <Text variant="label-caps" tone="subtle">
        confirm
      </Text>
      <Inline gap={4}>
        <ConfirmModal
          trigger={<Button variant="outline">Archive workflow</Button>}
          title="Archive workflow?"
          body="The workflow stops running but keeps its history. You can restore it later."
          confirmLabel="Archive"
        />
        <ConfirmModal
          trigger={<Button variant="destructive">Delete dataset</Button>}
          title="Delete dataset?"
          body="This permanently removes the dataset and its 12 generated test suites. This cannot be undone."
          confirmLabel="Delete dataset"
          destructive
        />
      </Inline>

      <Text variant="label-caps" tone="subtle">
        wizard
      </Text>
      <Inline gap={4}>
        <WizardModal
          trigger={<Button variant="primary">Add dataset</Button>}
          title="Add dataset"
          description="Register a source and map its fields."
          steps={[
            {
              title: "Source",
              content: (
                <Stack gap={3}>
                  <Text variant="meta">Dataset name</Text>
                  <input style={fieldStyle} placeholder="e.g. MDMR daily extract" />
                </Stack>
              ),
            },
            {
              title: "Mapping",
              content: (
                <Stack gap={3}>
                  <Text variant="meta">Key column</Text>
                  <input style={fieldStyle} placeholder="e.g. MATERIAL_ID" />
                </Stack>
              ),
            },
            {
              title: "Review",
              content: (
                <Text variant="body" tone="secondary">
                  2 fields mapped. The first sync runs immediately after finishing.
                </Text>
              ),
            },
          ]}
        />
      </Inline>
    </Stack>
  ),
};
