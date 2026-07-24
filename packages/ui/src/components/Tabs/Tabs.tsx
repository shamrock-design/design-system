import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Tabs.module.css";

export type TabsVariant = "underline" | "pill";
export type TabsSize = "sm" | "md";

export interface TabItem {
  value: string;
  label: ReactNode;
  iconStart?: ReactNode;
  /** Small machine-face counter pill (row counts, result counts). */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  items: TabItem[];
  /** `underline` for page/section level; `pill` for dense toolbars. */
  variant?: TabsVariant;
  size?: TabsSize;
  /** Controlled active value. */
  value?: string;
  /** Uncontrolled initial value. Defaults to the first enabled item. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Renders one styled panel per item. Alternative to `<TabsPanel>` children. */
  renderPanel?: (value: string) => ReactNode;
  /** `<TabsPanel>` elements, for custom or `keepMounted` panels. */
  children?: ReactNode;
}

/**
 * THE tab strip — the unification of the three drifted production tab styles.
 * View switching only: never navigation (links), never actions (Button).
 */
export function Tabs({
  items,
  variant = "underline",
  size = "md",
  value,
  defaultValue,
  onValueChange,
  renderPanel,
  className,
  children,
  ...rest
}: TabsProps) {
  const resolvedDefault =
    value === undefined ? (defaultValue ?? items.find((item) => !item.disabled)?.value) : undefined;
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={resolvedDefault}
      onValueChange={onValueChange ? (next) => onValueChange(next as string) : undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <BaseTabs.List activateOnFocus className={[styles.list, styles[variant], styles[size]].join(" ")}>
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} value={item.value} disabled={item.disabled} className={styles.tab}>
            {item.iconStart}
            {item.label}
            {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {renderPanel
        ? items.map((item) => (
            <BaseTabs.Panel key={item.value} value={item.value} className={styles.panel}>
              {renderPanel(item.value)}
            </BaseTabs.Panel>
          ))
        : children}
    </BaseTabs.Root>
  );
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Shown when the Tab with the matching value is active. */
  value: string;
  /** Keep the panel in the DOM while hidden. */
  keepMounted?: boolean;
}

/** Styled Base UI panel for use as `<Tabs>` children when `renderPanel` isn't enough. */
export function TabsPanel({ className, ...rest }: TabsPanelProps) {
  return <BaseTabs.Panel className={[styles.panel, className].filter(Boolean).join(" ")} {...rest} />;
}
