import { useState } from "react";
import {
  Button,
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
} from "@shamrock-design/ui";
import { Icon } from "@shamrock-design/icons";
import { RUN_ID, RUN_NOW, RUN_PROCESS, RUN_STEPS } from "./data";

export function BuilderView({ onBack }: { onBack?: () => void }) {
  // Default the ego-graph open on the gate step that stalled the run.
  const [expanded, setExpanded] = useState<string | undefined>("rbp");

  return (
    <Stack gap={6} style={{ width: "100%" }}>
      {/* Workspace bar */}
      <Inline gap={4} align="center">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Back to processes"
          onClick={onBack}
        >
          <Icon name="chevron-left" size={16} />
        </Button>
        <Stack gap={1}>
          <Text variant="h3">{RUN_PROCESS.name}</Text>
          <Text variant="machine" tone="subtle">
            v_alpha · {RUN_ID}
          </Text>
        </Stack>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="md">
          Run
        </Button>
      </Inline>

      {/* Two columns: cascade builder + Ask SPNR companion */}
      <Inline gap={6} align="stretch">
        <div style={{ flex: 3, minWidth: 0 }}>
          <Stack gap={2}>
            <Text variant="label-caps" tone="subtle">
              Run cascade
            </Text>
            <CascadeTimeline
              steps={RUN_STEPS}
              now={RUN_NOW}
              height={380}
              expandedId={expanded}
              onExpandedChange={(id) => setExpanded(id ?? undefined)}
            />
          </Stack>
        </div>

        <div style={{ flex: 2, minWidth: 360, display: "flex" }}>
          <CompanionPanel
            title="Ask SPNR"
            subtitle={`grounded in ${RUN_ID} · Weekly Supply Replan`}
            status="running"
            onSend={() => {}}
            suggestions={[
              { label: "Why did RBP fail?" },
              { label: "Show blocked steps" },
              { label: "Re-run from the gate" },
            ]}
          >
            <ChatMessage role="user">Why is the cascade stalled?</ChatMessage>
            <ChatMessage role="assistant">
              <Stack gap={3}>
                <ThinkingBlock label="REASONING" stepCount={2} defaultOpen>
                  <ThinkingStep label="GATE">
                    RBP Load &amp; Validation is a gate — it aborted at 21:00, so the run cannot
                    clear its out-of-band check.
                  </ThinkingStep>
                  <ThinkingStep label="IMPACT">
                    Everything downstream of the gate is held: Capacity Rough-Cut stays pending
                    until RBP re-runs clean.
                  </ThinkingStep>
                </ThinkingBlock>
                <Inline gap={2} align="center">
                  <StatusBadge status="critical" label="Gate blocked" size="sm" />
                  <RunRefChip>{RUN_ID}</RunRefChip>
                </Inline>
                <Text variant="body">
                  RBP Load &amp; Validation aborted at 21:00. Capacity Rough-Cut stays pending
                  until RBP re-runs clean and the gate reopens.
                </Text>
              </Stack>
            </ChatMessage>
          </CompanionPanel>
        </div>
      </Inline>
    </Stack>
  );
}
