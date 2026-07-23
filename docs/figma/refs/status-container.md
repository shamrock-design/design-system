# Refs / Status Container (node 2:101882)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs", section `2:101882` "Status Container" (4615×4485).

> **Data gaps:** documented from the full-section screenshot (1500px) plus locally cropped/upscaled regions only. `get_metadata` and `get_variable_defs` for this section could not be fetched — the Figma MCP Starter-plan tool-call limit was hit mid-task. Node ids, exact component names, exact px values and Figma Variables are therefore missing; colors are eyeballed approximations.

## What the screens are

The **case/issue status system** for the CM Data Integrity product: the anatomy and states of the "status container" chip cluster, issue notification cards, the full **Issue Summary** case-detail view, the **Chat with CM** thread, **RCCAPA response** cards (Root Cause / Corrective Action / Preventive Action), composer widgets for responding to cases, and a case **Timeline**. This section is effectively the spec for exception handling and the status enum.

## Artboards / groupings observed (no node ids available)

- Issue notification card — **Default** and **Hover** states (annotated in purple), plus a third repeat.
- Status badge specimen column: **Overdue / Closed / Pending / Sent back** (dashed purple spec frames).
- "Status Container" anatomy: gray placeholder bar + assembled container `[CM RCCAPA · Overdue · ⏱ 18 min | Data · Overdue · ⏱ 62 hr]`.
- Status-container matrix: columns **RCCAPA / Data / NV Review / Data Review** × rows **Overdue / Pending / Sent back / Closed** (Sent back + Closed exist only for RCCAPA and Data).
- Large **Issue Summary** case view, duplicated twice side by side (light blue-gray spec canvas).
- **Chat with CM** panel.
- 4 × **RCCAPA response** cards (REJECTED ×2, plain ×2) on white sheet.
- Right rail: 6 message/response spec cards (normal response with reply + status, minimal response, response with RCCAPA, RCCAPA response with reply, RCCAPA response with status, normal response with reply).
- Bottom: composer widget states (~10 frames) + context-menu list + collapsed issue-card list rows (with thread/hide actions) + **TIMELINE** card + two status-mapping mini tables.

## Element inventory (observed properties)

- **Status badge (chip)** — small rectangle, tiny radius (~2–4px), 11–12px medium text. The de-facto status enum (4 values):
  - `Overdue` — red text (~#DE2D3C) on pink (~#FBE6E6)
  - `Pending` — amber text (~#B8860B) on pale yellow (~#FBF0C8)
  - `Sent back` — purple text (~#8B4FD0) on pale lavender (~#F2E7FB)
  - `Closed` — dark gray text (~#4A4A4A) on light gray (~#E8E8E8)
  - Related chips seen in Issue Summary header: `Pending CM RCCAPA` (amber), org chip `FOXCONN` (magenta/purple text), site chip `FXSJ` (gray), and decision chips `APPROVED` (green on pale green ~#DBF2DC) / `REJECTED` (red on pink) / `Reject` / `Approve` (selectable pills with ×).
- **Status container** — white hairline-bordered bar composing: category label (plain text: `CM RCCAPA`, `Data`, `NV Review`, `Data Review`) + status badge + clock icon + elapsed duration (`18 min`, `62 hr`); multiple segments joined with a vertical hairline divider. Subtle drop shadow in the assembled version.
- **Issue notification card** — white card with **4px red left accent bar**; row 1: bold title `P1.03 Component Data Code - Not Blank` + right-aligned gray `10h ago`; row 2: gray meta `BYD - NRU_URS` + right `Frequency 2,727 errors`; row 3: embedded status container. Hover state = slightly elevated/shaded. Collapsed list-row variant with thread / hide (eye) actions also present.
- **KPI stat tiles** (Issue Summary) — tiles with **dashed corner-tick borders** (the signature viewfinder brackets, colored to match content): `99% Error Rate` red-on-pink; `34,062,669 Affected records` green-on-pale-green; same number blue-on-pale-blue (~#2F6FDE on #E9F1FD); `Last 30 Days Observation Window` black-on-white. Big bold number ~22px, caption ~12px.
- **Area chart** — "Error Count – Last 30 Days": light green (~#D9F0B4) fill, green line with hollow circle markers, dotted horizontal gridlines, y-axis 0–100%, month x-axis Jan–Dec.
- **Data table** — "Sample failing records": header row NR / KEY / DATE (sort chevron) / NVPN / GROUP / CM-SKU on pale gray; zebra-light rows; truncated monospace-looking keys (`BIVBRYRFV9F297FV97…`); footer pagination: `Showing [8 ▾] rows of 11,265` + `Page 1 of 35` + square chevron prev/next buttons.
- **Required Actions** — plain numbered list (3 steps) + `Frequency: 2,727 errors` footnote.
- **Chat thread ("Chat with CM")** — panel on pale sage/gray bg with green corner ticks; white system/user bubbles right-aligned; AI messages left with avatar + `AI Agent ` label; structured RCCAPA messages with small green-tinted section-label chips `ROOT CAUSE:` / `CORRECTIVE ACTION:` / `PREVENTIVE ACTION:`; quoted-reply preview bar (bordered input-like strip with back-arrow icon + truncated text); timestamps `Feb 18, 2:01 PM` in gray; **RESPOND button** — white, back-arrow icon, uppercase label, green dashed corner-tick brackets instead of a normal border; bottom input `Send Message to CM` + solid green square send button (↑).
- **RCCAPA response card** — white card: avatar + `AI Agent` + timestamp + optional `REJECTED` chip top-right; three labeled sections; footer share + copy icons left, RESPOND corner-tick button right.
- **Composer widget** — layered white bars: optional quoted-context bar (pale green header strip, truncated message + ×), `Select Response to Case ▾` dropdown, `Provide RCCAPA response` label + toggle switch (gray off / green on), `Enter a Feedback` text input, green square send button. Expanded RCCAPA mode swaps the feedback field for three stacked fields: `Enter Root Cause` / `Enter Corrective Action` / `Enter Preventive Action`. Variants with `Reject ×` (red chip) or `Approve ×` (green chip) pre-selected.
- **Timeline card** — white card, `TIMELINE` caption header (letterspaced), bullet dot + `Case created` + gray timestamp `3/30/2026, 12:13:54 PM`.
- **Context menu** — dark-outlined list (Dashboard, Cases, Top Errors, … , Agenda/AI Actions — low-res) with chevron rows.
- **Status mapping tables** — two-column mini tables pairing case states (`Pending CM RCCAPA`, `Overdue CM RCCAPA`, `Pending NV Review`, `Overdue NV Review`, `Sent Back`, `Closed`) with data states (`Pending Data`, `Overdue Data`).
- **Typography** — same grotesque sans throughout; bold for titles/numbers, ~11–12px chips/meta, uppercase caption style for TIMELINE/RESPOND. No distinct mono face even for record keys (they merely look condensed).

## Component instances / repeated patterns

(No metadata — inferred from repetition:) `Status badge` (4 states), `Status container` (category × status matrix), `Issue card` (default/hover/collapsed), `KPI stat tile` (4 color intents), `RCCAPA message card`, `RESPOND corner-tick button`, `Composer` (≥8 variant states), `Toggle switch`, `Pagination`, `Chip` (org/site/decision), `Timeline item`.

## Figma Variables

Not retrievable (rate limit). None recorded.

## Canon deltas (vs Shamrock canon)

1. **Status enum is 4 values** (Overdue / Pending / Sent back / Closed, plus Approved/Rejected decision chips) — not the canon 7-value status enum; mapping needed.
2. **Corner-tick dashed brackets** on buttons and KPI tiles replace canon hairline borders — decorative, non-canon.
3. Chips/cards have small rounded radius (~2–4px, larger on cards) vs canon 0 radius (closest section to canon sharpness, though).
4. Color is used well here in an exception-first way (red only for overdue/error) — closest to canon philosophy — but adds non-enum decorative colors (magenta org chips, blue stat tile) and the NVIDIA-green CTA everywhere.
5. White opaque cards on flat spec canvas — no glassmorphism.
6. Record keys / numerics not set in a machine face (canon expects Inter/machine face for data).
