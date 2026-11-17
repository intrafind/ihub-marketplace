# Usability Heuristics Review: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: High-fidelity mockups of a leave request flow

**Request**

> Review our leave request flow before dev starts. HR portal, 900-person manufacturer; office and shop-floor
> staff, many on shared terminals or phones. Main tasks: request leave, see remaining days,
> cancel a request. High-fidelity mockups, our design system "Forge" applies. What the screens do:
> Screen 1: calendar, pick start and end date; remaining days shown only on the profile page.
> Screen 2: dropdown "Absence type" with codes U01, U02, SU, ZA. Button "Submit" sends immediately.
> Screen 3: "Request sent" banner. On error: "Error 409".
> "My requests" list: cancel via a trash icon, no confirmation, no undo. Elsewhere in Forge, delete actions use a
> red text button "Delete" with a confirmation dialog.
> Half-day option exists and is clearly labelled.

**How the skill handles it**

- Step 1: context is complete (users, tasks, stage, design system), so no questions; high fidelity means
  interaction details and consistency are in scope.
- Step 3: two findings share one cause (internal codes and error codes leaking into the UI): reported as a pattern.
- Step 4: the instant, irreversible cancel and the cryptic error block or derail tasks; the absence codes slow
  users but they can recover.

**Answer**

# Usability review of the leave request flow

## Context
- Product: HR portal, leave requests
- Target users: office and shop-floor staff, shared terminals and phones
- Primary tasks: request leave, see remaining days, cancel a request
- Design stage: high-fidelity

## Findings at a glance
- Total issues: 4
- By severity: Critical 1 · Major 2 · Minor 0 · Enhancement 1
- Most-violated heuristics: H2, H3, H9
- Strengths: clearly labelled half-day option; immediate confirmation banner after sending

## Findings by severity
### Critical
```
ISSUE
  ID:              LR-1
  Heuristic:       H3 User control and freedom; H4 Consistency and standards
  Severity:        Critical
  Location:        "My requests" list, trash icon
  Observation:     One tap cancels a request; no confirmation, no undo. Forge uses a red "Delete" button with a confirmation dialog elsewhere. [From design review]
  Problem:         On phones and shared terminals a mis-tap may cancel approved leave unnoticed. [AI observation — validate with user testing]
  Recommendation:  Use the Forge delete pattern with a confirmation that names the dates, or an undo option in the banner, so a mistake can be reversed.
  Pattern:         —
```
### Major
```
ISSUE
  ID:              LR-2
  Heuristic:       H2 Match between system and real world
  Severity:        Major
  Location:        Screen 2, "Absence type" dropdown
  Observation:     Options are the codes U01, U02, SU, ZA. [From design review]
  Problem:         Users must know payroll codes to choose; users may pick the wrong type. [Heuristic evaluation]
  Recommendation:  Show plain names ("Annual leave", "Time off in lieu"); keep codes for HR views only.
  Pattern:         P1 System language in the UI

ISSUE
  ID:              LR-3
  Heuristic:       H9 Help users recognize, diagnose, and recover from errors
  Severity:        Major
  Location:        Screen 3, error state
  Observation:     The only message is "Error 409". [From design review]
  Problem:         It does not say what went wrong or what to do next. [Heuristic evaluation]
  Recommendation:  Say what happened in plain words (for example an overlapping request) and offer the next step, such as a link to the existing request.
  Pattern:         P1 System language in the UI
```
### Minor
None found.
### Enhancement opportunities
```
ISSUE
  ID:              LR-4
  Heuristic:       H6 Recognition rather than recall
  Severity:        Enhancement
  Location:        Screen 1, calendar
  Observation:     Remaining leave days appear only on the profile page. [From design review]
  Problem:         Users have to remember their balance while picking dates. [Heuristic evaluation]
  Recommendation:  Show the remaining days next to the calendar and the balance after this request.
  Pattern:         —
```

## Recurring patterns
- **P1 System language in the UI:** absence codes and HTTP error codes reach the user directly. Worth a Forge rule:
  user-facing text uses task language.

## What works well
- The half-day option is visible and clearly labelled.
- The confirmation banner gives immediate feedback (H1).

## Changes in priority order
1. LR-1 confirmation or undo for cancel: removes the risk of losing approved leave by accident.
2. LR-3 plain error message: lets users recover without calling HR.
3. LR-2 plain absence names: fewer wrong requests and corrections.
4. LR-4 remaining days on screen 1: less switching between pages.

## Example 2: No context, and a request for a "more modern" look

**Request**

> Here's a screenshot of the alarm screen for our injection moulding machines. I don't like it, it looks dated.
> Review it and tell me how to make it look more modern. (List of 40 alarms, all in the same font and colour,
> timestamp, a "Code" column, an "Acknowledge" button on every row.)

**How the skill handles it**

- Step 1: target users, tasks, constraints and stage are missing; the skill asks for them before rating anything.
- "Modern" is a style preference, not a usability finding: the skill says what it will assess instead.
- Meanwhile it names, without severity, the heuristics the visible material points to, marked as from the design.

**Answer**

"More modern" is a matter of taste. What I can assess is whether the screen supports the operators' tasks,
measured against Nielsen's 10 heuristics. For that I first need the context:

1. **Users:** who works with it (machine operators, shift leads, maintenance), and how experienced are they?
2. **Situation:** at the panel on the machine, wearing gloves, from a distance, in a noisy hall?
3. **Primary tasks:** which 2–3 things must succeed on this screen, for example spot a critical alarm, find the
   cause, acknowledge it?
4. **Goals:** what should the screen achieve for the business, for example shorter downtime?
5. **Constraints:** controller limitations, screen size, standards, corporate design?
6. **Stage:** is this the production interface or a draft?

From the screenshot I can already see where I will look more closely `[From design review]`:
- All 40 alarms look the same. Whether urgent alarms stand out from notices I will check under H1 and H8.
- The "Code" column: whether operators know the codes I will check under H2 and H6.
- "Acknowledge" on every row with no visible confirmation: I will check that under H3 and H5.

With your answers you get the full review, with a severity per finding and changes in priority order.
