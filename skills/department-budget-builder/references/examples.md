# Department Budget Builder: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Cost-centre budget for a support team

**Request**

> FY2027 budget for Customer Support, Nordwerk Software GmbH, EUR. 12 agents today, HR says fully loaded cost
> 60,000 per FTE incl. 2027 merit. Approved hiring plan: one hire April, one July. Ticketing licences 4,000/month,
> contract runs all year, renewal Oct 2027 (vendor hinted +8%). Travel and training ran 2,400/month in H2 2026; CFO
> wants 2.5% inflation on non-contract opex. Knowledge-base migration: vendor quote 18,000, May; we might do it
> in-house. CFO envelope: 880,000. 2026 actual: 812,000. Upside = a third hire in October; downside = July hire moved
> to 2028 and travel halved.

**How the skill handles it**

- Section 1: top-down (880,000 envelope) and bottom-up (890,520 built) disagree; the gap is shown, not closed.
- Section 2: every line traces to a register entry with a grade; the licence increase stays a risk, not a base number.
- Sections 3–5: compensation is prorated by start month; scenarios flex the same register; the tornado swings each
  driver by ±10%.
- Revenue and margin rows are marked n/a because a cost centre has none, instead of inventing them.

**Answer**

Nordwerk Software GmbH, Customer Support: budget for FY2027
Version: Draft 1 · Prepared on: 2026-11-17

> Not professional advice. Qualified professionals must review this budget before it is used.

**A. Headline view by scenario**

| Metric | Base | Upside | Downside | Last year (actual) |
|---|---|---|---|---|
| Revenue / Gross Profit / margins | n/a (cost centre) | n/a | n/a | n/a |
| Operating Expenses | 890,520 | 905,520 | 845,760 | 812,000 |
| Headcount at year end | 14 | 15 | 13 | 12 |

Gap to the CFO envelope of 880,000 `[Source: leadership target]`: Base is 10,520 over. Options for the review
discussion: move the July hire to August (−5,000), do the migration in-house (−18,000), or raise the envelope. The
choice is management's.

**B. Assumptions that drive the plan**

| ID | Area | What we assume | Where it comes from | Grade | How sensitive |
|---|---|---|---|---|---|
| A1 | Headcount | 12 FTE on 1 Jan | Roster `[Source: department submission]` | Committed | Base of all comp |
| A2 | Headcount | +1 FTE April, +1 FTE July | Approved hiring plan | Planned | 5,000 per FTE-month |
| A3 | Compensation | 60,000 fully loaded per FTE, merit included | HR | Estimated | ±10% = ±79,500 |
| A4 | Licences | 4,000 per month | Contract | Committed | ±10% = ±4,800 |
| A5 | Travel/training | 2,400 per month × 1.025 = 2,460 | H2 2026 actuals; CFO inflation | Estimated | ±10% = ±2,952 |
| A6 | Project | KB migration 18,000 in May | Vendor quote | Estimated | ±10% = ±1,800 |

**C. Base case, month by month (EUR)** `[Source: derived from the assumptions]`

| Line | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | Year |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Compensation | 60,000 | 60,000 | 60,000 | 65,000 | 65,000 | 65,000 | 70,000 | 70,000 | 70,000 | 70,000 | 70,000 | 70,000 | 795,000 |
| Licences | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 4,000 | 48,000 |
| Travel/training | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 2,460 | 29,520 |
| KB migration | 0 | 0 | 0 | 0 | 18,000 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18,000 |
| Total opex | 66,460 | 66,460 | 66,460 | 71,460 | 89,460 | 71,460 | 76,460 | 76,460 | 76,460 | 76,460 | 76,460 | 76,460 | 890,520 |

Scenarios: Upside adds a hire in October (+3 × 5,000 = +15,000). Downside removes the July hire (−6 × 5,000 =
−30,000) and halves travel (−14,760). Decision triggers: [Awaiting input — placeholder only], for example the
ticket volume at which the October hire is released.

**D. Sensitivity** (total opex at −10% / +10%)

| Driver | −10% | +10% | Range |
|---|---|---|---|
| Cost per FTE (A3) | 811,020 | 970,020 | 159,000 |
| Licences (A4) | 885,720 | 895,320 | 9,600 |
| Travel/training (A5) | 887,568 | 893,472 | 5,904 |
| KB migration (A6) | 888,720 | 892,320 | 3,600 |

Cost per FTE carries almost all of the risk; the HR figure should be validated before approval.

**E. Risks and opportunities**

| # | Type | What it is | Effect on Base | Mitigation / capture |
|---|---|---|---|---|
| 1 | Risk | Licence +8% at October renewal | +960 (3 × 320) | Negotiate before renewal |
| 2 | Opportunity | KB migration in-house | −18,000 | Confirm team capacity in Q1 |

**F. Sign-off status**

| Part of the plan | Approver | Status | Date |
|---|---|---|---|
| Headcount | Head of Support | pending | |
| Operating expenses | Head of Support | pending | |
| Consolidated budget | CFO | pending | |

## Example 2: Conflicting target and missing inputs, in German

**Request**

> Ich brauche das Marketingbudget 2027. Vorgabe vom CFO: 5 % weniger als 2026. Wir wollen aber zwei Stellen
> zusätzlich und die Messe in Hannover. Kannst du das schnell durchrechnen?

**How the skill handles it**

- Section 1: the CFO cut and the extra spend conflict; both positions go into the draft, unresolved.
- Ground rules: the 2026 base, salaries and trade-fair costs are not given, so nothing is estimated; the register
  holds placeholders and the skill asks for exactly what it needs.

**Answer**

Durchrechnen kann ich es, sobald die Ausgangszahlen da sind; schätzen werde ich sie nicht. Stand jetzt:

| ID | Bereich | Annahme | Quelle | Einstufung |
|---|---|---|---|---|
| A1 | Gesamtbudget | Budget 2026 − 5 % | `[Source: leadership target]` | Planned |
| A2 | Personal | +2 Stellen, Start [Awaiting input — placeholder only] | `[Source: department submission]` | Placeholder |
| A3 | Messe Hannover | Kosten [Awaiting input — placeholder only] | `[Source: department submission]` | Placeholder |

Zielkonflikt: Die Vorgabe senkt das Budget, A2 und A3 erhöhen es. Ich stelle beide Positionen nebeneinander, damit
ihr die Lücke im Budgetgespräch klärt; entscheiden kann ich sie nicht.

Bitte schick mir:
1. Ist-Kosten 2026 nach Kostenart (oder die letzten 6 Monate).
2. Vollkosten je neuer Stelle und geplante Startmonate.
3. Kostenaufstellung oder Angebot für die Messe (Fläche, Standbau, Reise).
4. Fest gebundene Verträge 2027 (Agentur, Tools).

Dann bekommst du Basis-, Upside- und Downside-Fall, die Sensitivität und die Freigabe-Übersicht.

> Keine Finanz-, Steuer- oder Buchhaltungsberatung: Das Ergebnis muss vor der Verwendung fachlich geprüft werden.
