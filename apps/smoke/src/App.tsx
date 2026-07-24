import { useState } from "react";
import { SegmentedControl, ToastProvider } from "@shamrock-design/ui";
import { Benchmark } from "./Benchmark";
import { Flagship } from "./Flagship";
import { Foundations } from "./Foundations";

const THEMES = ["neutral", "clover", "violet"] as const;

export function App() {
  const [theme, setTheme] = useState<string>("clover");
  const [page, setPage] = useState("benchmark");

  return (
    <ToastProvider>
      {/* Floating dev switcher — sits above whatever chrome each page renders. */}
      <div
        style={{
          position: "fixed",
          top: "var(--sh-space-4)",
          right: "var(--sh-space-4)",
          zIndex: 90,
          display: "flex",
          gap: "var(--sh-space-3)",
          padding: "var(--sh-space-2)",
          background: "var(--sh-surface-overlay)",
          border: "1px solid var(--sh-color-border-hairline)",
          backdropFilter: "blur(16px)",
        }}
      >
        <SegmentedControl
          size="sm"
          options={[
            { value: "benchmark", label: "Benchmark" },
            { value: "flagship", label: "Flagship" },
            { value: "foundations", label: "Foundations" },
          ]}
          value={page}
          onValueChange={setPage}
          aria-label="Page"
        />
        <SegmentedControl
          size="sm"
          options={THEMES.map((t) => ({ value: t, label: t }))}
          value={theme}
          onValueChange={(t) => {
            setTheme(t);
            document.documentElement.setAttribute("data-theme", t);
          }}
          aria-label="Theme"
        />
      </div>
      {page === "benchmark" ? <Benchmark /> : page === "flagship" ? <Flagship /> : <Foundations />}
    </ToastProvider>
  );
}
