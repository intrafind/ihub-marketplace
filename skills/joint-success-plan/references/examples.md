# Joint Success Plan: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Post-onboarding plan from discovery notes

**Request**

> Success plan for Halden Wohnbau (property management, 9,000 rental units). Contract 1 Dec 2026 to 30 Nov 2027,
> 60 seats of our field service app. I'm the CSM, Lukas Fehr; our sponsor is Ines
> Wolf (VP CS). Their lead: Marta Quandt (head of tenant services); sponsor: CFO Henrik Saal.
> Discovery 10 Nov, Marta: "Repairs take far too long, tenants complain on every portal review." "Board wants
> repair turnaround under four days by summer." Helpdesk report: average turnaround 6.2 days (Oct 2026). Technicians still get jobs by phone. Their IT (Tobias Renn) must connect
> the tenant portal by end of January.

**How the skill handles it**

- Step 1: the goal is the customer's own, not an adoption target.
- Step 2: baseline 6.2 days is measured; the target comes from the board via Marta. The app-dispatch KPI has no
  baseline, so "Not yet measured".
- Step 3/4: milestones by dependency, critical path marked, one owner per side; 30/60/90-day horizons
  ("after onboarding"). Marked as not yet validated.

**Answer**

# Success plan: Halden Wohnbau

| Role | Name |
|---|---|
| CSM (owns the plan) | Lukas Fehr |
| Customer lead | Marta Quandt |
| Executive sponsor, our side | Ines Wolf |
| Executive sponsor, customer side | Henrik Saal |

Runs 1 Dec 2026 to 30 Nov 2027 · First drafted 17 Nov 2026 · Last revised 17 Nov 2026 (account record)

**Draft: not yet validated by Halden Wohnbau.** Every section needs Marta Quandt's review.

## The customer's situation
- Sector: property management (account record)
- What matters most to them: faster repairs for tenants; better tenant portal reviews (customer's own words)
- Problems this plan tackles: repairs take too long; technicians receive jobs by phone (customer's own words)

## Goal 1: Repair turnaround under four days by summer (customer's own words)
Payoff if we get there: fewer tenant complaints (customer's own words)

**How we will measure it**
| KPI | Starting point | Measured on | Target | Tracking (method · who · how often) |
|---|---|---|---|---|
| Average repair turnaround | 6.2 days | Oct 2026 | 4.0 days by 30 Jun 2027 | Helpdesk report · Marta Quandt's team · monthly |
| Jobs dispatched in the app | Not yet measured | — | [ASK IN DISCOVERY] | App report · Lukas Fehr · monthly (CSM suggestion) |

**Milestones** (plan methodology)
| ID | Milestone | Done means | Our owner | Their owner | Due | Depends on | Status |
|---|---|---|---|---|---|---|---|
| M1.1 | Technicians onboarded | All 60 seats active, training done | Lukas Fehr | Marta Quandt | 31 Dec 2026 (30 days) | none | Not started |
| M1.2 | Tenant portal connected | Portal tickets create app jobs automatically | [our integration engineer] | Tobias Renn | 31 Jan 2027 (60 days) | M1.1 | Not started |
| M1.3 | Phone dispatch retired | New jobs go to technicians via the app only | Lukas Fehr | Marta Quandt | 28 Feb 2027 (90 days) | M1.2 | Not started |
| M1.4 | Turnaround target reached | Helpdesk report shows ≤ 4.0 days | Lukas Fehr | Marta Quandt | 30 Jun 2027 | M1.3 | Not started |

Critical path: M1.2 → M1.3 → M1.4; a slip in the portal integration moves everything. (CSM suggestion)

## Risks and how we will handle them
| # | Risk | Mitigation | Owner |
|---|---|---|---|
| 1 | Portal integration slips past January | Fortnightly check with Tobias Renn | Lukas Fehr |

## Review rhythm
| Review | How often | Next one |
|---|---|---|
| Progress check | every two weeks | 1 Dec 2026 |
| Quarterly review | quarterly | Feb 2027 [date to agree] |
| Plan refresh | twice yearly or at renewal | May 2027 [date to agree] |

## Staying in touch
- Routine updates: [channel to agree], every two weeks
- Escalations: Marta Quandt → Lukas Fehr → sponsors Henrik Saal / Ines Wolf

## Sign-off
| Signatory | Name | Date |
|---|---|---|
| CSM | Lukas Fehr | |
| Customer lead | Marta Quandt | |
| Executive sponsors (optional) | Henrik Saal, Ines Wolf | |

## Example 2: Renewal recovery without customer data

**Request**

> Corvan Logistics renews in March, unhappy. Their ops director: "the reporting module hasn't saved us a single
> hour". Recovery plan for Thursday's meeting, please. We have no numbers from them, so put in realistic
> baselines and targets, e.g. 20 hours a week saved. Contact Paul Ekberg; I'm Nadia Lorenz.

**How the skill handles it**

- Ground rules: no baselines or targets without customer data, so "20 hours" is not used; "Not yet measured".
- Variation "renewal recovery": prove value on the stated concern; weekly check-ins.
- Step 1: the meeting becomes discovery; the plan supplies the questions.

**Answer**

I've left out the 20-hours figure: a target Corvan didn't set won't convince them. Here is a draft for Thursday,
with the gaps to fill in that meeting.

# Success plan: Corvan Logistics (renewal recovery, draft)

| Role | Name |
|---|---|
| CSM (owns the plan) | Nadia Lorenz |
| Customer lead | Paul Ekberg |
| Executive sponsor, our side | [to confirm] |
| Executive sponsor, customer side | [ASK IN DISCOVERY] |

Runs from [date] to renewal in March 2027 · First drafted 17 Nov 2026 · **Not validated by Corvan.**

## The customer's situation
- Sector: logistics (account record)
- What matters most to them: [ASK IN DISCOVERY]
- Problems this plan tackles: "the reporting module hasn't saved us a single hour" (customer's own words)

## Goal 1: [ASK IN DISCOVERY: the time saving they expected, in their words]

**How we will measure it**
| KPI | Starting point | Measured on | Target | Tracking (method · who · how often) |
|---|---|---|---|---|
| Hours per week spent on reporting | Not yet measured | — | [agree with Paul Ekberg] | [ASK IN DISCOVERY] |

**Milestones** (plan methodology)
| ID | Milestone | Done means | Our owner | Their owner | Due | Depends on | Status |
|---|---|---|---|---|---|---|---|
| M1.1 | Baseline agreed | Reporting hours measured, accepted by both | Nadia Lorenz | Paul Ekberg | [date] | Thursday meeting | Not started |
| M1.2 | Target agreed | Target and date set by Corvan | Nadia Lorenz | Paul Ekberg | [date] | M1.1 | Not started |

## Questions for Thursday (plan methodology)
1. Which reports take the most time today, and who produces them?
2. When you bought the module, what did you expect it to save?
3. How will your leadership judge whether renewing was worth it?
4. Who on your side should own this plan with us?

## Review rhythm
| Review | How often | Next one |
|---|---|---|
| Progress check | weekly until stable (CSM suggestion) | [week after Thursday] |
| Quarterly review | quarterly | [ASK IN DISCOVERY] |
| Plan refresh | at renewal | March 2027 |

Not yet validated: every section. Send Paul the revised draft for sign-off after Thursday.
