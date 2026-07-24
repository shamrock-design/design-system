import { Grid, Inline, Stack, StatusBadge, Text, STATUSES } from "@shamrock-design/ui";
import { Icon } from "@shamrock-design/icons";

/** The original Phase 0 token demo, kept as a second smoke surface. */
export function Foundations() {
  return (
    <Stack gap={8}>
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
            <StatusBadge key={status} status={status} />
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
}
