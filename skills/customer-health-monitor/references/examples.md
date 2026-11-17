# Customer Health Monitor: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Scorecard for an account with slipping usage

**Request**

> Health check on Almland Foods, please (ARR EUR 96,000, renewal 31 Mar 2027, CSM Daniel Kraus). Pendo: 52 weekly
> active users of 120 licenses, down from 78 three months ago. Zendesk, last 90 days: 14 tickets (prior 90: 12),
> average resolution 2.1 days, CSAT 4.1/5, steady. CRM: champion Sabine Ott (Head of Operations) answers fast, monthly
> calls held; the executive sponsor hasn't joined since kickoff. Contract flat, invoices on time, renewal not yet
> discussed. NPS October: Sabine gave 6, "reports are too slow". Success plan: cut order-entry time by 30%; 18%
> measured so far.

**How the skill handles it**

- Phase 2 scores against the anchors: usage down 33% is a falling trend but not the >50% drop of a 1, so
  Engagement 2; the NPS detractor with a complaint gives Sentiment 2; the rest are 3.
- Phase 3: composite 2.65 is ORANGE; no override applies (no 1, and Relationship is 3).
- Phases 4–5 diagnose every dimension at 3 or lower and give ORANGE risks one-week deadlines, YELLOW ones two weeks.

**Answer**

```
CUSTOMER HEALTH SCORECARD
Account: Almland Foods
Assessment date: 17 Nov 2026
Assessed by: Daniel Kraus
Data sources: Pendo, Zendesk, CRM, October NPS survey, success plan (manual input)

OVERALL HEALTH: ORANGE — Composite: 2.65 / 5.0

DIMENSION SCORES:
  Product Engagement:  2 ▼ ORANGE   (High confidence)
  Support:             3 — YELLOW   (High confidence)
  Relationship:        3 — YELLOW   (Medium confidence)
  Commercial:          3 — YELLOW   (High confidence)
  Sentiment:           2 ▼ ORANGE   (Low confidence: one respondent)
  Outcomes:            3 — YELLOW   (Medium confidence)

  [▲ improving | ▼ declining | — stable]

KEY RISKS:
  1. Weekly active users fell from 78 to 52 (−33%), 43% of 120 licenses — Product Engagement — declining — High
     → Action: usage review with Sabine Ott to find which teams stopped logging in
     → Owner: Daniel Kraus (CSM)
     → Deadline: 24 Nov 2026
     → Success indicator: weekly active users back above 70 by end of January

  2. Champion is an NPS detractor over slow reports — Sentiment — declining — Low
     → Action: bring a report-performance specialist to the usage review; agree a fix date
     → Owner: Daniel Kraus with Support lead
     → Deadline: 24 Nov 2026
     → Success indicator: Sabine confirms report times are acceptable

  3. No executive sponsor contact since kickoff, renewal in 4.5 months — Relationship, Commercial — flat — Medium
     → Action: value summary (18% faster order entry) sent to the sponsor with a QBR invitation
     → Owner: CSM manager
     → Deadline: 1 Dec 2026
     → Success indicator: sponsor attends a QBR before 31 Jan 2027

  4. Order-entry goal at 18% of a 30% target — Outcomes — flat — Medium
     → Action: agree the remaining steps in the success plan at the QBR
     → Owner: Daniel Kraus (CSM)
     → Deadline: 1 Dec 2026
     → Success indicator: dated plan to reach 30%

EXPANSION SIGNALS:
  - None identified.

DATA GAPS:
  - Sentiment rests on a single NPS response.

NEXT REVIEW DATE: 15 Dec 2026
```

Composite [From scoring framework]: 0.25 × 2 + 0.15 × 3 + 0.20 × 3 + 0.15 × 3 + 0.10 × 2 + 0.15 × 3 = 2.65.
Hypothesis for the usage drop: slow reports push users back to spreadsheets [CSM hypothesis]; confirm in the review.
Support tickets rose slightly (12 to 14) at steady CSAT [From account data].

Validate scores with the account team before acting on risk classifications. I can also produce this as an XLSX
scorecard.

## Example 2: Thin data and a request for a churn percentage (German)

**Request**

> Wie hoch ist die Kündigungswahrscheinlichkeit bei Bergmann Logistik in Prozent? Daten: Logins in den letzten
> 90 Tagen 58 % unter dem Vorquartal. Unser Champion Herr Wiese hat im September gekündigt, einen Nachfolger kennen
> wir nicht, kein Kontakt zur Geschäftsführung. Vertrag unverändert, Zahlungen pünktlich, Verlängerung in 10 Wochen.
> Mehr habe ich gerade nicht.

**How the skill handles it**

- Ground rules: gives no churn percentage; a health score expresses risk level, not probability.
- Support, Sentiment and Outcomes are NO DATA and left out of the composite; with three gaps the score is
  unreliable. Engagement 1 and Relationship 1 trigger the automatic RED override, which is stricter than the
  ORANGE rule for missing data.
- RED dimensions get 48-hour actions. Answers in German.

**Answer**

Eine Kündigungswahrscheinlichkeit in Prozent kann ich nicht seriös angeben: Der Health Score beschreibt eine
Risikostufe, keine statistische Wahrscheinlichkeit. Die Stufe ist hier eindeutig:

```
CUSTOMER HEALTH SCORECARD
Account: Bergmann Logistik
Assessment date: 17.11.2026
Assessed by: [CSM]
Data sources: Login-Daten, CRM (manuelle Angaben)

OVERALL HEALTH: RED — Composite: 1,5 / 5,0 (nur 3 von 6 Dimensionen, nicht belastbar)

DIMENSION SCORES:
  Product Engagement:  1 ▼ RED      (Hohe Sicherheit)
  Support:             NO DATA
  Relationship:        1 ▼ RED      (Hohe Sicherheit)
  Commercial:          3 — YELLOW   (Hohe Sicherheit)
  Sentiment:           NO DATA
  Outcomes:            NO DATA

KEY RISKS:
  1. Logins 58 % unter Vorquartal — Product Engagement — fallend — Hoch
     → Action: Nutzungsanalyse nach Standorten und Teams
     → Owner: CSM
     → Deadline: 19.11.2026
  2. Champion ausgeschieden, kein Nachfolger, keine Geschäftsführung im Kontakt — Relationship — fallend — Hoch
     → Action: Anruf von CSM und Teamleitung bei der Geschäftsführung; Eskalationsnotiz an die Vertriebsleitung
     → Owner: CSM-Teamleitung
     → Deadline: 19.11.2026

EXPANSION SIGNALS:
  - Keine.

DATA GAPS:
  - Support, Sentiment, Outcomes: bitte Ticketdaten, letzte NPS-Werte und Success-Plan nachliefern.

NEXT REVIEW DATE: 01.12.2026
```

RED gilt per Regel: Engagement und Relationship liegen beide bei 1 oder 2 [Aus dem Bewertungsmodell]. Der
Composite (0,25 × 1 + 0,20 × 1 + 0,15 × 3) ÷ 0,60 = 1,5 stützt das, ist aber wegen drei fehlender Dimensionen
nicht belastbar. Erfolgsindikator für beide Maßnahmen: ein benannter neuer Ansprechpartner und ein Termin vor der
Verlängerung in 10 Wochen.

Validieren Sie die Bewertung mit dem Account-Team, bevor Sie auf Basis der Risikoeinstufung handeln.
