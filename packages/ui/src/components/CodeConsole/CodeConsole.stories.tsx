import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { CodeConsole, type CodeConsoleLine } from "./CodeConsole";

const execLog: CodeConsoleLine[] = [
  { text: "[16:40:02] Starting execution /IBP/MDMR_EXECUTE", level: "info" },
  { text: "[16:40:03] Connected to IBP tenant PRD-EMEA", level: "info" },
  { text: "[16:40:05] Loading master data (24 planning areas)", level: "info" },
  { text: "[16:40:11] Planning area EMEA-04 missing forecast horizon", level: "warn" },
  { text: "[16:40:12] Retrying with fallback horizon 26w", level: "info" },
  { text: "[16:40:19] Row 1482: material 000000-ZX not found in ECC", level: "error" },
  { text: "[16:40:20] 1 error, 1 warning — execution completed with issues", level: "warn" },
];

const script = `def run(job):
    ctx = connect(job.tenant)
    for area in job.planning_areas:
        ctx.load(area)
    return ctx.commit()`;

const meta = {
  title: "Components/CodeConsole",
  component: CodeConsole,
  args: {
    lines: execLog,
    title: "/IBP/MDMR_EXECUTE",
    meta: "exit 1 · 1h 21m",
    lineNumbers: true,
    copyable: true,
  },
} satisfies Meta<typeof CodeConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <CodeConsole {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8} style={{ maxWidth: 560 }}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Leveled log · line numbers · copyable
        </Text>
        <CodeConsole lines={execLog} title="/IBP/MDMR_EXECUTE" meta="exit 1 · 1h 21m" lineNumbers copyable />
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Plain code block
        </Text>
        <CodeConsole code={script} title="runner.py" lineNumbers copyable />
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          Empty state
        </Text>
        <CodeConsole lines={[]} title="Live logs" />
      </Stack>
    </Stack>
  ),
};
