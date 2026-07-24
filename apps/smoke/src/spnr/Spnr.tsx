import { useState } from "react";
import { ProcessesView } from "./ProcessesView";
import { BuilderView } from "./BuilderView";

type SpnrView = { name: "processes" } | { name: "builder"; processId: string };

/**
 * spnr flagship rebuild (benchmark quality gate) — the agentic-workflow app's two
 * flagship screens rebuilt entirely from `@shamrock-design/*`: the Processes
 * landing and the run builder + "Ask SPNR" companion. Opening a process routes to
 * the builder; the back affordance returns. Each view is a self-contained page
 * (own Aurora backdrop), so this is just the router between them.
 */
export function Spnr() {
  const [view, setView] = useState<SpnrView>({ name: "processes" });

  if (view.name === "builder") {
    return <BuilderView onBack={() => setView({ name: "processes" })} />;
  }
  return <ProcessesView onOpenProcess={(processId) => setView({ name: "builder", processId })} />;
}
