import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@shamrock-design/icons";
import { useState } from "react";
import { Button, Stack, Text } from "../../index";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { GlobalAlertPill } from "../GlobalAlertPill/GlobalAlertPill";
import { AppShell } from "./AppShell";

const meta = {
  title: "Components/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoShell({
  defaultCollapsed = false,
  height,
}: {
  defaultCollapsed?: boolean;
  height?: string;
}) {
  const [active, setActive] = useState("runs");
  return (
    <AppShell defaultCollapsed={defaultCollapsed} style={height ? { height } : undefined}>
      <AppShell.Sidebar>
        <AppShell.Brand>
          <Text variant="h3" as="span">
            Shamrock
          </Text>
        </AppShell.Brand>
        <AppShell.NavSection title="Operate">
          <AppShell.NavItem
            icon={<Icon name="run" size={14} />}
            label="Runs"
            active={active === "runs"}
            count={128}
            onClick={() => setActive("runs")}
          />
          <AppShell.NavItem
            icon={<Icon name="clock" size={14} />}
            label="Schedules"
            active={active === "schedules"}
            onClick={() => setActive("schedules")}
          />
          <AppShell.NavItem
            icon={<Icon name="bell" size={14} />}
            label="Alerts"
            active={active === "alerts"}
            count={7}
            onClick={() => setActive("alerts")}
          />
        </AppShell.NavSection>
        <AppShell.NavSection title="Model">
          <AppShell.NavItem
            icon={<Icon name="layers" size={14} />}
            label="Interfaces"
            active={active === "interfaces"}
            onClick={() => setActive("interfaces")}
          />
          <AppShell.NavItem icon={<Icon name="search" size={14} />} label="Explore" href="#explore" />
        </AppShell.NavSection>
      </AppShell.Sidebar>
      <AppShell.Topbar
        start={
          <Breadcrumbs
            items={[
              { label: "Operate" },
              { label: "Runs", href: "#runs" },
              { label: "MDMR_EXECUTE", mono: true },
            ]}
          />
        }
        end={
          <>
            <GlobalAlertPill count={7} label="orphans detected" onClick={() => setActive("alerts")} />
            <Button variant="outline" size="sm">
              Refresh
            </Button>
            <Button size="sm">Run Sync</Button>
          </>
        }
      />
      <AppShell.ContextBar>
        <Text variant="label-caps" tone="subtle">
          Filters
        </Text>
        <Text variant="meta">Last 24h · All systems · Failures first</Text>
      </AppShell.ContextBar>
      <AppShell.Content>
        <Stack gap={4}>
          <Text variant="h1">Runs</Text>
          <Text variant="body" tone="secondary">
            Scrollable main region. The sidebar collapses to a 56px icon rail via the chevron in the brand
            row.
          </Text>
          {Array.from({ length: 24 }, (_, i) => (
            <Text key={i} variant="machine">
              2026-07-24T0{i % 10}:00:00Z · run-{1000 + i} · ok
            </Text>
          ))}
        </Stack>
      </AppShell.Content>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <DemoShell />,
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={6} style={{ padding: "var(--sh-space-6)" }}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          expanded
        </Text>
        <DemoShell height="420px" />
      </Stack>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          collapsed (icon rail)
        </Text>
        <DemoShell defaultCollapsed height="420px" />
      </Stack>
    </Stack>
  ),
};
