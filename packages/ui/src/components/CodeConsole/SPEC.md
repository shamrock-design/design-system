# CodeConsole — SPEC

## Purpose
Read-only terminal/log surface: live execution logs (leveled lines) or a static code block. NOT an editor (no input) and NOT for prose output (use `<Text>` / Markdown).

## Reference
Grabber / TOSCA execution panels: dark log console streaming `[INFO]/[WARN]/[ERROR]` lines, and static code/script blocks with line numbers and a copy button.

## The dark surface
This is **the one sanctioned dark surface** in the system (terminal idiom). Its background is ink (`--sh-color-text-primary`) with inverse text — a deliberate exception to the light, glass-first canon. Do not clone this treatment onto non-terminal surfaces. On this dark ground, status colors use the **`-base`** variants (warn = `status-warning-base`, error = `status-critical-base`) because the `-text` variants are tuned for light backgrounds and go muddy on ink.

## Anatomy
root (dark) → header (optional: `title` + `meta` slots, machine face, + copy button) → body (scroll region, `maxHeight`) → line rows (optional line-number gutter in ink-6 + text, level-colored) OR a plain `code` block → EmptyState (sm) when there is nothing to show.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `lines` | `{ text: string; level?: 'info' \| 'warn' \| 'error' }[]` | — | leveled log mode |
| `code` | `string` | — | plain block mode (alternative to `lines`) |
| `title` | `ReactNode` | — | header title slot (machine face) |
| `meta` | `ReactNode` | — | header trailing slot (duration, exit code…) |
| `follow` | `boolean` | `false` | auto-scroll to bottom when new lines arrive |
| `maxHeight` | `number \| string` | `320` | body scroll cap (number → px) |
| `lineNumbers` | `boolean` | `false` | left gutter, ink-6 |
| `copyable` | `boolean` | `false` | copy button (navigator.clipboard), transient "Copied" |

## States matrix
empty (EmptyState sm: "No logs yet. Run an execution to see live logs here.") · lines (info/warn/error) · code block · following (pinned to bottom) · copy idle/copied. `lines` and `code` are mutually exclusive; if neither has content → empty.

## Behavior & keyboard
Static surface. `follow` scrolls the body to `scrollHeight` in a layout effect on every `lines` change. Copy writes the joined line text (or `code`) to the clipboard and flips the button to "Copied" for ~1.4s. The body is a focusable (`tabindex=0`) scroll region so keyboard users can scroll it. No line-level interaction.

## Tokens consumed
`--sh-color-text-primary` (bg = ink), `--sh-color-text-inverse`, `--sh-color-ink-6` (gutter), `--sh-color-status-warning-base`, `--sh-color-status-critical-base`, `--sh-font-family-machine`, `--sh-font-size-{meta,micro}`, `--sh-space-*`, `--sh-motion-*`, `--sh-radius-none`. Copy button borders use a translucent inverse hairline (rgba on white) since border tokens are light-surface tuned.

## Do / Don't
- Do: keep the dark surface for terminals/logs only.
- Do: pass preformatted line text; the console does not parse or wrap ANSI.
- Don't: use `-text` status variants here — they are for light backgrounds.
- Don't: pass both `lines` and `code`; `lines` wins if both are non-empty.

## Open questions
— ANSI color parsing and log-level filtering are out of scope for v1.
