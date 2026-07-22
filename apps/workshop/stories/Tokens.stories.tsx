import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "@shamrock/tokens";
import { Stack, Inline, Text } from "@shamrock/ui";

const meta = {
  title: "Foundations/Tokens",
} satisfies Meta;

export default meta;

function Swatch({ path }: { path: string }) {
  const cssVarName = `--sh-${path.replace(/\./g, "-")}`;
  return (
    <Stack gap={1} style={{ width: 148 }}>
      <div
        style={{
          height: 44,
          background: `var(${cssVarName})`,
          border: "1px solid var(--sh-color-border-hairline)",
        }}
      />
      <Text variant="caption">{path.replace(/^color\.|^surface\./, "")}</Text>
      <Text variant="machine">{tokens[path]}</Text>
    </Stack>
  );
}

function Group({ title, prefix }: { title: string; prefix: string }) {
  const paths = Object.keys(tokens).filter((p) => p.startsWith(prefix));
  return (
    <Stack gap={4}>
      <Text variant="label-caps" tone="subtle">
        {title}
      </Text>
      <Inline gap={4}>
        {paths.map((p) => (
          <Swatch key={p} path={p} />
        ))}
      </Inline>
    </Stack>
  );
}

export const Color: StoryObj = {
  render: () => (
    <Stack gap={8}>
      <Text variant="h2">Semantic color</Text>
      <Text variant="body" tone="secondary">
        The accent group is neutral in core — switch the theme in the toolbar to see clover/violet
        remap it. Status colors never change with theme.
      </Text>
      <Group title="Accent (themable)" prefix="color.accent." />
      <Group title="Text" prefix="color.text." />
      <Group title="Border" prefix="color.border." />
      <Group title="Status — success" prefix="color.status.success." />
      <Group title="Status — warning" prefix="color.status.warning." />
      <Group title="Status — critical" prefix="color.status.critical." />
      <Group title="Status — running" prefix="color.status.running." />
      <Group title="Surfaces" prefix="surface." />
    </Stack>
  ),
};

export const TypeScale: StoryObj = {
  name: "Type scale",
  render: () => (
    <Stack gap={5}>
      <Text variant="h1">H1 — Planning Observability</Text>
      <Text variant="h2">H2 — Weekly Supply Replan</Text>
      <Text variant="h3">H3 — Data Readiness</Text>
      <Text variant="lead">Lead — Pick a workflow to begin.</Text>
      <Text variant="body">Body — All tracked runs within a time window.</Text>
      <Text variant="meta">Meta — Last synced 4 minutes ago</Text>
      <Text variant="caption">Caption — 3 of 7 steps complete</Text>
      <Text variant="label-caps" tone="subtle">
        Label caps — Session suite
      </Text>
      <Text variant="kpi">21m 40s</Text>
      <Text variant="machine">machine — RUN-2026-07-22T16:40:02Z · /IBP/MDMR_EXECUTE</Text>
    </Stack>
  ),
};
