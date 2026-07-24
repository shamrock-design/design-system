import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { Aurora } from "../../primitives/Aurora/Aurora";
import styles from "./AppShell.module.css";

interface AppShellContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const AppShellContext = createContext<AppShellContextValue>({
  collapsed: false,
  toggleCollapsed: () => undefined,
});

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled sidebar collapse state. Leave unset for uncontrolled. */
  collapsed?: boolean;
  /** Uncontrolled initial collapse state. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * The page chassis: Aurora backdrop + glass sidebar + main column
 * (topbar / optional context bar / scrollable content). Mount once at the
 * app root. Compose with `AppShell.Sidebar`, `.Topbar`, `.ContextBar`, `.Content`.
 */
function AppShellRoot({
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  children,
  ...rest
}: AppShellProps) {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;
  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    if (collapsedProp === undefined) setCollapsedState(next);
    onCollapsedChange?.(next);
  }, [collapsed, collapsedProp, onCollapsedChange]);
  const context = useMemo(() => ({ collapsed, toggleCollapsed }), [collapsed, toggleCollapsed]);
  return (
    <AppShellContext.Provider value={context}>
      <div
        className={[styles.shell, collapsed && styles.collapsed, className].filter(Boolean).join(" ")}
        {...rest}
      >
        <Aurora />
        {children}
      </div>
    </AppShellContext.Provider>
  );
}

/** Glass navigation rail. Children: `AppShell.Brand`, `AppShell.NavSection`. */
function Sidebar({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <aside className={[styles.sidebar, className].filter(Boolean).join(" ")} {...rest} />;
}

export interface AppShellBrandProps extends HTMLAttributes<HTMLDivElement> {
  /** Hide the collapse chevron — only when collapse is driven elsewhere. */
  showCollapseToggle?: boolean;
}

/** Wordmark slot at the top of the sidebar, with the collapse toggle. */
function Brand({ showCollapseToggle = true, className, children, ...rest }: AppShellBrandProps) {
  const { collapsed, toggleCollapsed } = useContext(AppShellContext);
  return (
    <div className={[styles.brand, className].filter(Boolean).join(" ")} {...rest}>
      {!collapsed && <div className={styles.brandSlot}>{children}</div>}
      {showCollapseToggle && (
        <button
          type="button"
          className={styles.collapseToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={toggleCollapsed}
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
            className={styles.collapseGlyph}
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export interface AppShellNavSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section eyebrow (label-caps, subtle). Hidden when collapsed; still labels the nav. */
  title?: string;
}

/** A titled group of `AppShell.NavItem`s. Renders a semantic `<nav>`. */
function NavSection({ title, className, children, ...rest }: AppShellNavSectionProps) {
  return (
    <nav
      aria-label={title}
      className={[styles.navSection, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {title !== undefined && (
        <span className={styles.navSectionTitle} aria-hidden="true">
          {title}
        </span>
      )}
      {children}
    </nav>
  );
}

export interface AppShellNavItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  icon?: ReactNode;
  label: string;
  /** Current destination: solid surface + accent text + 2px left accent bar + aria-current. */
  active?: boolean;
  /** Machine-face count pill (row counts, orphans). Hidden when collapsed. */
  count?: number;
  /** Renders an `<a>` — prefer this for real navigation. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

/** One destination in the sidebar. `<a>` when `href` is given, `<button>` otherwise. */
function NavItem({ icon, label, active = false, count, href, onClick, className, ...rest }: AppShellNavItemProps) {
  const { collapsed } = useContext(AppShellContext);
  const sharedProps = {
    className: [styles.navItem, active && styles.navItemActive, className].filter(Boolean).join(" "),
    "aria-current": active ? ("page" as const) : undefined,
    title: collapsed ? label : undefined,
    onClick,
    ...rest,
  };
  const content = (
    <>
      {icon !== undefined && (
        <span className={styles.navItemIcon} aria-hidden={!collapsed || undefined}>
          {icon}
        </span>
      )}
      <span className={styles.navItemLabel}>{label}</span>
      {count !== undefined && <span className={styles.navItemCount}>{count}</span>}
    </>
  );
  if (href !== undefined) {
    return (
      <a href={href} {...(sharedProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...(sharedProps as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

export interface AppShellTopbarProps extends HTMLAttributes<HTMLElement> {
  /** Left slot: Breadcrumbs / page context. Children also land here. */
  start?: ReactNode;
  /** Right-aligned slot row: search, GlobalAlertPill, avatar. */
  end?: ReactNode;
}

/** Glass header bar across the main column. */
function Topbar({ start, end, className, children, ...rest }: AppShellTopbarProps) {
  return (
    <header className={[styles.topbar, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.topbarStart}>
        {start}
        {children}
      </div>
      <div className={styles.topbarEnd}>{end}</div>
    </header>
  );
}

/** Optional second bar under the topbar — filters, scope pickers. */
function ContextBar({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.contextBar, className].filter(Boolean).join(" ")} {...rest} />;
}

/** The scrollable page region. */
function Content({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <main className={[styles.content, className].filter(Boolean).join(" ")} {...rest} />;
}

export const AppShell = Object.assign(AppShellRoot, {
  Sidebar,
  Brand,
  NavSection,
  NavItem,
  Topbar,
  ContextBar,
  Content,
});
