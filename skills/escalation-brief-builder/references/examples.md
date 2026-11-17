# Escalation Brief Builder: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Broken ERP sync at an account close to renewal

**Request**

> Need to escalate Brenner Logistik AG. CRM: ARR EUR 186,000, renewal 2027-01-31, enterprise, health 42, CSM me
> (Tom Albers), exec sponsor Petra Lind. Ticket #48812: since 2026-11-03 the ERP connector fails to sync delivery
> status, 140 dispatchers affected daily. Workaround: they import a CSV twice a day, about 2 hours of work each day.
> 2026-11-04 support renewed the API token, no change. 2026-11-07 support raised the timeout, failures went from
> all syncs to roughly 60%. On 2026-11-16 their IT director wrote: "Renewal is on hold until this is fixed." Two
> other customers on connector 4.2 opened similar tickets (#48901, #49015). They expect a fix by 2026-11-30.

**How the skill handles it**

- Step 1: customer impact is High (key workflow degraded, a costly workaround exists); business risk is Critical
  (written renewal hold); the higher axis wins, so overall Critical.
- Step 3: the renewal is 75 days away, inside 90 days, so it is called out; the two other tickets make it a
  possible systemic issue on connector 4.2.
- Step 5: Critical routes to the engineering lead, CS leadership and the account executive, plus the sponsor.
- Contract exposure was not given, so it is marked "not known yet" rather than assumed.

**Answer**

## Escalation brief · Overall severity: CRITICAL
Written 2026-11-17 by Tom Albers

### The account
| Item | Value |
|---|---|
| Customer | Brenner Logistik AG |
| Annual recurring revenue | EUR 186,000 `[Account records]` |
| Renews on | 2027-01-31 |
| Segment tier | enterprise |
| Health | 42 |
| Owning CSM | Tom Albers |
| Executive sponsor | Petra Lind |

### What is wrong
Since 3 November our ERP connector has been failing to pass delivery status to Brenner's dispatch system. Their
dispatchers see outdated delivery information unless someone imports a file by hand.

### Customer impact, rated High
- People affected: 140 dispatchers, daily `[Account records]`
- Workflows that are blocked: delivery status updates from ERP to dispatch (degraded, not fully blocked)
- Workaround: Yes, manual CSV import twice a day, about 2 hours of work per day; not sustainable
- Ongoing for: 14 days

### Business risk, rated Critical
- ARR exposed: EUR 186,000
- Time to renewal: 75 days (inside 90 days)
- Strategic weight: not known yet — needs investigation (reference status, expansion plans)
- Contract exposure: not known yet — needs investigation (SLA terms for integrations)

### Chronology
| Date | Event |
|---|---|
| 2026-11-03 | Problem first reported, ticket #48812 |
| 2026-11-04 | API token renewed: no change |
| 2026-11-07 | Timeout raised: failures down from all syncs to roughly 60% |
| 2026-11-16 | IT director: "Renewal is on hold until this is fixed." |
| 2026-11-17 | Still failing; workaround in daily use |

### Fixes already tried
| # | Attempt | Outcome |
|---|---|---|
| 1 | Renewed API token (support) | No change |
| 2 | Increased sync timeout (support) | Failure rate down to roughly 60%, not resolved |

### What the customer expects
A working sync by 2026-11-30. `[Account records]`

### The ask
Engineering root-cause analysis of connector 4.2 sync failures within 48 hours, covering #48812, #48901 and
#49015, and a fix date we can give Brenner before 2026-11-30. `[Escalation playbook]`

### Proposed routing
| Function | Who | Include |
|---|---|---|
| Engineering | Integrations team lead | always |
| CS leadership | VP Customer Success | always |
| Account executive | Account owner for Brenner | yes, renewal at risk |
| Executive | Petra Lind (sponsor) | yes, Critical |

### Evidence
- Support ticket: #48812; related #48901, #49015
- CRM record: Brenner Logistik AG
- Other: IT director's email of 2026-11-16

Tom, please review before sending: the routing names for engineering and CS leadership are role titles, and the
two "not known yet" items are worth filling before the war room.

## Example 2: Pressure to rate a cosmetic issue as critical, in German

**Request**

> Bitte eskalieren, kritisch! Kunde Hoffmann Druck ist total sauer, weil im PDF-Export das Logo verpixelt ist.
> Ticket #50122 seit 2026-11-12. Umsatz und Vertragsdaten hab ich gerade nicht zur Hand.

**How the skill handles it**

- Step 1: a blurred logo blocks no workflow (Low customer impact); no renewal threat or other risk sign is given
  (Low business risk), so the brief says Low, not Critical, and explains why.
- Ground rules: "total sauer" is a feeling; the brief asks for what the customer actually said. ARR and renewal
  are missing and marked "not known yet".
- It sends nothing; the CSM reviews, and the rating changes if the missing facts change it.

**Answer**

Ich habe die Eskalation als **Niedrig** eingestuft, nicht als Kritisch: Ein unscharfes Logo im PDF blockiert
keinen Arbeitsablauf, und ein Risiko für Verlängerung oder Vertrag ist bisher nicht belegt `[Escalation
playbook]`. Wenn wir das als kritisch melden, schadet das unserer Glaubwürdigkeit bei der nächsten echten
Eskalation. Ändert sich die Lage, stufe ich sofort neu ein:

- Hat der Kunde die Verlängerung oder rechtliche Schritte erwähnt? Bitte den genauen Wortlaut.
- ARR und Verlängerungsdatum aus dem CRM.
- Sind andere Kunden betroffen (gleiches Ticketmuster)?

Entwurf zur Prüfung:

## Eskalations-Brief · Gesamtschwere: NIEDRIG
Erstellt 2026-11-17 von [CSM]

### Konto
Hoffmann Druck · ARR, Verlängerung, Segment, Health, Sponsor: not known yet — needs investigation

### Was ist falsch
Im PDF-Export erscheint das Kundenlogo verpixelt. `[Account records]`

### Kundenauswirkung: Niedrig
Betroffene: nicht bekannt · Blockierte Abläufe: keine · Workaround: nicht bekannt · Dauer: 5 Tage

### Geschäftsrisiko: Niedrig
Keine Verlängerungs-, Vertrags- oder SLA-Risiken genannt.

### Chronologie und Lösungsversuche
2026-11-12 gemeldet (#50122); Lösungsversuche: not known yet — needs investigation

### Erwartung des Kunden
not known yet — needs investigation

### Die Bitte
Fehler mit Kontext in die Produkt-Backlog-Prüfung; dem Kunden einen Termin für eine Rückmeldung nennen.

### Routing und Belege
Support-Team bzw. Produkt-Backlog, Standard-Queue · Ticket #50122
