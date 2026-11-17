# Product Thinking Partner: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: From a known problem to a direction

**Request**

> I'm PM for our expense app. 2,900 expense reports a month; 870 are sent back by approvers, 640 of those because
> a receipt is missing. Users tell support they lose paper receipts or forget to photograph them. Approvers
> complain about the back-and-forth. Our team has 2 sprints free next quarter. I want to think through options and
> leave with a direction. We already integrate with two corporate card providers.

**How the skill handles it**

- Mirrors first, then Stage 1: the problem is clear and evidenced, so one sentence is enough.
- Stage 2: three distinct options (Minimal, Lateral, Eliminate) instead of variants of one idea.
- Stages 3–4: one assumption map per option, then the evaluation table with the skill's H/M/L rules.
- Stage 5: a recommendation, not a decision, with the cheapest test; the owner is left to the PM.

**Answer**

Let me play it back: about 30% of reports (870 of 2,900) bounce, and almost three quarters of those (640) bounce
for a missing receipt, which costs users and approvers a round-trip each. `[From user input]`

**Problem in one sentence:** employees submit expense reports without receipts because receipts get lost or are
not captured at the moment of purchase. Doing nothing keeps about 640 return loops a month. `[From user input]`

**Options** (no judging yet)

```
OPTION 1: Receipt check before submission (Minimal)
  How it works:     Items without a receipt block submission until one is attached or the user
                    declares the receipt lost.
  Addresses:        Returns caused by forgetting to attach a receipt
  Leaves open:      Receipts that are genuinely lost
  Key assumption:   Most missing receipts exist and were just not attached
  Rough size:       S

OPTION 2: Forward-to-capture (Lateral)
  How it works:     Each user gets an email address; forwarded e-receipts attach to the matching item.
  Addresses:        Digital receipts that sit in inboxes
  Leaves open:      Paper receipts
  Key assumption:   A large share of receipts arrive by email
  Rough size:       M

OPTION 3: Card receipts arrive automatically (Eliminate)
  How it works:     Pull receipt data for card transactions from the two integrated providers.
  Addresses:        Card spending, without any user action
  Leaves open:      Cash and personal-card spending
  Key assumption:   The providers deliver receipt-level data that approvers and tax rules accept
  Rough size:       L
```
`[AI suggestion — treat as hypothesis]`

**Assumption maps**

| Option | Assumption | Type | Impact if it's wrong | Cheapest way to validate |
|---|---|---|---|---|
| 1 | Most missing receipts exist but weren't attached | User behavior | Users tick "receipt lost" instead; returns barely fall | Sample 50 of last month's returns: was a receipt supplied later? |
| 2 | Many receipts arrive by email | User behavior | Low use | Ask 10 frequent travellers how their receipts arrive |
| 3 | Card data is accepted as a receipt | Regulatory | Option fails outright | Ask Finance/tax adviser |
| 3 | Providers offer receipt-level data | Technical feasibility | Option fails | Engineering reads the providers' API docs |

**Stress test of Option 1:** most likely to sink it: users declare receipts "lost" to get past the check. Four
weeks in, rising declarations and flat returns would show it was the wrong call. `[Brainstorm framework]`

```
OPTION EVALUATION
| Option             | Impact | Feasibility | Key risk                              | Recommendation   |
|--------------------|--------|-------------|---------------------------------------|------------------|
| Pre-submit check   | M      | H           | Users declare "lost" to get past it   | Pursue           |
| Forward-to-capture | M      | M           | Paper receipts stay unsolved          | Park for now     |
| Card receipts      | H      | L           | Tax acceptance and provider data      | Explore further  |
```

```
BRAINSTORM OUTCOME
  Problem:              Reports are submitted without receipts; 640 of 870 monthly returns
  Options explored:     3
  Direction chosen:     Pre-submit receipt check, with card receipts explored in parallel
  Why this one:         Fits the 2 free sprints; card receipts may fix more but feasibility is unknown
  Riskiest assumption:  Most missing receipts exist and were just not attached
  How to validate:      Sample 50 returned reports from last month
  Next action:          Pull and review the sample — Owner: [PM to name] — By: [date]
  Parked options:       Forward-to-capture: leaves paper receipts open; revisit after the sample
```

My recommendation is the check, but it's your call: if the sample shows most receipts were truly lost, Option 1
loses its point and card receipts move up. `[AI suggestion — treat as hypothesis]`

## Example 2: Arriving with the solution already chosen

**Request**

> We should build a Microsoft Teams integration for our ticketing tool, sales keeps asking for it. Help me work
> through it: what should it do?

**How the skill handles it**

- "Divergence is never optional": the PM comes with X, so the skill first checks whether X targets the right
  problem, before designing it.
- Stage 1: the only evidence is "sales keeps asking"; the skill records that and asks for more instead of inventing
  user needs.
- It asks questions and offers reframings, without telling the PM not to build it.

**Answer**

Happy to work through it. Let me check I've got it: sales hears requests for a Teams integration and you'd like to
define what it does. `[From user input]`

Before we design features, I'd like to make sure we know which problem it solves, because "a Teams integration" can
mean very different things. Four questions:

1. **What exactly goes wrong today?** Do customers miss ticket updates, want to create tickets from chat, or
   switch tools too often?
2. **What tells us it's real?** Are there lost deals, churn reasons or support tickets that mention it, or is it
   mainly requests passed on by sales? Requests alone are worth noting, but they're thin evidence.
3. **Who feels it, and how much?** End customers, agents or managers? A handful of large prospects or many
   existing customers?
4. **What happens if we don't build it?** Do deals actually stall over it?

Two reframings to keep in mind while you answer: `[Brainstorm framework]`
- **Zoom out:** maybe the real problem is "people don't notice ticket updates in time"; Teams is one channel, email
  digests or mobile push are others.
- **Zoom in:** maybe one workflow matters most, such as "create a ticket from a chat message".

Once the problem fits in one sentence, we'll generate genuinely different options (Teams among them) and pick one.
