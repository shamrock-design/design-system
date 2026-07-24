import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Inline, Stack, Text, STATUSES, type Status } from "../../index";
import { ToastProvider, useToast } from "./Toast";

const meta = {
  title: "Components/Toast",
  component: ToastProvider,
  decorators: [
    (StoryFn) => (
      <ToastProvider>
        <StoryFn />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function FireDefault() {
  const { toast } = useToast();
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast({
          title: "Sync started",
          description: "Run #4822 is queued. You can keep working.",
          status: "info",
        })
      }
    >
      Run Sync
    </Button>
  );
}

export const Default: Story = {
  render: () => <FireDefault />,
};

const SAMPLES: Record<Status, { title: string; description: string }> = {
  neutral: { title: "Preferences saved", description: "Applies to this workspace only." },
  info: { title: "Sync started", description: "Run #4822 is queued. You can keep working." },
  success: { title: "Export complete", description: "104 rows written to jobs_2026-07-24.csv." },
  warning: { title: "Sync finished late", description: "+6m vs plan. 3 jobs exceeded their window." },
  critical: { title: "Export failed", description: "MDMR_EXECUTE rejected the request. Retry from the run page." },
  pending: { title: "Run queued", description: "Waiting for the 06:00 window." },
  running: { title: "Run in progress", description: "38 of 104 jobs complete." },
};

function FireAll() {
  const { toast, dismiss } = useToast();
  return (
    <Stack gap={4}>
      <Text variant="label-caps" tone="subtle">
        status
      </Text>
      <Inline gap={3}>
        {STATUSES.map((status) => (
          <Button key={status} variant="outline" onClick={() => toast({ ...SAMPLES[status], status })}>
            {status}
          </Button>
        ))}
      </Inline>
      <Text variant="label-caps" tone="subtle">
        persistence
      </Text>
      <Inline gap={3}>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Export failed",
              description: "Stays until dismissed — durationMs: 0.",
              status: "critical",
              durationMs: 0,
            })
          }
        >
          Persistent critical
        </Button>
        <Button variant="ghost" onClick={() => dismiss()}>
          Dismiss all
        </Button>
      </Inline>
    </Stack>
  );
}

export const AllVariants: Story = {
  render: () => <FireAll />,
};
