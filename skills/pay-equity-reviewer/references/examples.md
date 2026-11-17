# Pay & Equity Reviewer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Checking an offer against the band

**Request**

> Does this offer fit? Senior Data Engineer, level L4, Munich zone. Offer: EUR 87,000 base, 10% target bonus, no
> equity. Band L4 Munich: min 72,000, mid 84,000, max 96,000. Candidate has 6 years' experience; the role asks for
> 5+. Current L4 data engineers in Munich: 82,000, 85,000, 90,000. Our compa-ratio target is 90–110%.

**How the skill handles it**

- Choosing the depth: an offer, so a single-decision review, not an audit.
- Step 1: all must-have inputs are there; market data (worth having) is missing and goes under open points.
- Steps 2–3: penetration (87,000 − 72,000) / 24,000 = 62.5%; compa-ratio 87,000 / 84,000 = 103.6%, using the user's 90–110% range.
- Step 4: internal equity against the three peers; no demographic data is needed for this check, and no individual determination is made.

**Answer**

```
# Pay Review: Senior Data Engineer L4, Munich (offer)
Prepared on:     17 Nov 2026
Prepared by:     [Input: reviewer name]
Kind of review:  Offer

## In short
  The EUR 87,000 base offer sits in the middle of the L4 Munich band at a
  compa-ratio of 103.6%, inside your 90–110% target and inside the range of
  current peers. Recommend approval unchanged.

## Position in the band
  WHERE THE PAY SITS IN THE BAND
    Job and level:         Senior Data Engineer, L4
    Geography zone:        Munich
    Band, per the compensation framework:
        minimum 72,000 · midpoint 84,000 · maximum 96,000
    Pay under review:      87,000 base
    Placement:             middle
    Band penetration:      62.5%
    Verdict:               Inside the band
    Escalation:            None
  [Per the user's pay data]

## Compa-ratio
  COMPA-RATIO — ONE PERSON
    Formula:           87,000 / 84,000 × 100
    Target range:      90–110% (your policy)
    Outcome:           103.6%
    Reading:           Inside it
  Peers: 97.6% (82,000), 101.2% (85,000), 107.1% (90,000) [Standard review method]

## Equity screening
  Internal equity: the offer is within the peer range (82,000–90,000) and below
  the highest peer. Experience of 6 years against a 5+ requirement supports a
  position slightly above midpoint. [AI analysis — compensation team to confirm]
  Cohort comparison: tenure and ratings of the three peers were not provided.
  Historical pattern: not assessed for a single offer without team history.
  Risk rating: Low

## Recommended decision
  Approve unchanged
  Reasoning:      Inside the band, middle placement, compa-ratio within target,
                  within peer range.
  Who signs off:  [as your governance policy sets out]

## Open points
  - No market data was provided; the band is assumed to reflect market.
  - The peer at 82,000 sits 5,000 below the offer. If that peer has comparable
    experience, review their position in the next pay cycle so the new hire
    does not open an internal gap.
  - Under the EU Pay Transparency Directive the candidate may not be asked
    about current pay; confirm the offer was not based on pay history. Have
    employment counsel confirm national requirements.
```

## Example 2: German team audit with a gap and a compliance question

**Request**

> Haben wir im Customer Success Team Berlin (alle Level 2, Band 48.000 / 54.000 / 60.000) ein Gender Pay Gap?
> Und sind wir damit rechtssicher für die Entgelttransparenzrichtlinie?
> CS-01 w, 3 J., 50.000 · CS-02 m, 3 J., 54.000 · CS-03 w, 5 J., 53.000 · CS-04 m, 5 J., 57.500 ·
> CS-05 w, 1 J., 49.000 · CS-06 m, 6 J., 60.500

**How the skill handles it**

- Step 4, audit path: one cohort (same role, level, location); median compa-ratio of women 92.6% vs men 106.5%, a 13.9-point difference, above the 5-point flag.
- Tenure is tested as a legitimate factor: at equal tenure the gap stays (7.4 and 8.4 points); performance ratings are missing and marked.
- Ground rules: it does not call anything "compliant", makes no determination about individuals, and points to data protection and the works council.
- German request, German review.

**Answer**

```
# Pay Review: Customer Success Berlin, Level 2
Prepared on:     17.11.2026
Prepared by:     [Angabe fehlt]
Kind of review:  Equity audit

## In short
  Im Team liegt der Median-Compa-Ratio der Frauen 13,9 Prozentpunkte unter
  dem der Männer. Gleiche Betriebszugehörigkeit erklärt den Abstand nicht.
  Das ist ein Screening-Befund, kein Nachweis; empfohlen wird eine
  vertiefte Prüfung durch Vergütungsanalyse und Arbeitsrecht.

## Position in the band
  CS-06 liegt mit 60.500 über dem Bandmaximum (Penetration 104,2 %),
  alle anderen innerhalb des Bands. [Per the user's pay data]

## Compa-ratio
  Durchschnitt 100,0 %, Spanne 90,7–112,0 %
  CS-05 90,7 % (1 J.) · CS-01 92,6 % (3 J.) · CS-02 100,0 % (3 J.)
  CS-03 98,1 % (5 J.) · CS-04 106,5 % (5 J.) · CS-06 112,0 % (6 J.)
  Nach Geschlecht (Median): Frauen 92,6 %, Männer 106,5 %
  Bei gleicher Zugehörigkeit: 3 J. 92,6 % vs. 100,0 %; 5 J. 98,1 % vs. 106,5 %
  [Standard review method]

## Equity screening
  Abstand über 5 Prozentpunkte: Kohorte markiert.
  Betriebszugehörigkeit erklärt den Abstand nicht vollständig.
  Leistungsbeurteilungen und Aufgabenumfang:
  [Missing input — request from the user]
  Mit 3 zu 3 Personen ist die Gruppe für statistische Aussagen zu klein.
  Risk rating: Needs specialist review

## Readiness for EU pay transparency
  Eine Aussage zur Rechtssicherheit kann ich nicht treffen; das muss
  Arbeitsrecht in Deutschland bestätigen. Relevant ist: Ein nicht
  begründeter Abstand von mehr als 5 % kann eine gemeinsame Bewertung mit
  der Arbeitnehmervertretung auslösen; Umfang und Schwellen hängen von der
  nationalen Umsetzung ab.

## Recommended decision
  Escalate
  Reasoning:      Abstand über der Schwelle, nicht durch Zugehörigkeit erklärt,
                  Begründungsfaktoren fehlen, CS-06 über Bandmaximum.
  Who signs off:  [laut Ihrer Governance]

## Open points
  - Leistungsbeurteilungen und Aufgabenumfang aller sechs nachreichen.
  - Vertiefte statistische Analyse und arbeitsrechtliche Prüfung.
  - Verarbeitung von Geschlechtsdaten mit dem Datenschutz klären
    (siehe gdpr-operations-playbook); Betriebsrat ggf. vorher einbinden.
  - Begründung für CS-06 über Bandmaximum prüfen.
```
