# EU Regulation Navigator: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: AI screening of job applications at a machinery maker

**Request**

> We're Haller Maschinenbau GmbH, Germany, 620 employees, EUR 140M turnover, we build packaging machines. HR wants
> to buy a SaaS tool that ranks incoming job applications with AI. Which EU rules apply, and what do we have to do?

**How the skill handles it**

- Scoping step 1: the facts needed for all four tests are in the request (sector, size, member state, use case).
- AI Act: recruitment ranking falls in the Annex III employment area, so high-risk as a deployer; NIS2: machinery
  manufacturing is Annex II and the company is above the medium threshold, so important entity; DORA: no financial
  entity; GDPR: applicants' personal data.
- Betriebsrat: an AI tool in HR processes is a stated trigger; a ranking tool can objectively evaluate behaviour.
- Ground rules: every obligation cites its article; dates are flagged for verification; no web search was
  available, so the answer says so.

**Answer**

> Disclaimer: general legal information for orientation, not legal advice. Check this output and have it reviewed
> by a qualified legal professional before acting on it.

**Regulations that apply**

| Regulation | Applies? | Basis |
|---|---|---|
| EU AI Act | Yes, high-risk system, you are the deployer | Annex III (employment) with Article 6(2) |
| GDPR | Yes | Article 3(1): EU establishment processing applicants' personal data |
| NIS2 | Yes, important entity (company-wide, not only this tool) | Annex II (manufacturing of machinery); size above medium threshold per Article 2 |
| DORA | No | Not a financial entity under Article 2 |

**Key obligations**

*AI Act (deployer)*
- Human oversight by trained staff who can override the ranking (Article 14).
- Use according to the provider's instructions, monitor operation, keep logs (Article 26).
- Check whether a fundamental rights impact assessment is required before first use (Article 27).
- Report serious incidents to the market surveillance authority (Article 26(5)).

*GDPR*
- Applicability is clear; the DPIA, applicant information and the processor agreement with the SaaS vendor are
  operational work for the `gdpr-operations-playbook` skill.

*NIS2*
- Risk-management measures including supply chain security for SaaS providers (Article 21, in particular 21(d)).
- Incident reporting: early warning within 24 hours, notification within 72 hours, final report within one month
  (Article 23).
- Management body approves the measures and takes cybersecurity training (Article 20).

*Betriebsrat (BetrVG Section 87(1) No. 6)*
- The tool can objectively evaluate behaviour and performance-related data, so co-determination applies. Involve the
  works council before the purchase decision; record function, affected groups, data and monitoring capability.

**Where the regimes overlap**
- One security incident at the vendor can trigger GDPR Article 33 (72 hours to the DPA), NIS2 Article 23 (24 hours
  early warning) and AI Act Article 26(5). Use one incident process with the shortest clock first.
- Vendor due diligence serves GDPR Article 28 and NIS2 Article 21(d) at once.

**Nearest deadlines**
1. Betriebsrat involvement: before introduction, so now.
2. AI Act Annex III obligations: applicable from 2 August 2026 under the Act as enacted (Article 113);
   postponement has been discussed at EU level, verify the current date.
3. NIS2 in Germany: verify the status of the German transposition and BSI registration duties on bsi.bund.de.

**Recommended next steps**
1. Ask the vendor for its instructions for use and its documentation as provider.
2. Assign and train the people who will oversee the rankings.
3. Start the works council process and a DPIA (`gdpr-operations-playbook`).

Web search is not enabled in this workspace, so dates and transposition status above are as enacted; check them on
eur-lex.europa.eu, ec.europa.eu and bsi.bund.de. Given that the system is high-risk, involve employment and data
protection counsel before signing.

## Example 2: Emotion analysis in a call centre, in German

**Request**

> Unser Callcenter-Dienstleister bietet ein KI-Tool an, das in Gesprächen die Stimmung erkennt, beim Kunden und beim
> Agenten. Die Teamleiter sollen dann sehen, welche Agenten oft "gestresst" klingen. Dürfen wir das einsetzen?

**How the skill handles it**

- AI Act tiers from the top: emotion recognition at the workplace is a prohibited practice (Article 5(1)(f)), so the
  agent part stops there; the customer part is not banned but has duties.
- Ground rule 2: no final verdict for the company; the answer states the legal test and the facts that decide it.
- Betriebsrat: the tool is designed to monitor employees, a clear co-determination case. Answer in German.

**Answer**

> Hinweis: Allgemeine rechtliche Information zur Orientierung, keine Rechtsberatung. Bitte vor jeder Entscheidung
> fachanwaltlich prüfen lassen.

**Kurz:** Der Teil, der die Stimmung der Agenten auswertet, fällt nach dem Wortlaut unter ein Verbot. Der Teil für
Kunden ist nicht verboten, aber pflichtig.

**1. Analyse der Agenten: verbotene Praxis.** Emotionserkennung am Arbeitsplatz ist nach Art. 5 Abs. 1 lit. f
KI-Verordnung untersagt (Ausnahmen nur aus medizinischen oder Sicherheitsgründen). Eine Auswertung, welche Agenten
"gestresst" klingen, für Teamleiter fällt darunter. Bußgeldrahmen: bis 35 Mio. EUR oder 7 % des weltweiten
Jahresumsatzes (Art. 99).

**2. Analyse der Kunden: zulässig mit Pflichten.**
- Die betroffenen Kunden müssen über den Einsatz informiert werden (Art. 50).
- Emotionserkennung ist zudem ein Bereich von Anhang III (Biometrie); ob das Tool als Hochrisiko-System gilt, ist
  mit der Leitlinie der Kommission zu prüfen.
- DSGVO: Stimmdaten sind personenbezogen (Art. 3 Abs. 1); DSFA und Auftragsverarbeitung über den Skill
  `gdpr-operations-playbook`.

**3. Betriebsrat.** Das Tool ist objektiv geeignet, Verhalten der Agenten zu überwachen: Mitbestimmung nach § 87
Abs. 1 Nr. 6 BetrVG, auch wenn nur der Kundenteil genutzt wird. Früh einbinden.

**Was die Bewertung entscheidet:** Lässt sich die Agenten-Analyse technisch vollständig abschalten, nicht nur
ausblenden? Wo verarbeitet der Dienstleister die Daten?

Websuche ist hier nicht verfügbar; den aktuellen Stand der Kommissionsleitlinien zu Art. 5 bitte auf
ec.europa.eu prüfen. Wegen des Verbotsrisikos empfehle ich eine arbeits- und datenschutzrechtliche Beratung vor
Vertragsschluss.
