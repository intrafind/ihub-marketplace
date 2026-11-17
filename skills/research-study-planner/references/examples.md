# Research Study Planner: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Usability test script for a redesigned approval flow

**Request**

> We redesigned expense approval in Spendwise (Figma prototype ready); 22% of approved claims get reopened by
> finance today. Can managers approve, reject and request a missing receipt in the new flow? Decision: ship in
> February or iterate. Findings by 15 Dec. Please write the test script. Recruits: managers who approved 5+ claims
> last month; €50 voucher is our standard.

**How the skill handles it**

- Phase 1: anchors the script in a short brief; the primary question is observable ("can managers…"), so no
  reframing is needed.
- Phase 2: "Can users get the task done" points to usability testing, 5–8 per round; the brief fixes 6 as a
  method guideline, not a statistical calculation.
- Phase 4: tasks are user goals, not UI instructions; nothing in the wording hints at the missing receipt.
- Ground rules: recruit criteria and €50 incentive come from the user; the prototype link is a placeholder.

**Answer**

```
STUDY BRIEF
  Subject:                 Redesigned expense approval flow, Spendwise   [From research brief]
  Why now:                 Redesign; 22% of approved claims are reopened by finance   [From research brief]
  Business context:        Ship in the February release or iterate   [From research brief]
  Questions
    Primary:               Can managers approve, reject and request a missing receipt in the new flow without help?
    Secondary:             Where do managers hesitate or err when a claim lacks a receipt?
  Decision at stake:       Ship in February vs. one more design iteration
  Needed by:               15 Dec 2026
```

```
USABILITY TEST SCRIPT: Spendwise approval flow

  Session length:   45 min
  Format:           moderated remote, 6 participants (usability guideline: 5–8 per round)   [Methodology guidance]
  Prototype:        Figma prototype, link [Placeholder — define with research team]
  Recording:        screen + audio

  Before the tasks
    - Confirm the participant approved at least 5 claims last month; consent; start recording
    - Background: How do you approve expenses today? What happens when a claim is missing something?

  Tasks
    Task 1: Clear your pending approvals
      Scenario:     "It's Monday morning and three expense claims from your team are waiting for you.
                     Handle them as you normally would."
                     (Claim A: complete; Claim B: hotel €412 with no receipt; Claim C: duplicate taxi ride)
      Done when:    A approved, B sent back with a receipt request, C rejected with a reason
      Watch for:    B approved without noticing the missing receipt; path to the request option
      Time cap:     8 min
      Then ask:     "What did you expect to happen to each claim?" "Was anything unclear?"

    Task 2: Check what happened to a claim you sent back
      Scenario:     "Your colleague says she uploaded the hotel receipt. Find out where that claim stands."
      Done when:    participant finds Claim B and reads its current status
      Watch for:    where they look first (list, notifications, email); status wording they misread
      Time cap:     4 min
      Then ask:     "What would you do next here?"
  After the tasks
    - Overall: How would you describe the new flow to a colleague?
    - System Usability Scale (10 items)
    - What confused you most? What was most useful? Is anything missing?
```

Pilot one session first to check prototype paths and timing `[Methodology guidance]`. Analysis: task success, time
on task, errors on Claim B, SUS, affinity map of comments; sign-off owner `[Placeholder — define with research
team]`.

## Example 2: A survey of hypotheticals on a one-week deadline

**Request**

> Product wants to know "should we build an offline mode for the Fieldnote inspection app?" Plan a survey asking
> customers "Would you use offline mode?" We want 500 answers within a week. That's it, keep it simple.

**How the skill handles it**

- Phase 1: "Should we build…" is a business decision; it is reframed for research.
- Mistakes to design out: "Would you use…?" is a hypothetical; the questions ask about past behavior instead.
- Phase 2: a survey fits "how many", not "why"; interviews are offered only as an option, given the week.
- Ground rules: no invented sample size formula, panel, or incentive; those stay placeholders.

**Answer**

**First, the question.** "Should we build offline mode?" is a business decision the study informs, not a question
users can answer. Research can answer: *How often do inspectors lose connectivity during an inspection today, and
what do they do when it happens?* `[Methodology guidance]`

**Second, the survey item.** "Would you use offline mode?" predicts poorly, so the draft asks what people have
actually done.

```
STUDY BRIEF
  Subject:                 Fieldnote inspection app, working without connectivity   [From research brief]
  Why now:                 Product is weighing an offline mode   [From research brief]
  Questions
    Primary:               How often do inspectors lose connectivity mid-inspection, and how do they cope?
    Secondary:             How much work is lost or redone when it happens?
  Decision at stake:       Build offline mode now, later, or not at all
  Needed by:               one week from fieldwork start   [From research brief]
  Budget:                  [Placeholder — define with research team]
```

**Method:** online survey to active users `[Methodology guidance]`. 500 completes clears the 100+ guideline;
whether it is reachable in a week depends on list size and response rate `[Placeholder — define with research
team]`. Optional: 5 short calls with frequent-drop-out respondents to learn *why*.

**Draft survey (6 questions, about 3 minutes)**

1. Your role: (inspector / team lead / office staff) — office staff skip to Q6
2. In the last 4 weeks, how often did the app lose its connection during an inspection? (never / once or twice / several times / in most inspections)
3. What did you do the last time it dropped? (waited / paper, typed in later / photos to add later / restarted / other: ___)
4. Did you lose any data you had entered? (yes, some / yes, a whole inspection / no / not sure)
5. About how long did catching up take? (under 5 min / 5–15 min / 15–60 min / over an hour)
6. May we contact you for a 15-minute follow-up call? (yes / no)

**Analysis (fixed now):** drop-out frequency; share losing data; cross-tab by role; descriptive statistics only;
"other" answers coded inductively.

**Before sending:** pilot with 2 inspectors to check wording and timing. Confirm the panel or customer list,
incentive and sender with your research team `[Placeholder — define with research team]`.
