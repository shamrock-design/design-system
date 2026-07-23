# Figma "Refs" page — extraction index

Source: [Shamrock Design System Figma file](https://www.figma.com/design/LebdF7tuqBXI7FNm0gDuH3/Shamrock-Design-System?node-id=0-1), page "Refs" (14 top-level sections). Extracted 2026-07-23 via Figma MCP (metadata + screenshots). One file per section, each with element inventories, observed properties, component-instance censuses, and canon-delta notes.

**The product**: these screens are NVIDIA **"CM Data Integrity"** — an RCCAPA case-management suite (internal dashboard + CM-facing portal). A third product family alongside Cognito and RapidX, and the richest component demand source yet.

## Coverage

| Section | File | Coverage |
|---|---|---|
| Dashboard (2:44794) | dashboard.md | Full (screenshot + complete metadata) |
| TRENDS & CASES (2:55937) | trends-and-cases.md | Full structure; partial renders |
| Cases ×2 (2:62895/62994) | cases-frames.md | Full |
| DATA COVERAGE (2:55347) | data-coverage.md | Full metadata; no direct renders |
| DOCUMENTS (2:55594) | documents.md | Full metadata; no direct renders |
| RCCAPA Filter (2:41446) | rccapa-filter.md | Full |
| Error Checks & Bugs (2:55850) | error-checks-and-bugs.md | Full (best fidelity) |
| RCCAPA UPDATES & THREADS (2:63444) | rccapa-updates-and-threads.md | Partial (screenshots only) |
| CM Portal (2:97412) | cm-portal.md | Partial (metadata only, no renders) |
| AI CHAT (2:48373) | ai-chat.md | Partial (low-res renders) |
| Notification (2:63093) | notification.md | Partial |
| Calendar (2:101400) | calendar.md | Near-full visually |
| Status Container (2:101882) | status-container.md | Partial (hi-res crops, no metadata) |

**Known gaps (Figma MCP Starter-plan call limit hit mid-extraction):** `get_variable_defs` never succeeded — whether the file defines Figma Variables is unknown; AI CHAT needs per-artboard hi-res renders; CM Portal needs renders; RCCAPA Updates needs metadata. Next extraction round (when the limit resets or the plan upgrades): those four items first.

## What this adds to the component backlog

Confirms existing Phase 2/3 items (tables with expandable rows, unified pagination, KPI/metric tiles, badges/chips, tabs, modals, toasts ×4 variants, drawers, empty states, date-range picker — the dual-month Calendar here is the spec for Phase 3's DateTimeRangePicker).

**New demand not previously in the backlog:**
- **3-pane case workspace** (nav rail + list pane + detail pane + collapsible profile rail) — a layout pattern
- **Thread / messaging kit** ("Chat with CM": structured RCCAPA messages, approve/reject chips, quick-reply suggestions, ~10-state composer) — overlaps Phase 4 AI-chat kit; design once
- **Filter builder**: filter chip → cascading checkbox dropdowns → applied-filter badge chips → Save View modal (saved/customized views)
- **Status container** (stage × state composition: RCCAPA/Data/NV Review × Overdue/Pending/Sent back/Closed, with elapsed-time clock)
- **Timeline/milestone feed** (green/red milestone dots, breach events)
- **Escalation ladder** (E1–E6)
- **Notification popover** (avatar/initials tile, unread dot, read/unread/hover states)
- **Donut gauge** (large score dial) + **area chart** for @shamrock-design/charts
- **Document viewer** (resizable split, page navigation, toolbar)
- **Corner-tick bracket ornament** — recurring brand motif in these designs; **decision needed** whether it enters the canon or is normalized away (it currently substitutes for hairline borders)

## Cross-cutting canon deltas (to normalize when these screens rebuild on Shamrock)

- Rounded 2–12px radii + pills everywhere → canon 0
- Hardcoded NVIDIA green #76B900 as accent AND as "good" signal → colorless accent + status.success separation
- Third fragmented status vocabulary (Overdue/Pending/Closed/Sent back; Met/At risk/Breached; APPROVED/REJECTED; Open/Resolved) → map into the 7-value enum via `mapLegacyStatus`; extend the legacy table with `sent-back`, `at-risk`, `breached`, `approved`, `rejected`
- Color-only status chips (no dots in places) → redundant dot + text
- Single grotesque sans, no machine face → Instrument Sans + Inter split
- Categorical decoration color (weekend red numerals, initials-tile palette, org stripes) → needs a sanctioned categorical mini-palette or removal
