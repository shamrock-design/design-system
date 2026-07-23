# Refs — TRENDS & CASES (node 2:55937)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs" (canvas 0:1), section `2:55937` "TRENDS & CASES" (12057×22185).
Product context: NVIDIA "CM Data Integrity" portal — the Trends & Cases area (RCCAPA case management, top errors, scorecard deductions, agentic AI actions).

> **Extraction gaps.** Structure/copy comes from complete `get_metadata` output (full node tree, all subsections). Visual properties (colors, radii) are verified from: (a) full-res screenshots of the two Agentic AI "Cases" frames (2:62895/2:62994, see `cases-frames.md`); (b) sibling captures of the identical component set (Status Container sheet, RCCAPA Updates & Threads, Filter flows, Dashboard) that reuse these exact screens/components. Per-frame screenshots of the nine RCCAPA CASES artboards could not be rendered — the Figma MCP Starter-plan tool-call limit was hit mid-extraction. Font family/weight metadata is not exposed by `get_metadata`; typography notes are visual estimates. `get_variable_defs` could not be run.

## Purpose

State-by-state documentation of the Trends & Cases module: RCCAPA case list/detail lifecycle (empty → filled → detail → side-panels → scroll → pagination), Top Errors rankings, Scorecard Deduction incidents, and Agentic AI Actions, plus their component sheets.

## Sub-sections and artboards

All app artboards are 1512×987 desktop frames named "Cases".

### 1. RCCAPA CASES (`2:55939`, 11535×9237) — 9 artboards
Annotated states (from canvas labels): 

| Node | State label |
|---|---|
| 2:55940 | Empty state ("You have not received any case. / Get started by creating a case") |
| 2:56211 | Filled state (case list) |
| 2:56507 | RCCAPA details (list + detail panel) |
| 2:57216 | Detail open |
| 2:57925 | Right-rail states: both details closed / CM profile open / Case Details open |
| 2:58634 | Detail scroll state |
| 2:59279 | Scroll to middle |
| 2:59923 | Scroll to bottom |
| 2:60568 | End of page — 10 cases per page, pagination navigation shows |

Component sheets inside this sub-section: `❖ Metrics` (2:60875), `Status Container` (2:60902), `Messages` (2:61111), plus stray instances `Timeine item` (228×44), `Tr- Sample faiing records` (832×52), decorative `Minimal Pattern - 2 - A` (1020×1020) and reference images.

### 2. TOP ERRORS (`2:61289`, 11535×3198) — 3 artboards
2:61291 "By Frequency", 2:61457 "Empty State", 2:61629 "By Volume". Ranked error list (wide list pane, 1214px) with `By Frequency | By Volume` toggle, hidden chat area for drill-in.

### 3. SCORECARD DEDUCTIONS (`2:61798`, 11535×3198) — 4 artboards
2:61800 "By Frequency", 2:61976 "By Frequency", 2:62154 "By Volume + Filter dropdown open" (contains `Dropdown` 376×120), 2:62342. Left list of scorecard incidents ("RCCAPA case sent back by Sweta · Created 3/25/2026") + detail: Issue Summary, Error Count chart, Sample failing records, pagination. Component sheet: `❖ Scorecards` (2:62527, also duplicated at 2:62842).

### 4. AGENTIC AI ACTIONS (`2:62580`, 11535×3198) — 2 artboards + component
2:62582 (list / empty state), 2:62682 (list + detail) — same design as standalone frames 2:62895/2:62994 documented in `cases-frames.md`. Component `AgenticList` (2:62790): variants Default / Hover / Active (452×152).

## Element inventory

### Shared chrome (every artboard)
- **Aurora backdrop**: pale sage gradient (~`#DFE8D3` → `#F3F6EE`) from blurred ellipses; frosted-glass panels on top.
- **Brand plate** 328×64 (NVIDIA logo `#76B900` + "CM Data Inegrity"), **Main Nav** / **Nav bar** instance (tabs: Dashboard · Trends & Cases (active, green) · Scorecard · Data Coverage · Documents · Error Checks & Bugs), notification tile 64×64, avatar.
- **AI field** instance 544×46 bottom-center ("How can I help you?" / *Ask AI*).
- **Corner-bracket motif**: 8×8 corner vectors (`Rectangle 14199…14202`) on every panel — dashed green corner brackets marking panels/selection.
- **Resizer**: 2px vertical hairline with 12×18 drag pill (`grommet-icons:drag`) between panes.

### T&C left navigation (`T&C Navigation` instance, 242×224; 18 uses)
Collapsible groups **PINNED / Organizations / Customized Views**, each: group header 24px with chevron icon-button + rows (`Group` instance, 242×28 — label + count). Collapse-all icon button at bottom. Glass panel, hairline separators.

### Case list pane (489px wide)
- Title row 54px: "All Cases" (~24px semibold) + search field 198×38 ("Search Cases", magnifier icon, white, hairline border, ~4px radius).
- Filter row 48px: `Badge` filter chips + hidden "Save view" `Button` (117×28).
- **Case list item** (`List` instance 489×108, 10 per page; component variants Default/Hover at 522×116): case code "RCCAPA-012", score delta "+0.25" (green), SLA breach "24h over" (red), subtitle "SUPPLIER_CODE · Item Attributes" (gray), one-line latest-message preview, **status container** row.
- Pagination 44px: "Showing [8 ▾] rows of 11,265" + "Page 1 of 35" + prev/next icon buttons (40×40).

### Status system (component sheet 2:60902)
- **Badge** (24px tall, ~2–4px radius, tinted bg + colored text): variants `Overdue` (red ~`#D02E2E` on ~`#FBE9E9`), `Pending` (amber ~`#B98900` on ~`#FCF3D7`), `Closed` (gray on ~`#EBEBE7`), `Sent back` (olive/amber).
- **Status Container** (`Component 1`, 28px): gray stage label + Badge + clock icon + elapsed "16 hr". Stage axis (Property 1): `RCCAPA | NV Review | Data | Data Review`; state axis (Property 2): `Overdue | Sent back | Closed | Pending` (12 published combos). Multiple containers chain per case row.
- Additional chips seen in flows: `APPROVED` (green), `REJECTED` (red), `Active Investigation` (amber).

### Case detail panel ("RCCAPA Details", 725px)
- Header 48px: back icon-button, title "P1.03 Component Date Code - Not Blank" + "Created 3/25/2026" (small gray), share/copy icon-buttons.
- Status row 40px + top meta row.
- **Issue Summary**: heading ~24px + paragraph ("P1.03 Group - Not Blank … 34,062,669 total errors in the last 30 days").
- **Metric tiles** (`Metrics` component, 283×92; 24 uses): big colored value + small gray label on tinted tile. Variants `State=Bad` (red, e.g. "99% Error Rate"), `Good` (green "34,062,669 Affected records"), `Info` (blue), `mid` (amber), `Gray` (neutral, e.g. "Last 30 Days Observation Window"). ~4px radius, hairline border.
- **Error Count – Last 30 Days chart**: area chart, green line with light-green fill (~`#D7E9AE`), y-axis 0–100%, x-axis Jan–Dec, hairline gridlines.
- **Sample failing records table**: TH row 40px (Nr, KEY, DATE ▾ sortable, NVPN, GROUP, CM-SKU; small gray caps), rows 52px (`Tr- Sample faiing records`, 31 uses) with machine-style key strings, hairline row dividers, pagination bar identical to list pane.
- **Required Actions**: numbered 3-step list + footnote "Frequency: 3,737 errors".
- **Chat with CM** (embedded thread, 692px): centered system message; CM/AI-agent messages (`Message` instance, 26 uses) with avatar + name "AI Agent w0087" + timestamp "Feb 18, 2:01 PM"; structured RCCAPA replies with green small-caps section labels **ROOT CAUSE / CORRECTIVE ACTION / PREVENTIVE ACTION**; `← RESPOND` ghost buttons; APPROVED/REJECTED result chips; composer "Send Message to CM" with green send button; response popovers ("Select Response to Case" dropdown, Enter Root Cause / Corrective / Preventive textareas, Approve ✓ / Reject ✕ chips).
- **Timeline**: `Timeline` instance — dot + "Case created / 3/30/2026, 12:13:54 PM".

### Right rail (260px, collapsible; states in 2:57925)
- `CM Profile` accordion header 48px (9 uses): CM response-rate stats with small bars.
- **CASE DETAILS** accordion: two text fields; key-value list rows 14px — Status: Overdue, Assigned to: Raj Nair, Code: VAL_005, Field: SUPPLIER_CODE, Report: Item Attributes, Freq: 8d, Volume: 15,400, Spec: §5.3.2.
- **Escalation** stepper: E1 – Created → E2 — 24h Response → E3 — 72h RCCAPA.

### Top Errors / Scorecard specifics
- **By Frequency | By Volume** text-tab toggle above the ranked list.
- **Scorecards list card** (`Scorecards` component, 304×109; variants Default/Hover/Active; 18 uses): incident title ("RCCAPA case sent back by Sweta"), created date, status chips.
- **Filter Dropdown** (2:62329, 376×120): two side-by-side 188px panels (menu + cascading sub-menu), `Dropdown item` 188×40 rows, white surface, hairline border.

### Icon vocabulary (instance names)
`share` (heroicons-outline), `copy`, `trash`, `clock`, `arrow-down`, `search-normal`, `filter-edit`, `si:ai-fill` (AI sparkle), `calendar-2`, `grommet-icons:drag`, `arrow-left-up` line arrows (annotation). `Icon Button` 32×32/40×40 — 191 uses.

## Component inventory (distinct instances, whole section)
Icon Button ×191 · Group (nav row) ×126 · List (case row) ×126 · Badge ×104 · TD ×100 · TH ×48 · Tr- Sample faiing records ×31 · Message ×26 · Chat ×24 · Metrics ×24 · search-normal ×20 · T&C Navigation ×18 · AI field ×18 · Scorecards ×18 · Button ×13 · Case Details ×12 · Main Nav ×11 · CM Profile ×9 · Dropdown item ×8 · Nav bar ×7 · Timeline ×3 · Component 1 (status container) ×2 · AgenticList ×2.

## Figma Variables
Not retrievable — `get_variable_defs` blocked by Figma MCP plan limit before it could run. No `$variable` naming appeared in metadata; styling appears hard-coded per node.

## Canon deltas vs Shamrock

- **Radius**: chips/badges/tiles/search/AI pill carry ~2–8px radii → canon is 0; only status dots and count pills may round.
- **Brand color hard-coded**: NVIDIA `#76B900` used as accent, active-nav, chart fill, send buttons → must become themable `--sh-color-accent-*`; logo/brand plate belongs to a client theme.
- **Status vocabulary mismatch**: ref uses `Overdue / Pending / Closed / Sent back / Approved / Rejected / Active Investigation` as color-only chips → map to the 7-value enum (`overdue→critical`, `pending→pending`, `closed→neutral`, `sent back→warning`, `approved→success`, `rejected→critical`, `active investigation→running/info`) and always render dot + text, never tinted-pill color alone.
- **Color when nominal**: `State=Good` green metric tiles and green accent bars appear even when nothing is wrong → canon renders nominal calm/gray; saturated color reserved for exceptions (Bad/Overdue).
- **Corner-bracket selection motif** (green dashed brackets) has no canon equivalent → drop or formalize as a focus-ring token; not brand-green.
- **Machine values** (case codes, KEY strings, timestamps, "34,062,669", "§5.3.2") set in the UI face → should use `--sh-font-family-machine` / `Text variant="machine"`.
- **Aligned with canon**: glassmorphism panels over aurora backdrop; hairline borders/dividers instead of shadows; metrics quoted with baselines ("+0.25", "24h over", "down from ~100%"); exception-first table rows (white/calm rows, colored badges only on breaches); resizable panes with hairline dividers.
