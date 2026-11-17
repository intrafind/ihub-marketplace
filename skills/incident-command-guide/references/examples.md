# Incident Command Guide: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Slow public API, declaring a P2

**Request**

> Our public REST API at Fenwick Data has been crawling since 13:05 UTC today (17 Nov 2026). Monitoring shows p95
> latency 4.8 s instead of the usual 0.3 s, for every API customer. The web app still works. About 40% of our
> users work through integrations on the API. I'm on call (Lena Hoff). Arjun Mehta from the API team is online,
> Clara Weiss from support can do comms. We have no SLA document handy. What now?

**How the skill handles it**

- Step 1, in sequence: the service is reachable (not Q1), no breach signs (Q2), no direct revenue loss stated
  (Q3); more than 25% of users have a major feature degraded (Q4), so **P2**. A 16x slowdown also matches the P2
  example "more than 10x slower".
- No SLA supplied, so the default P2 clocks apply and are tagged `[Standard playbook]`; the escalation times are
  50% and 75% of the 8-hour window.
- Step 2: IC, Technical Lead and Communications Lead from the people named; a Scribe is still needed for a P2.
- Ground rules: no root cause from the description; diagnostics instead, kept short because the incident is live.

**Answer**

**Severity: P2 — High** `[Per incident record]` More than 25% of users (about 40%) have the API, a major feature,
degraded; latency is 16x normal. Re-rate at every update: raise to P1 if the API starts failing outright or
the web app is hit too.

**Clocks** `[Standard playbook]` (replace with your SLA targets when you find them)

| Target | Due (UTC) |
|---|---|
| Acknowledge (30 min) | 13:35 |
| First update (1 h) | 14:05 |
| Escalate to engineering management if no root cause (50% of 8 h) | 17:05 |
| Escalate to VP/Director if no fix deployed (75% of 8 h) | 19:05 |
| Resolve (8 h) | 21:05 |
| Updates | every hour |

**Roles** `[Per incident record]`
- Incident Commander: Lena Hoff
- Technical Lead: Arjun Mehta
- Communications Lead: Clara Weiss
- Scribe: not yet assigned; please name one now.

**Next steps for the Technical Lead** `[AI suggestion — needs verification]`
1. Check whether latency rose for all endpoints or a few, and whether it started with a deploy or config change
   around 13:05.
2. Compare database query times and connection pool use with the baseline.
3. Check rate of incoming requests: a traffic spike from one client would look the same from outside.

Nothing is confirmed yet; log each finding as "suspected" until verified.

**Opening notice** `[Standard playbook]`

```
[P2] INCIDENT OPEN: Public REST API

What's broken: All API customers see very slow responses (p95 4.8 s, normally 0.3 s). The web app is not affected.
Spotted at: 2026-11-17 13:05 UTC, via monitoring alert
State: Investigating
Commander (IC): Lena Hoff
War room / bridge: [call or channel link]

Next update due: 2026-11-17 14:05 UTC
```

**Timeline so far**

```
## [Incident ID]: Public API latency
Level: P2 | Affected service: Public REST API | IC: Lena Hoff

### Log

[2026-11-17 13:05 UTC] ALERT — Monitoring: API p95 latency 4.8 s (baseline 0.3 s)
[2026-11-17 13:xx UTC] IC — Declared P2; IC Lena Hoff, Tech Lead Arjun Mehta, Comms Clara Weiss; Scribe open
```

Fill in the declaration time; a post-mortem is due for this P2 once service is restored.

## Example 2: Login failures with signs of a breach

**Request**

> Customer portal logins are failing for some users since about 08:40 UTC. We also see three new admin accounts
> created at 08:31 that nobody on the team recognises. It's surely just the identity provider update from last
> night, right? Can you write the customer email saying it was the IdP update? I'm IC, Jonas Brück.

**How the skill handles it**

- Step 1: question 2 hits before anything about the login scope: a suspected breach (unknown admin accounts) is
  P1, whatever the share of users affected.
- Step 3: data breach or regulatory exposure escalates to CISO/DPO and Legal immediately.
- Ground rules: declines to name the IdP update as root cause; the customer note must not speculate on the cause
  (Step 4), so it is written without one.
- Keeps it to next steps, because a P1 needs actions, not an essay.

**Answer**

**Severity: P1 — Critical** `[Per incident record]` Three admin accounts created at 08:31 that nobody recognises
are a suspected security breach. That makes it P1 regardless of how many users have login problems.

**Escalate now** `[Standard playbook]`
- CISO and DPO, plus Legal: immediately, not at the 50% mark. If personal data turns out to be affected, the DPO
  has to assess notification deadlines.
- Open the security track in parallel to the service track.

**Root cause: not established.** The IdP update is one hypothesis, but it would not explain new admin accounts. I
won't put it in a customer email. `[AI suggestion — needs verification]` Check in this order:
1. Who or what created the three accounts (audit log: source IP, API token or user)?
2. Disable the three accounts and preserve their logs before any cleanup.
3. Did those accounts log in or change anything after 08:31?
4. Separately: do the login failures line up with the IdP update rollout?

**Clocks** `[Standard playbook]` acknowledge 15 min · first update 30 min · update every 30 min · resolve within
4 h · CTO if still unresolved after 2 h.

**Roles** IC: Jonas Brück. Still to staff: Technical Lead, Communications Lead, Scribe, plus a security lead for
the security track.

**Customer note (no cause stated)** `[Standard playbook]`

```
Subject: Customer portal disruption

We've identified an issue that is currently causing some customers to be unable to log in to the customer portal.

Our engineering team has picked this up and is working on a fix. You'll hear from us again every 30 minutes.

Status right now: Investigating
Expected resolution: We're working to restore normal service as fast as we can.

We apologize for the trouble this causes and will keep you updated.

[Support contact or status page link]
```

Have Legal and the CISO approve this note before it goes out, since a breach is suspected.

**Timeline entries to log now**

```
[2026-11-17 08:31 UTC] SYSTEM — Three admin accounts created, origin unknown
[2026-11-17 08:40 UTC] ALERT — Login failures reported on customer portal
[2026-11-17 hh:mm UTC] IC — Declared P1 (suspected breach); CISO, DPO and Legal escalated
```
