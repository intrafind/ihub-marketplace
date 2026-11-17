# Design-to-Dev Handoff Spec: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Handoff for an export button with progress

**Request**

> Please write the handoff for the new "Export CSV" button on the Reports screen. Figma frames: Reports/Default,
> Reports/Exporting, Reports/Export-done (link: figma.com/file/rpt-42). It's our DS `Button` (secondary) with a
> progress ring replacing the icon while exporting; when done, a DS `Toast` (success) says "Export ready" with a
> "Download" link. Tokens: bg `color.surface.secondary` (#F2F4F7), text `color.text.primary` (#1D2433), hover bg
> `color.surface.secondary-hover` (#E4E7EC), radius `radius.md` (6px), padding `space.2`/`space.4` (8px/16px),
> ring `color.brand.500` (#2F6FED). DS v3.2, light theme only, breakpoints 768 and 1024. Viewers can't export.

**How the skill handles it**

- Phase 1: `Button` is Existing (modified) because of the progress ring; `Toast` is Existing (as-is).
- Phase 2: walks the interaction, progression and permission families; the failed export and the viewer case have
  no frame, so they are marked `[Undesigned state — designer must decide]` instead of being invented.
- Phase 4: maps only the supplied tokens; the ring's stroke width has no token and is flagged.
- Phase 3: no mobile frame exists, so the ≤ 767px row says so rather than inventing a layout.

**Answer**

# Handoff spec — Reports: Export CSV

## At a glance
| Item | Value |
|---|---|
| Feature | Export CSV: export the current report view as a CSV file |
| Design files | figma.com/file/rpt-42 `[Source: supplied designs]` |
| Design system version | 3.2 |
| Breakpoints | 768px, 1024px |
| Themes | light only |

## Components
| Name | Category | Maps to in the DS | Variants |
|---|---|---|---|
| ExportButton | Existing (modified) | `Button` secondary + progress ring | default, exporting |
| Toast (success) | Existing (as-is) | `Toast` | success |

## Per-component detail

**States of ExportButton** `[Source: supplied designs]` unless marked
- Default: label "Export CSV" with icon (Reports/Default). Click starts the export → Exporting.
- Hover: bg `color.surface.secondary-hover`.
- Active/Pressed: `[Undesigned state — designer must decide]`
- Focus (keyboard): `[Undesigned state — designer must decide]` (DS default focus ring, if any, to confirm)
- Disabled / Exporting: ring replaces the icon, label "Exporting…" (Reports/Exporting); further clicks do nothing.
- Complete: button returns to Default; Toast appears (Reports/Export-done).
- Failed: `[Undesigned state — designer must decide]` (message, retry option)
- Permission, read-only (viewer): `[Undesigned state — designer must decide]` (hidden or disabled with tooltip)

**Token map for ExportButton**
| Group | Property | Token | Resolves to |
|---|---|---|---|
| Color | Background | `color.surface.secondary` | #F2F4F7 |
| Color | Hover state | `color.surface.secondary-hover` | #E4E7EC |
| Color | Text | `color.text.primary` | #1D2433 |
| Color | Progress ring | `color.brand.500` | #2F6FED |
| Spacing | Padding | `space.2` / `space.4` | 8px / 16px |
| Shape | Border radius | `radius.md` | 6px |
| Shape | Ring stroke width | `[No token exists — designer to choose between a new token and a one-off value]` | |
| Motion | Ring rotation | `[No token exists — designer to choose between a new token and a one-off value]` | |

## Breakpoint behavior
| Range | Behavior |
|---|---|
| Mobile, ≤ 767px | No frame supplied; open question below |
| Tablet, 768–1023px | No frame supplied; open question below |
| Desktop, ≥ 1024px | Button in the report toolbar, right-aligned (Reports/Default) |

## Interactions and motion
| Aspect | Detail |
|---|---|
| User action | Click or Enter/Space on ExportButton |
| Responding component | ExportButton, then Toast |
| Outcome | Export job starts; on completion a Toast "Export ready" with "Download" |
| Motion | Ring rotates while exporting; duration and easing not specified |
| Undo | Not designed: can an export be cancelled? |
| Keyboard path | Tab to button, Enter/Space; Tab into Toast to reach "Download" |
| Screen reader output | Proposed: "Exporting report" on start, "Export ready" on completion (to confirm) |

## What the mockups don't show
Edge cases
- Report has zero rows → export an empty file with headers, or block? Designer to decide.
- User leaves the page while exporting → does the Toast appear on the next page?
- Very large report → any time limit or background notification?

Assumptions to validate
- The Toast auto-dismisses per DS default; "Download" must stay reachable for keyboard users.

Unanswered questions
- Mobile and tablet placement of the button.

## Accessibility
- ExportButton: accessible name "Export CSV"; `aria-busy="true"` while exporting; status announced via a live region.
- Toast: `role="status"`; the link must be focusable before the Toast disappears.

## Unresolved items
1. Failed state design and copy.
2. Viewer permission: hide or disable.
3. Focus and pressed states.
4. Ring stroke width and rotation timing (new tokens or one-off values).
5. Mobile and tablet layout.

## Example 2: "Just fill in the gaps yourself"

**Request**

> Dev starts Monday. We only have the desktop frame of the new filter panel. Can you just add a dark-mode palette and
> the mobile layout so the spec is complete? Pick whatever looks right.

**How the skill handles it**

- Ground rules: concrete colors, spacing and layouts must come from the design system or the designer, so the skill
  does not pick them, and says why in one sentence.
- "Handoff mistakes to avoid": a dark theme without token mappings and an invented mobile layout are exactly the
  gaps it must expose, so it turns them into a short list of decisions with an owner.
- It still delivers what it can now: the decision list developers can plan around.

**Answer**

I won't pick colors or a mobile layout myself: values I choose would look final in the spec and be built as if
designed, and the gap would only surface in review. What I can do before Monday is make the gaps impossible to miss.

Decisions needed from design before the filter panel is built:

| # | Gap | Why engineering needs it | Owner |
|---|---|---|---|
| 1 | Dark-mode token mapping for every color in the panel | Without it the panel breaks in the dark theme | Designer |
| 2 | Mobile ≤ 767px: overlay, bottom sheet or full page? | Decides the component structure, not only styling | Designer |
| 3 | Tablet 768–1023px behavior | Panel width vs. results table | Designer |
| 4 | Loading, empty and error states of the filter options | Options come from the API | Designer |

If the design system already has dark-mode tokens, send me the list and I'll map them. Engineering can start on
the specified desktop layout and filter logic while 1–4 are decided.
