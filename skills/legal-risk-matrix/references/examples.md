# Legal Risk Matrix: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Pre-launch assessment of an AI screening feature

**Request**

> Please score the legal risks of "TalentMatch", the AI ranking of job applicants in our HR suite, launching Q1.
> Jana Brandt, Product. Customers: employers in Germany and Austria; they see a score per CV and can filter by it. Our framework: we accept no Extreme risk; High needs sign-off by the CLO;
> Medium by the Head of Legal. Existing controls: standard DPA, ISO 27001 certification, MSA liability cap of
> 12 months' fees. Insurance: cyber policy, no AI or discrimination cover.

**How the skill handles it**

- Step 1: scope filled from the request; the framework inputs are given, so it asks nothing.
- Step 2: goes through all eight categories; three apply; the others are named with the reason they are not scored.
- Step 3: scores from the matrix and tags each score's basis (ground rule 4), with no percentages (rule 1).
- Steps 4–5: plans only for Medium and above; approvers follow the user's thresholds.

**Answer**

> Not legal advice. This is a draft for review by qualified counsel before anyone relies on it.

```
SCOPE OF RISK ASSESSMENT
========================
Subject:            TalentMatch, AI ranking of job applicants (product feature)
Requested by:       Jana Brandt, Product
Business goal:      Faster shortlisting for HR customers
Jurisdictions:      Germany, Austria (EU)
Planned start:      Q1
Related matters:    None reported
Assessment type:    Pre-decision
```

**Risks identified**

- **R1 Regulatory:** recruitment ranking is high-risk under the AI Act; as provider we owe documentation, human oversight and a conformity assessment before launch. Exposure: the organization. Scored 4 x 4 = 16, High. [From regulatory framework] AI Act Art. 6(2) with Annex III point 4(a)
- **R2 Data Protection:** customers may reject applicants on the score alone (solely automated decision). Exposure: customers and us. Scored 4 x 3 = 12, High. [From regulatory framework] GDPR Art. 22
- **R3 Contractual:** the MSA has no AI-specific warranty language; the 12-month cap applies. Exposure: the organization. Scored 2 x 2 = 4, Low. [From factual context]
- **Not scored now:** Litigation and Employment (discrimination claims fall first on customers as employers; re-assess if one seeks recourse); Intellectual Property (no facts given: confirm training-data rights); Corporate, Competition (nothing in the facts).

```
MITIGATION PLAN
===============
Risk ID:            R1
Description:        AI Act high-risk obligations unmet at launch
Current score:      4 x 4 = 16 (High)
Strategy:           Reduce
Actions:
  1. Technical documentation and risk management file — Owner: Product — Due: 31 Jan
  2. Complete conformity assessment before release — Owner: Compliance — Due: before launch
Residual score:     4 x 2 = 8 (Medium)
Monitoring:         Monthly, product steering meeting
Next review:        Launch gate
Approver:           Head of Legal (residual Medium)
```

```
MITIGATION PLAN
===============
Risk ID:            R2
Description:        Customers rely solely on the score to reject applicants
Current score:      4 x 3 = 12 (High)
Strategy:           Reduce
Actions:
  1. Require a human decision step in the UI — Owner: Product — Due: 31 Jan
  2. Add Art. 22 guidance and controller duties to the DPA annex — Owner: Legal — Due: 15 Jan
Residual score:     4 x 2 = 8 (Medium)
Monitoring:         Quarterly check of UI flows
Next review:        Quarterly focused review
Approver:           Head of Legal (residual Medium)
```

```
LEGAL RISK REGISTER
===================
Date of assessment: 17 Nov
Scope:              TalentMatch AI ranking, DE/AT
Assessed by:        Legal
Next review:        Launch gate, then quarterly
```

| ID | Category | Risk | Severity | Likelihood | Score | Band | Strategy | Residual score | Owner | Status |
|----|----------|------|----------|------------|-------|------|----------|----------------|-------|--------|
| R1 | Regulatory | AI Act high-risk obligations | 4 | 4 | 16 | High | Reduce | 8 | Legal | open |
| R2 | Data Protection | Solely automated rejection | 4 | 3 | 12 | High | Reduce | 8 | Product | open |
| R3 | Contractual | No AI warranty language | 2 | 2 | 4 | Low | Accept, monitor | 4 | Legal | accepted |

Per your framework, launch waits until R1 and R2 are mitigated or the CLO signs a documented acceptance.

## Example 2: Market entry with the organization's framework missing

**Request**

> Wir wollen ab Mai unsere Wartungsverträge für Industrieanlagen auch in Frankreich anbieten, mit einem lokalen
> Subunternehmer für die Technikereinsätze. Kannst du mir bis Freitag eine Risikomatrix machen? Thomas Weber, Vertrieb.

**How the skill handles it**

- "What has to come from the user": appetite, thresholds, controls and insurance are missing, so it asks instead of assuming.
- Step 1 is filled as far as the facts go, gaps marked; Step 2 is done now, scoring waits for the inputs.
- German request, German answer.

**Answer**

> Keine Rechtsberatung. Entwurf zur Prüfung durch eine qualifizierte juristische Fachperson.

Für Bewertung und Freigaben brauche ich vier Angaben, die nur Sie festlegen können:

1. **Risikoappetit:** Welche Bänder akzeptieren Sie, und wer gibt High- bzw. Extreme-Risiken frei?
2. **Wesentlichkeitsschwelle:** Ab welchem Betrag gilt ein Schaden bei Ihnen als „Major"?
3. **Bestehende Kontrollen:** Mustervertrag für Subunternehmer, Haftungsbegrenzung in den Wartungsverträgen?
4. **Versicherung:** Deckt Ihre Haftpflicht Einsätze in Frankreich und Schäden durch Subunternehmer?

Was ich schon festhalten kann:

```
SCOPE OF RISK ASSESSMENT
========================
Subject:            Markteintritt Frankreich, Wartungsverträge Industrieanlagen
Requested by:       Thomas Weber, Vertrieb
Business goal:      Wartungsgeschäft in Frankreich
Jurisdictions:      Frankreich; Deutschland (Vertragspartei)
Planned start:      Mai
Related matters:    [Angabe fehlt]
Assessment type:    Pre-decision
```

**Risiken, die ich nach den Fakten bewerten werde**

- **Contractual:** Haftung gegenüber dem Kunden für Fehler des Subunternehmers, ohne Rückgriffsklausel. Exponiert: Ihr Unternehmen.
- **Regulatory / Employment:** Melde- und Prüfpflichten für Fremdpersonal in Frankreich (lokal zu prüfen). Exponiert: Ihr Unternehmen, Geschäftsführung.
- **Litigation:** Personen- oder Sachschäden beim Kunden. Exponiert: Ihr Unternehmen.
- **Data Protection:** Weitergabe von Kundendaten an den Subunternehmer ohne Auftragsverarbeitungsvertrag. Exponiert: Ihr Unternehmen.
- **Nicht einschlägig nach den bisherigen Fakten:** Intellectual Property, Corporate / Governance, Competition / Antitrust.

Mit diesen Angaben liefere ich bis Freitag Bewertung, Pläne und Register.
