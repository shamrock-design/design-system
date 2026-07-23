# Refs / Notification (node 2:63093)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs", section `2:63093` "Notification" (7179×3497).

> **Data gaps:** documented from the full-section screenshot plus locally upscaled crops (item body copy only partially legible). `get_metadata` and `get_variable_defs` could not be fetched (Figma MCP Starter-plan rate limit). Node ids, component names, exact colors/px and Variables missing.

## What the screens are

The **notification popover** of the CM Data Integrity dashboard: one in-context artboard ("DASHBOARD – in 1920 view") with the panel opened from the bell in the top nav, one standalone panel with item states, and a dark spec area defining the **notification item component** (state variants + avatar/initials-tile variants).

## Artboards / frames observed (ids unavailable)

| Frame | Contents |
|---|---|
| DASHBOARD – in 1920 view (~1920×1080) | full dashboard with Notification popover anchored under the nav-bar bell, top-right |
| Standalone panel (~330×470) | Notification panel showing hover/read shading states |
| Spec: item state stack (dashed purple frame) | 4 notification items labeled (purple annotations) approx.: General / Mixed(Read) / Unopened / Hovered+Pinned |
| Spec: avatar variant grid (dashed purple frame) | 2 columns "Photo" / "Text" × ~6 rows: photo avatar; colored initials tiles — green, red, dark green, blue, orange |

## Element inventory (observed properties)

- **Notification popover** — white sheet anchored below the bell icon button (bell sits in a white circular/pill icon button in the nav, avatar to its right). Header row: `Notification` title (~13px medium) + close **×** right. Light shadow; radius appears small (~4–8px). Width ~300–330px; 4+ items stacked with hairline separators; a filter/sort dropdown (`▾`) top-right of the list in the 1920 view.
- **Notification item** — rows ~90px tall with 12–16px padding:
  - **Leading avatar** (~32px): either a photo avatar or a colored **initials tile** (e.g. red tile with white "DA") — square with small radius.
  - **Title line**: mixed-weight rich text — bold actor `CM` + regular "sent a new" + bold object `Data`.
  - **Trailing meta**: small **green unread dot** + gray relative time (`24h ago`, `6h ago`).
  - **Body**: 2 lines of gray truncated summary text (~11px).
  - **Reference line**: gray code `BYD - NRU_URS` (site - feed reference).
- **Item states** (from shading in the standalone panel + spec stack):
  - Unread/unopened: white background (+ green dot)
  - Read: pale gray background (~#F0F0EE)
  - Hover/active: darker gray (~#DCDCDA)
  - First item variant with red initials tile = alert-type notification.
- **Avatar/initials tile variants** — "Photo" vs "Text" columns; text tiles in 5 tint variants (pale green, pale red/pink, saturated green, pale blue, pale orange) with dark two-letter initials — tile color appears to encode notification/actor type.
- **Context (1920 dashboard behind)** — confirms nav order: Dashboard, Remediation, Scorecard, Data Coverage, Documents, Error Chores & Bugs; bell icon button + avatar; the popover overlays the Health-by-Organization grid without dimming the page.
- **Typography** — same grotesque sans; heavy use of mixed weight within one line (actor/object bold), 11–12px throughout the panel.

## Component instances / repeated patterns

(Inferred:) `Notification popover`, `Notification item` (state variants: unread / read / hover; type variants via tile color), `Avatar` (photo | initials-tile × 5 tints), `Icon Button` (bell, close), unread dot, sort dropdown. Item anatomy matches the issue-card metadata pattern from the Status Container section (title / meta / reference / timestamp).

## Figma Variables

Not retrievable (rate limit). None recorded.

## Canon deltas (vs Shamrock canon)

1. Rounded popover and initials tiles vs canon 0 radius.
2. **Colored initials tiles as a type code** (green/red/blue/orange) — categorical decoration, conflicts with calm exception-first color and the colorless core; type should be conveyed by text/status enum, red reserved for true alerts.
3. State signaling by **background shade** (gray = read) rather than canon hairline separation + minimal marks; unread green dot is brand-green, not a status-enum token.
4. No glass treatment on the popover (opaque white over content) — the shell's glassmorphism is not carried into overlays.
5. Single sans; timestamps/reference codes not in machine face.
6. Popover header/title casing and the "NOtification" section title typo indicate spec is draft-grade — naming hygiene needed before tokenizing.
