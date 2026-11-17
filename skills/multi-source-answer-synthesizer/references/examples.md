# Multi-Source Answer Synthesizer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Data retention after contract end, with a conflict

**Request**

> How long do we keep a customer's data after their contract ends? Search found these:
> 1. Data Retention Policy v3, Confluence, Legal (Nina Hoff), 2026-02-10: "Customer content is deleted 90 days
>    after contract end. Backups roll over after 35 days."
> 2. ADR-041 Tenant deletion job, GitHub, Platform team (Ole Sander), 2026-05-04: nightly job deletes tenants
>    90 days after the billing system sets "contract ended".
> 3. Slack #customer-success, Mara Linde (CS lead), 2026-10-28: "FYI we keep data 180 days now for win-backs,
>    agreed with sales."
> 4. Jira PLAT-1182, 2026-09-15, status In Review: "Extend tenant retention to 180 days. Needs Legal approval."

**How the skill handles it**

- Step 2: tiers: policy Tier 1, ADR Tier 2, Jira ticket Tier 3 (open), Slack Tier 4; all are current (under 90 days old or not superseded).
- Step 4: policy and ADR agree on 90 days; Slack conflicts; the ticket shows the 180-day change is proposed, not approved.
- Step 4: the higher tier wins here because the newer, lower-tier claim depends on an approval no source shows.
- Step 6: Low, because sources conflict on the core question, even though the documented answer is clear.

**Answer**

# How long do we keep a customer's data after contract end?

**Confidence**: Low
**Sources consulted**: 4
**Most recently updated source**: 2026-10-28

---

## Synthesized answer

The approved rule is 90 days: customer content is deleted 90 days after contract end [Data Retention Policy v3, 2026-02-10]. The deletion is automated: a nightly job removes a tenant 90 days after the billing system marks the contract as ended [ADR-041, 2026-05-04]. Backups roll over after 35 days, so deleted content leaves backups about 35 days after the deletion [Data Retention Policy v3, 2026-02-10].

A change to 180 days has been proposed to support win-back campaigns and is waiting for Legal approval [PLAT-1182, 2026-09-15]. Customer Success says 180 days already applies [Slack #customer-success, 2026-10-28]. No source shows that the approval was given or that the deletion job was changed.

---

## Where Sources Agree and Disagree

| Claim | Sources that agree | Sources that conflict | Confidence |
|-------|--------------------|-----------------------|------------|
| Content is deleted 90 days after contract end | Policy v3, ADR-041 | Slack #customer-success says 180 days | Low |
| Deletion is automated by a nightly job | ADR-041 | — | Medium |
| Backups roll over after 35 days | Policy v3 | — | Medium |
| Extension to 180 days needs Legal approval | PLAT-1182 | — | Medium |

---

## Conflicts to Resolve
- **Retention period**: Policy v3 and ADR-041 say 90 days; the Slack message says 180 days. The policy is Tier 1 and the ADR describes the running job; the Slack message is newer but informal, and its basis (PLAT-1182) is still In Review. **Recommendation**: Follow the 90-day policy and check with Nina Hoff (Legal) whether PLAT-1182 was approved; if Customer Success already tells customers 180 days, that needs correcting or approving.

---

## What the sources don't cover
- Whether the deletion job's 90-day setting was changed after 2026-05-04 [Not covered in available sources]
- Retention of audit logs and invoices, which usually follow separate rules [Not covered in available sources]
- Whether customers are told the retention period at contract end [Not covered in available sources]

---

## Source register

| # | Title | Type | Platform | Author | Date | Reliability | Link |
|---|-------|------|----------|--------|------|-------------|------|
| 1 | Data Retention Policy v3 | Policy | Confluence | Nina Hoff | 2026-02-10 | Tier 1 | [link from search] |
| 2 | ADR-041 Tenant deletion job | Decision record | GitHub | Ole Sander | 2026-05-04 | Tier 2 | [link from search] |
| 3 | PLAT-1182 Extend tenant retention | Ticket (open) | Jira | Platform team | 2026-09-15 | Tier 3 | [link from search] |
| 4 | #customer-success message | Discussion | Slack | Mara Linde | 2026-10-28 | Tier 4 | [link from search] |

## Example 2: Only one source actually answers (German)

**Request**

> Was sagen unsere Quellen zur Verpflegungspauschale bei Messeeinsätzen? Gefunden:
> 1. Reisekostenrichtlinie 2026, SharePoint, Personal, 2026-01-15: „Bei Messeeinsätzen gilt die gesetzliche
>    Verpflegungspauschale. Wird Verpflegung vom Veranstalter oder Arbeitgeber gestellt, wird sie gekürzt."
> 2. Messeplanung 2027 (Präsentation), Marketing, 2026-09-30: Standbudgets und Personalplanung je Messe.
> 3. Teams-Thread „Hotelbuchung Hannover", 2026-10-12: Fragen zum Buchungstool.

**How the skill handles it**

- Step 1: "You need at least two sources." Only the travel policy speaks to the question; the deck and the thread are about other topics.
- So no synthesis template: it presents the one source directly, with attribution, and says why the others were left out.
- Ground rules: it adds no amounts, because the policy names none.
- German request, German answer.

**Answer**

Nur eine der drei Quellen beantwortet Ihre Frage, deshalb fasse ich sie direkt zusammen statt mehrere Quellen abzugleichen.

**Reisekostenrichtlinie 2026** (SharePoint, Personal, Stand 2026-01-15, verbindliche Richtlinie):

- Für Messeeinsätze gilt die gesetzliche Verpflegungspauschale.
- Stellt der Veranstalter oder der Arbeitgeber Verpflegung, wird die Pauschale gekürzt.

Konkrete Beträge oder Kürzungssätze nennt die Richtlinie nicht. [Not covered in available sources]

**Nicht verwendet:**

- *Messeplanung 2027* enthält Standbudgets und Personalplanung, aber nichts zur Verpflegungspauschale.
- *Teams-Thread „Hotelbuchung Hannover"* betrifft nur das Buchungstool.

Wenn Sie die Beträge brauchen, fragen Sie am besten die Personalabteilung als Herausgeberin der Richtlinie, oder ich suche gezielt nach einer Anlage zur Richtlinie bzw. einer FAQ der Reisekostenabrechnung.
