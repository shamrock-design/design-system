import { useState } from "react";
import { Aurora, Grid, Inline, Stack, Text, type Status, STATUSES, STATUS_LABELS } from "@shamrock/ui";
import { Icon } from "@shamrock/icons";

const THEMES = ["neutral", "clover", "violet"] as const;

function StatusPill({ status }: { status: Status }) {
  return (
    <Inline
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
      {STATUS_LABELS[status]}
    </Inline>
  );
}

export function App() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("clover");

  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora />
      <Stack gap={8} style={{ maxWidth: 960, margin: "0 auto" }}>
        <Inline gap={4} justify="space-between">
          <Stack gap={1}>
            <Text variant="h1">Shamrock smoke test</Text>
            <Text variant="body" tone="secondary">
              Consumes @shamrock/tokens, ui, and icons exactly like a product app would.
            </Text>
          </Stack>
          <Inline gap={2}>
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  document.documentElement.setAttribute("data-theme", t);
                }}
                style={{
                  border: "1px solid var(--sh-color-border-interactive)",
                  background: t === theme ? "var(--sh-color-accent-base)" : "var(--sh-surface-solid)",
                  color: t === theme ? "var(--sh-color-accent-on-accent)" : "var(--sh-color-text-secondary)",
                  padding: "var(--sh-space-2) var(--sh-space-5)",
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: "var(--sh-font-size-meta)",
                  fontWeight: 600,
                }}
              >
                {t}
              </button>
            ))}
          </Inline>
        </Inline>

        <Grid gap={6} minChildWidth="200px">
          {[
            ["Runs", "104"],
            ["Avg duration", "1h 21m"],
            ["Abort rate", "4.6%"],
            ["Steps nominal", "31 / 34"],
          ].map(([label, value]) => (
            <Stack
              key={label}
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
                {label}
              </Text>
              <Text variant="kpi">{value}</Text>
              <Inline gap={2}>
                <Icon name="clock" size={12} />
                <Text variant="meta">updated 4m ago</Text>
              </Inline>
            </Stack>
          ))}
        </Grid>

        <Stack gap={4}>
          <Text variant="label-caps" tone="subtle">
            Canonical status vocabulary
          </Text>
          <Inline gap={3}>
            {STATUSES.map((status) => (
              <StatusPill key={status} status={status} />
            ))}
          </Inline>
        </Stack>
      </Stack>
    </div>
  );
}
