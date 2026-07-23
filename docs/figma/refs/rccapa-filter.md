# RCCAPA Filter (Figma section 2:41446, "Refs" page)

Source: Figma file `LebdF7tuqBXI7FNm0gDuH3`, section "RCCAPA Filter" (7247×4933).
Data used: full section screenshot (1500px) + local crops, full `get_metadata` XML.
**Data gaps:** `get_variable_defs` could not be fetched (Figma MCP plan tool-call limit reached mid-task); per-screen high-res screenshots unavailable for the same reason — colors below are sampled from the 1500px section render and are approximate.

## Purpose
Filtering flow for the RCCAPA Cases list inside the NVIDIA "CM Data Integrity" portal (Trends & Cases tab). Documents the filter dropdown, cascading sub-filter, applied-filter state, and the "Save View" flow (modal + confirmation toasts).

## Artboards / frames
| Frame | Node | Size | State shown |
|---|---|---|---|
| Cases | 2:41447 | 1512×987 | Normal state — no filter applied |
| Cases | 2:41980 | 1512×987 | Filter dropdown open |
| Cases | 2:42530 | 1512×987 | Sub-filter content flyout to the right (red annotation box) |
| Cases | 2:43080 | 1512×987 | Filter checked & applied |
| Cases | 2:43630 | 1512×987 | Save View modal over dimmed screen |
| Cases | 2:44191 | 1512×987 | Save View flow, second step |
| ❖ Notification popup | 2:44733 | 481×468 | Toast component sheet (4 variants) |

Annotation texts on canvas: "NORMAL STATE / No filter applied", "Filter dropdown", "Sub-Filter Content to the right", "Filter checked & Applied", "SAVE VIEW FLOW", "Enter name of Views Category/Section".

## Element inventory

### Page chrome (shared with all portal screens)
- **Canvas background**: soft warm gradient beige→green (~#E4E5C5 top-left → ~#DBE3C3), subtle dotted-grid texture; BG frame built from 4–5 large blurred ellipses ("Ellipse 848–851") + vector overlay — decorative mesh-blob background.
- **Top bar**: NVIDIA logo + "CM Data Inegrity" (typo in file) wordmark block (328×64) with small green dot separator; center **Nav bar** (800×64) — full-radius translucent pill (~#D0DDD3, glass-like) with tabs Dashboard / Trends & Cases / Scorecard / Data Coverage / Documents / Error Checks & Bugs; active tab = white pill, NVIDIA-green text (~#76B900 accent, darker green text ~#488C2B), green hairline border; bell icon button + 40px avatar at right.
- **Left nav** (250×855, panel ~#FBFBF5, radius ~12): sections "Dashboard", "RCCAPA Cases" (active = white pill w/ green text), "Top Errors", "Scorecard/Incidents", "Agentic AI Actions"; then a tree: PINNED → All Cases, Need my Attention (red count dot), Awaiting CM, Overdue, Monitoring, Closed; **Organizations** → Foxconn, BYD, Wistron, Flex, Pegatron; **Customized Views** → FXSJ Critical, CM-lead Overdue, High Volume P7 Rules. Rows 28px, chevron + count on right, colored left-edge stripes per org (orange/green/blue/red).

### Case list column ("Monitoring", 490 wide)
- Column title "Monitoring" + search field ("Search Cases", pill, magnifier icon).
- **Filter trigger**: small "+ Filter" outline chip (72×24) with Badge instances showing applied filter count.
- **Case card** (repeated): rule title "P1.03 Component Date Code - Not Blank", site code "BYD - NB2_LJI8", relative time ("10h ago"), "Frequency: 3,737 errors"; badge row: `CM RCCAPA` (light green), status chips `Overdue` (red, ~#DE4B41 text on pink), `Pending` (amber on light yellow), `Checklist`/`Data` chips, clock icon + elapsed time, priority chips `P1`/`P2` (lavender ~#E9D8FD). Colored 3px left stripe per org. Card bg white, radius ~8–10, hairline divider between cards.

### Filter dropdown (frame "Dropdown" 188×320, radius ~10, white, soft shadow)
8 × **Dropdown item** (188×40): Organizations, Sites, Status, Action Owner, Report Type, Priority, SLA Status, Assigned to — each with right chevron and count.
- **Sub-filter flyout** (second Dropdown 188×120, opens to the right): checkbox rows (e.g. Foxconn, BYD, XFO DBG) — square checkboxes, 40px rows. Red rounded rectangle on canvas is an annotation, not UI.
- Applied state: category row highlighted light green; selected values become Badge chips next to "+ Filter".

### Case detail pane (right, 724 wide)
- Header: back chevron + rule name + "Created 3/25/2026" + Thread / More buttons.
- Badge row: `Pending CM RCCAPA` (yellow-green highlight), `FOXCONN` (lavender), `CM RCCAPA`, `Overdue` (red), timers (`18 min`, `62 hr`), `Data` chip.
- **Issue Summary** paragraph.
- **Metric tiles** (4-up, radius ~12): `99% Error Rate` (pink tile ~#FCE9E7, red text ~#F4827A/#DE4B41), `34,062,669 Affected records` (green tile ~#CEECD9, green text), `34,062,669 Affected records` (blue tile ~#E6F2FE, blue text), `Last 30 Days Observation Window` (white tile, black text).
- **Area chart** "Error Count - Last 30 Days": lime fill ~#E2FABB, green stroke + dot markers, Y axis 0–100%, X axis Jan–Dec.
- **Sample failing records table**: TH row (uppercase gray labels), 5+ `Tr- Sample faiing records` rows (key, dates, codes), pagination "Showing [8 ▾] rows of 11,265 · Page 1 of 35" with square icon-button chevrons.
- **Required Actions**: numbered 3-step list; footer "Frequency: 3,737 errors".
- Hidden right tab (260 wide) with `CM Profile`, `Case Details` accordions: CASE DETAILS shows Status=Overdue, Assigned to=Raj Nair, Code=VAL_005, Field=SUPPLIER_CODE, Report=Item Attributes, Freq=8d, Volume=15,400, Spec=§5.3.2, Escalation=20h/72h, and escalation ladder E1 Created → E2 24h Response → E3 72h RCCAPA → E4/E5 Decision → E6 14d Recheck.
- **AI assist pill** bottom center: "How can I help you?" + green Ask-AI toggle.

### Save View flow
- **Save View modal** (~480 wide, white, radius ~12, soft shadow, green hairline outer glow): title "Save View", subtitle, close X; "Filter" summary: `Organizations: BYD ×` (blue chip), `Sites: NDE-DGN, NDE-DGN` (green chips), `Priority: Daily` (lavender chip); required "Name of View" text input (light gray fill, radius ~8, red asterisk); "Select/Type a category" dropdown; footer: text "Cancel" + solid NVIDIA-green "Save View ✓" button (radius ~8). Backdrop: screen dimmed/frosted.
- **Notification popup (toast)** component — 4 variants (all ~420×64, radius ~10, hairline border, title "New View Created" + subtitle "A new view has been added to your Saved list", close X):
  - Default: white bg
  - Positive: mint bg (~#E6F4EA), green border, green ✓ icon
  - Error: pink bg (~#FBE9E7), red border, red ✗ icon
  - Warning: amber bg (~#FBF3E0), orange border, ⚠ icon

## Component instances (from metadata, with counts)
Icon Button (87), Group (84), Badge (52), Dropdown item (39), List (36), TH (36), Tr- Sample faiing records (30), Metrics (24), arrow-down (24), grommet-icons:drag (18), clock (12), Nav bar (6), T&C Navigation (6), search-normal (6), Button (6), Chat (6), CM Profile (6), Case Details (6), Text Field (2), Notification popup (1).

## Figma Variables
Not retrievable — Figma MCP tool-call limit reached before `get_variable_defs` could run. Unknown whether variables are defined on this section.

## Canon deltas vs Shamrock
- **Radius**: everything is rounded (full-radius nav pill, 8–12px cards/buttons/toasts) vs canon sharp 0 radius.
- **Accent**: hard-coded NVIDIA green (#76B900 family) brand accent vs canon colorless/themable accent.
- **Color discipline**: many simultaneous hues (lavender P1/P2, amber Pending, red Overdue, blue/green metric tiles, per-org rainbow stripes) vs canon calm exception-first color; status chips are ad-hoc (Overdue/Pending/Monitoring/Closed...), not the canon 7-value status enum.
- **Surface**: warm pastel gradient + dotted texture + blurred blobs; cards are opaque tinted white, only the nav pill reads as glass — partial overlap with canon glassmorphism but decorative rather than structural.
- **Borders**: soft shadows + green-tinted dividers (~#E3ECDF), not neutral hairlines.
- **Type**: NVIDIA Sans-style grotesque throughout; no Instrument Sans, and record keys/IDs do not use a distinct machine/mono face (canon wants Inter/mono for machine strings).
- Useful pattern to keep (translated to canon): filter category → cascading sub-filter flyout, applied-filter chips on the trigger, Save View modal with filter summary chips, 4-variant toast set.
