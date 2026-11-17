# Operational Risk Register: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Register entries from a scoring workshop

**Request**

> We scored three risks for our warehouse system (WMS) go-live on 1 March in yesterday's workshop. Please turn them
> into register entries, a heat map and actions. Owner of the project: Katja Engel.
> 1. Only one person, the external consultant Rolf Brandes, knows the WMS configuration. S4, L3. No controls.
>    Residual same.
> 2. Our label printers may not print the new barcode format. S3, L2. Control: test print in the pilot (Jan).
>    Residual S3, L1.
> 3. Stock levels could be migrated wrongly. S4, L4. Control: full count after migration. Residual S4, L2.

**How the skill handles it**

- Step 2: each note is rewritten as cause → event → consequence, using only the user's facts.
- Step 3: scores are the workshop's; the skill reads the ratings off the matrix (16 Critical, 12 High, 6 Medium) and does not re-score.
- Step 4: residual scores are the user's; controls are classified as preventive or detective.
- Step 5: actions for R1 and R3; R2 is accepted at residual Low. Missing owners are marked as open.

**Answer**

```
RISK REGISTER ENTRY
  Risk ID:           R3
  Description:       Due to stock levels being moved from the old system by a one-off migration,
                     wrong quantities may be loaded into the WMS, resulting in pick errors and
                     stopped shipments after go-live.
  Category:          Operational
  Severity:          4 Major
  Likelihood:        4 Likely
  Risk score:        16
  Rating:            Critical
  Existing controls: Full stock count after migration (detective)
  Residual risk:     4 Major x 2 Unlikely = 8, High
  Mitigation plan:   Trial migration with full reconciliation (below)
  Owner:             Katja Engel
  Review date:       Monthly until go-live
  Status:            Mitigating
  Trend:             → Stable (first assessment)
```

```
RISK REGISTER ENTRY
  Risk ID:           R1
  Description:       Due to the WMS configuration being known only to one external consultant,
                     his unavailability may occur during go-live, resulting in configuration
                     errors no one in-house can fix.
  Category:          People
  Severity:          4 Major
  Likelihood:        3 Possible
  Risk score:        12
  Rating:            High
  Existing controls: None
  Residual risk:     4 x 3 = 12, High
  Mitigation plan:   Knowledge transfer (below)
  Owner:             Katja Engel
  Review date:       Monthly
  Status:            Open
  Trend:             → Stable (first assessment)
```

```
RISK REGISTER ENTRY
  Risk ID:           R2
  Description:       Due to the new barcode format, existing label printers may fail to print
                     readable labels, resulting in manual relabelling and delayed shipments.
  Category:          Technology
  Severity:          3 Moderate
  Likelihood:        2 Unlikely
  Risk score:        6
  Rating:            Medium
  Existing controls: Test print in the January pilot (preventive)
  Residual risk:     3 x 1 = 3, Low
  Mitigation plan:   Accept; confirm pilot result
  Owner:             [Input required]
  Review date:       After the pilot
  Status:            Accepted
  Trend:             → Stable (first assessment)
```

**5×5 heat map (inherent scores)**

| Likelihood ↓ / Severity → | Negligible (1) | Minor (2) | Moderate (3) | Major (4) | Critical (5) |
|---|---|---|---|---|---|
| **Almost Certain (5)** | | | | | |
| **Likely (4)** | | | | R3 | |
| **Possible (3)** | | | | R1 | |
| **Unlikely (2)** | | | R2 | | |
| **Rare (1)** | | | | | |

```
MITIGATION ACTION
  Risk ID:          R3
  Strategy:         Reduce
  Action:           Trial migration in the January pilot with a reconciliation of 100% of
                    storage bins against the old system
  Owner:            [Input required]
  Deadline:         31 Jan
  Cost/effort:      [Input required]
  Expected effect:  Likelihood from 4 to 2 before go-live
  Verification:     Reconciliation report signed off by Katja Engel
  Status:           Not started
```

```
MITIGATION ACTION
  Risk ID:          R1
  Strategy:         Reduce
  Action:           Two in-house staff shadow Rolf Brandes and document the configuration
                    in the wiki before go-live
  Owner:            Katja Engel
  Deadline:         15 Feb
  Cost/effort:      [Input required]
  Expected effect:  Likelihood from 3 to 2; residual 8, High
  Verification:     In-house staff make one configuration change without the consultant
  Status:           Not started
```

R1 and R3 stay High after mitigation: monthly review, and each action needs a named owner. Want this as an XLSX register?

## Example 2: German request to score the risks for the user

**Request**

> Bewerte bitte die Risiken für unseren Umzug der Fertigung von Halle 2 in Halle 5 im April. Mir fallen ein:
> Maschinen könnten beim Transport beschädigt werden, und die Lieferanten wissen vielleicht nicht rechtzeitig
> Bescheid. Gib einfach Zahlen, du kennst dich ja aus.

**How the skill handles it**

- Ground rules: "Don't invent severity or likelihood scores." It guides the scoring with questions instead.
- Step 2: both concerns are rewritten as cause → event → consequence and marked for confirmation where causes are assumed.
- Step 3: thresholds are missing, so it asks for them.
- German request and answer.

**Answer**

Die Zahlen lege ich bewusst nicht selbst fest: Sie hängen von Ihren Maschinen, Verträgen und Ihrer Risikotoleranz ab. Ich führe Sie aber durch die Bewertung.

**1. Ihre Risiken als Ursache, Ereignis, Folge**

- **R1:** Weil die Maschinen von Halle 2 in Halle 5 transportiert werden, kann eine Maschine beschädigt werden, sodass die Fertigung auf dieser Linie ausfällt, bis sie repariert ist. [From risk data]
- **R2:** Weil Lieferanten [Annahme: bisher nicht informiert sind], kann Material im April an Halle 2 geliefert werden, sodass es fehlt oder doppelt bewegt werden muss. [From risk data]
- **R3 (Vorschlag):** Weil Strom- und Druckluftanschlüsse in Halle 5 neu verlegt werden, kann die Inbetriebnahme sich verzögern, sodass der Neustart sich verschiebt. [AI-identified risk — verify with domain expert]

**2. Ihre Schwellen**

Ab welchem Betrag oder welcher Ausfallzeit ist ein Schaden für Sie „Major" (4) und ab wann „Critical" (5)?

**3. Fragen zur Bewertung**

- R1: Gab es bei früheren Umzügen Schäden? Gibt es Spezialtransporteur und Versicherung? Wie lange dauert eine Reparatur?
- R2: Wie viele Lieferanten liefern im April, und wissen sie Bescheid?
- R3: Gilt der Punkt bei Ihnen, oder ist Halle 5 schon angeschlossen?

Mit Ihren Antworten lesen wir die Werte gemeinsam von der 5×5-Matrix ab, dann erstelle ich Register und Maßnahmen.
