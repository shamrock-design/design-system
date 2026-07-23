# Refs / AI CHAT (node 2:48373)

Figma: file `LebdF7tuqBXI7FNm0gDuH3`, page "Refs", section `2:48373` "AI CHAT" (12057×5572).

> **Data gaps:** documented from the full-section screenshot (1500px, so each 1512-wide artboard renders ~187px — small) plus locally upscaled crops. Fine text is not fully legible. `get_metadata` and `get_variable_defs` could not be fetched (Figma MCP Starter-plan rate limit). Node ids, instance names, exact colors/px and Variables missing.

## What the screens are

The **AI assistant chat** for the CM Data Integrity dashboard, shown in **three layout modes × menu on/off × populated vs. empty ("New") state** — 12 artboards total. The assistant answers org-health questions with text plus embedded metric cards, and can surface RCCAPA content in-thread. It reuses the dashboard's `AI field` input as its entry point.

## Artboard list (names from canvas labels; ids unavailable; each ≈1512×982)

Row 1 (populated conversation):
1. Default chat — Open (floating window over dimmed dashboard)
2. Default chat — Open — menu (adds chat-history sidebar inside the window)
3. Default chat — Full view (standalone full-page chat)
4. Default chat — Full view — menu (page + left history rail)
5. Default chat — Side view (chat docked as right panel; dashboard stays interactive)
6. Default chat — Side view — menu

Row 2 (empty state): the same six, suffixed **"— New"**, showing the "What would you like to do?" zero state with suggestion chips.

## Element inventory (observed properties)

- **Chat window (Open mode)** — large centered floating sheet (~640×400+) over the dashboard, which stays visible but blurred/dimmed behind (glass-over-content). Cream/sage chat canvas (~#EEEFE2), rounded corners (~8–12px), drop shadow. **Header bar**: white strip, leading icon + truncated conversation title ("How's my org doing…"), trailing icon buttons: expand/full-view, dock-to-side, close ×.
- **Side view** — same chat as a full-height right dock (~360px wide), dashboard remains at left; menu variant appends a second gray rail at the far right/left of the panel.
- **Full view** — chat as an entire page (white/cream), same header actions.
- **Menu / history rail** — light panel listing conversation history: "New chat" action at top + ~6 truncated history rows; active row highlighted; sits left of the thread in every "menu" variant.
- **User message bubble** — sage/olive-green filled rounded bubble (~#C9D4B4/#D4DDC2, radius ~10px), right-aligned, dark text, tiny gray timestamp bottom-right.
- **AI message** — left-aligned, no bubble: green **sparkle icon** + "AI Agent" label line, then plain dark body text on the canvas.
- **Embedded metric card** — white rounded card inside AI replies: bold title row ("Critical Rules Needing Attention"–style), 3 rows of rule/metric name + right-aligned **value badge** (green badge for good %, red badge for failing %, e.g. 94% / 72% / 0%!). Same Badge component as the dashboard.
- **Embedded RCCAPA card** (full view) — white card titled "My RCCAPA…" with labeled sections and a highlighted diff/values area including red inline text (change callout).
- **Message actions** — small icon row under AI replies: thumbs-up / thumbs-down left, copy / regenerate right (gray ~14px glyphs).
- **Empty state** — centered prompt "What would you like to do?" (~15px medium) with two rows of **suggestion chips**: pill-shaped, white/pale-green fill, thin green outline, small dark text (~5 chips, e.g. "What issues…", "Best of RCC?", "Handoff has select?" — text too small to transcribe reliably).
- **Input bar** — white rounded field docked at bottom of the thread: leading sparkle/arrow glyph, gray placeholder ("How can I help you?" style), trailing **solid green square send button** (~28px, white ↑ arrow, small radius). Identical to the dashboard `AI field` component (544×46 per Dashboard metadata).
- **Typography** — same grotesque sans as the rest of the product; body ~12–13px, labels ~11px. No mono face observed.

## Component instances / repeated patterns

(Inferred; Dashboard-section metadata confirms the shared masters:) `AI field` (input), `Badge` (metric values), sparkle icon `fluent:sparkle-28-filled`, `Icon Button` (header actions), user bubble, AI reply block, metric card, suggestion chip, history rail row, send button. The 12 artboards are a strict matrix: layout {Open, Full, Side} × menu {off, on} × state {default, new}.

## Figma Variables

Not retrievable (rate limit). None recorded.

## Canon deltas (vs Shamrock canon)

1. Rounded everything — window, bubbles, cards, chips, input (~8–12px) vs canon 0 radius.
2. Colored user bubbles (sage green fill) and green-tinted chat canvas — tinted core instead of colorless surface + accent token.
3. Suggestion chips and send button hard-coded to brand green; green also used decoratively (sparkle, outlines), not exception-first.
4. Metric badges keep the binary green/red good-bad scheme, not the 7-value status enum.
5. Dimmed/blurred dashboard behind the floating window is glass-adjacent and could map to canon glassmorphism, but the chat surface itself is opaque cream, not glass with hairline borders.
6. Single sans face; no Instrument Sans/Inter split, no machine face for the metric values.
