import type { Meta, StoryObj } from "@storybook/react-vite";
import { Aurora, Grid, Inline, Stack, Text } from "@shamrock/ui";

const meta = {
  title: "Primitives/Layout",
} satisfies Meta;

export default meta;

function DemoCard({ title, value }: { title: string; value: string }) {
  return (
    <Stack
      gap={2}
      style={{
        background: "var(--sh-surface-card)",
        border: "1px solid var(--sh-color-border-hairline)",
        borderTop: "3px solid var(--sh-color-accent-base)",
        padding: "var(--sh-space-6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Text variant="label-caps" tone="subtle">
        {title}
      </Text>
      <Text variant="kpi">{value}</Text>
      <Text variant="meta">vs plan: on time</Text>
    </Stack>
  );
}

export const GlassCards: StoryObj = {
  name: "Glass cards over aurora",
  render: () => (
    <div style={{ position: "relative", minHeight: 420, padding: "var(--sh-space-8)" }}>
      <Aurora />
      <Stack gap={8}>
        <Stack gap={2}>
          <Text variant="h2">Weekly Supply Replan</Text>
          <Text variant="body" tone="secondary">
            The canon in one screen: aurora backdrop, glass surfaces, hairline borders, sharp
            corners, accent used sparingly. Switch themes in the toolbar.
          </Text>
        </Stack>
        <Grid gap={6} minChildWidth="200px">
          <DemoCard title="Runs" value="104" />
          <DemoCard title="Avg duration" value="1h 21m" />
          <DemoCard title="Abort rate" value="4.6%" />
          <DemoCard title="Steps nominal" value="31 / 34" />
        </Grid>
        <Inline gap={3}>
          {(["success", "warning", "critical", "running", "pending"] as const).map((status) => (
            <Inline
              key={status}
              gap={2}
              style={{
                background: `var(--sh-color-status-${status}-bg)`,
                color: `var(--sh-color-status-${status}-text)`,
                padding: "2px var(--sh-space-4)",
                fontSize: "var(--sh-font-size-caption)",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "var(--sh-radius-circle)",
                  background: `var(--sh-color-status-${status}-base)`,
                }}
              />
              {status}
            </Inline>
          ))}
        </Inline>
      </Stack>
    </div>
  ),
};
