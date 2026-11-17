# Product Research Synthesizer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Seven planner interviews into an executive summary

**Request**

> Synthesize our interviews with service planners (customers of our maintenance-scheduling tool) and give me a
> one-page summary for leadership. Small customers (under 20 technicians): P1, P2, P5, P7. Large: P3, P4, P6.
> P1: "I plan the week in Excel and then type it into the tool." P2: "Drag and drop is too slow when I reschedule 30
> jobs after a sick call." P3: "When a technician calls in sick I redo the whole day by hand." P4: "We built a macro
> to reassign jobs in bulk." P5: "The mobile app is great, technicians love it." P6: "Rescheduling is fine for us,
> we only move a few jobs a day." P7: "I export to Excel to see who's overloaded." Analytics: 38% of 410 active
> planner accounts use the Excel export weekly.

**How the skill handles it**

- Phase 1: 7 interviews in two segments plus one analytics figure; only planners were interviewed, which limits
  every finding.
- Phases 2–3: codes grouped into themes; the rescheduling theme has 3 participants across both segments, so
  Moderate; P6 is shown as counter-evidence. The Excel theme has 2 participants (Emerging); the 38% shows scale, not
  the reason.
- Phase 4: only the Moderate theme becomes a backlog opportunity; emerging themes go to further research.
- Phase 5: executive-summary format, as asked; the inventory and codebook are given first so the summary can be
  traced.

**Answer**

**Evidence inventory** `[Study data]`

| Kind of source | How many | Collected via | Who took part | When |
|---|---|---|---|---|
| Interviews | 7 | 1:1 | Planners: 4 small, 3 large customers | not stated |
| Product analytics | 410 accounts | Export usage | Active planner accounts | not stated |

Known limits: only planners, no technicians or managers; no new or churned customers.

**Codebook** `[Study data]`

| Code label | Meaning | Typical quote | Participants (n) |
|---|---|---|---|
| reschedule-by-hand | Redoing plans manually after absences | "I redo the whole day by hand" (P3) | 3 (P2, P3, P4) |
| bulk-workaround | Self-built tools to move many jobs | "We built a macro" (P4) | 1 (P4) |
| excel-as-overview | Excel used to see the plan or workload | "to see who's overloaded" (P7) | 2 (P1, P7) |
| mobile-praised | Positive view of the technician app | "technicians love it" (P5) | 1 (P5) |
| reschedule-fine | No rescheduling problem | "Rescheduling is fine for us" (P6) | 1 (P6) |

```
THEME: Planners give up on the tool on disrupted days, because moving many jobs at once costs more than
       re-planning by hand
  Evidence level:   Moderate (3 participants, both segments)
  Built from codes: reschedule-by-hand, bulk-workaround
  Backing:
    - P2 said "Drag and drop is too slow when I reschedule 30 jobs after a sick call"; context: absences
    - P3 said "I redo the whole day by hand"; context: absences
    - P4 built a macro to reassign jobs in bulk
  Contradicting observations: P6 (large) moves only a few jobs a day and sees no problem
  Where it shows up: small and large customers
  Connections:      may drive excel-as-overview
```
`[My interpretation, researcher to confirm]`

**Bulk rescheduling research in brief, 17 November 2026**

Headline: When technicians are absent, planners leave the tool and re-plan by hand, because moving many jobs at
once is too slow.
Based on: 7 planner interviews · 1:1 interviews plus export analytics · small and large customers

Three insights that matter most:

| # | Insight | Backing data point | Confidence |
|---|---|---|---|
| 1 | Re-planning after absences happens outside the tool | 3 of 7 planners, one with a self-built macro; 1 planner disagrees | M |
| 2 | Excel may serve as the workload overview, not only as an export | 2 of 7 planners; 38% of 410 accounts export weekly | L |
| 3 | Technicians value the mobile app | 1 of 7 planners | L |

Actions we recommend:

| # | Action | Owner | Priority |
|---|---|---|---|
| 1 | Explore bulk reassignment of jobs for absence days | Product manager scheduling | High |
| 2 | Ask 5–8 weekly exporters what they do in Excel after exporting | Research | Medium |

Caveats: 7 planners only, no technicians or managers; insights 2 and 3 are hypotheses, not findings.

## Example 2: Asked to prove demand with too little evidence (German request)

**Request**

> Ich brauche für den Vorstand die Aussage, dass unsere Kunden statistisch signifikant eine KI-Tourenplanung wollen.
> Wir haben 4 Interviews: B1: „Automatische Vorschläge für die Touren wären toll." B2: „Wichtiger wäre, dass die
> Termine endlich mit Outlook synchron sind." B3: „Bei KI bin ich skeptisch, ich will die Kontrolle behalten." B4
> hat das Thema nicht erwähnt.

**How the skill handles it**

- Ground rules: no "statistically significant" for 4 interviews; qualitative data yields evidence levels.
- Phase 3: one participant supports the theme, so Emerging; B3 is counter-evidence and must be shown.
- Phase 4: an emerging theme goes on the research list, not into a board claim; the skill offers what it can say.

**Answer**

Die Aussage „statistisch signifikant" kann ich mit diesen Daten nicht treffen: Vier Interviews ergeben Muster mit
einer Belegstärke, keine statistische Signifikanz. Dafür bräuchte es eine quantitative Erhebung. `[Method scaffolding]`

Was die Interviews tatsächlich zeigen:

```
THEME: Ein Teil der Kunden wünscht sich Tourenvorschläge, will aber die Entscheidung selbst behalten
  Evidence level:   Emerging (1 Teilnehmer dafür)
  Backing:
    - B1 sagte „Automatische Vorschläge für die Touren wären toll"
  Contradicting observations:
    - B3 sagte „Bei KI bin ich skeptisch, ich will die Kontrolle behalten"
    - B2 nennt die Outlook-Synchronisierung als wichtiger
    - B4 erwähnt das Thema nicht
```
`[Study data]` `[My interpretation, researcher to confirm]`

Für den Vorstand ehrlich formuliert: „In 4 Interviews äußert sich 1 Kunde positiv zu KI-Tourenvorschlägen, 1 ist
skeptisch; ein anderes Thema (Outlook-Synchronisierung) wird als wichtiger genannt. Der Bedarf ist eine Hypothese,
die wir prüfen."

Nächste Schritte, um eine belastbare Aussage zu bekommen:
1. Kurze Umfrage unter Bestandskunden mit einer klaren Frage zu Tourenvorschlägen und zur Outlook-Synchronisierung
2. 5–6 weitere Interviews, gezielt zu Vertrauen und Kontrolle bei automatischen Vorschlägen
