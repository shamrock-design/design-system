import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";
import type { ChartTone } from "../../lib/types";

const durations = [72, 74, 69, 78, 81, 76, 70, 68, 71, 66, 64, 69, 72, 70];
const rising = [3, 5, 4, 8, 7, 11, 10, 14];
const falling = [14, 12, 13, 9, 10, 6, 5, 3];

const meta = {
  title: "Charts/Sparkline",
  component: Sparkline,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: durations, width: 120, height: 28, ariaLabel: "IBP load duration, last 14 runs" },
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontFamily: "var(--sh-font-family-sans)",
  fontSize: "var(--sh-font-size-caption)",
  color: "var(--sh-color-text-secondary)",
};

export const AllVariants: Story = {
  args: { data: durations },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={rowStyle}>
        <Sparkline data={durations} tone="neutral" width={120} height={28} />
        <span>neutral — the calm default</span>
      </div>
      <div style={rowStyle}>
        <Sparkline data={rising} tone="accent" width={120} height={28} showEndDot />
        <span>accent — emphasis, with end dot</span>
      </div>
      {/* Status tones are legal ONLY beside a visible status label. */}
      <div style={rowStyle}>
        <Sparkline data={rising} tone="critical" width={120} height={28} />
        <span style={{ color: "var(--sh-color-status-critical-text)" }}>Failing — error rate rising</span>
      </div>
      <div style={rowStyle}>
        <Sparkline data={falling} tone="success" width={120} height={28} />
        <span style={{ color: "var(--sh-color-status-success-text)" }}>Recovering — backlog draining</span>
      </div>
    </div>
  ),
};

export const Tones: Story = {
  args: { data: durations },
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {(["neutral", "accent", "info", "warning", "critical", "success"] as ChartTone[]).map((tone) => (
        <Sparkline key={tone} data={durations} tone={tone} width={88} height={24} />
      ))}
    </div>
  ),
};
