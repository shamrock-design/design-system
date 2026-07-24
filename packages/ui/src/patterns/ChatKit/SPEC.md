# ChatKit — SPEC

## Purpose
The **AI companion** surface: the pattern family behind Cognito's agent transcript,
RapidX's AiCompanion, and CM Data Integrity's AI CHAT. Composable pieces for an
assistant that answers grounded questions with rich, in-thread content
(reasoning, run references, inline status). NOT a general messaging UI, and NOT a
modal — `CompanionPanel` is a glass side panel meant to sit inside AppShell
content or a `Drawer`. For a focused, dismissable task use `Modal`/`Drawer`
directly.

## Reference
- `refs/apps/Planning/planning-observability/components/AiCompanion.tsx` +
  `app/globals.css` (`.companion .cmp-h .cmsg .cthink .sug .runref .cinput .orb .gd`).
- `refs/apps/Planning/app/assets/views/ai.js` (Cognito transcript + `aiAnswer`),
  `.aigr` grounded-AI block (`.ah .orb`, `.layer/.ll` uppercase reasoning labels).
- `docs/figma/refs/ai-chat.md` (12-artboard AI CHAT matrix), `cases-frames.md`
  (agentic AI actions). Canon deltas from those docs are applied here: sharp
  corners (no 8–12px radii), colorless surfaces + accent token (no hardcoded
  green cream canvas), status via the 7-value enum (not binary green/red),
  machine face for reasoning headers/metadata/timestamps.

## Anatomy (exported pieces)
- **AgentOrb** — `.orb` accent-tinted circle + glyph + `.orbDot` presence dot
  (the canon circle exception). Reused by ChatMessage and the panel header.
- **ChatMessage** — `.message` row; `.user` right / `.assistant` left; `.body`,
  `.bubble` (`.bubbleUser` accent-tinted / `.bubbleAssistant` transparent),
  `.timestamp` (machine).
- **ThinkingBlock** (+ **ThinkingStep**) — `.thinking` disclosure;
  `.thinkingHeader` (machine `.thinkingLabel`, `.spinner` when active,
  `.thinkingMeta` step count, `.thinkingChevron`); `.thinkingBody` of
  `.step` (`.stepLabel` mono + `.stepText`).
- **SuggestionChips** — `.suggestions` wrap row of accent-outline `.chip` buttons.
- **RunRefChip** — `.runref` machine-face reference chip with `.runrefIcon` slot,
  `<button>` when `onClick` else `<span>`.
- **ChatComposer** — `.composer` (textarea `.composerInput` + accent send Button).
- **CompanionPanel** — `.panel` (glass, left hairline) → `.panelHeader`
  (orb + `.panelTitle`/`.panelSubtitle` + close) / `.transcript` (`role="log"`) /
  `.panelFooter` (SuggestionChips + ChatComposer).

## Props (headline)
| Piece | Key props |
|---|---|
| AgentOrb | `size` sm\|md, `icon` IconName\|node, `status?: Status` (dot), `pulse?`, `label?` |
| ChatMessage | `role` user\|assistant, `avatar?` (default AgentOrb for assistant), `timestamp?`, children |
| ThinkingBlock | `label='REASONING'`, `active?`, `defaultOpen=true`, `stepCount?`, children |
| ThinkingStep | `label?`, children |
| SuggestionChips | `items: {label,onClick?,disabled?}[]` |
| RunRefChip | children, `icon?` (default `layers`, `null` for none), `onClick?` |
| ChatComposer | `onSend(text)`, `placeholder?`, `disabled?`, `value?`/`onChange?` (controlled) or `defaultValue?`, `sendIcon='arrow-right'`, `sendLabel='Send'` |
| CompanionPanel | `title`, `subtitle?`, `status?=success`, `onClose?`, `onSend`, `suggestions?`, `placeholder?`, `disabled?`, `composerProps?`, children |

## States matrix
- ChatMessage: user · assistant (× with/without timestamp, with/without custom avatar).
- ThinkingBlock: open · closed × idle · active(spinner). Impossible: closed body content is unmounted.
- SuggestionChips / RunRefChip / chip / send: default · hover · focus-visible · disabled.
- ChatComposer: empty (send disabled) · has-text (send enabled) · focus-within · disabled.

## Behavior & keyboard
Static/presentational — **no Base UI** (only reuses `Button` + composer textarea).
- ChatComposer: **Enter** sends the trimmed value (and clears when uncontrolled);
  **Shift+Enter** inserts a newline; send is inert while `disabled` or empty;
  textarea auto-grows (capped). Controlled via `value`+`onChange`.
- ThinkingBlock: header `<button aria-expanded>` toggles; body mounts only when open.
- CompanionPanel transcript is `role="log" aria-live="polite"`; spinner is
  `role="status" aria-label="Thinking"`; orb/icons are decorative (`aria-hidden`)
  unless a `label` is supplied.

## Tokens consumed
`--sh-color-accent-{base,subtle-bg,subtle-border,subtle-text,focus-ring}`,
`--sh-color-status-{status}-base` (orb dot), `--sh-color-text-{primary,secondary,tertiary,subtle,disabled,machine}`,
`--sh-color-border-{hairline,interactive}`, `--sh-surface-{panel,solid,faint}`,
`--sh-font-family-machine`, `--sh-font-size-{micro..control}`,
`--sh-font-weight-*`, `--sh-font-tracking-{body,caps,tight}`, `--sh-space-*`,
`--sh-radius-{none,circle}`, `--sh-motion-*`, keyframes `sh-rise`/`sh-spin`/`sh-pulse`.
Local vars: `--sh-orb-dot`, `--sh-orb-ring`.

## Do / Don't
- **Do** keep color scarce: accent marks the send CTA, suggestion outlines, run
  refs and the user's own bubble; nominal transcript reads calm.
- **Do** render inline signal with `StatusBadge` (dot + label) and machine values
  with the machine face.
- **Don't** tint the chat canvas or round the bubbles (benchmark did both).
- **Don't** encode state in the orb dot color or a run-ref that isn't the enum.
- **Don't** make CompanionPanel a modal — it has no scrim/focus-trap by design.

## Open questions
- A `spark`/`sparkle` icon would fit the orb better than `layers`; add to the
  icon set when available (default is overridable via `icon`).
- Message actions (copy / regenerate / thumbs) from the Figma refs are out of
  scope for v1 — add as a `ChatMessage` action slot if a consumer needs them.
