# Error Checks & Bugs (Figma section 2:55850, "Refs" page)

Source: Figma file `LebdF7tuqBXI7FNm0gDuH3`, section "Error Checks & Bugs" (12057×4650).
Data used: full `get_metadata` XML + high-res screenshots of the main frame (2:55868 @1400px) and the row component (2:55853 @1100px). Best-documented section of the four.
**Data gaps:** `get_variable_defs` could not be fetched (Figma MCP plan tool-call limit).

## Purpose
NVIDIA-side view of the "Error Checks & Bugs" tab: a **CM Questions & Concerns Log** — a ticket table tracking questions/concerns raised by contract manufacturers, with SLA response tracking (72-hour ODP response SLA) and resolution notes.

## Artboards / frames
| Frame | Node | Size | Contents |
|---|---|---|---|
| Agent Observation | 2:55868 | 1512×987 | Full screen: CM Questions & Concerns Log table |
| Components (sub-section) | 2:55852 | 3679×4111 | Component sheet |
| └ Tr- Suggested check | 2:55853 | 1108×264 | Table-row component, variants `Property 1=Default` and `Property 1=i` |
| Section title | 2:55851 | — | Large white display text "Error Checks & Bugs" (canvas annotation) |

Hidden alternate header in frame: "Agent Observations — AI-driven analysis of error patterns, onboarding insights, and CM support — based on data from Oct 13 to Dec 31, 2025".

## Element inventory

### Page chrome
- Background: beige→green gradient (~#E4E5C5 → ~#DBE3C3) with dotted-grid texture and blurred ellipse blobs (BG frame: Ellipses 848–852 + vector overlay).
- Top bar: NVIDIA logo + "CM Data Inegrity" label (green dot separator, small caps ~13px). Center pill nav (942×64, translucent ~#D0DDD3): Dashboard / Remediation / Scorecard / Data Coverage / Documents / **Error Checks & Bugs** (active: white pill, green text ~#76B900, dashed corner brackets in Figma are selection annotations). Bell icon button (white rounded square) + avatar.

### Left header block
- Page title "CM Questions & Concerns Log" — dark green (~#2E5C1F/#488C2B family), ~28px semibold.
- Meta line "72 hour ODP response SLA • 0 Total tickets" — green, ~15px.

### Concerns table (card 1093×750, white/greenish #EBF1E4–#F5F9F5, radius ~12, soft shadow)
- **THead** (6 × `TH` instances, 40px): TICKET / SITES / QUESTION ​/ CONCERN / RESPONSE TIME / SLA / RESOLUTION — uppercase, ~12px, gray #6–7x.
- **Rows**: 5 × `Tr- Suggested check` instances (1076×108 each), hairline dividers ~#E3ECDF:
  - Ticket id (bold, dark #3E403C): TKT-0041…TKT-0045
  - Site code: FXSJ, FBN_NBU, FXLH, FXG, FXHC
  - Concern text: 3–4 line wrapped paragraph (~15px)
  - Response time: green text (~#488C2B): "18 hrs", "31 hrs", "67 hrs", "12 hrs", "49 hrs"
  - **SLA status chip**: small square dot + label — `Met` (green ~#3D8B23), `At risk` (orange ~#E07A2F), `Breached` (red ~#D35A57) — text-only, no pill background
  - Resolution: plain paragraph
- **Pagination bar**: "Showing [8 ▾] rows of 8" (bordered select, radius ~6) · "Page **1** of 1" · two 40×40 white icon buttons (chevron left/right, hairline border, radius ~8).

### Component: `Tr- Suggested check` (2:55853)
Two variants:
- `Property 1=Default` — row as above.
- `Property 1=i` — same row layout (screenshot shows identical content; the variant likely adds an info affordance/state).
Row height 108, full-width 1076, transparent bg over the card tint.

## Component instances (from metadata)
Tr- Suggested check (8), TH (12), Icon Button (2 pagination + nav), arrow-down (row selector), Main Nav (1), and the shared chrome (nvidia-logo vector, avatar). A second off-canvas duplicate table ("Enabeld Sites" 2:55913) holds 3 more rows.

## Figma Variables
Not retrievable — Figma MCP tool-call limit reached before `get_variable_defs` could run.

## Canon deltas vs Shamrock
- **Radius**: 12px card, 8px buttons, full-radius nav pill vs canon 0 radius.
- **Accent**: NVIDIA green hard-coded for title, links, active nav, response times vs canon colorless themable accent.
- **Status enum**: SLA uses a 3-value enum (Met / At risk / Breached) with green/orange/red — maps onto only part of canon's 7-value status enum; naming differs.
- **Color usage is actually close to canon's "calm, exception-first"** here: the table is monochrome-green except SLA breaches — best reference of the set for canon translation.
- **Type**: NVIDIA Sans-style grotesque; ticket IDs (TKT-0041) set in the same face, not a machine/mono face (canon: Inter/mono for IDs).
- **Borders/surfaces**: soft shadow card with tinted (green) hairlines on a decorative gradient background, vs canon neutral hairlines + structural glassmorphism.
- Keep-worthy pattern: square status dot + text-only SLA chip (no pill fill) is closer to Shamrock restraint than the badge-heavy screens elsewhere in the file.
