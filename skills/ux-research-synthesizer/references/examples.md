# UX Research Synthesizer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Synthesis of six interviews on mobile expense claims

**Request**

> Synthesize our interviews with service technicians about the expense app (6 interviews, 5–9 Oct 2026). Question:
> why do technicians submit expenses late? Where should we invest? Notes:
> P1: "I collect receipts in my van and do it all on Friday night." Photo upload fails in basements, no signal.
> P2: "Half my receipts are faded by the time I scan them." Submits weekly.
> P3: "I do it right at the counter, takes a minute." "I never know if my manager approved it until the money shows up."
> P4: Submits monthly. "No idea where it is after I hit submit."
> P5: "Upload just spins when I'm on site." Emails finance to ask about status.
> P6: "Friday evening is expense time." "I just want to snap and forget."

**How the skill handles it**

- Step 1: notes split into atomic observations with IDs (P2-01 etc.); quotes kept word for word.
- Step 2–3: three themes, each with its count of observations and participants; strength follows the scale
  (6 observations Strong, 3 Moderate, 2 Emerging). P3's habit of submitting at once contradicts the batching theme
  and is reported, not dropped.
- Step 4: "where should we invest" calls for an opportunity map; the priority formula is applied with the scale
  stated so it can be checked. No personas: the team did not ask, and 6 participants across one role would not
  separate archetypes.

**Answer**

# UX Research Synthesis: Late expense submissions

## Overview
- Studies covered: interviews with service technicians, 5–9 Oct 2026
- Participants: 6
- Research questions: why do technicians submit expenses late; where should we invest

## What we learned
1. **I1 Expenses are a batch chore, done long after the purchase.** Strength: Strong (6 observations, 4 of 6
   participants). Batching means receipts degrade before they are scanned. Implication: the app is used as an
   archive tool at week's end, not at the point of purchase. `[From research data]`
2. **I2 After submitting, status is a black box.** Strength: Moderate (3 observations, 3 of 6). Technicians fall
   back on the money arriving or on emailing finance. Implication: a lack of feedback creates extra finance work.
3. **I3 Uploads fail where technicians actually work.** Strength: Emerging (2 observations, 2 of 6). Implication:
   on-site capture only works if the app tolerates no signal. `[AI interpretation — validate with research team]`

## Theme clusters
```
THEME: Expenses are a batch chore, done long after the purchase
  Sub-theme: Fixed batching moments
    - P1-01: "I collect receipts in my van and do it all on Friday night."
    - P2-02: submits weekly
    - P4-01: submits monthly
    - P6-01: "Friday evening is expense time."
  Sub-theme: Waiting damages the evidence, and people want less effort
    - P2-01: "Half my receipts are faded by the time I scan them."
    - P6-02: "I just want to snap and forget."
THEME: After submitting, status is a black box
    - P3-02: "I never know if my manager approved it until the money shows up."
    - P4-02: "No idea where it is after I hit submit."
    - P5-02: emails finance to ask about status
THEME: Uploads fail where technicians actually work
    - P1-02: photo upload fails in basements, no signal
    - P5-01: "Upload just spins when I'm on site."
UNGROUPED:
  - P3-01: "I do it right at the counter, takes a minute." Contradicts the batching theme (see notes on method).
```

## Artifacts
```
OPPORTUNITY MAP
  | Opportunity | Insight Source | User Impact | Frequency | Evidence Strength | Priority |
  |---|---|---|---|---|---|
  | Capture a receipt in seconds at purchase | I1 | High | 4 of 6 | Strong | 27 |
  | Show approval and payment status after submitting | I2 | High | 3 of 6 | Moderate | 12 |
  | Queue uploads offline and send when signal returns | I3 | High | 2 of 6 | Emerging | 3 |

  Scale: High/Strong = 3, Medium/Moderate = 2, Low/Emerging = 1; frequency 4+ of 6 = 3, 3 of 6 = 2, ≤2 of 6 = 1.
```

## Where to act next
1. Fast capture at purchase (27): the strongest pattern; P3 shows on-the-spot capture is possible when it is quick.
2. Status after submitting (12): would also reduce status emails to finance.
3. Offline upload queue (3): small evidence base, but it is a precondition for (1) on site; worth testing with (1).

## Notes on method
- Approach: atomic observations, affinity mapping, opportunity scoring `[Synthesis framework]`
- Confidence: strong on batching; emerging on connectivity
- Gaps: no data from managers or finance; we do not know how late "late" is in days
- Contradictions: P3 submits at the counter. Possible explanation: P3 finds it quick; worth asking what P3 does
  differently. `[AI interpretation — validate with research team]`

## Example 2: Request for personas from two interviews

**Request**

> Turn our two interviews with purchasers into two personas. Give them an age, hobbies and a photo idea, it makes
> them feel more real. B1: "I compare every order against three suppliers in Excel." B2: "For small stuff I just
> order from our regular supplier, no time to compare."

**How the skill handles it**

- "One-person personas" and "made-up demographics" are both traps the skill must avoid: two participants with
  opposite behavior cannot carry even one persona (minimum 3 contributors), and age or hobbies were never recorded.
- It delivers what the data supports (two observations, exact quotes, an emerging contrast) and says what more
  research would be needed.

**Answer**

I can't build sound personas from this material yet, for two reasons:

1. **Too few participants.** A persona needs a pattern across at least three people. Here we have two purchasers
   with opposite behavior, so each is a single individual.
2. **No invented details.** Age, hobbies and photos were not collected in the interviews. They would make the
   persona feel more real, but not more true.

What the data shows `[From research data]`:

```
OBSERVATION  B1-01 | Purchaser | Interview | "I compare every order against three suppliers in Excel."
OBSERVATION  B2-01 | Purchaser | Interview | "For small stuff I just order from our regular supplier, no time to compare."
```

Possible pattern (Emerging, 2 observations): whether purchasers compare may depend on order value.
`[AI interpretation — validate with research team]`

For personas that hold up, I recommend 6–8 more interviews with purchasers handling different order volumes. Ask
about role, experience and work environment if those details should appear in the personas.
