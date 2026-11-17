# Statistical Methods Advisor: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Validating a checkout A/B test

**Request**

> Did the new one-page checkout (B) beat the old one (A)? 50/50 split, 14 days, primary metric: order conversion.
> A: 12,040 visitors, 963 orders. B: 11,960 visitors, 1,076 orders.
> By device: mobile A 7,200 / 504, B 7,150 / 601; desktop A 4,840 / 459, B 4,810 / 475.
> About 90,000 checkout visitors a month.

**How the skill handles it**

- Phase 1: "did B beat A" on a yes/no outcome is a comparison of two proportions: chi-square test, CI for the
  difference, Cohen's h as effect size.
- A/B validation checks in order: SRM first (chi-square against the intended 12,000/12,000), then the primary metric,
  then segments. Randomization and novelty can't be checked without pre-period data or daily figures, so they are
  named as open, not assumed.
- Two segment tests mean multiple comparisons: Holm correction, segments reported as exploratory.
- All values computed in Python on the given counts; the business reading leads, p-value after.

**Answer**

**Short answer:** B converted 1.0 percentage point better than A (9.0% vs 8.0%). The true lift is most likely
between 0.3 and 1.7 points; at 90,000 visitors a month that is about 260 to 1,530 extra orders, best estimate about
900. `[Computed from data]`

```
METHOD: Chi-square test of independence (2×2), with 95% Wald CI for the difference in proportions
ASSUMPTION CHECKS:
  - Sample ratio (SRM): Met -- chi² = 0.27, p = 0.61 against intended 50/50
  - Expected cell counts ≥ 5: Met -- smallest expected count 1,016
  - Independence: Met, assuming one visit per user -- please confirm assignment is per user, not per session
  - Randomization balance: Not checked -- no pre-experiment metrics provided

RESULTS:
  Test statistic:      chi² = 7.69 (df = 1)
  p-value:             0.0055
  Effect size:         Cohen's h = 0.036 (below "small" by Cohen's conventions)
  Confidence interval: +0.29 to +1.70 percentage points at 95%
  Sample sizes:        A 12,040; B 11,960

WHAT IT MEANS:
  The data is consistent with the new checkout raising conversion. The effect is small in statistical
  terms but worth roughly 900 orders a month at current traffic.

CAVEATS:
  Segment results below are exploratory. Novelty effects not checked (no daily data).
```

**Segments (exploratory, Holm-corrected for 2 tests)** `[Computed from data]`

| Device | A | B | Difference | 95% CI | p (raw) | p (Holm) |
|---|---|---|---|---|---|---|
| Mobile | 7.0% | 8.4% | +1.4 pp | +0.5 to +2.3 pp | 0.0016 | 0.0032 |
| Desktop | 9.5% | 9.9% | +0.4 pp | −0.8 to +1.6 pp | 0.52 | 0.52 |

The lift comes mainly from mobile. Desktop shows no clear change either way, but its interval also allows a small
gain; it is not evidence that desktop is unaffected.

**Before shipping** `[Method recommendation]`
1. Confirm assignment is per user (otherwise independence fails).
2. Check daily conversion by group for a fading novelty effect.
3. Weigh the 260–1,530 orders a month against build and maintenance cost.
`[Interpretation — verify with domain expert]` for whether a mobile-driven gain fits what the product team expected.

## Example 2: German request to "prove" a causal effect from a small, self-selected group

**Request**

> Bitte belege statistisch, dass unsere Schulung „Lean am Band“ die Produktivität um 15 % gesteigert hat. Neun
> Mitarbeitende haben freiwillig teilgenommen. Stück pro Stunde vorher / nachher:
> 41/44, 38/41, 45/45, 36/40, 42/43, 39/44, 44/47, 40/42, 37/41.

**How the skill handles it**

- Phase 1: "um 15 % gesteigert" is a causal claim; the data supports only a paired before/after comparison.
- Phase 2: n = 9 (warning: under 20), self-selected volunteers and no control group. These are critical for the
  causal claim, so the skill declines to "belegen" it, and says why, instead of hedging a number.
- It still answers what the data can carry: did these nine produce more afterwards? Phase 3 picks the Wilcoxon
  signed-rank test (paired, small n, non-parametric preferred).
- Phase 6: never "beweist"; the 15% claim is checked against the computed interval and does not hold.

**Answer**

**Kurz:** Einen Beleg, dass die Schulung die Produktivität um 15 % gesteigert hat, kann ich aus diesen Daten nicht
liefern. Die neun Teilnehmenden haben sich freiwillig gemeldet, und es gibt keine Vergleichsgruppe ohne Schulung.
Saisoneffekte, andere Maschineneinstellungen oder schlicht motiviertere Freiwillige können den Anstieg genauso
erklären. `[Methodenempfehlung]`

Was die Daten zeigen: Diese neun Personen produzieren nach der Schulung im Mittel 2,8 Stück pro Stunde mehr
(40,2 → 43,0), das sind +6,9 %, nicht 15 %. `[Aus den Daten berechnet]`

```
METHODE: Wilcoxon-Vorzeichen-Rang-Test (gepaart, zweiseitig)
ANNAHMEN-PRÜFUNG:
  - Gepaarte Messungen derselben Personen: Erfüllt -- je Person ein Vorher- und ein Nachher-Wert
  - Unabhängigkeit zwischen Personen: Vermutlich erfüllt -- bitte bestätigen, dass sie nicht im selben Takt arbeiten
  - Stichprobengröße: Verletzt -- n = 9, eine Person ohne Veränderung, Test daher mit n = 8
  - Zufällige Auswahl: Verletzt -- freiwillige Teilnahme

ERGEBNISSE:
  Teststatistik:       W = 0
  p-Wert:              0,0078
  Effektstärke:        Rang-biseriale Korrelation r = 1,0 (groß)
  Konfidenzintervall:  +1,6 bis +4,0 Stück/h (mittlere Differenz, 95 %), entspricht +3,9 % bis +9,9 %
  Stichprobengröße:    9 Personen

BEDEUTUNG:
  Alle Teilnehmenden mit Veränderung waren danach schneller. Die Daten sprechen für eine echte Zunahme
  in dieser Gruppe, liegen aber deutlich unter 15 %; 15 % liegt außerhalb des Intervalls.

EINSCHRÄNKUNGEN:
  Kein Kausalnachweis: keine Kontrollgruppe, Selbstselektion, kleine Stichprobe.
  Das Intervall stützt sich auf einen t-Ansatz; bei n = 9 ist es nur eine grobe Orientierung.
```

**Wenn Sie die Wirkung der Schulung belegen wollen** `[Methodenempfehlung]`
- Nächste Schulungsrunde mit einer Vergleichsgruppe gleicher Schicht und Linie, die später geschult wird.
- Mindestens 20 Personen je Gruppe, Messzeitraum vorab festlegen.
- Auswertung als Differenz-von-Differenzen (Veränderung geschult minus Veränderung ungeschult).

`[Interpretation — mit Fachexperten prüfen]`: ob es im selben Zeitraum andere Änderungen an der Linie gab.
