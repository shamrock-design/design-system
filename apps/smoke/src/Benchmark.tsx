import { useMemo, useState } from "react";
import {
  AppShell,
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  ConfirmModal,
  DataTable,
  DateTimeRangePicker,
  Drawer,
  EmptyState,
  GlobalAlertPill,
  Inline,
  KeyValueList,
  KPITile,
  mapLegacyStatus,
  Pagination,
  ProgressBar,
  SegmentedControl,
  Select,
  Stack,
  StatusBadge,
  Tag,
  Text,
  TextInput,
  Tooltip,
  useToast,
  type Column,
  type DateTimeRange,
  type SortState,
} from "@shamrock-design/ui";
import { DonutChart, LineChart } from "@shamrock-design/charts";
import { Icon } from "@shamrock-design/icons";

interface Run {
  id: string;
  job: string;
  technical: string;
  system: "IBP" | "ECC" | "BW";
  status: string;
  start: string;
  duration: string;
  durationMin: number;
  steps: { name: string; status: string }[];
}

const RUNS: Run[] = [
  { id: "RUN-2201", job: "Master Data Sync", technical: "/IBP/MDMR_EXECUTE", system: "IBP", status: "Finished", start: "Jul 21, 19:05", duration: "1h 21m", durationMin: 81, steps: [{ name: "Extract MD", status: "Finished" }, { name: "Validate keys", status: "Finished" }, { name: "Publish", status: "Finished" }] },
  { id: "RUN-2202", job: "Total RBP Load & Validation", technical: "PLNG-ALL-PLNG-PRD-RBP-LOAD", system: "ECC", status: "Aborted", start: "Jul 21, 20:40", duration: "24m", durationMin: 24, steps: [{ name: "Load RBP", status: "Finished" }, { name: "Validate bands", status: "Aborted" }] },
  { id: "RUN-2203", job: "Exclude SRR", technical: "/IBP/SRR_EXCLUDE", system: "IBP", status: "Running", start: "Jul 22, 06:01", duration: "18m", durationMin: 18, steps: [{ name: "Scope SRR", status: "Finished" }, { name: "Apply exclusions", status: "Running" }] },
  { id: "RUN-2204", job: "Manual Memory Supply Copy", technical: "ZMEM_SUPPLY_COPY", system: "BW", status: "Overdue", start: "Jul 22, 05:30", duration: "—", durationMin: 0, steps: [] },
  { id: "RUN-2205", job: "Weekly Demand Snapshot", technical: "/IBP/DEM_SNAPSHOT_W", system: "IBP", status: "Finished", start: "Jul 21, 22:15", duration: "42m", durationMin: 42, steps: [{ name: "Freeze demand", status: "Finished" }, { name: "Snapshot", status: "Finished" }] },
  { id: "RUN-2206", job: "Capacity Rough-Cut", technical: "PLNG-CAP-ROUGHCUT", system: "ECC", status: "Scheduled", start: "Jul 22, 09:00", duration: "—", durationMin: 0, steps: [] },
];

const SYSTEM_TONE = { IBP: "info", ECC: "warning", BW: "accent" } as const;
const NAV = [
  { id: "overview", label: "Overview", icon: "layers" as const },
  { id: "runs", label: "Runs", icon: "run" as const, count: RUNS.length },
  { id: "readiness", label: "Readiness", icon: "check" as const },
  { id: "history", label: "History", icon: "clock" as const },
  { id: "alerts", label: "Alerts", icon: "bell" as const },
];

const DURATION_TREND = [
  { id: "ibp", label: "IBP", data: [81, 76, 88, 79, 84, 81, 77].map((y, i) => ({ x: new Date(2026, 6, 15 + i), y })) },
  { id: "ecc", label: "ECC", data: [24, 31, 22, 40, 28, 24, 26].map((y, i) => ({ x: new Date(2026, 6, 15 + i), y })) },
];
const OUTCOME_SLICES = [
  { label: "Finished", value: 78 },
  { label: "Aborted", value: 12 },
  { label: "Running", value: 8 },
  { label: "Overdue", value: 6 },
];

export function Benchmark() {
  const { toast } = useToast();
  const [nav, setNav] = useState("runs");
  const [systemFilter, setSystemFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string | null>(null);
  const [range, setRange] = useState<DateTimeRange>({ from: new Date(2026, 6, 15), to: new Date(2026, 6, 22) });
  const [sort, setSort] = useState<SortState>({ key: "start", dir: "asc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Run | null>(null);
  const [confirmAbort, setConfirmAbort] = useState(false);

  const rows = useMemo(() => {
    let out = RUNS.filter(
      (r) =>
        (systemFilter === "all" || r.system === systemFilter) &&
        (query === "" || r.job.toLowerCase().includes(query.toLowerCase()) || r.technical.toLowerCase().includes(query.toLowerCase())),
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    out = [...out].sort((a, b) =>
      sort.key === "duration"
        ? (a.durationMin - b.durationMin) * dir
        : String(a[sort.key as keyof Run] ?? "").localeCompare(String(b[sort.key as keyof Run] ?? "")) * dir,
    );
    return out;
  }, [systemFilter, query, sort]);

  const columns: Column<Run>[] = [
    {
      key: "job",
      header: "Job",
      sortable: true,
      width: "260px",
      render: (r) => (
        <Tooltip content={r.technical}>
          <span>{r.job}</span>
        </Tooltip>
      ),
      sub: (r) => r.technical,
      subMono: true,
    },
    { key: "system", header: "System", render: (r) => <Tag tone={SYSTEM_TONE[r.system]}>{r.system}</Tag> },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusBadge size="sm" status={mapLegacyStatus(r.status)} label={r.status} /> },
    { key: "start", header: "Start (PST)", sortable: true, mono: true },
    { key: "duration", header: "Duration", sortable: true, align: "right", mono: true },
  ];

  const detailDone = detail ? detail.steps.filter((s) => mapLegacyStatus(s.status) === "success").length : 0;

  return (
    <AppShell>
      <AppShell.Sidebar>
        <AppShell.Brand>
          <Inline gap={2}>
            <Icon name="layers" size={18} />
            <Text variant="lead" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              RapidX
            </Text>
          </Inline>
        </AppShell.Brand>
        <AppShell.NavSection title="Observability">
          {NAV.map((item) => (
            <AppShell.NavItem
              key={item.id}
              icon={<Icon name={item.icon} size={16} />}
              label={item.label}
              count={item.count}
              active={nav === item.id}
              onClick={() => setNav(item.id)}
            />
          ))}
        </AppShell.NavSection>
      </AppShell.Sidebar>

      <AppShell.Topbar>
        <Inline gap={4} justify="space-between" style={{ width: "100%" }}>
          <Breadcrumbs
            items={[
              { label: "Weekly", onClick: () => {} },
              { label: "Data Prep & Supply Run", onClick: () => {} },
              { label: "Runs" },
            ]}
          />
          <Inline gap={4}>
            <GlobalAlertPill count={7} label="orphans detected" onClick={() => toast({ title: "7 orphaned runs", description: "Open Settings → Orphaned Runs to reconcile.", status: "warning" })} />
            <Avatar name="Basil Varghese" size="sm" />
          </Inline>
        </Inline>
      </AppShell.Topbar>

      <AppShell.ContextBar>
        <Inline gap={4} justify="space-between" style={{ width: "100%" }}>
          <DateTimeRangePicker value={range} onChange={setRange} stepper="week" size="sm" />
          <Inline gap={3}>
            <SegmentedControl
              size="sm"
              options={[
                { value: "all", label: "All" },
                { value: "IBP", label: "IBP" },
                { value: "ECC", label: "ECC" },
                { value: "BW", label: "BW" },
              ]}
              value={systemFilter}
              onValueChange={(v) => {
                setSystemFilter(v);
                setPage(1);
              }}
              aria-label="Filter by system"
            />
            <Select
              size="sm"
              placeholder="All stages"
              options={[
                { value: "prep", label: "Data Prep", description: "L0 · master data & loads" },
                { value: "supply", label: "Supply Run", description: "L0 · replan execution" },
              ]}
              value={stage}
              onValueChange={setStage}
              aria-label="Stage"
            />
            <div style={{ width: 220 }}>
              <TextInput
                search
                size="sm"
                placeholder="Search jobs…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                onClear={() => setQuery("")}
                fullWidth
              />
            </div>
          </Inline>
        </Inline>
      </AppShell.ContextBar>

      <AppShell.Content>
        <Stack gap={8} style={{ maxWidth: 1180 }}>
          <Stack gap={1}>
            <Text variant="label-caps" tone="subtle">
              Weekly · Data Prep & Supply Run
            </Text>
            <Text variant="h1">Weekly Supply Replan</Text>
            <Text variant="body" tone="secondary">
              All tracked runs within this cycle. All times PST.
            </Text>
          </Stack>

          <Inline gap={6}>
            {[
              { label: "Runs", value: "104", delta: { text: "+9 vs last cycle", sentiment: "neutral" as const } },
              { label: "Avg duration", value: "1h 21m", delta: { text: "−12 min vs plan", sentiment: "positive" as const } },
              { label: "Abort rate", value: "4.6%", delta: { text: "+1.2 pts vs last cycle", sentiment: "negative" as const } },
              { label: "Steps nominal", value: "31 / 34", delta: { text: "3 exceptions need action", sentiment: "negative" as const } },
            ].map((kpi) => (
              <div key={kpi.label} style={{ flex: 1 }}>
                <KPITile label={kpi.label} value={kpi.value} delta={kpi.delta} />
              </div>
            ))}
          </Inline>

          <Inline gap={6} align="stretch">
            <Card variant="glass" padding={6} style={{ flex: 2 }}>
              <Stack gap={4}>
                <Text variant="label-caps" tone="subtle">
                  Run duration over cycle (min)
                </Text>
                <LineChart height={190} curve="monotone" showDots series={DURATION_TREND} yFormat={(v) => `${v}m`} />
              </Stack>
            </Card>
            <Card variant="glass" padding={6} style={{ flex: 1 }}>
              <Stack gap={4}>
                <Text variant="label-caps" tone="subtle">
                  Run outcomes
                </Text>
                <DonutChart height={190} centerLabel="Outcomes" slices={OUTCOME_SLICES} valueFormat={(v) => `${v}%`} />
              </Stack>
            </Card>
          </Inline>

          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            sort={sort}
            onSortChange={setSort}
            selection={{ selected, onChange: setSelected }}
            onRowClick={setDetail}
            expandable={(r) =>
              r.steps.length === 0 ? null : (
                <Stack gap={2}>
                  {r.steps.map((s, i) => (
                    <Inline key={s.name} gap={3}>
                      <Text variant="machine">{String(i + 1).padStart(2, "0")}</Text>
                      <Text variant="meta">{s.name}</Text>
                      <StatusBadge size="sm" status={mapLegacyStatus(s.status)} label={s.status} />
                    </Inline>
                  ))}
                </Stack>
              )
            }
            empty={
              <EmptyState
                title={`No jobs match “${query}”.`}
                description={`Clear the search to see all ${RUNS.length} runs in this cycle.`}
                action={
                  <Button variant="outline" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                }
              />
            }
          />
          <Inline justify="space-between">
            <Text variant="machine">{selected.size > 0 ? `${selected.size} selected` : `Showing ${rows.length} of ${RUNS.length} runs`}</Text>
            <Pagination page={page} pageCount={35} onPageChange={setPage} />
          </Inline>
        </Stack>
      </AppShell.Content>

      <Drawer open={detail !== null} onOpenChange={(open) => !open && setDetail(null)} size="md">
        <Drawer.Header eyebrow={detail?.id} title={detail?.job ?? ""} />
        <Drawer.Body>
          {detail && (
            <Stack gap={6}>
              <Inline gap={3}>
                <StatusBadge status={mapLegacyStatus(detail.status)} label={detail.status} />
                <Tag tone={SYSTEM_TONE[detail.system]}>{detail.system}</Tag>
                <Tag mono>{detail.technical}</Tag>
              </Inline>
              {detail.steps.length > 0 && (
                <Stack gap={2}>
                  <Text variant="label-caps" tone="subtle">
                    Step progress
                  </Text>
                  <ProgressBar value={(detailDone / detail.steps.length) * 100} label={`${detailDone} of ${detail.steps.length} done`} status={mapLegacyStatus(detail.status) === "critical" ? "critical" : "success"} />
                </Stack>
              )}
              <KeyValueList
                columns={2}
                items={[
                  { key: "L0 Stage", value: "Data Prep & Supply Run" },
                  { key: "Mode", value: "Automated" },
                  { key: "Start (PST)", value: detail.start, mono: true },
                  { key: "Duration", value: detail.duration === "—" ? undefined : detail.duration, mono: true },
                  { key: "Run ID", value: detail.id, mono: true },
                  { key: "Next est. run", value: "Jul 29, 19:00", mono: true },
                ]}
              />
            </Stack>
          )}
        </Drawer.Body>
        <Drawer.Footer>
          <Button fullWidth onClick={() => toast({ title: "Manual run added", description: `${detail?.job} queued behind the active run.`, status: "success" })}>
            Add manual run
          </Button>
          <Button variant="outline" fullWidth onClick={() => setConfirmAbort(true)} disabled={detail ? mapLegacyStatus(detail.status) !== "running" : true}>
            Abort run
          </Button>
        </Drawer.Footer>
      </Drawer>

      <ConfirmModal
        open={confirmAbort}
        onOpenChange={setConfirmAbort}
        destructive
        title="Abort this run?"
        body={`${detail?.job ?? "This job"} will stop after the current step. Completed steps are kept; downstream jobs stay blocked until a new run finishes.`}
        confirmLabel="Abort run"
        onConfirm={() => {
          setConfirmAbort(false);
          const aborted = detail?.id;
          setDetail(null);
          toast({ title: "Run aborted", description: `${aborted} stopped at the active step.`, status: "critical" });
        }}
      />
    </AppShell>
  );
}
