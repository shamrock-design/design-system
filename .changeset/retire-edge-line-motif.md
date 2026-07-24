---
"@shamrock-design/ui": patch
---

Retire the "edge line" motif across components — the hard colored accent/status bars read as bootstrappy and made color feel decorative. Replaced with quieter, meaning-first treatments:

- **Card** / **KPITile**: the 3px top accent/status bar → a subtle accent/status **corner bloom** (a soft top-left tint, echoing the Aurora on glass).
- **Toast**: the 3px left status bar → gone; status now rides a **square** dot beside the title (sharp, per the radius-0 canon).
- **SegmentedControl** (selected segment) and **AppShell** (active nav item): the boxed border / 2px left accent bar → a lifted solid fill; the fill + accent text carry the selection.

No API changes — `Card`'s `accentBar` prop and `KPITile`'s `accentBar` behave the same, only the rendering changed.
