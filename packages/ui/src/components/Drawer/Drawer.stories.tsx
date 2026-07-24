import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, KeyValueList, Stack, StatusBadge, Text } from "../../index";
import { Button } from "../Button/Button";
import { Drawer } from "./Drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  args: { size: "md", modal: true },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const inspectorBody = (
  <Stack gap={6}>
    <Inline gap={3}>
      <StatusBadge status="running" />
      <Text variant="machine">t/MDMR_EXECUTE</Text>
    </Inline>
    <KeyValueList
      items={[
        { key: "Started", value: "09:41:12" },
        { key: "Duration", value: "14m 03s" },
        { key: "Owner", value: "IBP batch" },
      ]}
    />
    <Text variant="body" tone="secondary">
      Execution is in flight. Interrupting now rolls the step back to its last checkpoint.
    </Text>
  </Stack>
);

export const Default: Story = {
  render: (args) => (
    <Drawer {...args} trigger={<Button variant="outline">Inspect step</Button>}>
      <Drawer.Header eyebrow="STEP 07" title="MDM replication" />
      <Drawer.Body>{inspectorBody}</Drawer.Body>
      <Drawer.Footer>
        <Button fullWidth>Re-run step</Button>
        <Button variant="outline" fullWidth>
          Skip and continue
        </Button>
      </Drawer.Footer>
    </Drawer>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6}>
      <Text variant="label-caps" tone="subtle">
        Sizes · modal vs non-modal
      </Text>
      <Inline gap={4}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <Drawer key={size} size={size} trigger={<Button variant="outline">Open {size}</Button>}>
            <Drawer.Header eyebrow="STEP 07" title={`Inspector (${size})`} />
            <Drawer.Body>{inspectorBody}</Drawer.Body>
            <Drawer.Footer>
              <Button fullWidth>Re-run step</Button>
            </Drawer.Footer>
          </Drawer>
        ))}
        <Drawer modal={false} trigger={<Button variant="ghost">Open non-modal</Button>}>
          <Drawer.Header title="Persistent inspector" />
          <Drawer.Body>
            <Text variant="body" tone="secondary">
              No scrim — the page behind stays interactive while this panel is open.
            </Text>
          </Drawer.Body>
        </Drawer>
        <Drawer disableScrimDismiss trigger={<Button variant="ghost">No scrim dismiss</Button>}>
          <Drawer.Header title="Sticky drawer" />
          <Drawer.Body>
            <Text variant="body" tone="secondary">
              Outside presses are ignored; close via × or Esc.
            </Text>
          </Drawer.Body>
        </Drawer>
      </Inline>
    </Stack>
  ),
};
