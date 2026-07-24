import { useState } from "react";
import { Aurora, Inline, SegmentedControl, Stack, Text, ToastProvider } from "@shamrock-design/ui";
import { Benchmark } from "./Benchmark";
import { Foundations } from "./Foundations";

const THEMES = ["neutral", "clover", "violet"] as const;

export function App() {
  const [theme, setTheme] = useState<string>("clover");
  const [page, setPage] = useState("benchmark");

  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", padding: "var(--sh-space-9)" }}>
        <Aurora />
        <Stack gap={8} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Inline justify="space-between" gap={4}>
            <Inline gap={4}>
              <Text variant="h3">Shamrock smoke</Text>
              <SegmentedControl
                size="sm"
                options={[
                  { value: "benchmark", label: "Benchmark rebuild" },
                  { value: "foundations", label: "Foundations" },
                ]}
                value={page}
                onValueChange={setPage}
                aria-label="Page"
              />
            </Inline>
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
          </Inline>
          {page === "benchmark" ? <Benchmark /> : <Foundations />}
        </Stack>
      </div>
    </ToastProvider>
  );
}
