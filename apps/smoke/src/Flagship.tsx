import { useState } from "react";
import {
  Aurora,
  CascadeTimeline,
  ChatMessage,
  CompanionPanel,
  Inline,
  RunRefChip,
  Stack,
  StatusBadge,
  Text,
  ThinkingBlock,
  ThinkingStep,
  type CascadeStep,
} from "@shamrock-design/ui";

const d = (h: number, m = 0) => new Date(2026, 6, 22, h, m);

const STEPS: CascadeStep[] = [
  { id: "mds", label: "Master Data Sync", technical: "/IBP/MDMR_EXECUTE", start: d(19), end: d(20, 21), status: "success", unlocks: ["rbp"] },
  { id: "rbp", label: "RBP Load & Validation", technical: "PLNG-RBP-LOAD", start: d(20, 30), end: d(21), status: "critical", needs: ["mds"], gate: true, unlocks: ["srr", "dem"] },
  { id: "srr", label: "Exclude SRR", technical: "/IBP/SRR_EXCLUDE", start: d(21, 10), end: d(21, 40), status: "running", needs: ["rbp"], unlocks: ["cap"] },
  { id: "dem", label: "Demand Snapshot", technical: "/IBP/DEM_SNAPSHOT_W", start: d(21, 15), end: d(22), status: "pending", needs: ["rbp"], ghost: true },
  { id: "cap", label: "Capacity Rough-Cut", technical: "PLNG-CAP-ROUGHCUT", start: d(22), end: d(23), status: "pending", needs: ["srr"], kin: true },
];

export function Flagship() {
  const [expanded, setExpanded] = useState<string | undefined>("rbp");

  return (
    <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
      <Aurora />
      <Stack gap={8} style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Stack gap={1}>
          <Text variant="label-caps" tone="subtle">
            Flagship patterns
          </Text>
          <Text variant="h1">Cascade Timeline + AI Companion</Text>
          <Text variant="body" tone="secondary">
            The signature dependency waterfall with an in-place ego-graph, beside the AI companion kit.
          </Text>
        </Stack>

        <Inline gap={6} align="stretch">
          <div style={{ flex: 3, minWidth: 0 }}>
            <CascadeTimeline
              steps={STEPS}
              now={d(21, 25)}
              expandedId={expanded}
              onExpandedChange={(id) => setExpanded(id ?? undefined)}
              height={360}
            />
          </div>
          <div style={{ flex: 2, minWidth: 340, display: "flex" }}>
            <CompanionPanel
              title="RapidX Copilot"
              subtitle="Weekly Supply Replan"
              status="running"
              suggestions={[
                { label: "Why did RBP fail?" },
                { label: "Show blocked downstream" },
                { label: "Re-run from gate" },
              ]}
              onSend={() => {}}
            >
              <ChatMessage role="user">Why is the cascade stalled?</ChatMessage>
              <ChatMessage role="assistant">
                <Stack gap={3}>
                  <ThinkingBlock label="REASONING" stepCount={2} defaultOpen>
                    <ThinkingStep label="GATE">RBP Load & Validation failed its out-of-band check.</ThinkingStep>
                    <ThinkingStep label="IMPACT">2 downstream steps blocked until a new run clears the gate.</ThinkingStep>
                  </ThinkingBlock>
                  <Inline gap={2} align="center">
                    <StatusBadge status="critical" label="Gate blocked" size="sm" />
                    <RunRefChip>RUN-2202</RunRefChip>
                  </Inline>
                  <Text variant="body">
                    Validate bands aborted at 21:00. Capacity Rough-Cut stays pending until RBP re-runs clean.
                  </Text>
                </Stack>
              </ChatMessage>
            </CompanionPanel>
          </div>
        </Inline>
      </Stack>
    </div>
  );
}
