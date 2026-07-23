# Refs / Calendar (node 2:101400)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs", section `2:101400` "Calendar" (3437×1783).

> **Data gaps:** documented from the full-section screenshot plus locally cropped/upscaled regions (good legibility — this section is small so detail is reliable). `get_metadata` and `get_variable_defs` could not be fetched (Figma MCP Starter-plan rate limit). Node ids, component names, exact px values and Variables missing; colors approximate.

## What the screens are

The **custom date-range picker** used by the dashboard time filter: a dual-month calendar popover with month/year dropdown selection, plus its interaction states. Four artboards labeled: *(default)*, **"Selecting a month"**, **"Hover on days"**, **"Selecting a Day"**, plus two standalone dropdown list specimens (month list, year list).

## Artboards / frames (names from canvas labels; ids unavailable)

| Artboard | Contents |
|---|---|
| Default range picker | "Custom / May 18th, 2026 – June 28th 2026", May + June dual month |
| Selecting a month | month dropdown (January–May) open over the left month, hover row "May" highlighted pale green |
| Hover on days | day cell "2" with light-gray square hover |
| Selecting a Day | range "May 2nd, 2026 – June 16th 2026" with start day **2** and end day **16** as solid green squares |
| Month dropdown specimen | January…May list on light gray panel |
| Year dropdown specimen | 2023–2026 list on light gray panel |

## Element inventory (observed properties)

- **Popover sheet** — white (#FFFFFF), essentially square corners (0–2px radius), hairline gray internal dividers (~#E3E3E3), light drop shadow. Header band separated by a hairline.
- **Header** — tiny gray eyebrow label `Custom` (~11px), bold range title `May 18th, 2026 – June 28th 2026` (~14–15px), close **×** icon button top-right (plain glyph, no container).
- **Month/Year selector row** — four segmented cells (`May | 2026 | June | 2026`) separated by hairline verticals; each cell is a click target opening a dropdown. Text gray (~#8A8A8A), centered.
- **Weekday header** — `M T W TH F S S` letterspaced gray caps (~11px). Note the two-letter `TH`.
- **Day grid** — 7-col grid, generous cell padding; numerals ~13px:
  - Weekday numbers: dark gray (~#3C3C3C)
  - Weekend days (Sat/Sun columns + their dates): salmon/red (~#E4696F) — red used *categorically* for weekends, not for exceptions
  - **Hover**: light gray filled square (~#E9E9E9), square corners
  - **Selected day**: solid NVIDIA-green square (~#76B900), white numeral, square corners (0–2px radius)
  - No visible in-range band fill between endpoints in these shots
- **Footer buttons** — right-aligned pair, both with the signature **dashed corner-tick brackets**:
  - `CANCEL` — white fill, dark uppercase label (~12px, letterspaced), hairline border + green corner ticks
  - `APPLY` — solid green fill (~#76B900→#8DC63F range), dark-green/black uppercase label, darker corner ticks
- **Month / Year dropdown lists** — flat light-gray panels (~#E9E9E9), left-aligned rows (~13px dark gray), generous row height, no radius visible; hover/selected row = pale green tint (~#E8F5C8) as seen on "May". Year list shows 2023–2026.

## Component instances / repeated patterns

(Inferred:) `Range calendar popover`, `Month grid`, `Day cell` (default / weekend / hover / selected), `Month-Year segmented header cell`, `Dropdown list` + `Dropdown row` (default/hover), `CANCEL`/`APPLY` corner-tick buttons, close icon button.

## Figma Variables

Not retrievable (rate limit). None recorded.

## Canon deltas (vs Shamrock canon)

1. **Closest section to canon geometry**: square selection/hover cells and near-0 radius sheet — largely compliant with sharp-0-radius canon.
2. **Corner-tick dashed brackets** on CANCEL/APPLY instead of plain hairline buttons — non-canon ornament.
3. **Red for weekends** is categorical color, violating calm exception-first color (red should be reserved for real exceptions).
4. Solid saturated green fill for selected day + APPLY — branded accent hard-coded (NVIDIA green), not a colorless core with a themable accent token.
5. Dropdown panels are flat opaque gray, no glass treatment; fine, but inconsistent with the glassy dashboard shell.
6. Single grotesque sans; tabular/machine face not used for the numeric grid (canon would set day numerals in the machine face); `TH` two-letter weekday breaks column rhythm.
