# Typography

Two faces, strict roles:

- **Instrument Sans** (`--sh-font-family-sans`) — all human-language UI text. (Themable: violet theme swaps to Inter.)
- **Inter as "machine"** (`--sh-font-family-machine`) — machine values only: timestamps, IDs, durations, counts, versions, technical names (`/IBP/MDMR_EXECUTE`). In React: `<Text variant="machine">` or `variant="kpi"`.

The scale is dense and operational (10–15px working range, 18–28px headings, 21px KPI). Use `<Text>` variants — never raw font-size:

`h1 28 · h2 24 · h3 18 · lead 15 · control 14 · body 13 · meta 12 · caption 11 · micro/label-caps 10 · kpi 21 (machine face)`

- Tight tracking is canon: body −0.01em, headings −0.016/−0.02em (baked into the variants).
- `label-caps` = uppercase micro labels with +0.06em tracking — section eyebrows, KPI labels, column headers.
- Weight, not size, is the first hierarchy lever within a text block (600/700 titles vs 400 body).
- Hierarchy device for pages: eyebrow (`label-caps`, subtle) → `h1` → `body` secondary subtitle.
