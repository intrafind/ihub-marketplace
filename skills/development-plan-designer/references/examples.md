# Development Plan Designer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: IDP for a senior engineer aiming at tech lead

**Request**

> I'm Jonas Weber, engineering manager. Need a 12-month IDP for Lena Bauer, Senior Software Engineer (L3), aiming at
> Tech Lead (L4). Our framework (levels Developing / Competent / Advanced / Expert) requires for L3 / L4: System
> design Advanced / Expert, Mentoring Competent / Advanced, Stakeholder communication Competent / Advanced.
> My assessment: system design Advanced, mentoring Developing, stakeholder communication Competent. Lena rates her
> communication Advanced. Our L&D catalog: workshop "Leading Technical Teams" (2 days, EUR 1,200), internal mentoring
> circle, architecture guild. The Q1 payments migration needs someone to coordinate with Finance. Plan goes into our
> HR system.

**How the skill handles it**

- Step 1: levels come only from the manager's assessment; where Lena's self-rating differs, the plan says so and
  uses the manager's observed level.
- Step 2: mentoring is a performance gap (below the current role) and ranks high; communication is a development
  gap tied to the Q1 migration, also high; system design is minor and medium, so it waits for the midpoint review.
- Step 3: every goal gets an experiential activity; resources come only from the catalog given.
- Data protection: the plan will be stored in the HR system, so the skill points to `gdpr-operations-playbook`.

**Answer**

```
GAP REVIEW
  Who:            Lena Bauer
  Role today:     Senior Software Engineer, L3
  Role aimed at:  Tech Lead, L4
```

| Skill | Level now | Current role | Target role | Size of gap | Priority |
|---|---|---|---|---|---|
| Mentoring | Developing | Competent | Advanced | critical | high |
| Stakeholder communication | Competent (self: Advanced) | Competent | Advanced | significant | high |
| System design | Advanced | Advanced | Expert | minor | medium |

`[Taken from your career framework]`

# Development Plan for Lena Bauer
Drawn up on:    2026-11-17
Next review:    2027-02-16
Line manager:   Jonas Weber

## At a glance
  Role today:       Senior Software Engineer, L3
  Role aimed at:    Tech Lead, L4
  Time frame:       12 months
  Priority skills:  Mentoring, Stakeholder communication (System design, medium, follows at the midpoint review)

## Goals

### Goal 1 — Mentoring
  Where they are now:    Developing (manager assessment)
  Where they should be:  Competent by 2027-05-18
  Priority:              high
  Why the business cares: required at her current level; the team onboards two juniors in 2027

  Planned activities
  - Mentor one junior engineer through onboarding (experiential)
      When:                  2027-01 to 2027-06
      Evidence of learning:  regular 1:1s held; junior's first PRs merged with her review
      Support required:      manager assigns the mentee, 2 h per week protected
  - Join the internal mentoring circle (social)
      When:                  from 2026-12, monthly
      Evidence of learning:  brings one real mentoring case per session
      Support required:      none beyond time

  Checkpoint:       the junior ships a feature end to end with Lena as reviewer and coach, and names her support in the onboarding retro
  Checkpoint date:  2027-05-18

### Goal 2 — Stakeholder communication
  Where they are now:    Competent (manager); Lena sees herself as Advanced, to discuss in the first 1:1
  Where they should be:  Advanced by 2027-11-16
  Priority:              high
  Why the business cares: the Q1 payments migration needs a technical counterpart for Finance

  Planned activities
  - Act as Finance contact for the payments migration (experiential)
      When:                  2027-01 to 2027-04
      Evidence of learning:  runs the bi-weekly status meeting with Finance herself
      Support required:      manager joins the first two meetings, then steps back
  - Workshop "Leading Technical Teams" (formal)
      When:                  Q1 2027
      Evidence of learning:  applies one technique to the migration status format
      Support required:      budget EUR 1,200, two days

  Checkpoint:       presents the migration go-live decision to the Finance lead without manager support
  Checkpoint date:  2027-04-30

## What the organization puts in
  From the manager:  bi-weekly 1:1 with development as a standing item; access to the migration
  Budget:            EUR 1,200
  Learning time:     2 h per week in the calendar

## Review points
  - 2027-02-16 quarterly check-in: compare progress with the checkpoints
  - 2027-05-18 midpoint review: rebalance the activities if gaps close faster or slower
  - 2027-11-16 closing review: evaluate outcomes and open the next cycle

`[General development method]` for structure and milestones; dates are proposals for you and Lena to confirm.
Because the plan is stored in the HR system, check the processing requirements with the `gdpr-operations-playbook`
skill.

## Example 2: Team program without assessments, in German

**Request**

> Mein Vertriebsinnendienst (8 Leute) soll 2027 komplett auf das neue CRM umgestellt werden. Mach mir ein
> Schulungsprogramm. Die drei Älteren tun sich sicher schwer mit Technik.

**How the skill handles it**

- Ground rules: no assessments exist, and age is no basis for rating anyone, so no individual levels are set;
  Step 1 asks for the inputs instead.
- It delivers the program frame that needs no ratings now, tagged as a proposal, and adds the works council note.

**Answer**

Gern. Einzelne Kompetenzstufen setze ich erst, wenn es eine Einschätzung gibt; Alter ist dafür kein Maßstab, und
eine Annahme dazu würde die Planung verzerren. Für die Gap-Analyse brauche ich:

1. Die Anforderungen an die Rollen im neuen CRM (z. B. Angebote anlegen, Pipeline pflegen, Reports).
2. Eine kurze Selbst- und Führungskräfte-Einschätzung je Person zu diesen Anforderungen.
3. Euren Schulungskatalog oder das Trainingsangebot des CRM-Projekts.
4. Termin der Umstellung und wie viel Zeit pro Woche neben dem Tagesgeschäft möglich ist.

Programmrahmen bis dahin `[AI proposal — L&D team to confirm]`:

| Phase | Inhalt | Lernform |
|---|---|---|
| 1. Grundlagen | Gemeinsame Einführung in die Kernabläufe | formal, für alle |
| 2. Anwendung | Echte Vorgänge im Testsystem, paarweise | Arbeit am Vorgang, Peer-Lernen |
| 3. Vertiefung | Individuelle Lücken laut Einschätzung | je Person |
| 4. Live-Start | Key User als Ansprechpartner im Team | sozial |

Meilenstein je Person: legt ein Angebot vollständig im neuen CRM an und pflegt die Pipeline ohne Hilfe.

Hinweis: Eine systematische Schulungsmaßnahme kann mitbestimmungspflichtig sein; bitte mit dem Betriebsrat bzw. der
Rechtsberatung klären. Werden Einschätzungen gespeichert, gilt der `gdpr-operations-playbook`-Skill.
