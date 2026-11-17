# Sprint Scope Planner: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Planning a sprint with reduced capacity

**Request**

> Plan Sprint 24 (23 Nov – 4 Dec, 10 days) for the Checkout team: 5 devs, 6 productive hours/day. Mia off 3 days;
> Ole on call (we lose ~40% of his time); recurring meetings 4 h per person. Velocity last 4 sprints: 34, 38, 36, 40;
> our usual adjusted capacity is about 270 h. Priority: saved cards for returning customers. Groomed stories:
> - DB migration payment_methods table, 3 pts
> - Tokenization via PSP API, 8 pts (sandbox credentials confirmed for 23 Nov)
> - Saved payment methods UI, 8 pts (needs tokenization)
> - Checkout error messages, 3 pts (carried over: copy wasn't approved; approved now)
> - Checkout analytics events, 2 pts
> - Refactor form validation, 3 pts
> - Admin view of saved cards, 5 pts
> - Card expiry reminder email, 5 pts (needs a template from the CRM team, no date yet)

**How the skill handles it**

- Capacity steps 1–4: 300 h raw, 238 h adjusted, 88% of the usual 270 h, so about 32 points from a 37-point average.
- Goal: one testable outcome tied to the stated priority.
- Commitment at 84% of effective capacity; the expiry email has an unconfirmed cross-team dependency, so it can't
  be committed, and as stretch must be dependency-free, it stays out of the sprint.
- Dependencies sequenced: migration and tokenization first, UI after.

**Answer**

```
Sprint 24  ·  runs 23 Nov 2026 to 4 Dec 2026
Sprint goal: Returning customers can pay with a saved card without re-entering their card details.

Capacity
| Input              | Value                                                             |
|--------------------|-------------------------------------------------------------------|
| Headcount          | 5                                                                 |
| Raw capacity       | 300 h (5 × 10 days × 6 h)                                         |
| Deductions         | 62 h: PTO 18 h (Mia, 3 days), on-call 24 h (40% of Ole's 60 h), meetings 20 h |
| Effective capacity | 238 h = 88% of the usual 270 h → about 32 points                  |
| Velocity baseline  | 37 points (34, 38, 36, 40)                                        |

Committed work — 27 points, i.e. 84% of effective capacity
| # | Item                         | Size | Assignee | Depends on         | State |
|---|------------------------------|------|----------|--------------------|-------|
| 1 | DB migration payment_methods | 3    | [ ]      | none               | Ready |
| 2 | Tokenization via PSP API     | 8    | [ ]      | 1; PSP sandbox     | Ready |
| 3 | Saved payment methods UI     | 8    | [ ]      | 2                  | Ready |
| 4 | Checkout error messages      | 3    | [ ]      | none               | Ready |
| 5 | Checkout analytics events    | 2    | [ ]      | none               | Ready |
| 6 | Refactor form validation     | 3    | [ ]      | none               | Ready |

Stretch work — 5 points
| # | Item                    | Size | Pull order        | Depends on |
|---|-------------------------|------|-------------------|------------|
| 1 | Admin view of saved cards | 5  | 1 (first to pull) | 1          |

Dependency tracker
| What we're waiting on   | Kind      | Tracked by | Resolution expected | Check on    |
|-------------------------|-----------|------------|---------------------|-------------|
| PSP sandbox credentials | External  | [ ]        | 23 Nov              | 23 Nov      |
| DB migration            | Technical | [ ]        | early in sprint     | 25 Nov      |

Threats to the goal
  Tokenization (8 pts) gates the UI (8 pts): if the PSP sandbox slips past 25 Nov, the goal is at risk.
  Ole's on-call load may exceed 40%.

Carried in from last sprint
  Checkout error messages: slipped because copy wasn't approved; now approved; kept in, as it supports checkout.
```

Not in this sprint: card expiry reminder email, until the CRM team confirms a template date `[AI proposal — team to
confirm]`. Sources: all figures and stories `[Team or tracker data]`; capacity method and the 80–90% commitment
band `[Planning method]`; goal wording, ordering and the refactor in the commitment `[AI proposal — team to confirm]`.
Assignees are left blank for the team to fill in during planning.

## Example 2: Rebalancing a sprint on day 6

**Request**

> We're on day 6 of 10. Goal: "Warehouse staff can print pick lists by zone." Velocity 28/sprint, 4 devs, one is
> now sick until the sprint ends. Left: zone filter API (about 2 of 5 pts left), pick-list PDF layout 5 (not
> started), printer config 3 (blocked: IT ticket, no date), label size settings 3, audit log 2. What do we drop?

**How the skill handles it**

- Rebalancing order: recalculate capacity, recheck the commitment, guard the goal, escalate the blocker, inform
  stakeholders.
- Capacity: 4 days left at 28 points per 10 days, scaled to 3 of 4 people: 28 / 10 × 4 × 0.75 = 8.4 points.
- The goal items need 10 points with one blocked, so the goal itself has to narrow unless the blocker clears.

**Answer**

**1. Capacity for the remaining 4 days:** 2.8 points per day × 4 days × 3/4 of the team = **8.4 points**
`[Team or tracker data]` `[Planning method]`. Remaining committed work is 15 points.

**2. Commitment check**

| Item | Points left | Serves the goal? | Status |
|---|---|---|---|
| Zone filter API | 2 | Yes | On schedule |
| Pick-list PDF layout | 5 | Yes | Not started, at risk |
| Printer config | 3 | Yes | Blocked, no date |
| Label size settings | 3 | No | Not started |
| Audit log | 2 | No | Not started |

**3. Guard the goal** `[AI proposal — team to confirm]`
- Move label size settings and audit log (5 points) out of the commitment to stretch; they don't serve the goal.
- Keep zone filter API and PDF layout (7 points, within 8.4).
- Printer config: escalate the IT ticket today, asking for a date by tomorrow. If none comes, narrow the goal to
  "Warehouse staff can generate pick lists by zone as PDF" and say so openly rather than miss it silently.

**4. Escalate:** the IT ticket blocks the goal, so it goes to the IT lead now, not at the next stand-up.

**5. Inform stakeholders:** the commitment changed, so send an update (use `product-update-communicator` if
available): what moved out, why, and whether printing is still in scope by [date].
