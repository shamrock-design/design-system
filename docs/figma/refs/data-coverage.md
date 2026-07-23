# Refs — DATA COVERAGE (node 2:55347)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs" (canvas 0:1), section `2:55347` "DATA COVERAGE" (12057×4650).

> **Extraction gaps.** Full `get_metadata` was captured (complete node tree below). A screenshot of this section could **not** be rendered — the Figma MCP Starter-plan tool-call limit was hit before it could run — so colors/typography are inferred from the shared app chrome verified in the Trends & Cases and Dashboard captures (same BG/nav/AI-field/pagination components by node reuse), not from a direct render of this artboard. `get_variable_defs` could not be run.

## Purpose

The Data Coverage page: "Enabled sites, onboarding pipeline, and report inventory" (its literal subtitle). One long scrolling page (annotated on canvas: "Scroll Area Overflow: Hidden") with KPI tiles and three table sections, plus a component sheet for the expandable report-table row.

## Artboards / frames

| Node | Name | Size | Notes |
|---|---|---|---|
| 2:55349 | Data Coverage | 1512×2237 | Single tall page; viewport 987, rest scrolls (overflow hidden) |
| 2:55486 | Components (section) | 3679×4111 | Contains `Tr- Current Reports property table` (2:55487) |

## Element inventory

### Chrome
- Same shared chrome as all screens: aurora sage BG (`BG` frame with blurred Ellipse 848–852), brand plate `Frame 1618868694` 328×64 (NVIDIA logo + "CM Data Inegrity"), `Nav bar` instance 779×64 (Data Coverage would be the active tab), notification tile `Frame 1618868696` 64×64, floating `AI field` 544×46 bottom-center.
- Page header (333px column): title "Data Coverage" (~24px semibold, 35px box) + subtitle "Enabled sites, onboarding pipeline, and report inventory" (2 lines, gray ~15px).

### KPI row (`Frame 1618868741`, 1093×116)
Four metric tiles, 261.25×116 each, 16px gaps: instances `Metrics`, `Frame 1618868746/747/748` — same Metrics tile family as Trends & Cases (large value + small gray label on tinted/white tile, states Bad/Good/Info/mid/Gray).

### Layout pattern
Each content section is two-column: **left sticky title column 333px** (section title ~20px + detail line) and **right table card 1092px**. Table cards have 8px inner padding, hairline dividers (`Vector 802` zero-height rules), and a shared pagination bar.

### Section 1 — Current Reports (`2:55425`, 1446×633)
- Title: "Current Reports"; detail: "1,510 total data elements across 6 reports".
- Table: `THead` 40px with 8 `TH` instances (col widths 260 / 141.5 / 82 / 141.5 / 141.5 / 120 / 141.5 / 48 — last col is an actions/chevron stub).
- 8 rows `Tr- Current Reports` (1076×52, 64px pitch).
- **Expandable row component** (sheet 2:55487): variants `Default` (52px) / `Hover` (52px) / `Opened` (324px) — a report row expands in place to ~6× height to reveal its data-element detail.

### Section 2 — Enabled Sites (`2:55359`, 1446×593)
- Left label "Enabled Sites".
- Table: 3 equal `TH` columns (359px each); 7 `Tr` rows (1077×52, 68px pitch).

### Section 3 — Upcoming Sites (`2:55389`, 1446×569)
- Title "Upcoming Sites"; detail block "Implementation:" + "Mar 15, 2026 · 12 days away" (deadline with relative baseline).
- Table: 5 `TH` columns (230 + 4×211.5); 7 rows `Tr- Incoming Sites` (1076×52, 64px pitch).

### Pagination bar (identical in all three tables, 44px)
- Left: "Showing" + row-count selector (`Row Selector` 53×28: value "8" + `arrow-down` icon) + "rows of **11,265**".
- Right: "Page 1 of 35" + two `Icon Button` 40×40 (prev/next).

## Component instances / repeated patterns
`TH` ×16 · `Tr` ×7 · `Tr- Incoming Sites` ×7 · `Tr- Current Reports` ×8 (+ variant sheet Default/Hover/Opened) · `Metrics` tile family ×4 · `Icon Button` ×6 · `arrow-down` ×3 · `Nav bar`, `Frame 1618868696`, `AI field` ×1 each. Corner-bracket vectors (`Rectangle 14199…14202`) hidden on this page's brand plate.

## Figma Variables
Not retrievable — `get_variable_defs` blocked by the Figma MCP plan limit. None referenced in metadata naming.

## Canon deltas vs Shamrock

- **Radius**: table cards/selectors carry the app's small radii (~4px, per the verified sibling screens) → canon 0.
- **Accent**: NVIDIA green accents (active nav, AI field glyph) hard-coded → themable `--sh-color-accent-*`.
- **Machine values**: counts ("11,265", "1,510"), dates ("Mar 15, 2026"), page numbers should use the machine face.
- **Baselines**: "Mar 15, 2026 · 12 days away" and "1,510 total data elements across 6 reports" follow the no-naked-numbers rule — keep this pattern.
- **Row-expansion pattern** (Default/Hover/Opened 52→324px) is a table capability Shamrock's table spec must cover; render expansion with hairline separation, no shadow/rounding.
- **Aligned**: glass table cards over aurora, hairline rules between rows/sections, calm colorless tables (color only in KPI tiles), consistent 52px row height + 40px header.
- **Watch**: KPI tiles tinted green when healthy contradicts calm-nominal; sticky-left-title two-column section layout is a layout pattern, not a component — document as a page template.
