# Cross-Team Status Report: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Weekly steering committee report

**Request**

> Steering committee report for the ERP migration, week of 9–13 Nov 2026. Last week: Data Green, Finance Green,
> Warehouse Amber.
> Data (Anja Weber): mock load 2 done, 11,656 of 12,400 material records passed validation; cleansing the rest;
> mock load 3 on 4 Dec on plan.
> Finance (Karim Osei): chart-of-accounts mapping complete; integration test due 27 Nov needs the bank interface spec
> from Treasury IT, requested 28 Oct, still missing. Karim thinks it will come "next week".
> Warehouse (Lisa Brandt): delayed scanners arrived 11 Nov, 30 of 45 configured; user training needs mock load 3 data.
> Open action from last week: Lisa to confirm training rooms (done).

**How the skill handles it**

- Step 2: Data is Green on evidence. Finance has an unresolved blocker open 16 days, so it cannot stay Green even
  though Karim expects a fix; Amber, deteriorating, because the 27 Nov milestone is at risk.
- Warehouse was Amber and is still Amber but mitigation moved (scanners arrived), so Amber improving, not escalated.
- Step 3 logs the two cross-team dependencies explicitly. Step 4: steering committee, so every workstream with
  trend and a decision request.

**Answer**

# Status Report — ERP Migration
# Reporting window: 9–13 Nov 2026
# Program RAG: 🟡 →

## The short version
- Overall: on plan for mock load 3 on 4 Dec; the Finance integration test on 27 Nov is at risk.
- Key achievement: 94% of material records (11,656 of 12,400) passed validation in mock load 2.
- Top risk: the bank interface spec from Treasury IT, open for 16 days, blocks the Finance integration test.
- Decision needed: escalation to Treasury IT or a new test date, from the steering committee, by 20 Nov.

## RAG by workstream

| Workstream | Owner | Status | Trend | Key update |
|---|---|---|---|---|
| Data Migration | Anja Weber | 🟢 | → | Mock load 2 done; 744 records in cleansing |
| Finance | Karim Osei | 🟡 | ↓ | Mapping done; integration test blocked by missing spec |
| Warehouse | Lisa Brandt | 🟡 | ↑ | Scanners delivered; 30 of 45 configured |

## Per-workstream notes
**Data Migration** [From project data]: Accomplished: mock load 2, 11,656 of 12,400 records valid. In progress:
cleansing 744 failed records. Planned: mock load 3 on 4 Dec. Blockers: none.

**Finance** [From project data]: Accomplished: chart-of-accounts mapping. In progress: integration test
preparation. Planned: integration test on 27 Nov. Blocker: bank interface spec from Treasury IT, open since 28 Oct
(16 days). Rated Amber, not Green: the blocker is unresolved and has no confirmed date.

**Warehouse** [From project data]: Accomplished: delayed scanners delivered on 11 Nov, training rooms confirmed. In
progress: configuring the remaining 15 scanners. Planned: user training after mock load 3. Blockers: none open.

## Risk and dependency log

| # | Type | Description | Affects | Owner | Status | Due |
|---|---|---|---|---|---|---|
| 1 | Blocker | Bank interface spec from Treasury IT missing | Finance | Karim Osei | Open | 20 Nov |
| 2 | Dependency | Warehouse training needs mock load 3 data | Warehouse, Data | Anja Weber | Open | 4 Dec |

## Decisions we need from you
**Bank interface spec.** Context: without it the integration test cannot start; it is due 27 Nov. Options: (a) the
sponsor escalates to the head of Treasury IT this week; (b) move the integration test to 4 Dec, alongside mock
load 3. Recommendation: (a), because (b) compresses the test window before go-live. Deadline: 20 Nov.
[AI-drafted summary — verify with workstream owner]

## Action tracker

| # | Action | Owner | Due | Status |
|---|---|---|---|---|
| 1 | Confirm training rooms | Lisa Brandt | 13 Nov | Done |
| 2 | Obtain bank interface spec | Karim Osei | 20 Nov | Open |
| 3 | Configure remaining 15 scanners | Lisa Brandt | [Data not available — status pending update from owner] | In progress |

## Outlook for Next Period
- Milestones coming up: Finance integration test 27 Nov; mock load 3 on 4 Dec.
- Expected status changes: Finance turns Red if the spec is still missing on 20 Nov; Warehouse can return to Green
  once all scanners are configured.

Ask for DOCX output if you want a formatted file to circulate.

## Example 2: Executive one-pager with a missing update (German)

**Request**

> Bitte einen Einseiter für die Geschäftsführung zum Programm „Neues Kundenportal“, KW 46. Vertrieb (Jana Roth): seit
> drei Wochen Gelb, Migration der Bestandskunden hängt weiter an fehlenden Vertragsdaten, keine neue Maßnahme. IT
> (Felix Arndt): Login und Bestellhistorie fertig, Lasttest am 20.11. geplant. Kundenservice: noch kein Update. Bitte
> alles Grün melden, die GF will keine Unruhe vor dem Jahresgespräch.

**How the skill handles it**

- Rates on evidence only: the request to report everything Green is declined, politely and with the reason.
- Vertrieb has been Amber for three weeks with no progress on mitigation: stuck Amber gets escalated.
- Kundenservice sent no update, so no rating is invented. Executive audience: one page, top line first, a decision.
  Answers in German.

**Answer**

Eine durchgehend grüne Meldung kann ich nicht verantworten: Der Vertrieb hat einen offenen Blocker, und für den
Kundenservice liegt kein Update vor. Der Einseiter benennt beides sachlich und mit einer klaren Bitte an die
Geschäftsführung:

# Statusbericht — Neues Kundenportal
# Berichtszeitraum: KW 46
# Programmstatus: 🟡 ↓

## Das Wichtigste in Kürze
- Gesamt: Die Technik liegt im Plan; die Übernahme der Bestandskunden stockt seit drei Wochen.
- Wichtigster Fortschritt: Anmeldung und Bestellhistorie im Portal sind fertig.
- Größtes Risiko: Ohne vollständige Vertragsdaten können Bestandskunden das Portal nicht nutzen.
- Entscheidung nötig: Wer liefert die Vertragsdaten, und bis wann? Von der Geschäftsführung, bis Ende KW 47.

## Status nach Bereich

| Bereich | Verantwortlich | Status | Trend | Kurzinfo |
|---|---|---|---|---|
| Vertrieb | Jana Roth | 🟡 | → | Seit 3 Wochen Gelb, Blocker ohne neue Maßnahme: Eskalation |
| IT | Felix Arndt | 🟢 | → | Anmeldung und Bestellhistorie fertig; Lasttest am 20.11. |
| Kundenservice | — | [Keine Daten — Status ausstehend, Update der Verantwortlichen nötig] | — | — |

[Aus Projektdaten]

## Entscheidungen, die wir von Ihnen brauchen
Klärung der Vertragsdaten: Benennen Sie eine verantwortliche Person, die die fehlenden Daten bis Ende KW 47
bereitstellt. Ohne diese Entscheidung wird der Bereich Vertrieb in KW 47 Rot.
[KI-Entwurf — mit Bereichsverantwortlichen prüfen]
