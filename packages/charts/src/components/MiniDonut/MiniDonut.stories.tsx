import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MiniDonut } from "./MiniDonut";

const meta = {
  title: "Charts/MiniDonut",
  component: MiniDonut,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MiniDonut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 64, size: 16, tone: "accent", ariaLabel: "64% complete" },
};

const nodeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--sh-font-family-machine)",
  fontSize: "var(--sh-font-size-meta)",
  color: "var(--sh-color-text-secondary)",
};

export const AllVariants: Story = {
  args: { value: 0 },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 20 }}>
        {[0, 25, 50, 75, 100].map((v) => (
          <span key={v} style={nodeStyle}>
            <MiniDonut value={v} size={16} tone="accent" />
            {v}%
          </span>
        ))}
      </div>
      {/* DAG-node glyph: ring + machine-face progress, status tone beside a label. */}
      <div style={{ display: "flex", gap: 20 }}>
        <span style={nodeStyle}>
          <MiniDonut value={100} size={14} tone="success" /> Extract
        </span>
        <span style={nodeStyle}>
          <MiniDonut value={72} size={14} tone="accent" /> Transform
        </span>
        <span style={nodeStyle}>
          <MiniDonut value={40} size={14} tone="warning" /> Load
        </span>
        <span style={nodeStyle}>
          <MiniDonut value={0} size={14} tone="neutral" /> Publish
        </span>
      </div>
    </div>
  ),
};
