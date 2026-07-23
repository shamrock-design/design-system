# Refs — DOCUMENTS (node 2:55594)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs" (canvas 0:1), section `2:55594` "DOCUMENTS" (12057×4650).

> **Extraction gaps.** Full `get_metadata` captured (complete node tree). No direct screenshot could be rendered (Figma MCP Starter-plan tool-call limit hit mid-extraction); visual properties are inferred from the shared chrome verified in the Trends & Cases captures — every chrome element here is the same component instance by node reuse. `get_variable_defs` could not be run.

## Purpose

The Documents page: a document library (list of onboarding/tutorial documents) and an inline document viewer, with a resizable split layout. Two states: full-width list (nothing open) and list + PDF-style viewer.

## Artboards / frames

| Node | Name | Size | State |
|---|---|---|---|
| 2:55662 | Cases | 1512×987 | Document list, full width; viewer hidden (empty-state "Select a document to view") |
| 2:55753 | Cases | 1512×987 | Split view: list 499px + document viewer 963px |
| 2:55596 | Components (section) | 3679×4111 | `Document list property table` (2:55597): variants Default / Hover / Active |

## Element inventory

### Chrome (same instances as rest of file)
Aurora sage BG (Ellipse 848–851 blurs), brand plate 328×64 (NVIDIA logo + "CM Data Inegrity"), `Main Nav` 939×64 (Documents tab active), corner-bracket vectors on panels, floating `AI field` 544×46.

### List pane
- **Title row** 54px: "Documents" (~24px semibold) + search field 198×38 (magnifier icon + placeholder — placeholder still reads "Search Scorecard", a copy bug in the mock; a hidden alternate reads "Search Insights").
- **Document list item** (`Document list` instance; 5 rows): 100px tall (full-width state, 1462 wide) or 124px when Active (narrow state, 499 wide). Rows separated by zero-height hairline vectors (`Vector 822–827`).
- **Component variants** (sheet 2:55607, 499×124 cells): `Default` / `Hover` / `Active` — Active is the selected-document treatment (taller, highlighted).

### Split behavior
- **Resizer** (2×855): hairline divider with centered 12×18 drag handle (`grommet-icons:drag`) between list and viewer. List collapses from 1462 → 499px when a document opens.

### Document viewer ("Chat area" frame, 963×855)
- **Header row** 48px: back `Icon Button` 32×32, title "Onboarding tutorials for New Sites" (~16px semibold), right-aligned "Last viewed - 4/6/2026" (small gray; empty-state variant says "Last refreshed 4/6/2026").
- **Toolbar row** 56px: left cluster of 2 `Icon Button` 32×32; center pager — "Page" label + page-number text field (41×40, value "2", with hidden calendar/arrow adornments) + "of 45"; right cluster of 3 `Icon Button` 32×32 (zoom/download/share-type actions); hidden search affordance.
- **Page canvas** 962×750: vertically stacked page images (`image 65`, 511×636 each — previous page peeking above, current page, next page below), continuous-scroll reading model.
- **Empty state** (2:55662): centered text "Select a document to view" (~16px gray) in the viewer area; viewer chrome hidden.
- **Hidden chat affordance**: a `Chat` instance (606×108) exists but is hidden in both frames — chat-with-document was designed but off.

## Component instances / repeated patterns
`Document list` ×10 (5 per frame) + variant sheet (Default/Hover/Active) · `Icon Button` ×~14 (incl. hidden) · `search-normal` ×4 · `Main Nav` ×2 · `AI field` ×2 · `Chat` ×2 (hidden) · pager text-field pattern ×2 · corner-bracket vectors throughout.

## Figma Variables
Not retrievable — `get_variable_defs` blocked by the Figma MCP plan limit. None referenced in metadata naming.

## Canon deltas vs Shamrock

- **Radius**: search field, list-item highlight, viewer cards use the app's small radii → canon 0.
- **Accent**: active nav/selected document highlight in NVIDIA green → themable accent token; selection should read via surface + hairline, color only as accent.
- **Machine values**: "Page 2 of 45", dates ("4/6/2026") → machine face.
- **Date format**: "4/6/2026" and "Last viewed -" hyphen style deviate from `docs/guidelines/date-time-format.md` — normalize.
- **Resizable split with hairline divider + drag handle**: matches canon's hairline-over-shadow preference; keep drag handle monochrome.
- **Empty state** is text-only and calm — aligns with `docs/guidelines/empty-states.md`; needs an action affordance per guideline ("Select a document to view" has no CTA).
- **Aligned**: glass panels over aurora; hairline row separators; list stays colorless in nominal state (no status color in the library at all).
