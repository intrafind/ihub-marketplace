# Tech Debt Prioritizer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Assessment of an order platform with team-supplied evidence

**Request**

> Tech debt review for our order platform; I have to justify Q1 capacity. Business priority: customer
> self-service portal live by end of March, and no more billing complaints. Our notes:
> 1. Invoice job: 3 incidents last quarter, duplicate invoices after retries (no idempotency key, built in a rush
>    in 2023). Fix est. 3 person-weeks.
> 2. Integration tests: CI takes 40 min, about 12% of runs fail on flaky tests and get re-run. Est. 4 pw.
> 3. Spring Boot 2.7, out of open-source support; two key customers' audits ask for supported versions. Est. 6 pw.
> 4. Reporting module: same export logic copy-pasted in 5 places, annoying but rarely buggy. Est. 1 pw.
> Owners: billing team (1), platform team (2, 3), reporting team (4).

**How the skill handles it**

- Phase 2: one type per item: design, test, dependency, code.
- Phase 3: each score has a reason tied to the notes and the stated business priorities; priority read from the
  grid (8 → P0, 6 → P1, 5 → P2, 4 → P3).
- Phase 4–5: cost bands from the team's estimates; a strategy per item. No coverage or complexity numbers
  were supplied, so none appear.

**Answer**

# Tech Debt Review — Order platform

## At a Glance
- Items found: 4
- Priority split: P0 1 · P1 1 · P2 1 · P3 1 · P4 0
- Remediation effort, all items combined (estimate): 14 person-weeks `[Supplied by the user]`
- Three headline recommendations:
  - Stop duplicate invoices now: idempotent invoice job (P0).
  - Fix flaky integration tests in Q1 so the portal release isn't slowed by re-runs (P1).
  - Plan the Spring Boot upgrade for Q2, before the next customer audits (P2).

## Breakdown by Debt Type
| Debt type | Items | Mean severity | Mean business impact |
|---|---|---|---|
| Architecture | 0 | — | — |
| Code | 1 | 2 | 2 |
| Test | 1 | 3 | 3 |
| Dependency | 1 | 2 | 3 |
| Infrastructure | 0 | — | — |
| Documentation | 0 | — | — |
| Design | 1 | 4 | 4 |

## P0 and P1 Items in Detail

```
DEBT RECORD TD-1 — Duplicate invoices from non-idempotent invoice job
  Category:           Design
  The problem:        Retries create a second invoice; 3 incidents last quarter [Supplied by the user]
  How it arose:       Deadline pressure in 2023, no idempotency key [Supplied by the user]
  Severity score:     4, because it is causing data integrity incidents in production now
  Business impact:    4, because customers see wrong invoices and billing complaints are a stated priority
  Priority:           P0 [Per the scoring method]
  Cost band:          Medium (3 person-weeks)
  Chosen strategy:    Dedicated debt sprint
  Approach:           Add an idempotency key per order and billing run; deduplicate on write; reconcile past duplicates
  Done when:          Zero duplicate-invoice incidents for one full quarter
  Owner:              Billing team
  Due by:             End of January [AI judgment — team to confirm]

DEBT RECORD TD-2 — Flaky integration tests and slow CI
  Category:           Test
  The problem:        CI runs 40 min; about 12% of runs fail on flaky tests and are re-run [Supplied by the user]
  How it arose:       Tests share state and depend on timing [AI judgment — team to confirm]
  Severity score:     3, because every change waits for re-runs, slowing all feature work
  Business impact:    3, because it slows the portal, the top roadmap item, in a critical area
  Priority:           P1 [Per the scoring method]
  Cost band:          Medium (4 person-weeks)
  Chosen strategy:    Dedicated debt sprint (20% of platform team capacity)
  Approach:           Quarantine the flakiest tests, isolate test data, split the suite to run in parallel
  Done when:          Flaky failure rate under 2% of runs and CI under 20 minutes
  Owner:              Platform team
  Due by:             End of February [AI judgment — team to confirm]
```

Other items: TD-3 Spring Boot 2.7 (Dependency, severity 2: no exploited issue reported yet, impact 3: customer
audits) → P2, High (6 person-weeks), strategic investment in Q2. TD-4 duplicated export logic (Code, 2/2) → P3, Low, fix on contact
when the reporting team next touches exports. `[Per the scoring method]`

## Roadmap
| Quarter | Where the effort goes | Measurable result expected | Effort (person-weeks) |
|---|---|---|---|
| Q1 | TD-1 invoice idempotency, TD-2 test stabilization | No duplicate invoices; CI under 20 min | 7 |
| Q2 | TD-3 Spring Boot upgrade | All services on a supported version before audits | 6 |
| Ongoing | TD-4 on contact | Export logic in one place | 1 |

## What to Measure Over Time
- Velocity over time (story points per sprint)
- Defect escape rate: the share of bugs that make it into production
- Incident count, broken down by system area (billing first)
- Mean time to deliver a feature in the portal area
- How long CI pipeline runs take, and the share of re-runs

## Example 2: Board numbers requested with no evidence

**Request**

> Our code is a complete mess. By Friday I need a prioritized tech debt list for the management board, with test
> coverage and complexity figures. Nothing is connected and I don't have details right now.

**How the skill handles it**

- Ground rule: no invented quality numbers. The skill names the tools that produce coverage and complexity figures
  instead of making them up.
- "Ask about business priorities rather than guessing" and nothing is connected, so it asks the Phase 1 questions
  plus the business priorities before scoring anything.

**Answer**

Without evidence I can't produce a list that would hold up, and I won't make up coverage or complexity figures.

**Where the numbers can come from**
- Test coverage: the output of your coverage tool in CI (for example JaCoCo, Istanbul, coverage.py). What matters
  is coverage on the critical paths.
- Complexity: a static analysis tool such as SonarQube. The telling files are those that are complex, change
  often and produce many bugs.

**What I need from you or the team**
1. What matters most to the business in the next two quarters (a release, customer complaints, an audit)? That
   sets the business impact scores.
2. Which corner of the code does the team avoid whenever it can, and why?
3. Where do the bugs keep coming from? Any incidents in recent months?
4. What can't you change without breaking something somewhere else?
5. How long does CI take, and are there flaky tests or outdated libraries?

With notes on these questions by Wednesday, I'll write the full report: P0–P4 with a reason for each score, cost
bands, a strategy per item and a roadmap.
