# Refs — Standalone "Cases" Frames (Agentic AI Actions)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs" (canvas 0:1).
Nodes: `2:62895` "Cases" (1512×987) and `2:62994` "Cases" (1512×987).
Product context: NVIDIA "CM Data Integrity" portal (spelled "CM Data Inegrity" in the mock), Trends & Cases area, **Agentic AI Actions** sub-view.

## Purpose

Two states of the Agentic AI Actions screen:

- **2:62895 — list state.** Full-width insight list ("AI insights for the day") with two insight rows; no detail panel.
- **2:62994 — list + detail state.** Narrowed insight list on the left, detail panel on the right showing one agentic insight ("Foxconn GPU systemic collapse") with issue summary, AI recommendation card, and action buttons.

## Artboards

| Node | Name | Size | State |
|---|---|---|---|
| 2:62895 | Cases | 1512×987 | Agentic AI Actions — list only |
| 2:62994 | Cases | 1512×987 | Agentic AI Actions — list + detail panel open |

## Element inventory

### App chrome (shared by both frames)
- **Backdrop**: soft aurora-style gradient, pale sage/green (~`#DFE8D3` → `#F3F6EE`), built from large blurred ellipses (BG frame with `Ellipse 848…852`).
- **Brand plate** (top-left, 328×64 glass panel): NVIDIA logo (green eye `#76B900` + black wordmark), small green dot separator, product name "CM Data Inegrity" in a small caps-ish sans (~13px, dark `#1A1A1A`).
- **Main Nav** (top-center, ~960×64 frosted glass strip): text tabs `Dashboard · Trends & Cases · Scorecard · Data Coverage · Documents · Error Checks & Bugs`. Inactive: dark gray ~15px. Active ("Trends & Cases"): NVIDIA green `#76B900`, semibold, framed by **dashed green corner brackets** (signature selection/focus motif used throughout).
- **Notification button**: square glass tile with bell outline icon + corner brackets. **Avatar**: square photo tile.
- **Left sidebar** (~230px glass panel): rows `Dashboard`, `Cases 5`, `Top Errors 5`, `Scorecard Incidents 5`, `Agentic AI Actions 5`. Counts right-aligned in gray. Active row: white background, green semibold label, corner-bracket outline. Row height ~40px, hairline separators.
- **AI field** (instance `AI field`, 544×46, bottom-center, floating): white pill/rounded bar, left "+" icon, placeholder "How can I help you?" (gray), right *Ask AI* in italic + green NVIDIA-eye glyph; wrapped in green corner brackets. Slight drop shadow.

### List pane
- **Primary button** "+ Start New Agentic Action": filled `#76B900`, sharp/near-sharp corners, dark olive-black label + plus glyph, ~40px tall.
- **Search field**: white rounded rect (~4px radius), magnifier outline icon, gray placeholder ("Search Scorecard" wide state / "Search" narrow state), hairline border.
- **Section header** "AI insights for the day": sparkle/AI icon + green semibold ~14–15px label; hairline rules above and below.
- **Insight list item** (repeated ×2): 
  - left vertical **green accent bar** (~3–4px, `#76B900`)
  - title: bold dark ~15px, single line
  - body: 1–2 lines regular gray `#4A4A45`, ellipsis truncation
  - timestamp: small gray ~12px, relative or absolute ("Yesterday, 8:37 PM" / "5/04/2026, 8:37 PM")
  - hairline row separators; white/near-white row background over glass.

### Detail panel (2:62994 only)
- **Panel header**: back chevron, title "Foxconn GPU systemic collapse" (~16px semibold), right-aligned metadata "Last refreshed 4/6/2026" (small gray).
- **Chip row**: 
  - `Active Investigation` — amber chip (bg ~`#F7E8B0`, text ~`#8A6A00`), ~2–4px radius
  - `FOXCONN` — magenta chip (bg ~`#F8D9F1`, text ~`#C700A0`)
  - `FXSJ` `FXHC` `FXMG` — neutral gray chips (bg ~`#E7E7E3`, dark text)
- **Heading** "Issue Summary": ~24px medium/semibold dark.
- **Body paragraph**: ~15px regular, dark gray, generous line height.
- **AI recommendation card**: white card, hairline border, sparkle icon + "Agentic AI recommendation" title (semibold ~14px), small gray body text; corner brackets at card corners.
- **Action row**: `+ Open RCCAPA` (filled green primary), `Visit affected sites` (white/ghost, hairline border), `Explore in Chat ↗` (white/ghost with external-arrow icon). All ~40px, sharp/near-sharp corners, corner-bracket accents.

## Component instances / repeated patterns (from metadata)
- `Main Nav` (instance, 960×64)
- `Frame 1618868694` (brand plate, 328×64)
- `AI field` (instance, 544×46) — appears on every screen in the file
- Insight list rows (repeated), sidebar nav rows (repeated), chip set, corner-bracket overlay rectangles (`Rectangle 14199…14202` on many containers)

## Figma Variables
None retrieved — `get_variable_defs` could not be run for these nodes (Figma MCP Starter-plan rate limit was hit during extraction). No variable usage was evident in metadata naming.

## Canon deltas vs Shamrock

| Ref behavior | Shamrock canon | Delta |
|---|---|---|
| Small radii on chips, search, AI pill (~2–8px) | Radius 0 everywhere (dots/pills excepted) | Squared corners required; AI input could qualify as pill only if treated as count-pill-class exception (it shouldn't — flatten it) |
| Hardcoded NVIDIA green `#76B900` as accent + brand logo | Colorless core; accent via `--sh-color-accent-*` theme tokens | Map green to themable accent; logo lives in a client theme, never core |
| Status via colored chips (amber "Active Investigation", magenta org chip) with color-only distinction | 7-value status enum, theme-invariant, always dot + text | Recast chips: status chips → dot+label from `neutral|info|success|warning|critical|pending|running`; org/site chips are tags, not status |
| Green accent bar on every list row even in nominal state | Color is exception-first; nominal renders calm | Accent bars should be neutral unless the row is exceptional |
| Dashed green corner-bracket focus/selection motif | Not in canon; hairline borders are canonical edge treatment | Either drop or formalize as a focus-ring token; do not ship as green-hardcoded decoration |
| Frosted glass panels over aurora gradient | Matches canon (`--sh-surface-*` over `<Aurora />`) | Aligned |
| Hairline row/card separators, borders over shadows | Matches canon (`--sh-color-border-hairline`) | Aligned |
| Timestamps in same UI face | Machine values use `Text variant="machine"` | Timestamps/dates/counts should switch to machine face |
| Insight metrics quoted with baselines in prose ("down from ~100%") | No naked numbers | Mostly aligned in copy; keep baselines when tokenized |
