# Vendor Evaluator: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Choosing an IT service desk tool

**Request**

> We need a decision memo for the IT steering board (meets 4 Dec) on our new service desk tool: 60 agents, 3-year
> term, budget EUR 180k. Must-haves agreed: EU hosting, SSO via Entra ID, German UI. Weights agreed: functional 35,
> technical 20, cost 20, vendor strength 10, support 10, risk/compliance 5.
> Notes: Ticketon hosts in the US only (their RFP answer). DeskPilot: demo + PoC, workflows exceeded our needs,
> API tested, 2 good reference calls, SLA in contract draft; EUR 55/agent/month, implementation 24k. Servora: demo
> fine, CMDB sync partly manual, 1 reference okay, support only in business hours; EUR 42/agent/month,
> implementation 22k. Both: training 6k. Our estimates: internal effort 18k (DeskPilot), 20k (Servora); exit 5k
> each. Due diligence not run yet on either.

**How the skill handles it**

- Steps 1–2: need, scope, budget, date, must-haves and weights are given, so no questions; weights add up to 100%.
- Step 3: Ticketon fails "EU hosting" and is removed; nothing to relax since the user set it as a knock-out.
- Step 4: scores follow the scale (5 only with proof; DeskPilot's functional fit was proven in the PoC). Risk is 3
  for both because due diligence is pending; totals shown with the calculation.
- Steps 5–6: TCO from the user's numbers, own estimates labelled; margin 0.55 > 0.3 and the winner holds when cost
  gains 10 points.

**Answer**

**Must-haves**

| Must-have | DeskPilot | Servora | Ticketon |
|---|---|---|---|
| EU hosting | ✅ [Vendor document] | ✅ [Vendor document] | ❌ US only [Vendor document] |
| SSO via Entra ID | ✅ tested in PoC | ✅ shown in demo | — |
| German UI | ✅ demo | ✅ demo | — |

Ticketon is out on EU hosting.

**Scoring matrix**

| Criterion | Weight | DeskPilot | Servora |
|---|---|---|---|
| Functional fit | 35% | 5 — workflows exceeded needs in PoC | 4 — demo covered use cases |
| Technical fit | 20% | 4 — API tested in PoC | 3 — CMDB sync partly manual |
| Cost (TCO) | 20% | 3 — EUR 171,800 | 4 — EUR 143,720 |
| Vendor strength | 10% | 4 — 2 good reference calls [Reference call] | 3 — 1 reference, okay [Reference call] |
| Service and support | 10% | 4 — SLA in contract draft | 3 — business hours only |
| Risk and compliance | 5% | 3 — due diligence pending | 3 — due diligence pending |
| **Weighted total** | 100% | **4.10** | **3.55** |

Evidence is from the user's demo and PoC notes `[Per the user]` unless marked otherwise.

DeskPilot: 5×0.35 + 4×0.20 + 3×0.20 + 4×0.10 + 4×0.10 + 3×0.05 = 1.75 + 0.80 + 0.60 + 0.40 + 0.40 + 0.15 = 4.10
Servora: 4×0.35 + 3×0.20 + 4×0.20 + 3×0.10 + 3×0.10 + 3×0.05 = 1.40 + 0.60 + 0.80 + 0.30 + 0.30 + 0.15 = 3.55

**TCO over 3 years (60 agents)**

| Cost item | DeskPilot | Servora |
|---|---|---|
| Subscription (60 × rate × 36 months) | 118,800 | 90,720 |
| Implementation | 24,000 | 22,000 |
| Internal effort | 18,000 [My estimate] | 20,000 [My estimate] |
| Training | 6,000 | 6,000 |
| Hosting, support | included | included |
| Exit and migration | 5,000 [My estimate] | 5,000 [My estimate] |
| **Total** | **171,800** | **143,720** |

Assumes flat prices for 3 years; escalation clauses not yet checked `[Input required]`.

# Vendor selection: IT service desk tool — recommendation
Prepared 17 Nov 2026 for the IT steering board

## Recommendation
DeskPilot — the best functional and technical fit, proven in a PoC, within budget. Confidence: medium, because
due diligence has not been run yet.

## The decision in numbers
| Vendor | Must-haves | Weighted score | TCO (3 years) |
|---|---|---|---|
| DeskPilot | all met | 4.10 | EUR 171,800 |
| Servora | all met | 3.55 | EUR 143,720 |
| Ticketon | failed (EU hosting) | — | — |

## Why DeskPilot
- Functional fit 5: workflows exceeded requirements in the PoC, not just in a demo.
- Technical fit 4: API tested; Servora needs manual CMDB sync.
- Support 4: SLA already in the contract draft; Servora offers business hours only.

## What we give up
- EUR 28,080 more over 3 years than Servora; DeskPilot uses 95% of the EUR 180k budget.

## Open risks and conditions
- Due diligence on DeskPilot (security, GDPR) — before signing, owner IT security, by 1 Dec.
- Price escalation clause — check in contract draft, owner procurement, by 1 Dec.

## Sensitivity
Margin is 0.55 points. With cost at 30% and functional fit at 25%, DeskPilot scores 3.90 and Servora 3.55: the
winner holds. Servora would only lead if DeskPilot failed due diligence.

## Next steps
1. Vendor Due Diligence on DeskPilot.
2. Negotiate the escalation and exit clauses.
3. Decision at the steering board on 4 Dec.

## Example 2: Request to score vendors from general knowledge

**Request**

> We need a new travel expense tool. Compare Spesio, TravelDesk and Kostra and tell me which is best. We don't have
> any documents yet, but you surely know these vendors.

**How the skill handles it**

- Ground rule: never score a vendor from general knowledge. Without material every score would be "Not assessed",
  so the skill does not produce a ranking.
- Steps 1–2 come first anyway: the skill drafts must-haves and weights so the yardstick exists before vendor
  material arrives, and adds the status quo to the long list.
- It lists what it needs, marked `[Input required]`.

**Answer**

I can't give you a sound ranking yet: I score vendors only on your documents and notes, not on general knowledge.
What we can do now is set the yardstick before any proposals come in.

**The decision (Step 1)** `[Input required]`
- How many employees submit travel expenses, and how many receipts a month?
- Which systems must it connect to (for example accounting, corporate cards)?
- Budget, contract term, decision date; does the works council need to be involved?
- Should "keep the current process" be scored as an option too? I recommend it.

**Proposed must-haves**
- Hosting in the EU
- Expense rules per German travel expense law
- Export to your accounting system

**Proposed weights**

| Group | Weight |
|---|---|
| Functional fit | 35% |
| Technical fit | 15% |
| Cost (3-year TCO) | 20% |
| Vendor strength | 10% |
| Service and support | 10% |
| Risk and compliance | 10% |

Please confirm or adjust these. After that I need, per vendor, the proposal, the price sheet and your demo notes.
