# NDA Intake Triage: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Mutual NDA with elevated factors only

**Request**

> Can we sign this? Mutual NDA from Velatec Solutions B.V. (Netherlands) for evaluating a joint IoT project; sales
> wants to start talks next week. Our template (attached): mutual, 2-year term, 3-year survival, German law, courts
> of Munich, info must be marked confidential, all four standard exclusions. Their NDA:
> §2 "all information disclosed, whether or not marked as confidential"; §3 use "solely to evaluate the Project";
> §8 term 2 years; §9 obligations survive 5 years; §5 all four standard exclusions; §12 Dutch law, courts of
> Amsterdam. Notices clause is §14 (ours: §10). We have never signed under Dutch law.

**How the skill handles it**

- Step 1: mutual, a structure signed routinely; obligations in §2–§9 run both ways.
- Steps 3–4: three elevated factors (broader definition, survival 5 vs 3 years = 67% longer, new governing law), no critical factor: 2–3 elevated means YELLOW.
- Ground rule 4: every factor names its clause and quotes the wording.
- Urgency stays standard: "next week" is a timing note, not a stated urgency request.

**Answer**

> Not legal advice. A qualified legal professional must review this assessment.

```
NDA INTAKE ASSESSMENT
---------------------
Assessed on:   17 Nov 2026
Other party:   Velatec Solutions B.V.
Structure:     mutual
Color:         YELLOW

1. CORE TERMS AT A GLANCE
   Scope of confidential information:  broad
   Allowed use:                        specific purpose
   Agreement term:                     2 years
   Survival after it ends:             5 years
   Governing law:                      Netherlands, courts of Amsterdam
   Standard carve-outs:                all present

2. RISK FACTORS FOUND
   Critical:        None
   Elevated:        §2 definition covers "all information disclosed, whether
                    or not marked as confidential" (template requires marking);
                    §9 survival of 5 years, 67% longer than our 3 years;
                    §12 Dutch law, not accepted by us before
   Administrative:  Section numbering differs (notices in §14, ours §10)

3. DIFFERENCES FROM OUR TEMPLATE
   §2 Definition — no marking requirement — Material deviation
   §3 Permitted use — "solely to evaluate the Project" — No deviation
   §5 Exclusions — all four present — No deviation
   §8 Term — 2 years — No deviation
   §9 Survival — 5 years instead of 3 — Material deviation
   §12 Governing law — Dutch law, Amsterdam — Material deviation
   §14 Notices — position only — Minor deviation

4. WHERE IT GOES
   Color:            YELLOW
   Send to:          legal counsel
   Urgency:          standard
   Expected effort:  30-60 min targeted review

5. CONTEXT
   Sales plans to start talks next week; if that date is firm, say so and
   counsel can expedite. Likely negotiation points: add a marking
   requirement or a "reasonably understood as confidential" standard to §2,
   and reduce §9 to 3 years. Counsel to decide whether Dutch law is acceptable.
```

## Example 2: German NDA with a residuals clause and no template

**Request**

> Bitte schnell prüfen, ob wir das unterschreiben können. Einseitige NDA der Kranich Robotics GmbH, wir erhalten
> deren Steuerungssoftware zur Integration. Auszüge: §1 „alle Informationen, gleich in welcher Form"; §3
> Ausnahmen nur für „öffentlich bekannte" Informationen; §6 „Der Empfänger darf Kenntnisse, die seine Mitarbeiter
> im Gedächtnis behalten, frei verwenden"; §7 Vertragsstrafe 50.000 EUR je Verstoß; §9 Laufzeit 3 Jahre,
> Geheimhaltung 5 Jahre; §11 deutsches Recht, Gerichtsstand Stuttgart. Unsere Vorlage habe ich gerade nicht da.

**How the skill handles it**

- "What you compare against": no template, so it asks for it, still runs the triage on the Step 4 checklist and states the reduced confidence (ground rule 3).
- Step 4: three critical factors (§6 residuals clause, §7 penalty, §3 missing exclusions): any one makes it RED.
- Tech NDA check: the residuals clause is the point to watch when source code is shared.
- German request, German report; the report labels stay as the template sets them.

**Answer**

> Keine Rechtsberatung. Diese Einschätzung muss von einer qualifizierten juristischen Fachperson geprüft werden.

Ihre Standard-NDA liegt mir nicht vor. Ich habe deshalb nur gegen die Risikofaktoren geprüft; Abschnitt 3 bleibt leer, und die Einstufung ist weniger sicher. Bitte schicken Sie mir die Vorlage, dann ergänze ich den Vergleich. Am Ergebnis RED ändert die Vorlage aber nichts: Drei kritische Faktoren reichen jeder für sich.

```
NDA INTAKE ASSESSMENT
---------------------
Assessed on:   17 Nov 2026
Other party:   Kranich Robotics GmbH
Structure:     unilateral (we receive)
Color:         RED

1. CORE TERMS AT A GLANCE
   Scope of confidential information:  overly broad
   Allowed use:                        undefined (nicht in den Auszügen)
   Agreement term:                     3 Jahre
   Survival after it ends:             5 Jahre
   Governing law:                      Deutschland, Gerichtsstand Stuttgart
   Standard carve-outs:                partial (es fehlen: unabhängig
                                       entwickelt, rechtmäßig von Dritten
                                       erhalten, behördlich angeordnete
                                       Offenlegung)

2. RISK FACTORS FOUND
   Critical:        §6 Residuals-Klausel: „Kenntnisse, die seine Mitarbeiter
                    im Gedächtnis behalten, frei verwenden";
                    §7 Vertragsstrafe 50.000 EUR je Verstoß;
                    §3 Standardausnahmen fehlen bis auf „öffentlich bekannt"
   Elevated:        §1 Definition „alle Informationen, gleich in welcher Form"
   Administrative:  None

3. DIFFERENCES FROM OUR TEMPLATE
   Kein Vergleich möglich: Vorlage nicht vorhanden.

4. WHERE IT GOES
   Color:            RED
   Send to:          senior legal counsel
   Urgency:          expedited (vom Fachbereich als dringend angegeben)
   Expected effort:  full review needed

5. CONTEXT
   Wir erhalten Steuerungssoftware, vermutlich mit Quellcode. Die
   Residuals-Klausel in §6 begünstigt uns als Empfänger, ist aber
   nach unserer Checkliste kritisch und bei Software-NDAs genau zu
   prüfen. Die Vertragsstrafe in §7 trifft dagegen uns: Ohne die
   Ausnahme für unabhängig Entwickeltes (§3) könnte eigene
   Entwicklung als Verstoß gelten. Nicht unterschreiben, bevor
   Senior Counsel die Klauseln geprüft und ggf. nachverhandelt hat.
```

Auffällig: Die Pflichten in §6 und §7 wirken widersprüchlich. Das spricht für eine gezielte Rückfrage an Kranich Robotics, welche Fassung sie wirklich meinen.
