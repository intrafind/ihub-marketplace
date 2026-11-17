# Revenue Forecast Modeler: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Quarter forecast with stage history

**Request**

> Q4 2026 forecast for my team, quota €450,000. Our win rates by stage, last 4 quarters from the CRM: Negotiation
> 70%, Proposal 45%, Demo 25%, Discovery 10%. Deals:
> 1. Brenner Maschinenbau, €120,000, PO received 10 Nov.
> 2. Halvorsen Foods, €150,000, Negotiation, verbal yes, legal redlines booked for 2 Dec, close 15 Dec, last activity 14 Nov.
> 3. Novacert, €90,000, Negotiation, verbal yes, but their procurement steps are unknown, close 20 Dec.
> 4. Lindqvist Retail, €80,000, Proposal, budget confirmed, CFO in the meetings, close 18 Dec, active.
> 5. Ostwind Energie, €110,000, Proposal, close moved from 31 Oct to 31 Dec, one contact, last activity 28 Oct.
> 6. Faros Logistics, €60,000, Demo, close Feb 2027.
> 7. Talvik Software, €45,000, Discovery, last activity 2 Oct.

**How the skill handles it**

- Phase 2: the decision order settles each deal; Novacert lacks a paper process: Best Case, flagged.
- Phase 3: stage-based weighting with the team's own rates only.
- Phase 4: Ostwind carries three High flags (slipped, single-threaded, stale 20 days) and drops from Best Case to
  Pipeline; Talvik (46 days silent) goes to Omit.
- Phase 5: Closed Won counts toward both quota lines.

**Answer**

# Forecast — Q4 2026

| Prepared on | Quota | Weighting used |
|---|---|---|
| 17 Nov 2026 | €450,000 | Stage-based |

## Totals by category
| | Deals | Unweighted value | Weighted value | Share of quota |
|---|---|---|---|---|
| Closed Won | 1 | €120,000 | €120,000 | 26.7% |
| Commit | 1 | €150,000 | €105,000 | 23.3% |
| Best Case | 2 | €170,000 | €99,000 | 22.0% |
| Pipeline | 2 | €170,000 | €64,500 | 14.3% |
| **All categories** | 6 | €610,000 | €388,500 | 86.3% |

Categories other than Brenner [CRM record] are [AI judgment — rep to validate]. Talvik is Omit (€45,000, not counted).

## Distance to quota
- At Commit: €450,000 − (€120,000 Closed Won + €105,000) = €225,000 gap
- At Best Case: €450,000 − (€225,000 + €99,000) = €126,000 gap
- Coverage: raw 1.09x (€490,000 open) · weighted 0.60x (€268,500) · quality-adjusted 0.84x (€380,000 without
  Ostwind and Talvik)

## Deals at risk
| Opportunity | Amount | Category | Flags raised | H / M | Next action |
|---|---|---|---|---|---|
| Ostwind Energie | €110,000 | Pipeline | Close date slipped; single-threaded; 20 days silent | H | Call this week; ask the contact to bring in the budget holder |
| Novacert | €90,000 | Best Case | Paper process undefined | M | Get the procurement steps and legal timeline in writing by 27 Nov |

## Best bets for closing the gap
| Opportunity | Amount | Category now | What has to be cleared before it can move up | Likelihood it moves (evidence-based) |
|---|---|---|---|---|
| Novacert | €90,000 | Best Case | Defined paper process with dates before 20 Dec | High: verbal yes already given [CRM record] |
| Lindqvist Retail | €80,000 | Best Case | Verbal commitment and an agreed signing date | Medium: budget and CFO confirmed, no commitment yet |

## New pipeline required
- Coverage verdict: Critical [AI judgment — rep to validate]
- Amount to generate: [Placeholder — no historical coverage-to-close ratio yet]; needed for Q1 2027
- How urgent: 44 days left in Q4; the €126,000 best-case gap has to come from existing deals

## Assumptions and data caveats
- Stage win rates from the last 4 quarters [Supplied by user]; no haircut, as accuracy history is missing.
- Talvik should go to pipeline cleanup.

This forecast supports decisions; it does not make them. The rep and their manager must validate every category
assignment and risk assessment before the forecast is submitted.

## Example 2: No win-rate history, and a request for "standard" percentages

**Request**

> Need a quick commit view for Q4, quota €300,000. Mertens Bau €95,000, PO is in. Solberg Pharma €140,000, I'd
> say 80%, verbal yes, contract with their legal, close 12 Dec. Ivarsen Media €70,000, maybe 50%, demo done,
> budget not confirmed yet. Corvel Hotels €60,000, proposal sent. We don't track stage win rates, so just use the
> standard 10/25/50/75 by stage.

**How the skill handles it**

- Weighting: no history, so no stage-based rates; ground rule 2 rules out "standard" percentages.
- Assessed-confidence weighting with the rep's figures; Corvel has no figure and gets a placeholder, not a guess.
- Phase 2: Ivarsen lacks confirmed budget, so Pipeline rather than Best Case.
- Asks for the missing evidence instead of filling it in.

**Answer**

I haven't used the 10/25/50/75 split: those aren't your numbers and can't be defended in the commit call. I've
weighted with your own confidence figures instead.

# Forecast — Q4 2026

| Prepared on | Quota | Weighting used |
|---|---|---|
| 17 Nov 2026 | €300,000 | Assessed-confidence |

## Totals by category
| | Deals | Unweighted value | Weighted value | Share of quota |
|---|---|---|---|---|
| Closed Won | 1 | €95,000 | €95,000 | 31.7% |
| Commit | 1 | €140,000 | €112,000 | 37.3% |
| Best Case | 0 | €0 | €0 | 0.0% |
| Pipeline | 2 | €130,000 | €35,000 + Corvel [Placeholder — no historical baseline yet] | 11.7% + Corvel |
| **All categories** | 4 | €365,000 | €242,000 + Corvel | 80.7% + Corvel |

## Distance to quota
- At Commit: €300,000 − (€95,000 + €112,000) = €93,000 gap
- At Best Case: €300,000 − (€207,000 + €0) = €93,000 gap
- Coverage: raw 0.90x (€270,000 open) · weighted and quality-adjusted pending Corvel's figure

## Deals at risk
| Opportunity | Amount | Category | Flags raised | H / M | Next action |
|---|---|---|---|---|---|
| Ivarsen Media | €70,000 | Pipeline | Value not validated by a budget holder | M | Confirm budget with the economic buyer before the next review |

## Best bets for closing the gap
| Opportunity | Amount | Category now | What has to be cleared before it can move up | Likelihood it moves (evidence-based) |
|---|---|---|---|---|
| Ivarsen Media | €70,000 | Pipeline | Confirmed budget and an involved decision-maker | [AI judgment — rep to validate] |

## New pipeline required
- Coverage verdict: Thin (0.90x raw, below quota before any weighting)
- Amount to generate: [Placeholder — no historical baseline yet]
- How urgent: 44 days left in the quarter

## Assumptions and data caveats
- Solberg's 80% and Ivarsen's 50% [Supplied by user] still need evidence (who gave the verbal yes, legal timeline).
- Corvel lacks confidence figure, close and activity dates; please add them.

This forecast supports decisions; it does not make them. The rep and their manager must validate every category
assignment and risk assessment before the forecast is submitted.
