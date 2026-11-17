# Blameless Postmortem Facilitator: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Checkout outage after a configuration change

**Request**

> Write the postmortem for INC-2291 (SEV-2, 10 Nov 2026). Evidence, all times UTC:
> - Deploys: 13:52 payment-gateway config v4.18 to all instances (db pool max 200 → 20); 11 Nov 09:30 schema
>   validation for pool settings added to the config pipeline.
> - Monitoring: 13:55 p95 checkout latency > 2 s; 14:11 error rate > 5%; 14:21 alert "error rate > 5% for
>   10 min" pages on-call; 14:52 error rate < 1%. 3,140 failed checkout attempts.
> - Chat #inc-2291: 14:27 payments team pulled in; 14:40 "no runbook for pool exhaustion"; 14:48 rollback to v4.17.
> - Jira: INC-2034 (Aug 2026) action item "Validate config values before deploy", no owner, still open.
> Author and owner of fixes: Platform team; alerts: SRE on-call; runbooks: Payments team.

**How the skill handles it**

- Phase 2: only given timestamps, in UTC, five key transitions labelled.
- Phase 1 metrics: TTD 13:55 → 14:21 = 26 min; TTM 14:21 → 14:52 = 31 min; TTR 14:21 → 09:30 next day = 19 h 9 min.
- Blameless: the 5 Whys ends at the config pipeline, not at a person.
- Phase 5: the open INC-2034 item recurs, so it is escalated.

**Answer**

# Incident Review — Checkout failures after payment-gateway config change

| Incident ID | Incident date | Severity | Written by | Report status |
|---|---|---|---|---|
| INC-2291 | 2026-11-10 | SEV-2 | Platform team | Draft |

---

## What Happened

For 57 minutes on 10 November, customers could not check out: after a configuration change the payment gateway ran
out of database connections. A rollback restored service; a validation step now blocks the same change.

## Impact in Numbers

- **Total duration:** 57 min of impact (13:55–14:52 UTC)
- **TTD (time to detect):** 26 min
- **TTM (time to mitigate):** 31 min
- **TTR (time to resolve):** 19 h 9 min
- **Users affected:** 3,140 failed checkout attempts [Source: monitoring]
- **Revenue effect:** Not quantified
- **SLA effect:** Not quantified

## Sequence of Events

| When (UTC) | What occurred | Evidence source |
|---|---|---|
| 13:52 | Config v4.18 deployed; db pool max 200 → 20 | Deploy record |
| 13:55 | **Incident start:** p95 checkout latency above 2 s | Monitoring |
| 14:11 | Checkout error rate above 5% | Monitoring |
| 14:21 | **Detection:** alert pages on-call | Monitoring |
| 14:27 | **Escalation:** payments team joins #inc-2291 | Chat log |
| 14:48 | Config rolled back to v4.17 | Chat log |
| 14:52 | **Mitigation:** error rate below 1% | Monitoring |
| 09:30 (11 Nov) | **Resolution:** pool-setting validation added | Deploy record |

## Why It Happened

Payment-gateway config changes reach production without the validation and staged rollout code changes get.

| Step | Answer to "why?" | Supporting evidence |
|---|---|---|
| Why 1 | Checkout requests timed out waiting for DB connections | Spike from 13:55 [Source: monitoring] |
| Why 2 | The pool maximum was 20 instead of 200 | v4.18 diff [Source: deploy record] |
| Why 3 | Nothing checked the value's range before deploy | Validation added only on 11 Nov [Source: deploy record] |
| Why 4 | The config pipeline has no schema checks and deploys everywhere at once | One deploy at 13:52 [Source: deploy record] |
| Why 5 | Config is not treated as code; the INC-2034 gate was never owned | Item open since August [Source: Jira] |

## What Else Played a Part

| Factor | Category | Role it played | Seen before? |
|---|---|---|---|
| No canary for config deploys | Deployment | Worsened: every instance failed at once | No |
| Alert pages only after 10 min above 5% | Monitoring / Alerting | Delayed detection by 10 min | No |
| No runbook for pool exhaustion | Runbook / Documentation | Delayed resolution [AI inference — confirm] | No |
| INC-2034 validation item unowned | Process | Caused: the safeguard did not exist | Yes, INC-2034 |

## What Worked

- Escalation 6 min after the page; rollback held first time.

## Follow-up Actions

| ID | Action | Traces to | Priority | Owner | Due date | Verified by |
|---|---|---|---|---|---|---|
| AI-001 | Schema validation for all payment-gateway config keys (escalated from INC-2034) | Root cause | P1 | Platform team | 2026-12-04 | Invalid value fails the pipeline in staging |
| AI-002 | Deploy config to one canary instance for 10 min first | Deployment factor | P2 | Platform team | 2026-12-18 | Canary stage in the next config deploy |
| AI-003 | Page when checkout error rate stays above 3% for 3 min | Monitoring factor | P2 | SRE on-call | 2026-11-27 | Alert fires in a staging fault test |
| AI-004 | Write a runbook for pool exhaustion | Runbook factor | P3 | Payments team | 2026-12-11 | Reviewed by on-call |

## Takeaways

- Config needs the same gates as code.
- An unowned action item does not happen; INC-2034 warned us.

## Links

- Incident ticket: INC-2291
- Incident chat channel: #inc-2291
- Related earlier postmortems: INC-2034

## Example 2: Asked to name a person as the cause (German)

**Request**

> Postmortem zum VPN-Ausfall von gestern bitte (ca. 3 Stunden, ganzer Außendienst betroffen). Ursache: Max hat
> beim Zertifikatstausch die falsche Kette eingespielt, er soll eine Schulung machen. Mehr Daten habe ich nicht.

**How the skill handles it**

- "Never blame an individual": the question is why the system let an incomplete chain go live.
- "Never invent timeline events" or a root cause: without timestamps the cause stays open; missing data is named.
- It delivers known facts and a labelled provisional Why chain, plus requests.

**Answer**

Gern, mit zwei Anpassungen: Ich nenne keine Person als Ursache, denn eine unvollständige Kette hätte unser Prozess
abfangen müssen; eine Schulung für eine Person verhindert nicht, dass es der nächsten passiert. Und ohne Zeitpunkte
bleibt die Ursache vorerst offen.

**Was feststeht**
- VPN-Ausfall am 16.11.2026, ca. 3 Stunden (approximativ), gesamter Außendienst betroffen [Source: user testimony]
- Beim Tausch wurde eine unvollständige Kette eingespielt [Source: user testimony]

**Vorläufige Warum-Kette**
- Warum 1: VPN-Clients lehnten das Server-Zertifikat ab. [AI inference — confirm]
- Warum 2: Die Zwischenzertifikate fehlten. [Source: user testimony]
- Warum 3: Vor der Aktivierung prüfte nichts die Kette automatisch. [AI inference — confirm]
- Ursache: Root cause not yet established — more data required.

**Was ich noch brauche**
1. Zeitpunkte (UTC) für Einspielen, ersten Fehler, erste Meldung, Rollback, Wiederherstellung (Gateway-Log,
   Tickets)
2. Gibt es Runbook oder Testumgebung für den Tausch? Ticket-Nummer, frühere Postmortems?

Danach arbeite ich Maßnahmen mit Verantwortlichen und Terminen aus, etwa eine automatische Kettenprüfung vor der
Aktivierung.
