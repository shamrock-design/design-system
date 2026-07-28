import {
  Aurora,
  Button,
  Card,
  Grid,
  Inline,
  KPITile,
  Stack,
  StatusBadge,
  Tag,
  Text,
} from "@shamrock-design/ui";
import { Sparkline } from "@shamrock-design/charts";

/**
 * A starter page that follows the Shamrock canon:
 *   - colorless by default; saturated color is earned (the one critical badge)
 *   - no naked numbers (every metric carries a baseline)
 *   - machine values in the machine face; spacing via Stack/Inline/Grid gaps
 *   - no edge-line stripes; signal with badges, dots, and a subtle corner bloom
 *
 * Delete this and build your app. The rules live in CLAUDE.md / AGENTS.md so
 * your AI coding agent stays on-system too. Run `pnpm lint` to check yourself.
 */
export function App() {
  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora />
      <Stack gap={8}>
        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            {{APP_NAME}}
          </Text>
          <Text variant="h1">You&rsquo;re wired into the design system.</Text>
          <Text variant="body" tone="secondary">
            Everything below is built from @shamrock-design/ui and tokens — no hex, no
            magic px, sharp corners, calm by default.
          </Text>
        </Stack>

        <Grid gap={4} minChildWidth="220px">
          <KPITile
            label="Uptime"
            value="99.98%"
            delta={{ text: "+0.02 pts vs last week", sentiment: "positive" }}
          />
          <KPITile
            label="Median latency"
            value="128 ms"
            delta={{ text: "−12 ms vs plan", sentiment: "positive" }}
          />
          <KPITile
            label="Open incidents"
            value="1"
            delta={{ text: "+1 vs yesterday", sentiment: "negative" }}
          />
        </Grid>

        <Grid gap={4} minChildWidth="300px">
          <Card variant="glass" padding={5}>
            <Card.Header
              title={
                <Text variant="h3" as="span">
                  Nominal service
                </Text>
              }
              trailing={<StatusBadge status="success" label="Healthy" size="sm" />}
            />
            <Stack gap={3}>
              <Text variant="body" tone="secondary">
                Calm at rest. A card stays colorless until something earns attention.
              </Text>
              <Inline gap={2} align="center">
                <Tag tone="neutral" size="sm">
                  web
                </Tag>
                <Tag tone="neutral" size="sm">
                  api
                </Tag>
                <Sparkline
                  data={[8, 9, 7, 10, 9, 11, 10, 12]}
                  tone="neutral"
                  showEndDot
                  ariaLabel="Requests per second, trending up"
                />
              </Inline>
            </Stack>
          </Card>

          <Card variant="glass" padding={5} accentBar="critical">
            <Card.Header
              title={
                <Text variant="h3" as="span">
                  Needs a person
                </Text>
              }
              trailing={<StatusBadge status="critical" label="Action required" size="sm" />}
            />
            <Stack gap={3}>
              <Text variant="body" tone="secondary">
                Saturated color is the exception, not the wallpaper — reserved for the one
                thing that needs you.
              </Text>
              <Inline gap={2}>
                <Button variant="primary" size="sm">
                  Acknowledge
                </Button>
                <Button variant="ghost" size="sm">
                  View run
                </Button>
              </Inline>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </div>
  );
}
