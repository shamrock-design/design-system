import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Stack, StatusBadge, Tag, Text, mapLegacyStatus, type TagTone } from "../../index";
import { DataTable, type Column, type SortState } from "./DataTable";
import { Pagination } from "./Pagination";

interface JobRow {
  id: string;
  name: string;
  program: string;
  system: "IBP" | "ECC" | "BW";
  status: string;
  lastRun: string; // preformatted per date-time-format.md (MMM D, HH:mm)
  duration: string; // largest two units
}

const jobs: JobRow[] = [
  { id: "job-01", name: "MDM refresh", program: "/IBP/MDMR_EXECUTE", system: "IBP", status: "Finished", lastRun: "Jul 22, 16:40", duration: "1h 21m" },
  { id: "job-02", name: "Demand plan sync", program: "/IBP/DP_SYNC_BATCH", system: "IBP", status: "Running", lastRun: "Jul 22, 15:05", duration: "21m 40s" },
  { id: "job-03", name: "Material master extract", program: "ZMM_MAT_EXTRACT", system: "ECC", status: "Aborted", lastRun: "Jul 22, 04:00", duration: "4m 12s" },
  { id: "job-04", name: "Inventory snapshot", program: "ZWM_INV_SNAP", system: "ECC", status: "Finished", lastRun: "Jul 21, 22:30", duration: "58m 02s" },
  { id: "job-05", name: "Sales history load", program: "BW_SD_HIST_LOAD", system: "BW", status: "Overdue", lastRun: "Jul 20, 06:01", duration: "2h 44m" },
  { id: "job-06", name: "Forecast accuracy calc", program: "/IBP/FA_CALC_WKLY", system: "IBP", status: "Queued", lastRun: "Jul 19, 19:00", duration: "40s" },
];

const SYSTEM_TONE: Record<JobRow["system"], TagTone> = {
  IBP: "info",
  ECC: "warning",
  BW: "neutral",
};

const jobColumns: Column<JobRow>[] = [
  {
    key: "name",
    header: "Job",
    sortable: true,
    width: "240px",
    sub: (row) => row.program,
    subMono: true,
  },
  {
    key: "system",
    header: "System",
    render: (row) => (
      <Tag tone={SYSTEM_TONE[row.system]} mono size="sm">
        {row.system}
      </Tag>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusBadge status={mapLegacyStatus(row.status)} size="sm" />,
  },
  { key: "lastRun", header: "Last run", sortable: true, mono: true },
  { key: "duration", header: "Duration", mono: true, align: "right" },
];

function sortJobs(rows: JobRow[], sort: SortState): JobRow[] {
  const sorted = [...rows].sort((a, b) =>
    String(a[sort.key as keyof JobRow]).localeCompare(String(b[sort.key as keyof JobRow])),
  );
  return sort.dir === "asc" ? sorted : sorted.reverse();
}

/** Sorting LOGIC lives with the consumer — the table only renders indicators and emits. */
function JobsTable() {
  const [sort, setSort] = useState<SortState>({ key: "name", dir: "asc" });
  return (
    <DataTable
      columns={jobColumns}
      rows={sortJobs(jobs, sort)}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  args: {
    columns: jobColumns,
    rows: jobs,
    rowKey: (row: JobRow) => row.id,
  },
} satisfies Meta<typeof DataTable<JobRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <JobsTable />,
};

function expandedRunDetail(row: JobRow): ReactNode {
  return (
    <Stack gap={4}>
      <Text variant="label-caps" tone="subtle">
        Last run detail
      </Text>
      <Inline gap={8}>
        <Stack gap={1}>
          <Text variant="caption" tone="subtle">
            Program
          </Text>
          <Text variant="machine">{row.program}</Text>
        </Stack>
        <Stack gap={1}>
          <Text variant="caption" tone="subtle">
            Started
          </Text>
          <Text variant="machine">{row.lastRun}</Text>
        </Stack>
        <Stack gap={1}>
          <Text variant="caption" tone="subtle">
            Duration
          </Text>
          <Text variant="machine">{row.duration} · +4m vs plan</Text>
        </Stack>
      </Inline>
    </Stack>
  );
}

function FullFeaturedTable() {
  const [sort, setSort] = useState<SortState>({ key: "lastRun", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set(["job-02"]));
  const [page, setPage] = useState(7);
  return (
    <Stack gap={0}>
      <DataTable
        columns={jobColumns}
        rows={sortJobs(jobs, sort)}
        rowKey={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        selection={{ selected, onChange: setSelected }}
        expandable={(row) => (row.system === "BW" ? null : expandedRunDetail(row))}
        onRowClick={(row) => console.info("row click", row.id)}
      />
      <Pagination page={page} pageCount={35} onPageChange={setPage} totalLabel="Showing 49–56 of 11,265" />
    </Stack>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={2}>
      <Text variant="label-caps" tone="subtle">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Section label="sortable + selectable + expandable + pagination (BW rows not expandable)">
        <FullFeaturedTable />
      </Section>
      <Section label="loading">
        <DataTable columns={jobColumns} rows={[]} rowKey={(row: JobRow) => row.id} loading />
      </Section>
      <Section label="empty">
        <DataTable
          columns={jobColumns}
          rows={[]}
          rowKey={(row: JobRow) => row.id}
          empty={
            <Stack gap={1} align="center">
              <Text variant="body" tone="secondary">
                No job runs yet.
              </Text>
              <Text variant="meta" tone="subtle">
                Runs appear here once a sync is triggered.
              </Text>
            </Stack>
          }
        />
      </Section>
      <Section label="compact">
        <DataTable columns={jobColumns} rows={jobs} rowKey={(row) => row.id} density="compact" />
      </Section>
    </Stack>
  ),
};
