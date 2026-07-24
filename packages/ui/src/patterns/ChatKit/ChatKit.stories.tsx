import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Aurora, Stack, StatusBadge, Text } from "../../index";
import { AgentOrb } from "./AgentOrb";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage } from "./ChatMessage";
import { CompanionPanel } from "./CompanionPanel";
import { RunRefChip } from "./RunRefChip";
import { SuggestionChips } from "./SuggestionChips";
import { ThinkingBlock, ThinkingStep } from "./ThinkingBlock";

const meta = {
  title: "Patterns/ChatKit",
  component: CompanionPanel,
  args: { title: "Planning Intelligence", onSend: () => {} },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SUGGESTIONS = [
  "Why is the supply solve at risk this week?",
  "Has the OPO shortfall happened before?",
  "What's different vs a typical week?",
];

interface Turn {
  role: "user" | "assistant";
  ts: string;
  content: ReactNode;
}

const FAILED_RUN_ANSWER = (
  <Stack gap={3}>
    <ThinkingBlock label="REASONING" stepCount={3}>
      <ThinkingStep label="Gate">
        The supply solve is gated by <b>Stock/OPO check</b>, which holds the pre-solve gate.
      </ThinkingStep>
      <ThinkingStep label="Signal">
        Open production orders are <b>18% below the expected floor</b> — 2.3M vs a 2.8–3.2M band.
      </ThinkingStep>
      <ThinkingStep label="Cause">
        Twelve SKUs loaded <b>qty=0</b> after a date-column format change at source.
      </ThinkingStep>
    </ThinkingBlock>
    <div>
      Right now <b>Stock/OPO check</b> is{" "}
      <StatusBadge status="critical" label="Failing" size="sm" /> — it holds <b>CRT solve run</b> until open
      orders recover. The signature matches one prior run:{" "}
      <RunRefChip icon="clock" onClick={() => {}}>
        R1-2026-W21
      </RunRefChip>
      , where the root cause was a late APO extract instead.
    </div>
  </Stack>
);

const INITIAL_TURNS: Turn[] = [
  {
    role: "assistant",
    ts: "16:40",
    content: (
      <>
        I&rsquo;m grounded in this run and the last <b>8 weekly snapshots</b> — not guessing. Ask about risk,
        root cause, or week-over-week trends.
      </>
    ),
  },
  { role: "user", ts: "16:41", content: "Why did the supply solve fail this week?" },
  { role: "assistant", ts: "16:42", content: FAILED_RUN_ANSWER },
];

function CompanionConversation() {
  const [turns, setTurns] = useState<Turn[]>(INITIAL_TURNS);

  const handleSend = (text: string) => {
    setTurns((prev) => [
      ...prev,
      { role: "user", ts: "now", content: text },
      {
        role: "assistant",
        ts: "now",
        content: (
          <>
            Grounded in this run + the last 8 snapshots: it&rsquo;s <b>40% complete</b>, <b>ahead of plan</b>,
            with <b>2 open cases</b> (1 critical) and data health at <b>88%</b> vs a ~92% trailing average.{" "}
            <RunRefChip icon="clock" onClick={() => {}}>
              R1-2026-W21
            </RunRefChip>
          </>
        ),
      },
    ]);
  };

  return (
    <>
      <Aurora />
      <div style={{ height: "100vh", display: "flex", justifyContent: "flex-end", padding: "var(--sh-space-8)" }}>
        <div style={{ width: 384, maxWidth: "100%", height: "100%" }}>
          <CompanionPanel
            title="Planning Intelligence"
            subtitle="grounded in run history · R1-2026-W22"
            status="success"
            onClose={() => {}}
            onSend={handleSend}
            placeholder="Ask about the run…"
            suggestions={SUGGESTIONS.map((label) => ({ label, onClick: () => handleSend(label) }))}
          >
            {turns.map((t, i) => (
              <ChatMessage key={i} role={t.role} timestamp={t.ts}>
                {t.content}
              </ChatMessage>
            ))}
          </CompanionPanel>
        </div>
      </div>
    </>
  );
}

export const Default: Story = {
  name: "CompanionPanel — failed-run conversation",
  render: () => <CompanionConversation />,
};

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={3}>
      <Text variant="label-caps" tone="subtle">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

export const AllVariants: Story = {
  name: "AllVariants — pieces in isolation",
  render: () => (
    <>
      <Aurora />
      <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
        <Stack gap={8} style={{ maxWidth: 560 }}>
          <Section label="AgentOrb — presence dot = status">
            <Stack gap={0} align="center" style={{ flexDirection: "row", gap: "var(--sh-space-5)" }}>
              <AgentOrb size="md" status="success" label="Online" />
              <AgentOrb size="md" status="running" label="Working" />
              <AgentOrb size="md" status="warning" label="Degraded" />
              <AgentOrb size="sm" icon="run" />
              <AgentOrb size="md" />
            </Stack>
          </Section>

          <Section label="ChatMessage — assistant vs user">
            <Stack gap={5}>
              <ChatMessage role="assistant" timestamp="16:40">
                I&rsquo;m grounded in this run and the last <b>8 weekly snapshots</b>. Ask about risk or root
                cause.
              </ChatMessage>
              <ChatMessage role="user" timestamp="16:41">
                Why did the supply solve fail this week?
              </ChatMessage>
            </Stack>
          </Section>

          <Section label="ThinkingBlock — idle (with steps) and active">
            <Stack gap={4}>
              <ThinkingBlock label="REASONING" stepCount={3}>
                <ThinkingStep label="Gate">Supply solve gated by Stock/OPO check.</ThinkingStep>
                <ThinkingStep label="Signal">Open orders 18% below the floor.</ThinkingStep>
                <ThinkingStep label="Cause">12 SKUs loaded qty=0 after a date-format change.</ThinkingStep>
              </ThinkingBlock>
              <ThinkingBlock label="ANALYZING RUN" active defaultOpen={false} />
            </Stack>
          </Section>

          <Section label="SuggestionChips — prompt starters">
            <SuggestionChips items={SUGGESTIONS.map((label) => ({ label, onClick: () => {} }))} />
          </Section>

          <Section label="RunRefChip — clickable and static, inline">
            <Text variant="body" tone="secondary">
              Same signature appeared in{" "}
              <RunRefChip icon="clock" onClick={() => {}}>
                R1-2026-W21
              </RunRefChip>{" "}
              and doc{" "}
              <RunRefChip icon="layers">supply-solve-v13.md</RunRefChip>.
            </Text>
          </Section>

          <Section label="ChatComposer — Enter sends, Shift+Enter newlines">
            <ChatComposer onSend={() => {}} placeholder="Ask about the run…" />
          </Section>
        </Stack>
      </div>
    </>
  ),
};
