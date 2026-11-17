# Roadmap Prioritization Studio: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Ranking a quarter's backlog with RICE and MoSCoW

**Request**

> Plan Q1 2027 for the Ledgerline invoicing team. We commit to quarterly dates, no OKR process. Capacity 24
> person-weeks. Our RICE inputs (reach per quarter from product analytics, effort incl. QA):
> - Bulk invoice export: reach 1,200, impact 1, confidence 80%, effort 4
> - Dunning automation: reach 800, impact 2, confidence 80%, effort 8; needs the payment-status webhook from the
>   Payments team (Jonas Feld, in progress, due 20 Jan)
> - DATEV connector: reach 450, impact 3, confidence 50%, effort 10
> - Dark mode: reach 2,000, impact 0.25, confidence 100%, effort 3
> - XRechnung e-invoicing: reach 600, impact 2, confidence 100%, effort 9; legally required for our German B2B
>   customers from 1 Jan 2027 (receiving), so it must be in Q1
> Our quarter goal is lowering days sales outstanding. I need the ranking and an exec summary.

**How the skill handles it**

- Format decision: no OKR practice, quarterly commitments, so the Quarterly format.
- Step 3: RICE computed only from the team's own inputs; the ranking is an input, not the result.
- MoSCoW: XRechnung is a Must for a regulatory reason despite rank 4; dark mode outranks dunning by RICE, but the
  suggestion to keep dunning ahead is labelled as an AI suggestion, tied to the DSO goal.
- Step 4: the webhook is a sequential dependency, so webhook then dunning is the critical path.

**Answer**

**RICE ranking** `[From user/roadmap data]` `[Roadmap framework]`

| Rank | Item | Reach | Impact | Confidence | Effort (pw) | RICE |
|---|---|---|---|---|---|---|
| 1 | Bulk invoice export | 1,200 | 1 | 80% | 4 | 240.0 |
| 2 | Dark mode | 2,000 | 0.25 | 100% | 3 | 166.7 |
| 3 | Dunning automation | 800 | 2 | 80% | 8 | 160.0 |
| 4 | XRechnung e-invoicing | 600 | 2 | 100% | 9 | 133.3 |
| 5 | DATEV connector | 450 | 3 | 50% | 10 | 67.5 |

**Q1 2027 scope (MoSCoW, 24 person-weeks)**

| Bucket | Item | Effort | Running total | Why |
|---|---|---|---|---|
| Must | XRechnung e-invoicing | 9 | 9 | Legal requirement from 1 Jan 2027 `[From user/roadmap data]` |
| Should | Dunning automation | 8 | 17 | Directly targets DSO; kept ahead of dark mode despite a slightly lower score `[AI suggestion — verify]` |
| Should | Bulk invoice export | 4 | 21 | Top RICE score |
| Could | Dark mode | 3 | 24 | Fits only if nothing slips; first cut |
| Won't (Q1) | DATEV connector | 10 | n/a | Low confidence (50%); re-score after customer interviews |

The plan uses 21 of 24 person-weeks before the Could item; with dark mode it is at 100%, so there is no buffer.

**Dependency map**

```
DEPENDENCY MAP:
  Initiative:          Dunning automation
  Depends on:          Payment-status webhook (Payments team)
  Dependency type:     Sequential
  Status:              In progress
  Owner:               Jonas Feld
  Expected resolution: 20 Jan 2027
```

Critical path: webhook (to 20 Jan) → dunning automation (8 person-weeks). If the webhook slips past mid-February,
dunning moves to Q2 and dark mode takes its slot.

**Executive view**

```
ROADMAP SUMMARY — Q1 2027
Strategic priorities:       Lower days sales outstanding; meet e-invoicing obligations
Key deliverables:           XRechnung receiving (compliance); dunning automation (fewer overdue invoices);
                            bulk invoice export (finance team workload)
Resource allocation:        Compliance 38% (9 pw), DSO 33% (8 pw), efficiency 17% (4 pw), Could item 12% (3 pw)
Key risks:                  Webhook from Payments team (due 20 Jan); no capacity buffer
Changes since last review:  DATEV connector deferred to Q2 pending validation
```

## Example 2: A key customer demands a feature in a full quarter (German)

**Request**

> Hanseatic Freight (unser größter Kunde) verlangt SSO mit Azure AD bis Ende März, sonst prüfen sie den Wechsel.
> Q1 ist voll: Reporting-Modul 10 PW, Mandantenfähigkeit 8 PW, Mobile-Belege 6 PW, Kapazität 24 PW. Kannst du SSO
> einfach selbst mit RICE bewerten und mir ein Kunden-Update mit konkreten Lieferdaten für Hanseatic schreiben?

**How the skill handles it**

- Step 2 triage: contractual urgency is real; size and problem validation are open, so SSO is not ranked yet.
- Ground rules: no self-made RICE inputs; it gives the scoring frame for the team to fill in.
- Step 3: a new item outranking committed work means writing down swap, defer, or add capacity.
- Customer view: ranges instead of dates, no internal names or scores.

**Answer**

**SSO-Bewertung:** Reach, Impact, Confidence und Aufwand schätze ich nicht selbst; die Zahlen müssen aus Ihren
Daten kommen. Bitte füllen Sie mit dem Team aus `[Roadmap framework]`:

| Faktor | Woher |
|---|---|
| Reach | Accounts pro Quartal mit SSO-Bedarf (Vertrieb, Support-Tickets) |
| Impact | Skala 0,25 / 0,5 / 1 / 2 / 3 auf das Ziel „Kundenbindung“ |
| Confidence | 100 % mit Daten, 80 % begründete Schätzung, 50 % Bauchgefühl |
| Aufwand | Personenwochen inkl. Konzept, QA, Rollout |

**Triage** `[From user/roadmap data]`: Problem bei Hanseatic belegt, für weitere Kunden offen; Termin Ende März
(vertragliche Dringlichkeit); Größe offen. Q1 ist mit 24 von 24 PW voll.

**Abwägung, falls SSO in Q1 muss** `[AI suggestion — verify]`

| Option | Folge |
|---|---|
| Tausch: Mobile-Belege (6 PW) nach Q2 | Passt nur, wenn SSO höchstens 6 PW braucht |
| Teilumfang: SSO nur für Azure AD, weitere Anbieter später | Kleinerer Aufwand, deckt Hanseatic ab |
| Kapazität erhöhen | Nur realistisch, wenn erfahrene Leute verfügbar sind |

Die Entscheidung und die betroffenen Stakeholder (Owner Mobile-Belege) bitte festhalten, bevor Sie Hanseatic zusagen.

**Kunden-Update** (für Hanseatic, ohne Lieferdaten; die nennen Sie erst nach der Teamentscheidung)

```
PRODUCT UPDATE — Q1 2027
Coming soon:       Einfachere Abrechnung über mehrere Gesellschaften hinweg und ein neues Reporting,
                   das Ihre Kennzahlen auf einen Blick zeigt
On our radar:      Anmeldung mit Ihrem bestehenden Firmenkonto, damit Ihre Mitarbeitenden kein
                   eigenes Passwort mehr brauchen; Zeitpunkt voraussichtlich im ersten Halbjahr
Recently shipped:  [bitte aus Ihren Release Notes ergänzen]
```

Ein konkretes Datum steht bewusst nicht drin: Kundenkommunikation nennt Zeiträume, und solange SSO weder
geschätzt noch eingeplant ist, wäre ein Datum eine Zusage, die das Team nicht gegeben hat.
