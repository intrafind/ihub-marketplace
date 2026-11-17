# SOP & Runbook Author: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Runbook for a stuck message queue

**Request**

> Runbook for alert `OrderQueueBacklog` (RabbitMQ queue `orders-in` > 5,000 messages for 10 min). On-call SRE
> runs it; needs SSH and Grafana. Check `systemctl status order-consumer` on `app-prod-02`; if dead, `sudo
> systemctl restart order-consumer`; queue drains within 15 min (Grafana "Order Queue"). If it runs but the queue
> grows, it's usually the ERP API: `curl -s https://erp-gw.internal/health`. Escalate to Integration
> (#integration-oncall, 15 min) and after 45 min to the Head of Platform. Status in #ops-status. Takes ~20 min.

**How the skill handles it**

- Document type: runbook, since an alert triggers it and an operator works under pressure; imperative tone.
- Commands, hosts, thresholds and channels come only from the request.
- Decision points end with OTHERWISE / NOT SURE; missing values (L2 channel and SLA) get placeholders.

**Answer**

# Runbook: OrderQueueBacklog

## At a glance
```
RUNBOOK — OrderQueueBacklog
  Doc version ....... 1.0
  Revised on ........ 17 Nov 2026
  Maintained by ..... [team to specify]
  Validated by ...... [team to specify]
  Re-check every .... [team to specify]
  Starts when ....... alert OrderQueueBacklog: orders-in > 5,000 messages for 10 min
  Run by ............ on-call SRE; SSH with sudo to app-prod-02, Grafana access
  Typical duration .. 20 min
```

## Before you begin
```
BEFORE YOU BEGIN
  Permissions
    - app-prod-02: SSH with sudo for systemctl
    - Grafana: view dashboard "Order Queue"
  Facts to have at hand
    - Alert start time: in the alert
  Starting state
    - Alert acknowledged by you
```

## Steps
```
STEP 1 — Announce the incident
  Do ............... Post the "Started" message below in #ops-status
  You should see ... Your message in the channel
  Check ............ Message posted with alert start time

STEP 2 — Check the consumer service
  Do ............... On app-prod-02 run `systemctl status order-consumer`
  You should see ... "active (running)" or "failed/inactive"
  If not ........... Command fails or host unreachable → escalate to L1
  Check ............ Note the state, then go to Decision point A

STEP 3 — Restart the consumer
  Do ............... On app-prod-02 run `sudo systemctl restart order-consumer`
  You should see ... `systemctl status order-consumer` shows "active (running)"
  Check ............ Grafana "Order Queue": message count falls within 15 min
  Watch out ........ Restart only order-consumer, nothing else

STEP 4 — Check the ERP gateway
  Do ............... Run `curl -s https://erp-gw.internal/health`
  You should see ... A health response
  Check ............ Note the response, then go to Decision point B
```

## Decision points
```
DECISION POINT A: state of order-consumer (Step 2)
  WHEN failed or inactive ..... → Step 3
  WHEN active (running) ....... → Step 4
  OTHERWISE / NOT SURE ........ → escalate to L1 via #integration-oncall with the status output

DECISION POINT B: queue after Step 3 or ERP health (Step 4)
  WHEN queue drains in 15 min . → wrap-up checklist
  WHEN ERP health is not OK ... → escalate to L1 with the curl output
  OTHERWISE / NOT SURE ........ → escalate to L1 with all outputs so far
```

## Escalation tiers
```
ESCALATION TIERS
  L1 — Integration team
    Escalate when .... Decision point A or B says so
    Reach them via ... #integration-oncall
    Response SLA ..... 15 min
    Hand over ........ alert start time, queue count, consumer status, ERP health output
  L2 — Head of Platform
    Escalate when .... unresolved 45 min after the alert started
    Reach them via ... [team to specify]
    Response SLA ..... [team to specify]
    Hand over ........ L1 hand-over plus actions taken
```

## Ready-made messages
```
MESSAGE — Started
  Recipients ...... operations
  Sent via ........ #ops-status
  Send at ......... Step 1
  Subject line .... Order intake delayed
  Message body .... Began: [TIME]. Orders are queuing and not yet processed. Investigating. Next update: [TIME].
MESSAGE — Resolved
  Recipients ...... operations
  Sent via ........ #ops-status
  Send at ......... queue drained
  Subject line .... Order intake back to normal
  Message body .... Resolved: [TIME]. Cause: [CAUSE]. Queued orders processed.
```

## Backing out
Step 3 only restarts a service; nothing to undo.

## Wrap-up checklist
- [ ] Queue below threshold in Grafana
- [ ] "Resolved" message posted
- [ ] After-run review filled in

## Change log
| Version | Date | Changed by | What changed |
|---|---|---|---|
| 1.0 | 17 Nov 2026 | [team to specify] | First version |

Sources: commands and thresholds `[Source: your procedure description]`; structure `[Source: runbook methodology]`;
brackets `[Source: placeholder — ops team to fill in]`. Before use: walk-through and blind test by another SRE. Word
version on request.

## Example 2: SOP from a thin description

**Request**

> We need an SOP for the quarterly user access review in our ERP. Department heads should check their people's
> roles. Keep it short.

**How the skill handles it**

- Document type: SOP (recurring business process); descriptive, with the reason for each step.
- Most specifics are missing (ERP, deadline, who removes access); it names the gaps instead of assuming them.
- Delivers a skeleton meanwhile, with placeholders.

**Answer**

To write steps someone can follow, I need a few facts rather than guesses about your systems or deadlines:

1. Which ERP, and who pulls the user-role export (role and tool)?
2. How do department heads respond: a spreadsheet, a ticket, a workflow in the ERP?
3. What deadline do they have, and what happens if they don't respond?
4. Who removes access that a department head rejects, and within what time?
5. Where is the evidence kept?

Meanwhile, the skeleton:

# SOP: Quarterly ERP user access review

## At a glance
Owner and start date [team to specify]; quarterly; IT administration and department heads. Purpose: only people who need access keep it.

## Steps
1. **Export users and roles** from [ERP] — so every reviewer works from one snapshot. Check: export date noted.
2. **Send each department head their list** via [channel], deadline [team to specify].
3. **Department heads confirm or reject** each role — the people closest to the work know what is needed.
4. **Remove rejected access** within [team to specify]. Check: a fresh export shows the role gone.
5. **File the evidence** in [location]: export, responses, removal proof.

## Exceptions
No response by the deadline → reminder, then escalation to [role] `[team to specify]`.

## Change log
| Version | Date | Changed by | What changed |
|---|---|---|---|
| 0.1 | 17 Nov 2026 | [team to specify] | Skeleton pending answers |
