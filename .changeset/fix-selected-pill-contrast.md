---
"@shamrock-design/ui": patch
---

Fix the low-contrast selected state on `SegmentedControl` and the `Tabs` pill variant. The selected item filled with a near-white surface, which was nearly invisible on light backgrounds. It now fills with the theme accent — green/violet under those themes, dark ink (`#1A1B18`) under the neutral theme — with on-accent text, matching `Button` primary.
