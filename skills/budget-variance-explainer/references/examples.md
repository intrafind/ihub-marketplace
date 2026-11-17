# Budget Variance Explainer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Monthly variance report for the controller

**Request**

> October 2026 budget vs actual for Kvarta Software GmbH, EUR. Use our thresholds: EUR 50K, 10%, or EUR 25K and 5%.
> Full report for FP&A please.
>
> | Line | Budget | Actual | Sep variance |
> |---|---|---|---|
> | License revenue | 1,200,000 (400 licenses × 3,000) | 1,086,000 (375 licenses × 2,896 avg) | −40,000 |
> | Services revenue | 300,000 | 318,000 | +5,000 |
> | R&D personnel | 520,000 (52 FTE) | 492,000 (49 FTE) | −18,000 |
> | Marketing | 150,000 | 205,000 | +2,000 |
> | Cloud hosting | 80,000 | 87,500 | +3,000 |
> | Other G&A | 250,000 | 241,000 | −4,000 |
>
> Notes: the Hanover trade fair invoice (EUR 60,000) was budgeted for November but paid in October. Two R&D hires
> slipped to January, one leaver not replaced. Owners: Jonas Keller (sales), Mira Olsen (marketing), Daniel Szabo (R&D).

**How the skill handles it**

- Step 1: same period, one currency, six lines on both sides; September variances give the trend.
- Step 3: licenses (EUR 114K) and marketing (EUR 55K) pass the absolute test, R&D personnel the combined test
  (EUR 28K, 5.4%); hosting at 9.4% is within 80% of the 10% test, so Watch.
- Step 5: licenses split into volume −75,000, price −41,600 and mix +2,600, which sum to −114,000; personnel
  split into headcount −30,000 and rate +2,000.
- No action dates were given, so actions carry proposed dates.

**Answer**

# Budget vs. Actual — October, 2026
Author: FP&A (AI-assisted)  ·  Issued: 17 Nov 2026  ·  Version: Draft

## 1. Headline results
| Measure | Gap in EUR | F/U | Gap as % of budget |
|---|---|---|---|
| Revenue, all lines | EUR −96,000 | U | −6.4% |
| Expenses, all lines | EUR +25,500 | U | +2.6% |
| Effect on net income | EUR −121,500 | U | −24.3% |

Budgeted operating result EUR 500,000; actual EUR 378,500. [Derived]

## 2. Biggest variances, ranked
| # | Account | EUR gap | % gap | F/U | Main driver | Status |
|---|---|---|---|---|---|---|
| 1 | License revenue | −114,000 | −9.5% | U | Volume | Material |
| 2 | Marketing | +55,000 | +36.7% | U | Timing | Material |
| 3 | R&D personnel | −28,000 | −5.4% | F | Volume (headcount) | Material |
| 4 | Cloud hosting | +7,500 | +9.4% | U | not supplied | Watch |

Services revenue (+18,000, F, +6.0%) and Other G&A (−9,000, F, −3.6%) are immaterial.

## 3. Line-by-line explanations

#### License revenue
- Gap to plan ......... EUR −114,000, U, equal to −9.5% of the budgeted amount
- Status .............. Material
- What caused it:
    · Volume, EUR −75,000: 375 licenses sold against 400 planned, at budget price 3,000 [Derived]
    · Price, EUR −41,600: average price 2,896 against 3,000, on budget volume [Derived]
    · Mix (interaction), EUR +2,600: shown separately, as no house convention was supplied [Derived]
- Direction ........... Worsening (September: −40,000)
- Looking ahead ....... A second month of shortfall suggests a pipeline or discount issue persisting into Q4
- Next step ........... Jonas Keller will explain the discount level and Q4 pipeline by 27 Nov 2026 (proposed date)
- Controllable: partially · Confidence: High

#### Marketing
- Gap to plan ......... EUR +55,000, U, equal to +36.7% of the budgeted amount
- Status .............. Material
- What caused it:
    · Timing, EUR +60,000: Hanover trade fair invoice budgeted for November, paid in October [Source: actuals]
    · Other discretionary spend, EUR −5,000: not explained in the data
- Direction ........... New this period (September: +2,000)
- Looking ahead ....... Reverses if the November budget line stays unspent
- Next step ........... Mira Olsen will confirm the November fair budget is released by 24 Nov 2026 (proposed date)
- Controllable: yes · Confidence: High for timing, Low for the remaining −5,000

#### R&D personnel
- Gap to plan ......... EUR −28,000, F, equal to −5.4% of the budgeted amount
- Status .............. Material
- What caused it:
    · Volume (headcount), EUR −30,000: 49 FTE against 52 at budget cost 10,000 per FTE [Derived]
    · Rate, EUR +2,000: actual cost per FTE about 10,041 [Derived]
- Direction ........... Larger favorable gap than September (−18,000)
- Looking ahead ....... Favorable only on paper: two hires slipped to January, one leaver unreplaced
- Next step ........... Daniel Szabo will confirm the replacement plan for the leaver by 4 Dec 2026 (proposed date)
- Controllable: yes · Confidence: High

## 4. Patterns across lines
- Revenue is below plan for a second month; savings come from unfilled roles, not efficiency.

## 5. What lies ahead: risks and upside
- License shortfall: likely to persist without pipeline action (recurring).
- Marketing: timing only; should reverse in November.
- R&D: recurs until January, then reverses; delivery risk outweighs the saving.
- Cloud hosting: Watch; driver not supplied — please provide usage data.

## 6. Action list
| # | What to do | Who | Due | Linked line |
|---|---|---|---|---|
| 1 | Explain discount level and Q4 pipeline | Jonas Keller | 27 Nov 2026 (proposed) | License revenue |
| 2 | Confirm November fair budget release | Mira Olsen | 24 Nov 2026 (proposed) | Marketing |
| 3 | Confirm replacement plan for leaver | Daniel Szabo | 4 Dec 2026 (proposed) | R&D personnel |

Not professional advice: qualified professionals must review this report before anyone relies on it.

## Example 2: Periods that do not match (German)

**Request**

> Bitte Abweichungsanalyse Q3 für den Vorstand: Budget Q3 Materialkosten 840.000 EUR, Ist 610.000 EUR. Ist-Daten
> aus dem ERP-Export "Juli–August". Warum sind wir so gut?

**How the skill handles it**

- Step 1: budget covers Q3, actuals only July–August; the mismatch is raised at once instead of reporting a
  favorable EUR 230,000.
- Ground rule: September is "not supplied — please provide"; nothing is extrapolated.

**Answer**

Vorab: Die Zahlen sind so nicht vergleichbar.

- Budget: Q3 (Juli–September), 840.000 EUR [Source: budget]
- Ist: nur Juli–August, 610.000 EUR [Source: actuals]
- September-Ist: not supplied — please provide

Die scheinbare Unterschreitung von 230.000 EUR (−27,4 %) entsteht vor allem, weil ein Monat fehlt. Eine
gleichmäßige Verteilung (280.000 EUR je Monat) wäre eine Annahme, keine Analyse.

Damit ich die Analyse erstellen kann, brauche ich eines von beiden:
1. den ERP-Export mit den Ist-Werten für September, oder
2. die monatliche Aufteilung des Q3-Budgets, dann vergleiche ich vorerst Juli–August mit Juli–August.

Für die Treiberanalyse (Menge, Preis, Mix) brauche ich außerdem Mengen und Einkaufspreise je Materialgruppe.

Hinweis: keine Finanzberatung; vor Verwendung fachlich prüfen lassen.
