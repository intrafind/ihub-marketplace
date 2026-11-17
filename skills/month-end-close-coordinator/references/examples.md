# Month-End Close Coordinator: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Mid-close status with a blocked reconciliation

**Request**

> October close status, please. Today is Wed 4 Nov; hard close Wed 11 Nov, report due Thu 12 Nov. I'm close
> lead (Anna Roth). Phase 1 and depreciation/prepaids (Mehmet, due 2 Nov) and accruals (me,
> due 3 Nov) are done. Bank recs DE+PL (Kasia Nowak, reviewer Lukas Berg, due 3 Nov) are blocked: the Polish bank
> changed its statement export and we have no October file. Intercompany eliminations (Mehmet, due today) in
> progress. Then: BS recs (Jonas, 5 Nov), IC balance rec (Kasia, 5 Nov), flux (me, 6 Nov), controller review
> (Lukas, 9 Nov), CFO sign-off (Sabine Kraus, 10 Nov), statements and commentary (me, 11 Nov), distribution
> (Lukas, 12 Nov).

**How the skill handles it**

- Part A: every task gets a calendar date and explicit predecessors.
- Step 4: C-006 is a bottleneck three times over: overdue, blocking, on the critical path.
- Step 5: it is one day overdue, so the escalation step is "+1": the close lead contacts owner and reviewer and works out a workaround.

**Answer**

> Not professional advice. Review by qualified finance staff before relying on it.

# October 2026 — Close Tracker
- Running the close: Anna Roth
- Period ends: 31 Oct 2026
- Books final by (hard close): 11 Nov 2026

## Where each phase stands
| Close phase | Tasks in phase | Not Started | In Progress | Blocked | Complete |
|---|---|---|---|---|---|
| Phase 1 · Pre-Close | 3 | 0 | 0 | 0 | 3 |
| Phase 2 · Transaction Processing | 4 | 0 | 1 | 1 | 2 |
| Phase 3 · Reconciliation and Review | 3 | 3 | 0 | 0 | 0 |
| Phase 4 · Management Review and Adjustments | 2 | 2 | 0 | 0 | 0 |
| Phase 5 · Reporting and Distribution | 2 | 2 | 0 | 0 | 0 |

## What is holding the close up
| Stuck task | Accountable person | Days overdue | Dependent tasks now at risk | Escalation step reached |
|---|---|---|---|---|
| C-006 Bank reconciliations DE + PL | Kasia Nowak | 1 | C-008, C-009, then C-010 to C-014 | +1 |

## Every task, line by line
| Ref | What the task is | Ph. | Accountable | Waits on | Due | Current status | Actually finished |
|---|---|---|---|---|---|---|---|
| C-001 | AP cutoff | 1 | Anna Roth | none | 30 Oct | Complete | 30 Oct |
| C-002 | AR cutoff | 1 | Jonas Weil | none | 30 Oct | Complete | 30 Oct |
| C-003 | Sub-ledger to GL check | 1 | Anna Roth | C-001, C-002 | 30 Oct | Complete | 30 Oct |
| C-004 | Depreciation and prepaid amortization | 2 | Mehmet Aydin | C-003 | 2 Nov | Complete | 2 Nov |
| C-005 | Payroll, revenue and expense accruals | 2 | Anna Roth | C-003 | 3 Nov | Complete | 3 Nov |
| C-006 | Bank reconciliations DE + PL | 2 | Kasia Nowak | C-003 | 3 Nov | Blocked | |
| C-007 | Intercompany eliminations | 2 | Mehmet Aydin | C-005 | 4 Nov | In Progress | |
| C-008 | Balance sheet reconciliations | 3 | Jonas Weil | C-006, C-007 | 5 Nov | Not Started | |
| C-009 | Intercompany balance reconciliation | 3 | Kasia Nowak | C-006, C-007 | 5 Nov | Not Started | |
| C-010 | Flux analysis | 3 | Anna Roth | C-008 | 6 Nov | Not Started | |
| C-011 | Controller review | 4 | Lukas Berg | C-009, C-010 | 9 Nov | Not Started | |
| C-012 | CFO sign-off | 4 | Sabine Kraus | C-011 | 10 Nov | Not Started | |
| C-013 | Statements and variance commentary | 5 | Anna Roth | C-012 | 11 Nov | Not Started | |
| C-014 | Distribute management report | 5 | Lukas Berg | C-013 | 12 Nov | Not Started | |

**Bottleneck: C-006**

- Stuck: no October statement file, as the Polish bank changed its export.
- Blocks C-008 and C-009, and through them the critical path to C-014.
- If the file arrives on 5 Nov, C-006, C-008 and C-009 finish a business day late and C-010 to C-014 each slip one business day: distribution moves from 12 to 13 Nov. Every further day adds one more.

**Escalation record (+1 day)**

- Blocked task and owner: C-006, Kasia Nowak; reviewer Lukas Berg.
- Root cause: missing data (new bank export format).
- Effect: 1 business day at risk if solved by 5 Nov.
- Proposed fix: Kasia reconciles PL manually from the PDF statement in online banking; treasury gets the file in the new format. Owner: Kasia Nowak.
- Revised target date: 5 Nov.

If C-006 is still open tomorrow, step +2 takes it to the controller and CFO with this impact assessment. C-007 is due today.

## Example 2: Retrospective in German with a short history

**Request**

> Mach bitte die Retrospektive für den September-Abschluss. Ziel war T+7, geschafft haben wir T+9. Juli war T+7,
> August T+8. Verspätet: Intercompany-Abstimmung (Spanien hat Rechnungen zu spät gebucht, wie im August) und
> Rückstellungen Vertrieb (CRM-Provisionsdaten zwei Tage zu spät). 46 Korrekturbuchungen, sonst
> meist um die 30. 7 offene Abstimmungsposten über 18.400 EUR ins Oktober vorgetragen.

**How the skill handles it**

- Part C: covers all five points in order, using only the user's figures.
- Point 1 wants 3–6 periods; only three are given, so the gap is named.
- The Spain issue recurred, so it gets its own improvement with a date; owners are left to the user.
- German request, German answer.

**Answer**

> Keine Fachberatung. Bitte vor Verwendung von qualifizierten Finanzfachleuten prüfen lassen.

**Retrospektive Monatsabschluss September 2026**

**1. Zeitplan**
Ziel T+7, erreicht T+9: zwei Arbeitstage zu spät. Verlauf: Juli T+7, August T+8, September T+9. Der Abschluss wird seit drei Perioden jeden Monat einen Tag langsamer. Für einen Trend über 3–6 Perioden fehlen April bis Juni; bitte nachreichen, falls vorhanden.

**2. Engpässe**

| Aufgabe | Ursache | Wiederholung |
|---|---|---|
| Intercompany-Abstimmung | Gesellschaft Spanien bucht Rechnungen zu spät | 2 von 3 Monaten (August, September) |
| Rückstellungen Vertrieb | CRM-Provisionsdaten zwei Tage zu spät | 1 von 3 Monaten |

**3. Korrekturbuchungen**
46 Buchungen gegenüber üblicherweise rund 30, also etwa die Hälfte mehr. Das deutet auf Probleme vor dem Abschluss hin, vermutlich die späten Daten aus Spanien und dem CRM; eine Aufstellung nach Ursache würde das klären.

**4. Offene Abstimmungsposten**
7 Posten über 18.400 EUR in den Oktober vorgetragen. Bitte im Oktober-Tracker als eigene Aufgaben führen.

**5. Verbesserungen für den nächsten Abschluss**

| Maßnahme | Verantwortlich | Bis |
|---|---|---|
| Buchungsschluss für IC-Rechnungen Spanien auf T+1 festlegen, mit Erinnerung an T−2 | [Input required: Abschlussverantwortliche/r] | vor Oktober-Abschluss |
| CRM-Provisionsexport als festen Termin T+1 einplanen, Verantwortliche im Vertrieb benennen | [Input required] | vor Oktober-Abschluss |
| Korrekturbuchungen im Oktober nach Ursache kategorisieren | [Input required] | Oktober-Retrospektive |

Ich greife sie in der nächsten Retrospektive auf; Verantwortliche bitte benennen.
