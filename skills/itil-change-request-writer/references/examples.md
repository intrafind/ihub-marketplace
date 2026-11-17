# ITIL Change Request Writer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Database minor upgrade as a Normal change

**Request**

> CR please: patch our ERP database cluster (erp-db-01/02, primary/replica) from PostgreSQL 15.6 to 15.10.
> Window Sat 28 Nov 2026, 22:00–01:00 CET, ERP offline then anyway. Done twice before on other
> clusters. Steps: snapshot both VMs (15 min), stop replica, patch, start (20 min), switch over to replica
> (10 min), patch old primary and rejoin (20 min), smoke test ERP login and order posting (15 min). Rollback:
> revert both VM snapshots (30 min); writes after go-live would be lost, but ERP is closed for entry until 06:00.
> Tested on erp-db-stage on 12 Nov, pass. Implementor Nils Berg (DBA team), requester me, Sara Imhof. Month-end
> close starts 1 Dec. 1,400 ERP users.

**How the skill handles it**

- Step 1: no incident, no approved standard procedure, and only 2 successful runs (fewer than 3), so **Normal**.
- Step 2: the window does not collide with month-end close (1 Dec); no other conflicts given.
- Step 3: rates the six dimensions; one H (effect on services) gives **High**, so CAB plus senior management.
- CAB members and change manager were not given: listed as blockers.

**Answer**

# Request for Change CR-[number] (Normal)

- Submitted: 17 Nov 2026
- Submitted by: Sara Imhof
- Classification: Normal `[Source: AI structuring — change authority to confirm]`
- Priority: [to set]
- Wanted by: 28 Nov 2026

## A. The change `[Source: your change details]`

**What will be different:** erp-db-01/02 run PostgreSQL 15.10 instead of 15.6; primary and replica swap roles.

**Reason:** `[BLOCKER: reason not given]`

| | |
|---|---|
| Covered | Minor upgrade on erp-db-01/02 |
| Not covered | ERP application, OS patches |
| Components touched | erp-db-01, erp-db-02 |
| Environments | Production (tested on erp-db-stage) |
| Who notices | Nobody in the window; 1,400 users if ERP is not back by 06:00 |

## B. Risk `[Source: AI structuring — change authority to confirm]`

| Risk dimension | H/M/L | Reasoning |
|---|---|---|
| Effect on services | H | ERP depends fully on this cluster |
| Effect on users | L | Window outside entry hours |
| Complexity | M | Two nodes, switchover, five manual steps |
| Ease of reversal | L | Snapshot revert in 30 min; no user writes before 06:00 |
| Window fit | L | 80 min planned in a 180 min window |
| Dependencies | L | DBA team only |

Overall level: **High** → sign-off by CAB plus senior management

| # | What might go wrong | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Replica fails to rejoin after switchover | L | M | Snapshot revert |
| 2 | ERP not available by 06:00 | L | H | Rollback trigger at 00:30 latest |

## C. Delivery `[Source: your change details]`

**Readiness checks**
- [ ] VM snapshots of both nodes taken and listed
- [ ] Rollback steps read by Nils Berg
- [ ] Notice sent to the service desk

| # | Task | Owner | Duration | Proof it worked |
|---|---|---|---|---|
| 1 | Snapshot both VMs | Nils Berg | 15 min | Snapshots listed |
| 2 | Stop, patch, start replica | Nils Berg | 20 min | Replica reports 15.10 |
| 3 | Switch over to replica | Nils Berg | 10 min | New primary accepts writes |
| 4 | Patch old primary, rejoin as replica | Nils Berg | 20 min | Replication active |
| 5 | Smoke test | Nils Berg | 15 min | Login and order posting work |

- Window opens: 28 Nov 2026, 22:00 CET · closes: 29 Nov 2026, 01:00 CET
- Outage for users: No (ERP offline in window)
- Fallback slot: `[BLOCKER: fallback slot not defined]`

## D. Testing
| Test | Where run | Outcome | When |
|---|---|---|---|
| Full procedure | erp-db-stage | Pass | 12 Nov 2026 |

**Smoke test:** 1. ERP login · 2. Replication on both nodes · 3. Test order

## E. Backing out `[Source: your change details]`
**Triggers:** smoke test fails; replication not active after step 4; work not finished by 00:30.

| # | Task | Owner | Duration |
|---|---|---|---|
| 1 | Revert both VM snapshots | Nils Berg | 30 min |
| 2 | Confirm 15.6, replication and ERP login | Nils Berg | included |

**Limits:** writes after go-live are lost on revert; none expected before 06:00.

## F. Keeping people informed `[Source: CR template]`
| Who | Via | When | Content |
|---|---|---|---|
| Service desk | Teams | 3 days ahead | Window, expected impact: none |
| Service desk, Sara Imhof | Teams | start, end, on rollback | Status |

## G. Sign-off
| Role | Person(s) | Outcome | Date |
|---|---|---|---|
| Change Manager | `[BLOCKER: not named]` | | |
| CAB | `[BLOCKER: members not named]` | | |
| Senior management | `[BLOCKER: not named]` | | |

## Example 2: Notfalländerung ohne Rückfallplan (auf Deutsch)

**Request**

> Wir haben gerade einen P1 (INC-88412): Der Webshop wirft seit 09:20 Fehler, weil das TLS-Zertifikat auf dem
> Loadbalancer lb-ext-01 abgelaufen ist. Wir spielen jetzt das neue Zertifikat ein. Schreib schnell den Change.
> Freigabe gibt Jens Rau (ECAB). Ich bin Olga Fichte, Netzwerkteam.

**How the skill handles it**

- Step 1: the change resolves an active P1 incident, so **Emergency**, short template.
- Risk section kept despite urgency; lb-ext-01 is shared infrastructure, so its other services are in scope.
- No rollback given: `[BLOCKER: NO ROLLBACK PLAN YET]`; no import steps are invented either.

**Answer**

# Emergency Change ECR-[Nummer]

- Erstellt: 17.11.2026, [Uhrzeit]
- Erstellt von: Olga Fichte, Netzwerkteam `[Source: your change details]`
- Incident: INC-88412 (P1) `[Source: your change details]`
- Freigegeben von: Jens Rau (ECAB) `[Source: your change details]`

**Änderung und Dringlichkeit:** Das abgelaufene TLS-Zertifikat auf lb-ext-01 wird durch ein neues ersetzt. Der
Webshop liefert seit 09:20 Fehler; der normale Freigabeweg würde den P1 verlängern. `[Source: your change details]`

**Risiko:** lb-ext-01 ist gemeinsame Infrastruktur. Prüfen Sie vor dem Einspielen, welche weiteren Dienste über
diesen Loadbalancer laufen; ein falsches Zertifikat oder eine unvollständige Kette würde alle betreffen.
`[Source: AI structuring — change authority to confirm]`

**Schritte:** [Bitte die genauen Schritte für lb-ext-01 eintragen; ich schreibe keine geratenen Befehle für Ihr
System.] `[Source: CR template]`

**Rückgängig machen:** `[BLOCKER: NO ROLLBACK PLAN YET]` Bitte festhalten, wie Sie zurückgehen, falls das neue
Zertifikat Fehler verursacht (zum Beispiel, ob die vorherige Konfiguration gesichert ist).

**Nacharbeit**
- [ ] Vollständiger Change-Antrag nachträglich innerhalb von [24/48 h] für das CAB
- [ ] Post-Implementation-Review durchgeführt
- [ ] Die Post-Mortem-Analyse zu INC-88412 berücksichtigt diesen Change, inklusive der Frage, warum der Ablauf
  nicht vorher bemerkt wurde

Offen, bevor Sie loslegen: die Schritte und der Rückfallplan.
