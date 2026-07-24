# FileDropzone — SPEC

## Purpose
File intake surface: drag & drop plus a browse fallback over one hidden `<input type="file">`. NOT for inline attachment buttons in toolbars (use a `Button` wired to an input) and NOT for showing upload progress (pair with Toast/StatusBadge in the consumer).

## Reference
Cognito Settings → Upload Config: dashed drop area, "Drag & drop your .xlsx file here, or browse", disabled until a prerequisite is chosen ("Select an L0 stage above to enable upload") — that gating copy is the `disabledReason` prop.

## Anatomy
zone (the whole thing is one button) → icon slot → copy line ("Drag & drop …, or **browse**" — browse styled as the accent link) → hint (accept/limit, machine-adjacent meta) → inline error (critical text) → chips row (selected files: machine-face name + formatted size + × remove).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `accept` | `string` | — | passed to the input, echoed in the copy ("your .xlsx file") |
| `multiple` | `boolean` | `false` | |
| `disabled` | `boolean` | `false` | |
| `disabledReason` | `string` | — | rendered inside the zone when disabled |
| `onFiles` | `(files: File[]) => void` | — | fired with accepted files (picker or drop) |
| `maxBytes` | `number` | — | oversize files → `onError` + inline critical text; accepted ones still flow to `onFiles` |
| `onError` | `(message: string, rejected: File[]) => void` | — | |
| `selectedFiles` | `File[]` | — | controlled chip list |
| `onRemove` | `(file: File, index: number) => void` | — | chip × |
| `icon` | `ReactNode` | built-in upload glyph | icon slot |

## States matrix
default (dashed `hairline-strong` border — dashed is sanctioned HERE as the drop affordance, nowhere else) · hover (accent-subtle border) · drag-over (`accent-subtle-bg` + accent border) · focus-visible (standard 3px ring) · disabled (0.45 faint + `not-allowed`, `disabledReason` replaces the hint) · error (inline critical text below the copy). No loading state — progress belongs to the consumer.

## Behavior & keyboard
The whole zone is a native `<button>` — Enter/Space open the picker; "browse" is a styled span inside it (no nested interactive element). Drag-over uses dragenter/dragleave counting so child elements don't flicker the state. Oversize handling: rejected files produce one inline critical message ("`name` exceeds the N MB limit.") and an `onError` call; remaining valid files are still delivered. Chip remove buttons are real buttons with `aria-label="Remove <name>"`. Sizes format as B/KB/MB (one decimal, machine face).

## Tokens consumed
`--sh-color-border-{hairline-strong}`, `--sh-color-accent-{base,emphasis,subtle-bg,subtle-border,focus-ring}`, `--sh-color-status-critical-text`, `--sh-color-text-{primary,secondary,subtle,faint}`, `--sh-surface-solid`, `--sh-space-*`, `--sh-font-{size,weight,family-machine,tracking-body}`, `--sh-motion-*`, `--sh-radius-none`.

## Do / Don't
- Do: always give `disabled` a `disabledReason` — a mute dead zone is a mystery.
- Do: keep `selectedFiles` controlled; the component never owns the file list.
- Don't: use dashed borders anywhere else in the system — here it IS the affordance.
- Don't: validate file *types* in the component beyond the input `accept`; domain validation stays with the consumer.

## Open questions
— directory upload (`webkitdirectory`) unneeded so far.
