# Compliance Gap Tracker: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Gap assessment ahead of an ISO 27001 surveillance audit

**Request**

> ISO 27001 surveillance audit on 15 Feb 2027. Three controls from our Statement of Applicability worry me. Target
> rating for all: Managed. A.5.18 access rights: documented quarterly access review, but it ran in Q1 and Q3 2026
> only. A.8.13 backup: daily backups with quarterly restore tests, documented, but the staging environment (in ISMS
> scope) is not backed up. A.6.3 awareness training: held in May 2026, but attendance records were lost in the June
> LMS migration. Our compliance team rates risk: access review High, backup Medium, training Medium. Effort per IT:
> access review low, staging backup medium (needs budget approval), training records low. Owners: Lena Hartwig (IAM),
> Tobias Rinke (IT Ops), Selin Acar (HR). Last audit's minor nonconformity on supplier reviews (A.5.22) is fixed,
> not yet verified.

**How the skill handles it**

- Phase 3 rates each control from the evidence described; Phase 4 classifies the gaps as operating (access
  review), scope (backup) and evidence (training).
- Priority comes from the compliance team's risk and IT's effort ratings.
- Phase 5: one remediation item per gap; Phase 6 rates readiness per control area.
- No claim that the company "is compliant"; results are to be verified.

**Answer**

**Control assessments** [From compliance data]

| Control | Current | Target | Gap type | Missing evidence | Risk if left open |
|---|---|---|---|---|---|
| A.5.18 Access rights | Defined | Managed | Operating | Q2 2026 review record | Leavers keep access unnoticed; likely audit nonconformity |
| A.8.13 Backup | Defined | Managed | Scope | Staging backup and restore test | Data loss on staging; scope finding |
| A.6.3 Awareness | Defined | Managed | Evidence | 2026 attendance records | Training cannot be proven |

**Remediation plan**

```
REMEDIATION ITEM
  Gap ID:              G-01
  Control ID:          A.5.18
  Gap type:            Operating
  Shortfall:           Quarterly access review skipped in Q2 2026
  Priority:            Immediate (risk High, effort Low)
  Action:              Run the Q4 review for all in-scope systems by 15 Dec; add a quarterly calendar task with
                       a named deputy
  Owner:               Lena Hartwig
  Due:                 15 Dec 2026
  Status:              In progress
  Depends on:          None
  How verified:        Signed Q4 review record and calendar entry
  Re-assessment date:  Mid-January 2027
```
```
REMEDIATION ITEM
  Gap ID:              G-02
  Control ID:          A.8.13
  Gap type:            Scope
  Shortfall:           Staging environment not backed up
  Priority:            Medium (risk Medium, effort Medium)
  Action:              Add staging to the daily backup job and include it in the January restore test
  Owner:               Tobias Rinke
  Due:                 31 Jan 2027
  Status:              Not started
  Depends on:          Budget approval for storage
  How verified:        Backup job log and restore test protocol covering staging
  Re-assessment date:  Early February 2027
```
```
REMEDIATION ITEM
  Gap ID:              G-03
  Control ID:          A.6.3
  Gap type:            Evidence
  Shortfall:           No attendance records for the May 2026 training
  Priority:            High (risk Medium, effort Low)
  Action:              Restore records from the old LMS export; if not possible, collect signed attendance
                       confirmations and enable completion tracking in the new LMS
  Owner:               Selin Acar
  Due:                 20 Dec 2026
  Status:              In progress
  Depends on:          Access to the old LMS export
  How verified:        Attendance list for all staff in scope
  Re-assessment date:  Mid-January 2027
```

```
REMEDIATION DASHBOARD — 17 Nov 2026

All gaps:             4 (G-01 to G-03, prior finding A.5.22)
Not started:          1 — 25%
In progress:          2 — 50%
Blocked:              0 — 0%
Complete:             1 — 25% (A.5.22, awaiting verification)
Verified:             0 — 0%

Overdue:              None
At risk:              G-02, pending budget approval
Next milestone:       Surveillance audit, 15 Feb 2027
```

**Audit readiness** [AI assessment — verify with compliance team]

| Control area | Controls in scope | Fully compliant | Gaps being remediated | Open gaps | Readiness |
|---|---|---|---|---|---|
| Organizational (A.5.18, A.5.22) | 2 | 0 | 2 | 0 | Amber |
| People (A.6.3) | 1 | 0 | 1 | 0 | Amber |
| Technological (A.8.13) | 1 | 0 | 0 | 1 | Red until budget is approved |

Before the audit: verify A.5.22; decide by 31 Jan whether G-02 is closed or disclosed. Have your compliance team
confirm these results. Ask for XLSX output for a distributable tracker.

## Example 2: "Do we meet NIS2?" (German)

**Request**

> Unsere Geschäftsführung fragt, ob wir NIS2 erfüllen. Wir haben MFA für Admins, einen Incident-Prozess, der nicht
> aufgeschrieben ist, und prüfen Lieferanten nur beim Onboarding. Welche Anforderungen gelten für uns, und sind wir
> konform?

**How the skill handles it**

- Which NIS2 obligations apply is legal interpretation: it refers to `eu-regulation-navigator` and does not list
  requirements from training data.
- No compliance verdict; it rates the three described practices on the maturity scale.
- It names what it needs to build the control register. Answers in German.

**Answer**

Ob NIS2 für Sie gilt und welche Pflichten daraus folgen, ist eine rechtliche Einordnung. Dafür ist der Skill
`eu-regulation-navigator` gedacht, oder Ihre Rechts- bzw. Compliance-Abteilung. Ein Urteil „konform“ oder „nicht
konform“ gebe ich nicht ab.

Was ich schon jetzt sagen kann, ist der Reifegrad der drei Praktiken, die Sie beschreiben
[KI-Einschätzung — mit Compliance-Team prüfen]:

| Praxis | Reifegrad | Begründung |
|---|---|---|
| MFA für Administratoren | Nicht bewertbar | Nachweise fehlen; ob MFA nur für Admins genügt, folgt aus den Anforderungen |
| Incident-Prozess | Ad hoc | Existiert, ist aber nicht dokumentiert |
| Lieferantenprüfung | Ad hoc bis Definiert | Nur beim Onboarding; ob laufende Prüfungen gefordert sind, klärt die Anforderung |

Für ein Kontrollregister mit Lückenanalyse brauche ich:
1. Die für Sie geltenden Anforderungen, z. B. als Liste Ihrer Rechtsabteilung oder aus der offiziellen
   Umsetzungsgesetzgebung, mit Artikel- oder Paragrafenbezug.
2. Den Geltungsbereich: Standorte, Systeme, Dienste.
3. Den Ziel-Reifegrad je Kontrolle und die Risikoeinstufung durch Ihr Compliance-Team.
4. Vorhandene Nachweise: Richtlinien, Protokolle, Tickets, Schulungslisten.

Daraus erstelle ich das Register, bewerte und klassifiziere die Lücken und priorisiere die Maßnahmen.
