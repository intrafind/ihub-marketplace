# Structured Interview Designer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Interview loop and one scorecard for a senior role

**Request**

> We're hiring a Senior Data Engineer (level IC4) at a 400-person logistics software company. Competencies from the
> role spec: data pipeline design, SQL and data modelling, stakeholder communication, ownership of production
> incidents, mentoring juniors. Interviewers available: Petra (hiring manager), Ömer (staff data engineer),
> Lisa (analytics lead, our main internal customer). Please give me the loop and the scorecard for stakeholder
> communication.

**How the skill handles it**

- Phase 1: each competency gets the method that fits it; stakeholder communication is double-covered on purpose
  (behavioral and case) because it is the role's main gap in the current team. No competency appears in 3+ stages.
- Phase 2: three interviewers, each rating only what they can judge (Lisa does not rate SQL).
- Phase 4: anchors written for levels 1, 3, 5 first, then 2 and 4; probing areas come from the role spec, not a
  question bank. Every block is source-labelled.

**Answer**

**Competency × stage matrix** `[From role requirements]`

| Competency | 1 Screen (Petra) | 2 Technical (Ömer) | 3 Behavioral (Petra) | 4 Case (Lisa, Ömer) |
|---|---|---|---|---|
| Data pipeline design | | ✓ | | ✓ |
| SQL and data modelling | | ✓ | | |
| Stakeholder communication | | | ✓ | ✓ (deliberate overlap) |
| Ownership of production incidents | | | ✓ | |
| Mentoring juniors | | | ✓ | |
| Role fit, logistics | ✓ | | | |

Order follows the framework: screen, technical, behavioral, case last because it is the most demanding.
Panel of three; nobody shares notes before the debrief. `[Framework template]`

**Scorecard: Stakeholder communication** `[AI-generated suggestion — verify]`

Competency: Stakeholder communication -- Target job level: IC4 (Senior)

| Level | Anchor |
|---|---|
| 1 Does Not Meet | Gives no example of working with non-engineers, or describes stakeholders only as sources of tickets. |
| 2 Partially Meets | Has an example of explaining a data issue to a business user, but cannot say what the stakeholder did with it or how they checked understanding. |
| 3 Meets Expectations | Describes a specific case of turning a vague business request into data requirements, agreeing scope and trade-offs (for example freshness vs. cost) with the stakeholder, and the outcome. |
| 4 Exceeds Expectations | Several examples; proactively surfaced a data-quality risk to a business owner before it hit a report, and changed how requests are taken in. |
| 5 Exceptional | Set up a recurring practice (for example data contracts or a request intake with analytics) that other teams adopted. |

Suggested probing areas `[From role requirements]`
- A request from analytics that turned out to mean something different from what was asked
- A time a pipeline delay or data error affected a business report: who was told, when, how
- A trade-off negotiated with a non-technical owner

Evidence capture: what the candidate said and did, quoted where possible; no impressions.
Score: one number 1–5 per interviewer, using the anchors.
Overall recommendation: hire / no hire with written rationale, kept separate from the score.

**Judging answers (STAR+)** `[Framework template]`: listen for one datable event, the candidate's own part
("I proposed…" rather than "we decided…"), a measurable outcome, credit proportional to a senior IC role, and
what they would do differently.

**Debrief:** scorecards submitted before the meeting, scores revealed together, 2+ level gaps discussed on
evidence, Petra decides and documents whether she follows or overrides the weighted score.

## Example 2: German request to rank finalists, with a protected characteristic

**Request**

> Hier die Scorecards unserer drei Finalistinnen für die Teamleitung Kundenservice (Skala 1–5, je zwei
> Interviewer): Frau Albers: Führung 4/4, Konfliktlösung 3/5, Prozessverbesserung 3/3. Frau Demir: Führung 3/3,
> Konfliktlösung 4/4, Prozessverbesserung 4/2. Frau Kühn: Führung 5/4, Konfliktlösung 3/3, Prozessverbesserung 3/3.
> Sag mir, wen ich nehmen soll. Frau Kühn ist übrigens 58 – passt das zu unserem jungen Team?

**How the skill handles it**

- Ground rule: no rankings or hire recommendations. The skill says so plainly and gives the hiring manager the
  debrief structure instead.
- Phase 6, step 3: it can flag gaps of 2+ levels between interviewers, since that is a process step, not an
  assessment: Albers on conflict resolution (3/5) and Demir on process improvement (4/2).
- Age is a protected characteristic under the AGG: the skill calls it out with the prescribed counsel sentence (in German) and advises
  keeping it out of the decision.

**Answer**

Eine Empfehlung, wen Sie einstellen sollten, gebe ich nicht: Die Bewertung von Kandidatinnen und die Entscheidung
liegen bei Ihnen und Ihren Interviewern. Ich kann aber dafür sorgen, dass die Entscheidung sauber vorbereitet ist.

**Zum Alter:** Das Alter darf in die Auswahl nicht einfließen, auch nicht als „Passung zum Team“. Lassen Sie das
Vorgehen von Arbeitsrechtlern in Deutschland prüfen, um die Einhaltung der Antidiskriminierungsvorgaben (AGG) zu bestätigen.
Halten Sie die Frage aus Debrief und Dokumentation heraus. `[Framework template]`

**Abweichungen von zwei oder mehr Stufen (Diskussionspunkte)** `[Framework template]`

| Kandidatin | Kompetenz | Interviewer 1 | Interviewer 2 |
|---|---|---|---|
| Frau Albers | Konfliktlösung | 3 | 5 |
| Frau Demir | Prozessverbesserung | 4 | 2 |

**Ablauf des Debriefs** `[Framework template]`
1. Alle Scorecards liegen vor dem Termin vor (ist erfüllt).
2. Für die zwei Abweichungen legen beide Interviewer ihre konkreten Belege offen: Zitate, beschriebenes Verhalten.
3. Scores dürfen sich nur aufgrund von Belegen ändern, nicht aufgrund der Meinung anderer.
4. Danach werden die Scores mit der beim Scorecard-Design vereinbarten Gewichtung zusammengeführt. Gibt es keine
   vereinbarte Gewichtung, legen Sie sie vor dem Debrief fest, nicht nach Blick auf die Ergebnisse.
5. Sie entscheiden und dokumentieren, ob Sie dem gewichteten Ergebnis folgen oder davon abweichen, und warum.

Wenn Sie mir nach dem Debrief die kalibrierten Scores und die Gewichte geben, baue ich die Vergleichsmatrix als
eine Grundlage für Ihre Entscheidung, gekennzeichnet als `[AI-generated suggestion — verify]`.
