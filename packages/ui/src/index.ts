import "./styles/reset.css";

export { Stack, Inline, Grid } from "./primitives/Stack/Stack";
export type { SpaceToken } from "./primitives/Stack/Stack";
export { Text } from "./primitives/Text/Text";
export type { TextProps, TextVariant, TextTone } from "./primitives/Text/Text";
export { VisuallyHidden } from "./primitives/VisuallyHidden/VisuallyHidden";
export { Aurora } from "./primitives/Aurora/Aurora";

export { STATUSES, STATUS_LABELS, mapLegacyStatus } from "./constants/status";
export type { Status } from "./constants/status";

export { Button } from "./components/Button/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button/Button";
export { StatusBadge } from "./components/StatusBadge/StatusBadge";
export type { StatusBadgeProps } from "./components/StatusBadge/StatusBadge";
export { Tag } from "./components/Tag/Tag";
export type { TagProps, TagTone } from "./components/Tag/Tag";

export { TextInput } from "./components/TextInput/TextInput";
export type { TextInputProps, TextInputSize } from "./components/TextInput/TextInput";
export { Checkbox } from "./components/Checkbox/Checkbox";
export type { CheckboxProps, CheckboxSize } from "./components/Checkbox/Checkbox";
export { SegmentedControl } from "./components/SegmentedControl/SegmentedControl";
export type {
  SegmentedControlProps,
  SegmentedControlOption,
  SegmentedControlSize,
} from "./components/SegmentedControl/SegmentedControl";

export { Tabs, TabsPanel } from "./components/Tabs/Tabs";
export type { TabsProps, TabsPanelProps, TabItem, TabsSize, TabsVariant } from "./components/Tabs/Tabs";
export { Tooltip, TooltipProvider } from "./components/Tooltip/Tooltip";
export type { TooltipProps, TooltipProviderProps, TooltipSide } from "./components/Tooltip/Tooltip";
export { Select } from "./components/Select/Select";
export type { SelectProps, SelectOption, SelectSize } from "./components/Select/Select";

export { Modal } from "./components/Modal/Modal";
export type { ModalProps, ModalHeaderProps, ModalSize } from "./components/Modal/Modal";
export { ConfirmModal } from "./components/Modal/ConfirmModal";
export type { ConfirmModalProps } from "./components/Modal/ConfirmModal";
export { WizardModal } from "./components/Modal/WizardModal";
export type { WizardModalProps, WizardStep } from "./components/Modal/WizardModal";
export { ToastProvider, useToast } from "./components/Toast/Toast";
export type { ToastOptions, ToastProviderProps, UseToastReturn } from "./components/Toast/Toast";

export { KPITile } from "./components/KPITile/KPITile";
export type { KPITileProps, KPITileDelta, KPITileDeltaSentiment } from "./components/KPITile/KPITile";
export { KeyValueList } from "./components/KeyValueList/KeyValueList";
export type { KeyValueListProps, KeyValueItem, KeyValueOrientation } from "./components/KeyValueList/KeyValueList";
export { EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps, EmptyStateSize } from "./components/EmptyState/EmptyState";

export { DataTable } from "./components/DataTable/DataTable";
export type { DataTableProps, Column, SortState } from "./components/DataTable/DataTable";
export { Pagination, paginationItems } from "./components/DataTable/Pagination";
export type { PaginationProps, PaginationItem } from "./components/DataTable/Pagination";

// ── Phase 3: shell, surfaces, patterns ──────────────────────────────────────
export { AppShell } from "./components/AppShell/AppShell";
export type {
  AppShellProps,
  AppShellBrandProps,
  AppShellNavSectionProps,
  AppShellNavItemProps,
  AppShellTopbarProps,
} from "./components/AppShell/AppShell";
export { Card } from "./components/Card/Card";
export type { CardProps, CardHeaderProps, CardVariant } from "./components/Card/Card";
export { Drawer } from "./components/Drawer/Drawer";
export type { DrawerProps, DrawerHeaderProps, DrawerSize } from "./components/Drawer/Drawer";

export { Avatar, getInitials, getIdentityColorIndex } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize, AvatarShape } from "./components/Avatar/Avatar";
export { Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs";
export type { BreadcrumbsProps, BreadcrumbItem } from "./components/Breadcrumbs/Breadcrumbs";
export { GlobalAlertPill } from "./components/GlobalAlertPill/GlobalAlertPill";
export type { GlobalAlertPillProps } from "./components/GlobalAlertPill/GlobalAlertPill";

export { ProgressBar } from "./components/ProgressBar/ProgressBar";
export type { ProgressBarProps, ProgressBarSize, ProgressSegment } from "./components/ProgressBar/ProgressBar";
export { CodeConsole } from "./components/CodeConsole/CodeConsole";
export type { CodeConsoleProps, CodeConsoleLine, CodeConsoleLevel } from "./components/CodeConsole/CodeConsole";
export { FolderTree } from "./components/FolderTree/FolderTree";
export type { FolderTreeProps, TreeNode } from "./components/FolderTree/FolderTree";
export { FileDropzone, formatBytes } from "./components/FileDropzone/FileDropzone";
export type { FileDropzoneProps } from "./components/FileDropzone/FileDropzone";

export { DateTimeRangePicker } from "./components/DateTimeRangePicker/DateTimeRangePicker";
export type {
  DateTimeRangePickerProps,
  DateTimeRangePickerSize,
  DateTimeRange,
  QuickRange,
  RangeStepper,
} from "./components/DateTimeRangePicker/DateTimeRangePicker";

// ── Phase 4: flagship patterns ──────────────────────────────────────────────
export { CascadeTimeline } from "./patterns/CascadeTimeline/CascadeTimeline";
export type { CascadeTimelineProps, CascadeStep } from "./patterns/CascadeTimeline/CascadeTimeline";
export { Timeline } from "./patterns/Timeline/Timeline";
export type { TimelineProps, TimelineItem } from "./patterns/Timeline/Timeline";
export {
  AgentOrb,
  ChatMessage,
  ThinkingBlock,
  ThinkingStep,
  SuggestionChips,
  RunRefChip,
  ChatComposer,
  CompanionPanel,
} from "./patterns/ChatKit";
export type {
  AgentOrbProps,
  AgentOrbSize,
  ChatMessageProps,
  ChatRole,
  ThinkingBlockProps,
  ThinkingStepProps,
  SuggestionChipsProps,
  SuggestionItem,
  RunRefChipProps,
  ChatComposerProps,
  CompanionPanelProps,
} from "./patterns/ChatKit";
