# Date & time formatting standard

Production apps drifted into 4+ formats (`06/07/2026, 01:00 PM`, `Jul 6, 13:05:05`, `Jul 7, 2026 06:01`, `Tue 19:00`). The standard:

| Context | Format | Example |
|---|---|---|
| Full timestamp | `MMM D, YYYY HH:mm` | `Jul 22, 2026 16:40` |
| Same-year timestamp | `MMM D, HH:mm` | `Jul 22, 16:40` |
| Within-week (timelines, axes) | `ddd HH:mm` | `Tue 16:40` |
| Time only (same-day context) | `HH:mm` | `16:40` |
| Duration | `1h 21m` / `21m 40s` / `40s` | largest two units |
| Delta vs plan | signed, minutes | `+35 min vs plan` |
| Date only | `MMM D, YYYY` | `Jul 22, 2026` |

Rules:
- **24-hour clock**, no AM/PM. No seconds unless debugging/log context.
- Always render timestamps/durations in `Text variant="machine"`.
- Timezone: display in the run's operating timezone with a one-time suffix at page level (e.g. "All times PST"), not per-value.
- Relative time ("4m ago") only for freshness indicators, never for schedule data; pair with a tooltip carrying the absolute value.
