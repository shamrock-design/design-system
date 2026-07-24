import {
  Aurora,
  Button,
  Card,
  Grid,
  Inline,
  Stack,
  StatusBadge,
  Tag,
  Text,
} from "@shamrock-design/ui";
import {
  PROCESSES,
  LIFECYCLE_STATUS,
  TRIGGER_LABEL,
  type SpnrProcess,
} from "./data";

/** Human label for the lifecycle dot — "Live"/"Paused"/"Draft" (never color alone). */
const LIFECYCLE_LABEL: Record<SpnrProcess["lifecycle"], string> = {
  live: "Live",
  paused: "Paused",
  draft: "Draft",
};

/**
 * One process = one goal the agent pursues end to end. The card stays calm
 * (colorless) at rest; saturated color is earned only when the run needs a
 * person — surfaced as a critical StatusBadge plus a critical stage-bar.
 */
function ProcessCard({
  p,
  onOpenProcess,
}: {
  p: SpnrProcess;
  onOpenProcess?: (id: string) => void;
}) {
  return (
    <Card
      variant="glass"
      padding={5}
      accentBar={p.attention ? "critical" : undefined}
      onClick={() => onOpenProcess?.(p.id)}
    >
      {/* Top row: lifecycle signal + machine-face relative time of the latest run. */}
      <Card.Header
        title={
          <StatusBadge
            status={LIFECYCLE_STATUS[p.lifecycle]}
            label={LIFECYCLE_LABEL[p.lifecycle]}
            size="sm"
          />
        }
        trailing={
          <Text variant="machine" tone="tertiary">
            {p.latestRunLabel}
          </Text>
        }
      />

      {/* Identity: name + what the agent actually does. */}
      <Stack gap={1}>
        <Text variant="h3" as="span">
          {p.name}
        </Text>
        <Text variant="body" tone="secondary">
          {p.desc}
        </Text>
      </Stack>

      {/* Footer: category (trigger) + in-flight count, then the earned signal. */}
      <Inline gap={3} align="center" justify="space-between">
        <Inline gap={2} align="center">
          <Tag tone="neutral" size="sm">
            {TRIGGER_LABEL[p.trigger]} trigger
          </Tag>
          {p.inflight > 0 && (
            <Text variant="machine" tone="tertiary">
              {p.inflight} in flight
            </Text>
          )}
        </Inline>
        {p.attention ? (
          <StatusBadge status="critical" label={p.attention} size="sm" />
        ) : p.next ? (
          <Text variant="machine" tone="tertiary">
            {p.next}
          </Text>
        ) : null}
      </Inline>
    </Card>
  );
}

export function ProcessesView({
  onOpenProcess,
}: {
  onOpenProcess?: (id: string) => void;
}) {
  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora />
      <Stack gap={8} style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Page header: title + spnr's own framing, with the primary create action. */}
        <Inline gap={6} align="flex-start" justify="space-between">
          <Stack gap={2} style={{ maxWidth: "60ch" }}>
            <Text variant="h1">Processes</Text>
            <Text variant="body" tone="secondary">
              Each one is a goal the agent pursues end to end, drawing on your
              connectors and pausing only when it needs a person.
            </Text>
          </Stack>
          <Button variant="primary" size="md">
            New
          </Button>
        </Inline>

        <Grid gap={4} minChildWidth="300px">
          {PROCESSES.map((p) => (
            <ProcessCard key={p.id} p={p} onOpenProcess={onOpenProcess} />
          ))}
        </Grid>
      </Stack>
    </div>
  );
}
