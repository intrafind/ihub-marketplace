# Release Readiness Checklist: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Go/no-go for a medium-risk feature release

**Request**

> Release 4.8 of our order API goes out Thursday 10:00. Contents: new `/exports` endpoint behind flag
> `exports-v1` (default off), plus an HTTP client library upgrade. No DB changes. Kubernetes with Argo Rollouts
> (canary supported), Grafana for monitoring. Status: all PRs merged, CI green, everything reviewed, no open high
> bugs. Env vars and the flag exist in prod. Baseline: error rate 0.3%, p95 320 ms; our SLA alerts fire at 1% and
> 600 ms. On-call: Jonas (platform team). Not done yet: dashboard panel for /exports, support notes. Stateless API,
> steady traffic. Release manager can order a rollback; backup is the platform lead.

**How the skill handles it**

- Step 1: new feature plus a dependency update is Medium risk, and the platform supports canary, so canary;
  stateless with steady traffic means a bake time of at least 15–30 minutes per stage.
- Step 2: only what the user confirmed is ticked; items not mentioned stay open and are called out, not assumed.
- Step 3: application code plus a feature flag, so rollback is redeploy or flag off; thresholds come from the user's
  SLA, not from the skill.
- No runbook: the release is not complex or high-risk.

**Answer**

**Release 4.8: readiness**

**Risk level:** Medium (new endpoint, dependency upgrade). **Strategy:** canary via Argo Rollouts: 5% → 25% →
50% → 100%, at least 15–30 minutes per stage, comparing error rate, p50/p95/p99 latency and order success rate
with baseline. `[Deployment methodology]`

**Verdict: Go, once the three open blockers below are closed by Wednesday.** `[AI recommendation — verify]`

**Code**
- [x] Every planned change merged `[From user context]`
- [x] No open PR holding the release
- [x] CI green on the release branch
- [x] All changes reviewed
- [x] No known critical or high bugs

**Database and data**
- [x] Not applicable: no migrations in 4.8 `[From user context]`

**Dependencies and configuration**
- [x] Environment variables present in prod
- [x] Flag `exports-v1` set up, default off
- [ ] Third-party status pages checked: do on Thursday morning
- [ ] HTTP client upgrade: compatibility with upstream services confirmed? **Open, blocker**
- [ ] New secrets: none mentioned; confirm none are needed

**Infrastructure**
- [ ] Capacity, auto-scaling, health checks, routing for `/exports`: not confirmed
- [ ] SSL certificates valid: not confirmed

**Observability**
- [ ] Dashboard panel for `/exports`: **open, blocker** (canary can't be judged without it)
- [ ] Alerts for new failure modes, linked to runbooks: not confirmed
- [ ] Production log levels: not confirmed
- [ ] Deployment marker prepared in Grafana

**Communication**
- [x] On-call named: Jonas, platform team
- [ ] Stakeholders informed of Thursday 10:00
- [ ] Support notes: **open, blocker** before the flag is switched on for customers
- [x] Maintenance window and status page: not needed for a canary with no downtime

```
# Rollback Plan — Release 4.8

## When to roll back (any single condition is enough)
- [ ] Error rate above 1% (baseline 0.3%)
- [ ] p95 latency above 600 ms (baseline 320 ms)
- [ ] Health checks failing on [N] or more instances
- [ ] Critical issue reported by customers and confirmed
- [ ] Data integrity problem detected

## Who can call it
- Primary: Release manager
- Backup: Platform lead

## Steps
1. During canary: abort the rollout in Argo Rollouts; traffic returns to the stable version
2. After full rollout: roll back to the 4.7 revision
3. Problem only in /exports: set flag exports-v1 to off (no deployment needed)

## How long it takes
- Application: [X minutes, from your last rollback]
- Database: not applicable
- Full recovery: [X minutes]

## What cannot be undone
Nothing identified: no schema or data changes. Exports already downloaded by customers stay with them.

## Verify after rolling back
- [ ] Application health checks pass
- [ ] Error rate is back at baseline
- [ ] Customer-facing functionality confirmed working
- [ ] Stakeholders told about the rollback
```
`[From user context]` for thresholds and roles; `[Deployment methodology]` for the steps

## Example 2: Destructive migration, environment unknown

**Request**

> We need to ship release 2.0 of our billing service tomorrow night. It renames the `amount` column to
> `amount_net` and drops `amount_legacy`. Can you give me the deployment runbook?

**How the skill handles it**

- Step 1: a database migration in billing is High risk at least; but the platform is unknown, so the skill doesn't
  pick tooling-specific steps ("Don't invent infrastructure").
- Reference, rollback by change type: rename and drop are destructive; rollback is not safe until assessed, and
  expand-contract is recommended.
- It asks what it needs and delivers the part that holds regardless of the platform.

**Answer**

Before I write the runbook, one thing stands out: this release is High risk and, as described, **not safely
reversible**. `[Deployment methodology]`

- **Renaming `amount`** breaks the old code the moment the migration runs. If 2.0 must be rolled back, version 1.x
  can't read the table, so a code rollback alone doesn't work.
- **Dropping `amount_legacy`** deletes data. Rolling back means restoring from backup, and billing records written
  after the migration would be lost.

**Recommendation: expand-contract over two releases** `[AI recommendation — verify]`
1. Release 2.0: add `amount_net`, write to both columns, read from `amount_net`. Keep `amount` and `amount_legacy`.
   Rollback = redeploy 1.x; the extra column doesn't bother it.
2. Release 2.1, after a full billing cycle without problems: remove `amount`, and drop `amount_legacy` once a
   verified backup or archive exists.

To write the runbook, I need:
1. **Platform:** where does the service run (Kubernetes, VMs, a PaaS) and what deploys it?
2. **Blue-green:** can you run a parallel environment? For High risk that's the recommended strategy.
3. **Thresholds:** baseline error rate and p95 latency, and the alert levels from your SLA.
4. **Backup:** when the last restore of the billing database was tested, and how long a restore takes.
5. **Billing cycle:** when do invoices run? The bake time should cover at least one complete cycle.
6. **Roles:** who can order a rollback, and who is on call tomorrow night?

If the release has to go out unchanged tomorrow, the minimum is a verified backup taken right before the migration
and a rollback plan that names restore time and data written after the migration as irreversible.
