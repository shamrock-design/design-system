# Color usage

**Color is a scarce, earned resource.** A good operational screen is mostly calm when things are fine and lights up only for what needs action. A screen that's colorful on a normal day has failed.

- Structure (borders, dividers, chrome) uses hairline/ink neutrals — never the accent, never status colors. Structure and status must never collide.
- The **accent** (`--sh-color-accent-*`) marks: primary CTAs, active nav/tab, selection, brand moments. One accent per screen region; if everything is accented, nothing is.
- **Status colors** are exclusively for state (see status-vocabulary.md), always dot + label. Nominal/done states prefer muted treatment (`pending`-like grays); saturated `success` green is for moments that earn it (a gate satisfied, a run completing).
- Never use accent for "healthy" — that's `status.success`. This separation is why the system can re-brand without breaking meaning.
- Tinted backgrounds (`*-bg` triads, `accent-subtle-bg`) are for badges/selection — not for large surfaces.
- The slate/canvas palette (`--sh-surface-canvas`, slate primitives) is reserved for authoring/model-editing contexts — the "run/model firewall": observing is warm glass, authoring is cool blueprint.
