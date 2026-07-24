import { useMemo, useState } from "react";
import {
  Button,
  ConfirmModal,
  DataTable,
  EmptyState,
  Inline,
  KeyValueList,
  KPITile,
  mapLegacyStatus,
  Modal,
  Pagination,
  SegmentedControl,
  Select,
  Stack,
  StatusBadge,
  Tabs,
  Tag,
  Text,
  TextInput,
  Tooltip,
  useToast,
  type Column,
  type SortState,
} from "@shamrock-design/ui";
import { Icon } from "@shamrock-design/icons";

/**
 * Phase 2 acceptance gate: the Planning "job runs" screen rebuilt purely from
 * @shamrock-design/ui + tokens. Permanent regression fixture — must build forever.
 */

interface Run {
  id: string;
  job: string;
  technical: string;
  system: "IBP" | "ECC" | "BW";
  status: string; // legacy vocab on purpose — normalized at the boundary
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

export function Benchmark() {
  const { toast } = useToast();
  const [tab, setTab] = useState("runs");
  const [systemFilter, setSystemFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string | null>(null);
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
    out = [...out].sort((a, b) => {
      if (sort.key === "duration") return (a.durationMin - b.durationMin) * dir;
      const av = String(a[sort.key as keyof Run] ?? "");
      const bv = String(b[sort.key as keyof Run] ?? "");
      return av.localeCompare(bv) * dir;
    });
    return out;
  }, [systemFilter, query, sort]);

  const columns: Column<Run>[] = [
    {
      key: "job",
      header: "Job",
      sortable: true,
      width: "280px",
      render: (r) => (
        <Tooltip content={r.technical}>
          <span>{r.job}</span>
        </Tooltip>
      ),
      sub: (r) => r.technical,
      subMono: true,
    },
    { key: "system", header: "System", render: (r) => <Tag tone={SYSTEM_TONE[r.system]}>{r.system}</Tag> },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <StatusBadge size="sm" status={mapLegacyStatus(r.status)} label={r.status} />,
    },
    { key: "start", header: "Start (PST)", sortable: true, mono: true },
    { key: "duration", header: "Duration", sortable: true, align: "right", mono: true },
  ];

  return (
    <Stack gap={8}>
      <Inline justify="space-between" gap={4}>
        <Stack gap={1}>
          <Text variant="label-caps" tone="subtle">
            Weekly · Data Prep & Supply Run
          </Text>
          <Text variant="h1">Weekly Supply Replan</Text>
          <Text variant="body" tone="secondary">
            All tracked runs within this cycle. All times PST.
          </Text>
        </Stack>
        <Inline gap={3}>
          <Button variant="outline" iconStart={<Icon name="clock" size={14} />}>
            Execution history
          </Button>
          <Button
            iconStart={<Icon name="run" size={14} />}
            onClick={() => toast({ title: "Run started", description: "Master Data Sync queued as RUN-2207.", status: "success" })}
          >
            Run Sync
          </Button>
        </Inline>
      </Inline>

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

      <Tabs
        items={[
          { value: "overview", label: "Overview" },
          { value: "runs", label: "Runs", count: rows.length },
          { value: "readiness", label: "Readiness" },
        ]}
        value={tab}
        onValueChange={setTab}
        renderPanel={(value) =>
          value === "runs" ? (
            <Stack gap={5} style={{ paddingTop: "var(--sh-space-6)" }}>
              <Inline gap={4} justify="space-between">
                <Inline gap={4}>
                  <SegmentedControl
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
                    placeholder="All stages"
                    options={[
                      { value: "prep", label: "Data Prep", description: "L0 · master data & loads" },
                      { value: "supply", label: "Supply Run", description: "L0 · replan execution" },
                    ]}
                    value={stage}
                    onValueChange={setStage}
                    aria-label="Stage"
                  />
                </Inline>
                <div style={{ width: 260 }}>
                  <TextInput
                    search
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
                <Text variant="machine">
                  {selected.size > 0 ? `${selected.size} selected` : `Showing ${rows.length} of ${RUNS.length} runs`}
                </Text>
                <Pagination page={page} pageCount={35} onPageChange={setPage} />
              </Inline>
            </Stack>
          ) : (
            <div style={{ paddingTop: "var(--sh-space-8)" }}>
              <EmptyState
                title="Not instrumented yet."
                description="This view arrives with the Phase 3 shell — data appears once the stage reports."
              />
            </div>
          )
        }
      />

      <Modal open={detail !== null} onOpenChange={(open) => !open && setDetail(null)} size="md">
        <Modal.Header title={detail?.job ?? ""} description={detail?.id} />
        <Modal.Body>
          {detail && (
            <Stack gap={6}>
              <Inline gap={3}>
                <StatusBadge status={mapLegacyStatus(detail.status)} label={detail.status} />
                <Tag tone={SYSTEM_TONE[detail.system]}>{detail.system}</Tag>
                <Tag mono>{detail.technical}</Tag>
              </Inline>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDetail(null)}>
            Close
          </Button>
          <Button variant="outline" onClick={() => setConfirmAbort(true)} disabled={detail ? mapLegacyStatus(detail.status) !== "running" : true}>
            Abort run
          </Button>
          <Button onClick={() => toast({ title: "Manual run added", description: `${detail?.job} queued behind the active run.`, status: "success" })}>
            Add manual run
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        open={confirmAbort}
        onOpenChange={setConfirmAbort}
        destructive
        title="Abort this run?"
        body={`${detail?.job ?? "This job"} will stop after the current step. Completed steps are kept; downstream jobs stay blocked until a new run finishes.`}
        confirmLabel="Abort run"
        onConfirm={() => {
          setConfirmAbort(false);
          setDetail(null);
          toast({ title: "Run aborted", description: `${detail?.id} stopped at the active step.`, status: "critical" });
        }}
      />
    </Stack>
  );
}
