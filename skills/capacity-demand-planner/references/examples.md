# Capacity & Demand Planner: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Q1 plan for a development team with a pipeline project

**Request**

> Capacity plan for Q1 2027, product engineering. Available hours per FTE in Q1 after leave, holidays and training:
> 456. Backend: 6 FTE, already allocated 2,300 h (release 4.0: 1,900 h, BAU support: 400 h). QA: 3 FTE, allocated
> 1,230 h (release 4.0: 880 h, BAU: 350 h). Pipeline: integration project for Kessler Logistik, estimate backend
> 300/400/620 h, QA 100/150/260 h (optimistic/likely/pessimistic); win rate for such deals 50%. Settings:
> target band 75–85%, unplanned buffer 10% of available hours, critical shortfall = gap above 10% of supply. One QA
> engineer has resigned and leaves end of January; no backfill approved yet.

**How the skill handles it**

- All settings are given, so it asks nothing.
- Step 2: three-point estimates for the pipeline project, weighted at the user's 50% win rate.
- Step 3: gaps classified against the 10% buffer and 10% threshold.
- Step 4: the resignation becomes the constrained-supply scenario.

**Answer**

# Capacity Plan — Product Engineering — Q1 2027

## Plan at a glance
- Current utilization: 86.0% overall (3,530 of 4,104 h), just above your 75–85% band [From org data]
- Forecasted demand: 3,820 h base case (8.4 FTE) [Framework methodology]
- Gap assessment: no shortfall in the base case; QA in moderate shortfall under high demand and critical under constrained supply
- Key risk: QA loses about 304 h when the resignation takes effect at end of January
- Primary recommendation: contract 250 h of QA capacity from February

## Available capacity by team
```
CAPACITY SUMMARY
  Team/Pool:              Backend               QA
  Headcount (FTE):        6                     3
  Available hours/period: 2,736                 1,368
  Currently allocated:    2,300                 1,230
  Remaining capacity:     436                   138
  Utilization rate:       84.1%                 89.9%
  Utilization band:       Target                Over
```

## Expected demand
| Source | Backend | QA |
|---|---|---|
| Committed: release 4.0 | 1,900 h | 880 h |
| BAU support | 400 h | 350 h |
| Pipeline: Kessler, expected effort | 420 h (σ 53) | 160 h (σ 27) |
| Pipeline weighted at 50% | 210 h | 80 h |
| **Base-case demand** | **2,510 h** | **1,310 h** |
| Unplanned buffer (10%) | 274 h | 137 h |

## Where supply and demand diverge
```
GAP ANALYSIS
  Period:             Q1 2027
  Skill category:     Backend               QA
  Supply (h):         2,736                 1,368
  Demand (h):         2,510                 1,310
  Gap:                +226                  +58
  Confidence:         High                  High
  Gap classification: Balanced (< 274 buffer)  Balanced (< 137 buffer)
```

## Scenario results
| Scenario | Backend gap | QA gap | Classification |
|---|---|---|---|
| Base case | +226 h | +58 h | Both balanced |
| High demand (Kessler at 100%) | 2,736 − 2,720 = +16 h | 1,368 − 1,390 = −22 h | Backend balanced, buffer nearly gone; QA moderate shortfall (threshold 137 h) |
| Constrained supply (QA leaves 31 Jan, 2/3 of 456 h lost) | +226 h | 1,064 − 1,310 = −246 h | QA critical from February [AI estimate — verify] |

## Recommended actions
```
RECOMMENDATION
  Gap addressed:       QA shortfall of 246 h (constrained supply)
  Lever:               2 — Redistribute across teams
  Specific action:     Backend writes the API regression tests for release 4.0 (100 h from its 226 h surplus)
  Effort to implement: Two-day handover
  Expected impact:     100 h of QA demand removed
  Timeline:            From mid-January
  Risk:                Backend surplus disappears if Kessler is won
  Dependencies:        Engineering manager approval
```
```
RECOMMENDATION
  Gap addressed:       Remaining QA shortfall of 146 h, plus buffer
  Lever:               4 — Temporary augmentation
  Specific action:     Contract one QA tester for 250 h, February to March
  Effort to implement: Two to three weeks of procurement
  Expected impact:     250 h, restoring 104 h of the 137 h buffer
  Timeline:            Available from mid-February
  Risk:                Onboarding eats into the first weeks
  Dependencies:        Budget approval; vendor availability
```
Decide the permanent backfill (lever 5) separately; it lands after Q1.

## Assumptions and known limits
- 456 h per FTE for both teams; the leaver works 1/3 of the quarter. BAU taken as stable (no seasonality data).

## When to revisit this plan
When Kessler is decided, at the latest at the start of Q2.

## Example 2: Request with missing settings (German)

**Request**

> Unser Service-Team Feldtechnik hat 8 Techniker, zwei davon in Teilzeit (50 %). Pro Vollzeitkraft rechnen wir im
> Q1 mit ca. 470 verfügbaren Stunden. Wartungsverträge binden 2.400 Stunden. Können wir zusätzlich den Rollout bei
> der Brandt Kältetechnik übernehmen? Schätzung 600 bis 1.000 Stunden, eher 700. Das Angebot liegt beim Kunden.

**How the skill handles it**

- Target band, threshold, conversion rate and buffer are missing; no defaults are assumed, so it asks.
- Meanwhile it delivers Step 1 and the three-point estimate from the user's figures.
- No gap classification or yes/no without the threshold. Answers in German.

**Answer**

Eine belastbare Antwort braucht vier Einstellungen, die nur Ihre Organisation festlegen kann:

1. **Ziel-Auslastungsband:** In welchem Bereich soll das Team laufen (z. B. 75–85 %) und warum?
2. **Puffer für ungeplante Arbeit:** Wie viele Stunden haben Störungseinsätze in den letzten Quartalen gebunden?
3. **Abschlussquote:** Wie oft werden Angebote dieser Art bei Ihnen erfahrungsgemäß beauftragt?
4. **Kritische Schwelle:** Ab welcher Unterdeckung eskalieren Sie (Stunden oder Prozent)?

Was Ihre Zahlen schon jetzt zeigen:

```
KAPAZITÄTSÜBERSICHT
  Team:                    Service Feldtechnik
  FTE:                     7,0 (6 × 1,0 + 2 × 0,5)
  Verfügbare Stunden Q1:   3.290 (7 × 470)
  Bereits verplant:        2.400 (Wartungsverträge)
  Restkapazität:           890
  Auslastung:              72,9 %
  Auslastungsband:         offen, Zielband fehlt
```
[Aus Organisationsdaten]

Rollout Brandt, Dreipunktschätzung [Methodik]:
- Erwarteter Aufwand = (600 + 4 × 700 + 1.000) ÷ 6 = 733 Stunden
- Standardabweichung = (1.000 − 600) ÷ 6 = 67 Stunden

Bei voller Beauftragung bleiben von 890 Stunden Restkapazität 157 Stunden, bevor Störungseinsätze abgezogen sind.
Ob das reicht, hängt an Ihrem Puffer: Liegt er über 157 Stunden, entsteht eine Unterdeckung. Ob sie moderat oder
kritisch ist, entscheidet Ihre Schwelle. [KI-Schätzung — prüfen]

Sobald Sie die vier Werte nennen, ergänze ich die Lückenanalyse, die drei Szenarien und die Hebel in Prioritätenfolge.
