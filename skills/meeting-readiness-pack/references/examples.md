# Meeting Readiness Pack: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Project review with a go-live decision

**Request**

> Prep me for the ERP phase 2 review, Thursday 19 Nov, 14:00–14:45. Attendees: Petra Lang (CFO, decides), Ahmed
> Yilmaz (IT lead), Clara Brandt (Finance lead), me (Sven Hartmann, PM). Goal: decide whether go-live stays on
> 1 February or moves to 1 March.
>
> Connected sources show: Jira: 12 of 18 interfaces tested, 2 blocked by the bank file format. Confluence notes of
> the 22 Oct review: open items "Clara: sign off chart of accounts mapping", "Ahmed: test plan for cut-over
> weekend". Migration test 2 report (5 Nov): 3.4% of open items failed to migrate; target is below 0.5%.
> Me: budget spent EUR 410k of EUR 560k.

**How the skill handles it**

- Step 1: type, attendees, length and objective are all given, so no questions; it is a project review, so medium prep with a pre-read.
- Step 3: time boxes add up to 38 minutes, within 45 minus the 5-minute buffer; the decision goes first; open items from 22 Oct are carried over.
- Step 4: every figure in the brief cites its source; nothing is added that the sources do not show.
- Ground rules: every block is tagged with its origin.

**Answer**

# ERP Phase 2 Review

| When | Length | Who is coming | Goal: what should be true afterward |
|---|---|---|---|
| Thu 19 Nov, 14:00 | 45 min | Petra Lang, Ahmed Yilmaz, Clara Brandt, Sven Hartmann | Go-live date decided: 1 February or 1 March [Per the user] |

## Running order
| # | Item | Minutes | Notes |
|---|---|---|---|
| 1 | Opening, purpose of the meeting | 3 | Sven frames the decision |
| 2 | Go-live date | 15 | Background: migration error rate 3.4% vs target below 0.5%; 6 interfaces untested · Decision required? Yes: 1 Feb or 1 Mar (Petra) · Pre-read: below |
| 3 | Interface status and bank file format | 8 | Background: 2 interfaces blocked by the bank file format [Via connected tool] · Decision required? No |
| 4 | Budget position | 7 | Background: EUR 410k of 560k spent, EUR 150k left [Per the user] · Decision required? Only if the date moves |
| 5 | Wrap-up: action items and next steps | 5 | Owner and deadline for each action |

## Still open from the previous meeting
| Item | Owner | Status: done / in progress / not started |
|---|---|---|
| Sign off chart of accounts mapping | Clara Brandt | [Input required] |
| Test plan for cut-over weekend | Ahmed Yilmaz | [Input required] |

```
# Pre-read: ERP Phase 2 Review
Written 17 Nov for the meeting on 19 Nov, 14:00

## The short version
  We need to decide whether the ERP go-live stays on 1 February or moves to 1 March.
  Data migration is well above its error target and a third of the interfaces are not yet tested.

## Background
  Phase 2 covers finance and order processing. The second migration test ran on 5 November.
  Interface testing continues; two interfaces wait for a corrected bank file format.

## Numbers and facts
  | Fact or metric | Where it came from |
  |---|---|
  | 3.4% of open items failed to migrate (target below 0.5%) | Migration test 2 report, 5 Nov |
  | 12 of 18 interfaces tested, 2 blocked | Jira |
  | EUR 410k of EUR 560k budget spent | Sven Hartmann |

## Questions to settle in the room
  1. Go-live on 1 February or 1 March?
  2. If 1 February: what error rate must test 3 reach, and by when, to proceed?

## How we got here
  - 22 Oct: last phase review; mapping sign-off and cut-over test plan assigned
  - 5 Nov: migration test 2 completed, 3.4% failure rate

## Points worth raising
  - The cost of a one-month delay is not in the sources [Input required]
  - Status of the bank file format fix decides 2 of the 6 untested interfaces
  - The cut-over test plan is a precondition for either date
```

**Talking points for you**

- Decision to drive: "Go-live needs a decision today: 1 February with a hard gate after test 3, or 1 March." [My suggestion]
- Follow-up from the last meeting: "Clara, where is the chart of accounts sign-off? Ahmed, the cut-over test plan?" [Via connected tool]
- Risk to flag: "At 3.4% we would carry failed open items into the new system; Finance should say what is acceptable." [My suggestion]
- Question to ask: "Ahmed, when do we get the corrected bank file format?" [Via connected tool]
- Input required before Thursday: the cost of one extra month (team, vendor days), so Petra can weigh both dates.

## Example 2: Client call with no objective

**Request**

> Bereite mich bitte auf den Call morgen mit der Firma Ostwerk vor, 30 Minuten, mit Herrn Fischer und Frau Neumann.

**How the skill handles it**

- Step 1 and ground rules: "Don't assume what the meeting is for. Ask about the objective before drafting the agenda." So no agenda yet.
- Step 2: no sources are connected in this chat, so it asks for the history instead of inventing it.
- It delivers what it can meanwhile: the outline of the prep for a client call, so the user sees what the answers feed into.
- German request, German answer.

**Answer**

Gern. Bevor ich eine Agenda entwerfe, brauche ich drei Dinge von Ihnen, denn für diesen Call sind keine Quellen verbunden, und ich will weder Ziel noch Vorgeschichte erfinden:

1. **Ziel:** Was soll nach den 30 Minuten feststehen, was heute noch offen ist? Zum Beispiel ein Angebot besprochen, eine Reklamation geklärt, ein nächster Termin vereinbart.
2. **Rollen:** Welche Funktion haben Herr Fischer und Frau Neumann bei Ostwerk, und wer entscheidet?
3. **Vorgeschichte:** Was ist beim letzten Kontakt passiert, und ist etwas offen (Zusagen, Angebote, Probleme)? Zwei, drei Sätze reichen.

Sobald ich das habe, bekommen Sie für einen Kunden-Call dieser Länge:

- eine Agenda mit höchstens 25 Minuten verplanter Zeit und dem wichtigsten Punkt zuerst,
- ein kurzes Pre-Read, falls die Teilnehmer Hintergrund brauchen,
- konkrete Gesprächspunkte: was Sie ansprechen, fragen und gegebenenfalls entscheiden lassen sollten.

Falls Sie Ihr CRM oder Ihren Mailverlauf mit Ostwerk verbinden oder die letzten Notizen hochladen, kann ich die Vorgeschichte selbst zusammenstellen und markiere dann, was woher stammt.
