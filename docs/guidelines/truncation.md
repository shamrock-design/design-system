# Truncation & overflow

Technical names get long (`PLNG-ALL-PLNG-PRD-…`). The standard:

- Truncate with CSS ellipsis at the container, single line, `min-width: 0` on the flex child.
- **Every truncated value must have a tooltip** with the full value. No tooltip → don't truncate; wrap instead.
- Middle-truncate identifiers whose start AND end are meaningful (IDs with significant suffixes): `PLNG-ALL…TC-01`.
- Two-line table cells (primary name over gray sub-label) truncate each line independently.
- Numbers, timestamps, durations, and status labels are **never** truncated.
- Prefer showing the leaf + tooltip-for-path for breadcrumb-like hierarchies rather than squeezing the full path.
