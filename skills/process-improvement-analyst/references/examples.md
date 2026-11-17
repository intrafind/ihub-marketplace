# Process Improvement Analyst: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Purchase requisitions that take eight days

**Request**

> Our requisition process is too slow. Data from March–May (720 requisitions, 240/month): requester fills
> an Excel form (15 min) and emails it to purchasing; purchasing re-keys it into the ERP (10 min, waits about 1 day
> in the inbox); cost-center manager approves (5 min, waits 2 days); plant director approves every requisition
> (5 min, waits 4 days, about 70 in his queue); purchasing creates the PO (20 min, waits half a day). 18%
> are sent back for missing supplier or cost-center data, which adds about 2 days. Average start-to-PO: 8 working
> days. 62% of requisitions are under EUR 1,000. The director rejected 3 of the 720.

**How the skill handles it**

- Phase 2: baseline from the user's figures only; efficiency = 55 min hands-on ÷ 8 days × 480 min.
- Phase 4: the longest queue and wait sit at the director: a policy bottleneck, since every item needs his
  sign-off regardless of value.
- Phase 5: Five Whys on the bottleneck stops at Why 4, where the cause is systemic and actionable.
- Phase 7: projections tagged and built only on the given waits; no cost per item (no cost data).

**Answer**

# Process Optimization Report: Purchase requisitions

## At a glance
- Current performance: 8.0 working days to PO; 1.4% process efficiency; 82% first-pass yield `[From process data]`
- Primary bottleneck: plant director approval (policy bottleneck)
- Top waste category: waiting (7.5 of 8 days)
- Recommended improvements: 3, projected to cut cycle time to roughly 4.3 days `[AI projection — verify with process data]`
- Quick wins: approval threshold of EUR 1,000; mandatory fields in the form

## How the process runs today
- Process map: (1) Excel form, 15 min → email → (2) re-key into ERP, 10 min, wait 1 day → (3) cost-center
  approval, 5 min, wait 2 days → (4) director approval, 5 min, wait 4 days → (5) PO, 20 min, wait 0.5 days;
  18% loop back from step 2 or 3 to the requester, +2 days
- Baseline metrics (March–May, 720 requisitions):

```
PROCESS BASELINE
  Process:            Purchase requisition to PO
  Measurement period: March–May 2026
  Volume:             240 per month
  Cycle time:         8.0 working days
  Processing time:    55 minutes
  Process efficiency: 1.4% (55 ÷ 3,840 minutes)
  Error/rework rate:  18%
  First-pass yield:   82%
  Cost per item:      not available (no cost data)
```

- Process efficiency: 1.4%; a requisition spends almost all its time waiting `[From process data]`

## Waste found
| Type | Location | Frequency | Impact | Root cause |
|---|---|---|---|---|
| Waiting | Before director approval | Every item | 4 days | Approval required for all values |
| Rework | Steps 2–3 back to requester | 18% of items | +2 days each | Form allows missing supplier and cost center |
| Motion | Excel to ERP | Every item | 10 min plus 1 day in inbox | Form is outside the ERP |

## Bottlenecks identified
**Plant director approval: policy bottleneck.** Evidence: longest queue (about 70 items), longest wait (4 days),
and 717 of 720 approved unchanged. `[From process data]`

```
PROBLEM: Requisitions wait 4 days for the director
  Why 1: About 70 requisitions sit in his queue at any time
  Why 2: He must approve every requisition, about 240 a month
  Why 3: The approval policy has no value threshold
  Why 4: The policy was written when the plant had far fewer purchases and was never reviewed
  Root cause: An approval rule with no threshold sends low-value items to the scarcest approver
```

## Recommended changes
| # | Change | Move | Impact | Effort | Priority |
|---|---|---|---|---|---|
| 1 | Director approval only from EUR 1,000 | Eliminate | High | Low | Do first |
| 2 | Supplier and cost center as mandatory form fields | Simplify | Medium | Low | Do second |
| 3 | Requesters enter requisitions directly in the ERP | Automate | High | Medium–High | Plan |

```
IMPROVEMENT PROJECTION
  Improvement:         Director approval only from EUR 1,000
  Addresses:           Policy bottleneck at step 4
  Current metric:      8.0 days average cycle time
  Projected metric:    about 5.5 days (62% of items skip a 4-day wait: 0.62 × 4 = 2.48 days)
  Improvement:         -2.5 days (-31%)
  Confidence:          Medium: the 3 rejections may have been under EUR 1,000; check them
  Assumptions:         Remaining items do not wait longer
  Measurement method:  Cycle time from ERP timestamps, 4 weeks after the change
```
`[AI projection — verify with process data]`

Change 2: rework 18% to an assumed 5% saves about 0.26 days on average (0.13 × 2). Change 3: removes the
1-day inbox wait and the 10-minute re-keying. Combined, roughly 8.0 to 4.3 days.
`[AI projection — verify with process data]`

## Rollout roadmap
- Phase 1 (Quick wins): threshold decision by management; mandatory fields in the form (within 2 weeks)
- Phase 2 (Planned): ERP entry for requesters, with IT, next quarter
- Phase 3 (Strategic): none needed

## How to tell it worked
Re-measure cycle time, first-pass yield and the director's queue for 4 weeks after each phase.

## Caveats and assumptions
No cost data, so no cost per item. Whether the 3 rejections were below EUR 1,000 is unknown; check before setting
the threshold. Waits are averages.

## Example 2: No data, but a request for a benchmark (German request)

**Request**

> Unsere Reklamationsbearbeitung dauert gefühlt ewig, ich schätze so drei Wochen. Wie stehen wir im
> Branchenvergleich da, und was sollten wir ändern?

**How the skill handles it**

- "Keep the numbers honest" and "No benchmark claims": no industry comparison and no recommendations on a guess.
- Phases 1 and 2 come first; the skill says exactly which data it needs.

**Answer**

Einen Branchenvergleich kann ich Ihnen nicht seriös geben: Ein „Branchenwert" ohne Ihre Produkte, Reklamationsarten
und Prüfaufwände sagt nichts aus. Aussagekräftig ist der Vergleich mit Ihren eigenen Zahlen vor und nach einer
Änderung. Auch Empfehlungen auf Basis einer Schätzung von „drei Wochen" wären geraten. `[Framework methodology]`

Was ich für eine belastbare Analyse brauche, am besten für die letzten drei Monate:

1. **Ablauf:** alle Schritte vom Eingang der Reklamation bis zur Antwort an den Kunden, mit den beteiligten Rollen
2. **Zeiten je Schritt:** Bearbeitungszeit (aktive Arbeit) und Liegezeit bis zum nächsten Schritt
3. **Menge:** Reklamationen pro Monat, wenn möglich getrennt nach Art
4. **Rückläufer:** wie viele Fälle zurückgehen, weil Angaben oder Teile fehlen
5. **Schmerzpunkte:** wo sich Kolleginnen und Kollegen beschweren oder Umwege nutzen

Zeitstempel aus dem ERP- oder Ticketsystem reichen oft schon. Damit erstelle ich die Ausgangslage und finde
Wartezeiten und Engpass.
