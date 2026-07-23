# RCCAPA UPDATES & THREADS (Figma section 2:63444, "Refs" page)

Source: Figma file `LebdF7tuqBXI7FNm0gDuH3`, section "RCCAPA UPDATES & THREADS" (8406×6087).
Data used: section screenshot (1500px) + local 3× crops of each screen.
**Data gaps:** `get_metadata` and `get_variable_defs` for this section could NOT be fetched — the Figma MCP plan tool-call limit was hit before this section's metadata call. Frame node IDs, exact sizes, instance names and text strings below are read visually from the 1500px render (small text is partially illegible); treat fine print as approximate. Frame sizes assumed 1512×987 (matches sibling sections).

## Purpose
The threads/communication layer on an RCCAPA case in the "CM Data Integrity" portal (Trends & Cases tab): opening the case detail, opening the Threads chat panel, responding to the CM, approval of an RCCAPA, and the right-hand accordions (CM Profile, Case Details, Timeline).

## Artboards (9 screens, canvas annotations in quotes)
| Column | Screens |
|---|---|
| (unlabeled) | All Cases list + empty/initial case pane |
| "RCCAPA Details" | All Cases + case detail opened (chart, sample failing records, Required Actions) |
| "Chat Opens — Chat button is active" | Case detail + right Threads panel opened |
| "User Taps on Respond" | Threads panel with response affordance active (quick-reply suggestion chip above composer) |
| "RCCAPA Approved" | Thread showing approved state + ✓ Approve action |
| "More Details — CM profile" | Right accordion: CM Profile expanded (metrics bars, contact info) |
| "Case Details" | Right accordion: Case Details expanded (key-value list + escalation ladder) |
| "Timeline" | Right accordion: Timeline expanded (milestone feed) |

## Element inventory

### Shared chrome
Same as other portal sections: gradient beige→green dotted background with blurred blobs; NVIDIA logo + "CM Data Inegrity"; translucent pill nav with active "Trends & Cases" (white pill, green text); bell + avatar; left nav tree (Dashboard / RCCAPA Cases active / Top Errors / Scorecard & Incidents / Agentic AI Actions; PINNED: All Cases, Need my Attention (red dot), Awaiting CM, Overdue, Monitoring, Closed; Organizations: Foxconn, BYD, Wistron, Flex, Pegatron; Customized Views: FXSJ Critical, CM-lead Overdue, High Volume P7 Rules). Bottom-center AI pill "How can I help you?" with green Ask-AI toggle.

### Case detail (center column when Threads open)
- Breadcrumb header: back chevron, "P1.03 Component Date Code - Not Blank", "Created 3/25/2026", buttons "Thread" (chat-bubble icon, becomes active/filled when panel open) and "More" (⋯).
- Area chart (lime fill, green line, Jan–Dec axis).
- "Sample failing records" table (TH row + 5 rows: NO / KEY / DATE / NVPN / GROUP / CM-SKU; pagination "Showing 8 rows of 11,265 · Page 1 of 35" + chevron icon buttons).
- "Required Actions" numbered list (3 items) + "Frequency: 3,737 errors".

### Threads panel (right, ~360 wide, white card, radius ~12)
- Header: "Threads" + green "Online" status dot/label; date separators ("Sep 8, 2:01 PM").
- **System/summary card**: bordered light card with case-context text at thread top.
- **Message groups**: avatar + author + role chip (e.g. "AI Agent"/CM author label in green), multi-paragraph body with labeled sub-blocks (ROOT CAUSE / CORRECTIVE ACTION / PREVENTIVE ACTION pattern — CM's RCCAPA submission rendered as a structured message), timestamps.
- **Status chips inside thread**: green `APPROVED` chip on approval message; approval action shown as outline "✓ Approve" button; (companion CM Portal section shows the matching red `REJECTED` state).
- **Quick-reply suggestion chip** above composer when "Respond" tapped (lavender/outline pill with suggested response text).
- **Composer**: "Send Message to CM" text field (light fill, radius ~8) + square green send button; attachment/toolbar icons.

### Right accordion rail ("More Details" screens, ~260 wide)
Three stacked accordion instances (white cards, radius ~10, chevron headers):
- **CM Profile**: avatar/name, response metric rows with small horizontal bar indicators (green/red), contact fields ("Core Details", phone).
- **Case Details**: key-value list — Status (Overdue, red), Assigned to, Code VAL_005, Field SUPPLIER_CODE, Report, Freq, Volume, Spec §5.3.2, Escalation 20h/72h — plus escalation ladder E1 Created → E2 24h Response → E3 72h RCCAPA → E4/E5 Decision → E6 14d Recheck with colored state dots.
- **Timeline**: vertical milestone feed, each entry = colored square/dot (green = done, red = breach e.g. "RCCAPA Overdue") + label + timestamp line (entries like Case created, CM Notified, NV Response, CM sends RCCAPA, NV approves RCCAPA, RCCAPA Overdue).

### Case list (left list column, first two screens)
Same case-card anatomy as the RCCAPA Filter section: title, site code, org color stripe, badges (`CM RCCAPA`, `Overdue` red, `Pending` amber, `P1/P2` lavender), clock + elapsed, "Frequency: N errors", relative time.

## Component instances / repeated patterns
Metadata unavailable (see gaps); visually repeated: Nav bar, T&C Navigation left-nav, case cards, Badge chips, Tr- Sample failing records rows, TH, pagination Icon Buttons, Threads message bubbles ("Senders message"/"Message" family per sibling-section metadata), CM Profile / Case Details / Timeline accordions, AI field pill, Button (Approve), Text field (composer).

## Figma Variables
Not retrievable — Figma MCP tool-call limit. Unknown for this section.

## Canon deltas vs Shamrock
- Rounded 8–12px cards/pills everywhere; full-radius nav — vs canon 0 radius.
- NVIDIA green as accent (Online dot, Approve, send button, author chips) — vs colorless themable accent.
- Thread state chips APPROVED/REJECTED + Overdue/Pending badge zoo — overlaps but does not match canon 7-value status enum; several saturated hues used simultaneously vs calm exception-first color.
- Decorative pastel gradient + blob background; opaque white cards, glass only in nav — differs from canon structural glassmorphism + neutral hairlines.
- Grotesque (NVIDIA Sans-like) type; timestamps/IDs not in a machine face — canon wants Instrument Sans + Inter/mono machine face.
- Strong keeper patterns: structured RCCAPA message (root cause / corrective / preventive as labeled blocks in chat), timeline with exception-colored breach entries, escalation ladder E1–E6, thread-anchored approve/reject.
