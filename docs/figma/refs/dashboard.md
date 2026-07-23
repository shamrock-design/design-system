# Refs / Dashboard (node 2:44794)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs", section `2:44794` "Dashboard" (11681×13885).
Source of truth for this doc: full-section screenshot (1500px) + full `get_metadata` XML (376k chars, fully parsed). Per-frame high-res screenshots and `get_variable_defs` were blocked by a Figma MCP rate limit — noted as gaps below.

## What the screens are

A **"CM Data Integrity" analytics product for NVIDIA** (nvidia-logo vector + "CM Data Inegrity" [sic] wordmark in the app header). The section contains the main monitoring dashboard in multiple breakpoints and drill-in views:

- **Overall DI (Data Integrity) Score dashboard** — hero donut gauge ("80% Overall Health"), stat tiles (Accuracy 100%, Timeliness 26%, Completeness 73%, Remediation 83%), and a dense "Health by Organization" matrix of CM (contract manufacturer) sites — BYD, Foxconn, Innolite, FXG1, BYD MP, sites like "Guadalajara, Mexico", "4 Sites", "11 feeds", "3 issues".
- **Health by CM Sites** — four drill-in variants per-CM: site score tables, per-metric columns (A / T / C / R / DI = Accuracy, Timeliness, Completeness, Remediation, Data Integrity), trend line charts ("+1.2% vs last Week", "Last 14 Days").
- **Data Feeds** — feed health views: a large dot-matrix status grid (green/red dots per feed per day), and two bar-chart views (red and orange bars = error counts over time) with rule-result cards below ("Manufacturer_PN matches E-BOM", "Part number must exist in E-BOM", "Quantity is Positive", "Consumption Quantity must be positive", sample part numbers like `900-9D1AR-0056-ST4`, `TRX-W2Q`, "Null" values).
- **Rules Dashboard** — rule management screen with KPI headline numbers, a bar chart, and a rules table; plus overlay flows: **Edit Rule** modal, "AI-recommended data quality rules" panel, **Manual fix**, **AI Fix Ongoing**, **AI Fix completed** overlay cards.
- **Dashboard time filter** — dashboard variant with the date-range dropdown open.
- A small dark **Components** sub-section (2:45242) holding master components: `Stats`, `Tr-CM sites` (table row), a dropdown, and a nav strip.

## Artboard / frame list (top-level children)

| Node | Name | Size | Notes |
|---|---|---|---|
| 2:44795 | Dashboard | 1512×1752 | 1440-view main dashboard |
| 2:45010 | Dashboard | 1512×554 | partial/top slice |
| 2:45248 | Dashboard | 1920×1752 | 1920-view main dashboard |
| 2:45808 / 2:45906 / 2:46132 / 2:46369 | Dashboard | 1512×982 ×4 | "Health by CM sites" drill-ins |
| 2:46606 | Data Coverage | 1512×1917 | dot-matrix feed grid |
| 2:47381 / 2:47619 | Data Coverage | 1512×1397 ×2 | bar-chart feed views (red / orange) |
| 2:47859 | CM Data | 1512×1917 | Rules Dashboard screen |
| 2:45234 | Dropdown | 163×240 | time-filter dropdown component |
| 2:48246 | Edit Rule | 689×819 | modal |
| 2:48271 | AI-recommended data quality rules. | 689×200 | panel |
| 2:48302 | Manual fix | 482×414 | overlay card |
| 2:48315 | AI Fix Ongoing | 482×533 | overlay card |
| 2:48343 | AI Fix completed | 482×601 | overlay card |
| 2:45242 | Components (section) | 2894×5265 | contains masters: Rectangle 14224, `Stats` (351×227), `Frame 1618868695` (342×251), Rectangle 14231, `Tr-CM sites` (954×52) |

Node-type census for the whole section: 1458 frames, 1260 text, 300 rounded-rectangles, 210 component instances, 184 vectors, 136 ellipses.

## Element inventory (observed properties)

- **App shell / background**: warm cream/olive canvas (~`#EFEDE0`–`#F4F2E6`) with large soft blurred ellipse blobs (4 per screen, 676–971px, greenish/amber tints) behind a big rounded content sheet — a glassmorphism-adjacent "frosted sheet over aurora blobs" treatment. Content cards sit on translucent white.
- **Top navigation (`Main Nav`, 939×64, 10 instances)**: pill-shaped segmented nav (Dashboard, Remediation, Scorecard, Data Coverage, Documents, Error Chores & Bugs per notification screen), active tab = white pill; right side: bell icon button + avatar. Brand block left: NVIDIA logo + "CM Data Inegrity" caption + tiny green status dot (6×6 ellipse).
- **Donut gauge**: 290×290 ring, thick stroke, vivid green (NVIDIA-green ≈ `#76B900`/`#8AC926`) on pale track, center text "80%" (~42px) + "Overall Health" caption (~13px); small ellipse dots (16–20px) riding the ring.
- **Stat tiles (`Stats` instance, 350×227, ×4 usages)**: 2×2 grid of metric cards — big % value (green for good, red/orange for bad e.g. Timeliness 26% in red), small label under.
- **Data table (`Tr-CM sites` row instance 954×52, ×16; `TH` ×17, `THead` ×7)**: org/site health matrix; header row of abbreviated metric columns (A, T, C, R, DI); cells are small % chips colored green (healthy) / red (bad); org rows expandable (arrow-down ×16); "line" divider frames ×40 → hairline row separators.
- **Badges (×36 instances)**: small rounded status/percent chips — green fill for positive (`+0.3%`), red for negative, plus status colors (see Status Container doc for the enum).
- **Icon buttons (×19)** and icon set: `filter-edit` ×17, `arrow-down` ×16, `search-normal` ×11, `calendar-2` ×7, `heroicons-mini/check-circle` ×11, `heroicons-solid/x-mark`, `heroicons-mini/list-bullet`, `heroicons-outline/chat-bubble-oval-left`, `edit-2`, `fluent:sparkle-28-filled` ×8 (AI affordance sparkle). Mixed icon libraries (heroicons + fluent + custom).
- **Search field**: "Search Organization" (×9) rounded input with search icon.
- **AI field (×11 instances, 544×46)**: rounded AI-prompt input docked at bottom of dashboards ("Your input helps you?" style), with green send affordance — the persistent AI entry point.
- **Dropdowns**: time filter (`Dropdown` 163×240, `Dropdown item` ×12): options list (Last 14 Days etc.), white popover, subtle shadow.
- **Text fields (`Text field` ×9 frames + instances)**: labeled bordered inputs in Edit Rule modal.
- **Charts**: (a) line/area trend charts with dotted grid + green area fill; (b) vertical bar charts, red series and orange series, one bar highlighted darker with value callout; (c) dot-matrix heatmap grid (green/red circles, ~rows = feeds, cols = days); (d) donut gauge. Axis labels Oct/Nov/Dec, Dec 25, etc.
- **Cards/sheets**: rounded-rectangle count 300 — everything is a rounded card; corner brackets (`Rectangle 14199–14202`, 8×8 vectors at the 4 corners of major panels) form a distinctive "viewfinder corner ticks" decoration around dashboard panels.
- **Modal (Edit Rule, 689×819)**: white sheet, title, stacked labeled inputs (`Rule properties` instance), chip row, green primary CTA bottom-right ("Save"-style, NVIDIA green fill, dark text).
- **Overlay flow cards (Manual fix / AI Fix Ongoing / AI Fix completed)**: 482px wide stacked cards on a pale sage panel; checklists with green check-circles, progress state, green completion CTA.
- **Typography**: metadata carries no font names (gap — needs `get_design_context` or variables). Visually: section headings in a grotesque sans (Helvetica-like, matches "DASHBOARD" specimen); UI text small (11–13px labels, 42px gauge number). Numeric-dense tables use the same sans, no separate mono face observed.

## Component instances / repeated patterns (from metadata)

`Badge` ×36 · `Icon Button` ×19 · `filter-edit` ×17 · `arrow-down` ×16 · `Tr-CM sites` ×16 · `Dropdown item` ×12 · `search-normal` ×11 · `AI field` ×11 · `heroicons-mini/check-circle` ×11 · `Main Nav` ×10 · `calendar-2` ×7 · `Stats` ×4 · `TH` ×4 · `Text field`/`Text Field` ×7 · `Logo animation` ×2 · `Nav bar` · `Rule properties` · `edit-2` · paired `Frame 16188687xx` masters ×2 each.

## Figma Variables

**Gap:** `get_variable_defs` on 2:44794 could not be retrieved (Figma MCP Starter-plan rate limit hit). No variables recorded; retry later.

## Canon deltas (vs Shamrock canon)

1. **Radius**: pervasive rounded corners (cards, pills, chips, inputs, 300 rounded-rects) vs canon sharp 0 radius.
2. **Color**: strongly branded NVIDIA green accent saturating gauges, CTAs, table cells, charts — not a colorless core with themable accent; color is used decoratively (green = good everywhere), not exception-first. Red/orange used heavily in bulk (whole bar charts), diluting exception salience.
3. **Background**: warm cream + aurora blob glassmorphism is on-theme for glass but tinted (warm beige/olive), not colorless.
4. **Typography**: single grotesque sans; no visible Instrument Sans / Inter split, no machine face for dense numerics (metadata lacks font names — verify).
5. **Status**: percent-chip green/red binary plus ad-hoc badge colors; not the 7-value status enum.
6. **Borders**: mostly shadow/fill-separated cards; hairlines only as table row dividers ("line" ×40). Decorative corner-tick brackets are non-canon ornament.
7. **Mixed icon libraries** (heroicons mini/solid/outline + fluent + custom) — canon would want one coherent set.
