# GDPR Operations Playbook: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Access request from a former customer

**Request**

> We're Brightmoor Software GmbH (180 employees, Leipzig). On Monday 9 March 2026 a former customer, Jonas Weller,
> emailed support asking for "a copy of all data you hold on me". He still has a login to our customer portal. His
> data sits in our CRM, the ticketing system, the billing system and with our newsletter provider (processor).
> Some tickets contain notes from our staff about other customers' setups. What do we do, and by when?

**How the skill handles it**

- Choosing the procedure: a data subject request, so it runs DSAR handling, steps 1 to 5 in order.
- Step 1: dates the one-month clock from 9 March as a calendar month (Article 12(3)), giving 9 April 2026, and
  adds the 3-business-day acknowledgement as recommended practice, not a requirement.
- Step 2: he has an online account, so re-authentication is enough.
- Step 4: third-party notes are redacted (Article 15(4)), not refused.
- Ground rules: each obligation names its article and is labelled; the system list comes from the user only.

**Answer**

> **Disclaimer.** This is general legal information for orientation, not legal advice. Check the output and have a
> qualified legal professional review it before acting.

**Procedure: DSAR handling (access request under Article 15)**

**1. Log the request**
- Enter it in the DSAR register: received 9 March 2026, data subject Jonas Weller, type: access (Article 15).
- **GDPR requirement:** respond within one calendar month of receipt (Article 12(3)): **by 9 April 2026**.
- **Recommended practice:** acknowledge receipt by **12 March 2026** (3 business days).

**2. Verify identity** (*decision point*)
- He has an active portal account, so ask him to confirm the request from inside the portal after logging in.
  No ID copy.
- **GDPR requirement:** only information needed to confirm identity may be requested (Article 12(6)).

**3. Define the scope** (*decision point*)
- For an Article 15 request the scope is all personal data relating to him. Search these systems, as you listed them:

| System | Role | Action |
|---|---|---|
| CRM | Controller | Export contact record, history, notes |
| Ticketing system | Controller | Export his tickets and replies |
| Billing system | Controller | Export invoices, payment data |
| Newsletter provider | Processor | Ask the processor for his data under its assistance duty (Article 28(3)(e)) |

- **Organization-specific decision:** whether backups or support inboxes also hold his data; I added no systems.

**4. Check exemptions before replying**
- Ticket notes about other customers: **GDPR requirement** to protect third parties' rights (Article 15(4)).
  Redact those passages; do not withhold the tickets.

**5. Assemble and send the response**
- **GDPR requirement:** besides the copy, include the Article 15(1) information: purposes, categories of data,
  recipients, retention period, his rights (rectification, erasure, restriction, objection), the right to
  complain to a supervisory authority, the source of the data, and whether automated decision-making takes place.

## Example 2: Fehlversand von Gehaltsdaten (auf Deutsch)

**Request**

> Bei uns (Kessler Maschinenbau AG) hat eine HR-Mitarbeiterin heute, 12. Mai 2026, um 14:30 Uhr gemerkt, dass sie
> am Vormittag den Gehaltsexport für 38 Beschäftigte (Name, Bruttogehalt, IBAN, Steuerklasse) versehentlich an eine
> externe Personalberatung gemailt hat statt an unseren Steuerberater. Die Beratung hat um 15:10 Uhr schriftlich
> bestätigt, die Mail ungelesen gelöscht zu haben. Müssen wir das melden?

**How the skill handles it**

- Choosing the procedure: a possible breach, so it runs breach notification, steps 1 to 5.
- Step 1: fixes awareness at 12 May 2026, 14:30, so the 72-hour ceiling is 15 May 2026, 14:30.
- Step 2: rates the risk from the facts given (financial data, 38 people); whether the deletion confirmation
  removes the high risk is a decision point under Article 34(3)(b), so it is put to the user, not decided.
- Ground rule 3: the authority's national practice is flagged.

**Answer**

> **Hinweis.** Dies sind allgemeine rechtliche Informationen zur Orientierung, keine Rechtsberatung. Prüfen Sie
> die KI-generierte Ausgabe und lassen Sie sie vor dem Handeln von einer qualifizierten Rechtsberatung prüfen.

**Verfahren: Meldung einer Datenschutzverletzung**

**1. Zeitpunkt der Kenntnis festhalten**
- Kenntnis: **12.05.2026, 14:30 Uhr** (Art. 33 Abs. 1 DSGVO). Die 72-Stunden-Frist endet spätestens am
  **15.05.2026, 14:30 Uhr**. Das ist die Obergrenze, nicht das Ziel.

**2. Risiko für die Betroffenen bewerten**
- Offenlegung an einen unbefugten Empfänger; Gehalt, IBAN, Steuerklasse von 38 Beschäftigten (keine Daten nach
  Art. 9, aber finanziell sensibel). Mildernd: bekannter Empfänger, Löschbestätigung nach 40 Minuten.
- **Einschätzung:** Ein Risiko lässt sich nicht ausschließen, daher Meldung an die Aufsichtsbehörde.

**3. Meldung an die Aufsichtsbehörde (Art. 33 DSGVO)**
- **DSGVO-Pflicht:** Meldung binnen 72 Stunden mit den Angaben nach Art. 33 Abs. 3 (Art der Verletzung,
  Kategorien und ungefähre Zahl der Betroffenen und Datensätze, Kontakt des DSB, wahrscheinliche Folgen,
  ergriffene Maßnahmen).
- Meldung in Schritten ist zulässig (Art. 33 Abs. 4).
- **Empfohlene Praxis:** heute noch melden und die Löschbestätigung beifügen.

**4. Benachrichtigung der Beschäftigten (Art. 34 DSGVO)** (*Entscheidungspunkt*)
- Pflicht nur bei voraussichtlich **hohem** Risiko. Nach Art. 34 Abs. 3 lit. b entfällt sie, wenn nachträgliche
  Maßnahmen sicherstellen, dass das hohe Risiko aller Wahrscheinlichkeit nach nicht mehr besteht.
- **Organisationsspezifische Entscheidung:** Reicht Ihnen die Löschbestätigung als solche Maßnahme? Dafür sollten
  Sie wissen: Wurde die Mail weitergeleitet? Liegt sie noch in Backups oder Postfächern der Beratung? Diese
  Angaben haben Sie mir nicht genannt; holen Sie sie schriftlich ein, bevor Sie entscheiden.
- Wie streng die zuständige Landesbehörde Löschbestätigungen wertet, unterscheidet sich; ziehen Sie deren
  Leitlinien heran.

**5. Eintrag ins Verletzungsregister (Art. 33 Abs. 5 DSGVO)**
- **DSGVO-Pflicht**, unabhängig von der Meldung: Sachverhalt, Auswirkungen, Abhilfemaßnahmen, Zeitpunkt der
  Kenntnis, jede Meldeentscheidung mit Begründung.

**Fristen auf einen Blick**

| Wer | Was | Bis wann | Grundlage |
|---|---|---|---|
| Verantwortlicher | Meldung an Aufsichtsbehörde | 15.05.2026, 14:30 Uhr | Art. 33 Abs. 1 |
| Verantwortlicher | Benachrichtigung der Beschäftigten, falls hohes Risiko | unverzüglich | Art. 34 Abs. 1 |
| Verantwortlicher | Registereintrag | sofort | Art. 33 Abs. 5 |
