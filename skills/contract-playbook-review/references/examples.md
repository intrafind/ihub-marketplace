# Contract Playbook Review: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Vendor SaaS agreement against the buyer's playbook

**Request**

> Check Clarivo's SaaS agreement (draft, German law, EUR 84,000/year, 3 years) against our playbook. Liability:
> T1 cap 2x annual fees, data protection uncapped; T2 1.5x, super-cap 3x; T3 1x, super-cap 2x. Termination for
> convenience: T1 any time, 90 days; T2 after month 12, 90 days; T3 end of contract year, 6 months. Data exit: T1
> export within 30 days, free; T2 same, reasonable fee; T3 14 days, standard rates. Contract: "11.1 Supplier's total
> aggregate liability shall not exceed the fees paid by Customer in the twelve (12) months preceding the event giving
> rise to the claim. 11.2 Supplier shall not be liable for loss of data." "14.3 Customer may terminate for
> convenience at the end of each Contract Year by giving six (6) months' written notice." No data export clause.

**How the skill handles it**

- Phase 3 tests 11.1 and 11.2 separately; the clause takes the worst result. "Fees paid in the preceding 12
  months" is below 1x annual fees early in the term, and there is no super-cap.
- Phase 6: data exit is an expected SaaS clause and is absent: Red, wording from Tier 1.
- Phase 7 sorts by priority and quotes before assessing; Germany overlay: AGB check.

**Answer**

*Not legal advice: verify everything with a qualified legal professional before relying on it.*

**Executive summary.** SaaS agreement, Clarivo (supplier) and you (customer); German law; EUR 84,000 per year,
3-year term; draft. Overall: not signable as is. Findings: Red 2, Yellow 1.

## Limitation of Liability -- Section 11
**Current Language**: "11.1 Supplier's total aggregate liability shall not exceed the fees paid by Customer in the twelve (12) months preceding the event giving rise to the claim. 11.2 Supplier shall not be liable for loss of data."
**Playbook Tier**: Below 3 (11.1 below Tier 3: in year one the cap is less than 1x annual fees; 11.2 contradicts every tier's data protection position)
**Deviation**: Red
**Risk Score**: High x Possible = High
**Confidence**: High
**Suggested Redline**: Before: "the fees paid by Customer in the twelve (12) months preceding the event". After: "two times (2x) the annual fees payable under this Agreement. This limitation does not apply to breaches of data protection obligations." Delete 11.2.
**Rationale**: Tier 3 floor is a 1x cap with a 2x super-cap; the redline proposes Tier 1.
**Priority**: High
**Source**: From contract / From playbook

```
ESCALATION NOTICE
Clause: Limitation of Liability, Section 11
Current Position: "...shall not exceed the fees paid by Customer in the twelve (12) months preceding the event
giving rise to the claim." / "Supplier shall not be liable for loss of data."
Minimum Acceptable (Tier 3): Cap 1x annual fees; data protection super-cap 2x annual fees
Gap Description: Cap below 1x in year one; no super-cap; data loss excluded
Risk Narrative: A data breach in month three would be capped at a fraction of annual fees; data loss not at all
recoverable.
Recommended Action: Redline
Escalation To: Legal
Negotiation Context: Concede on Section 14.3 if needed
```

## Data Portability / Exit -- not specified in document
**Current Language**: Not specified in document
**Playbook Tier**: Below 3 (missing)
**Deviation**: Red
**Risk Score**: High x Likely = High
**Confidence**: High
**Suggested Redline**: Add: "Upon termination, Supplier shall provide all Customer Data in a standard, machine-readable format within thirty (30) days at no charge."
**Rationale**: Expected in SaaS agreements; without it, exit depends on goodwill. Tier 1 wording.
**Priority**: High
**Source**: AI assessment / From playbook

```
ESCALATION NOTICE
Clause: Data Portability / Exit (missing)
Current Position: Not specified in document
Minimum Acceptable (Tier 3): Export within 14 days at standard rates
Gap Description: No export right at all
Risk Narrative: At exit your data could be withheld.
Recommended Action: Redline
Escalation To: Legal
Negotiation Context: Raise with Section 11
```

## Termination for Convenience -- Section 14.3
**Current Language**: "Customer may terminate for convenience at the end of each Contract Year by giving six (6) months' written notice."
**Playbook Tier**: 3 (exact match)
**Deviation**: Yellow
**Risk Score**: Medium x Possible = Medium
**Confidence**: High
**Suggested Redline**: Tier 1: "at any time on ninety (90) days' written notice". Tier 2: "at any time after the first twelve (12) months on ninety (90) days' written notice". Negotiation difficulty: Medium.
**Rationale**: Tier 3 is your floor; accept only to win Section 11.
**Priority**: Medium
**Source**: From contract / From playbook

Germany overlay: if these are standard terms, check Sections 11 and 14.3 against BGB Sections 305-310; verify with
qualified counsel in Germany. Ask for DOCX output for a circulation-ready version.

## Example 2: NDA without a playbook (German)

**Request**

> Bitte prüfen Sie die NDA der Hagen Präzisionsteile GmbH, ob wir die so unterschreiben können. Einen Leitfaden
> haben wir nicht. Text: „1. Vertrauliche Informationen sind alle Informationen, die der Empfänger erhält.
> 2. Die Pflicht zur Vertraulichkeit gilt unbefristet. 3. Bei jedem Verstoß zahlt der Empfänger eine Vertragsstrafe
> von EUR 50.000. 4. Es gilt deutsches Recht, Gerichtsstand Stuttgart."

**How the skill handles it**

- No playbook: it asks for one, offers a template, and does not use "market standard" positions.
- Meanwhile only the reduced scope: intake, extraction, completeness check, possibly one-sided provisions. No
  tiers, colors or redlines. Answers in German.

**Answer**

*Keine Rechtsberatung: Bitte lassen Sie das Ergebnis von einer qualifizierten Rechtsberatung prüfen.*

Ohne Ihren Leitfaden bewerte ich keine Abweichungen und schlage keine Änderungen vor. Nennen Sie mir Ihre
Positionen, oder ich erstelle aus dieser NDA eine dreistufige Leitfaden-Vorlage zum Ausfüllen.

**Eingang:** NDA, Hagen Präzisionsteile GmbH und Ihr Unternehmen (Rollen nicht angegeben); deutsches Recht,
Gerichtsstand Stuttgart; Wert nicht angegeben; Status: Entwurf.

**Klauseln:** 1 Definition vertraulicher Informationen; 2 Dauer („gilt unbefristet“); 3 Vertragsstrafe („EUR
50.000“ je Verstoß); 4 Recht und Gerichtsstand.

**Fehlende Klauseln für eine NDA:** Ausnahmen von der Vertraulichkeit (z. B. öffentlich bekannte Informationen);
zulässige Weitergabe (Berater, Mitarbeitende); Rückgabe oder Vernichtung der Unterlagen.

**Möglicherweise einseitig:** Ziffer 1 erfasst jede erhaltene Information; Ziffer 3 setzt eine feste Vertragsstrafe
je Verstoß an. Ob diese Ziffern als AGB nach §§ 305–310 BGB wirksam
sind, sollte qualifizierte Rechtsberatung in Deutschland prüfen.
