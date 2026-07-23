# CM Portal (Figma section 2:97412, "Refs" page)

Source: Figma file `LebdF7tuqBXI7FNm0gDuH3`, section "CM Portal" (7533×14284).
Data used: full `get_metadata` XML (saved and parsed in chunks).
**Data gaps:** NO screenshots of this section could be fetched — the Figma MCP plan tool-call limit was hit before any CM Portal render. All layout/content below comes from metadata (node names, text-node strings, sizes); colors/radii are inferred from the identical shared components verified visually in sibling sections (same BG frames, Main Nav, Badge, table components). `get_variable_defs` also not retrievable.

## Purpose
The **contract-manufacturer-facing** portal (mirror of the NVIDIA-side app): CM dashboard, RCCAPA remediation/case view with "Chat with CM"-style threads (from the CM's perspective), Top Errors, and an Error Checks & Bugs area where the CM raises concerns to NVIDIA and tracks resolution.

## Artboards / frames (top-level children)
| Node | Name | Size | Canvas label |
|---|---|---|---|
| 2:101108 | Dashboard | 1512×987 | "Dashboard" |
| 2:97413 | Remediation | 1512×987 | "RCCAPA Details" |
| 2:98261 | Remediation | 1512×987 | "Case details Opens" / "Threads button is active" |
| 2:98827, 2:99393, 2:99961, 2:100529 | Remediation ×4 | 1512×987 each | thread/chat state variations |
| 2:98163 | Remediation | 1512×987 | "Top errors" |
| 2:97566 | Error checks and bugs | 1512×995 | "Main page" |
| 2:97699 | Error checks and bugs | 1512×2071 | "Concerns expanded on tap" (tall scroll) |
| 2:97832 | Error checks and bugs | 1512×925 | "Raise a concern" |
| 2:97985 | Error checks and bugs | 1512×925 | "Minimize a concern" |
| 2:98139 | Text field | 1136×140 | component: `Property 1=Default`, `Property 1=Area` |
| 2:101156 | CM title | 756×144 | component |
| 2:101173 | Tr- Current Reports | 1448×1344 | component: `State=Default / Hover / Open / Resolved` (1416 wide; Default/Hover 60h, Open 524h, Resolved 620h) |

Shared chrome on every frame: BG blob/gradient frame, `Main Nav` instance (~690×64), NVIDIA logo + "CM Data Inegrity" block (328×64), `Breadcrumbs` instance, hidden `AI field` (544×46) assist pill.

## Element inventory

### Dashboard (2:101108)
- **Open RCCAPA Cases requiring Action** card: title + "View All" link; table of 2 `List` row instances (1076×108).
- **DI Score** instance (354×699): tall right-rail data-integrity score panel.
- **Top Error by Volume** and **Top Error by Frequency** cards (538×294 each, side by side): title + "View All", 3 visible `List` rows (522×72) + 2 hidden.

### Remediation / case view (2:97413, 2:98261 + 4 variants)
CM-side equivalent of the NVIDIA case view; text strings confirm identical anatomy:
- All Cases list + Search Cases; case pane: badges `CM RCCAPA`, timers (18 min / 62 hr), `Data` chip; "Issue Summary" ("P1.03 Group - Not Blank ... 34,062,669 total errors in the last 30 days"); "Error Count - Last 30 Days" chart (0–100%, Jan–Dec); "Sample failing records" table + pagination (Showing 8 rows of 11,265, Page 1 of 35); "Required Actions" 3-step list; "Frequency: 3,737 errors".
- **Threads panel**: "Threads" + "Online"; **"Chat with CM"** header; message body "We identified the issue. Our ERP export was not mapping SUPPLIER_CODE correctly due to a config change in January."; red **`REJECTED`** state chip with NVIDIA feedback message ("This is a feedback on what needs to be improved. NVIDIA user types and sends this feedback to CM."), timestamp "Feb 18, 2:01 PM". Components: `Senders message` (24), `Message` (33), `CM threads Text field` (6), `RCCAPA Details` (9), `Chat` (5).
- Right accordions: `CM Profile` (11), `Case Details` (22), `Timeline` (11) instances.
- Top errors variant (2:98163): "Top Error by Volume" / "Top Error by Frequency" cards with View All.

### Error Checks & Bugs — CM side (2:97566 / 97699 / 97832 / 97985)
- Page title "Error Checks & Bugs" + search field.
- **Concerns Summary** block: "Report issues, ask NVIDIA questions, and track concern progress from one place." + "Timeliness Metrics" strip (1432×92) + filter row.
- **Concerns History** table ("See list of issues raised and resoution status" [sic]): THead of `TH` instances + rows of **`Tr- Current Reports`** (1416 wide) with states:
  - `State=Default` (60h collapsed row), `State=Hover`,
  - `State=Open` (524h — row expands inline into the concern thread),
  - `State=Resolved` (620h — expanded with resolution).
  Row actions include share / copy / trash icon instances; pagination "Showing 8 rows of 11,265 · Page 1 of 35".
- **Raise a concern** (2:97832): "Raise Concern — Got an issue, concern or question? Provide details below." with `Text field` component (Default single-line + Area multi-line variants, 1136 wide).
- **Minimize a concern** (2:97985): concern collapsed to titled bar ("This is a concern title").
- Expanded page (2:97699, 2071 tall) shows the full scrolled thread of a concern.

## Component instances (metadata counts across section)
Group (154), Icon Button (151), List (82), TH (66), Badge (63), Line arrow-left-up (60), grommet-icons:drag (33), Message (33), heroicons-outline/share (30), copy (30), trash (30), Tr- Sample faiing records (25), Senders message (24), Case Details (22), Metrics (20), Metrics cards (16), Tr- Current Reports (16), arrow-down (15), Main Nav (12), Breadcrumbs (12), AI field (12), T&C Navigation (11), search-normal (11), CM Profile (11), Timeline (11), Button (10), clock (10), RCCAPA Details (9), CM title (6), CM threads Text field (6), Text field (5), Chat (5), DI Score (1).

## Figma Variables
Not retrievable — Figma MCP tool-call limit. Unknown for this section.

## Canon deltas vs Shamrock
(Inferred — shared components verified visually in sibling sections; CM Portal itself not rendered.)
- Same rounded (8–12px + full-radius pill) language vs canon 0 radius; same NVIDIA-green fixed accent vs colorless themable accent.
- `REJECTED` (red) / resolved / open concern states are bespoke enums, not the canon 7-value status enum; badge multi-hue palette vs calm exception-first color.
- Pastel gradient + blob background with opaque cards vs canon glassmorphism + neutral hairline borders.
- Grotesque type; concern/ticket IDs and record keys not in a machine face (canon: Instrument Sans + Inter/mono).
- Distinct patterns worth porting to canon: expandable table row as thread container (`Tr- Current Reports` Default→Open→Resolved states), dual-audience mirroring (NVIDIA portal vs CM portal share components with reversed roles), DI Score rail, "Raise Concern" inline form with single-line/area text-field variants, timeliness-metrics strip above a history table.
