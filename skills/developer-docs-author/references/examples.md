# Developer Docs Author: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Runbook from an engineer's notes

**Request**

> Turn my notes into a runbook for on-call. "Invoice export stuck: alert `BillingExportQueueStale` fires when the
> oldest job in queue `invoice-export` is >30 min old. Usually the worker pod hangs on a lock. Check:
> `kubectl -n billing get pods -l app=export-worker`. Restart: `kubectl -n billing rollout restart
> deploy/export-worker`. Wait for Running, then `./bin/queue-stats invoice-export` should show oldest_age dropping
> under 60s within 5 min. Need kubectl access to ns billing (group oncall-billing). If it doesn't recover, page
> Payments team via #payments-oncall. Customers get invoices late but nothing is lost, jobs are retried."

**How the skill handles it**

- Step 1: an operational procedure for on-call engineers, so the **Runbook** template.
- Every command comes from the notes and is tagged `[Source: user's code]`; nothing is added that the notes don't
  contain.
- The notes give no rollback for a rollout restart and no urgency target; those become explicit gaps, not guesses.
- Principle 2: "When to use this" leads with the customer impact so the operator knows why it matters.

**Answer**

# Runbook — Unstick the invoice export queue

## When to use this
Invoices reach customers late when the `invoice-export` queue stops draining, usually because an export worker
hangs on a lock. No jobs are lost; they are retried once the worker is back.

## Triggers and urgency
Alert `BillingExportQueueStale`: the oldest job in `invoice-export` is older than 30 minutes.
Urgency: [Gap: target time to resolve, e.g. per billing SLA]

## Before you start
- [ ] Member of group `oncall-billing` (kubectl access to namespace `billing`)
- [ ] `kubectl` configured for the production cluster [Gap: cluster context name]
- [ ] Access to the repository containing `./bin/queue-stats` [Gap: repository and working directory]

## Procedure

### 1. Check the worker pods
- Do: `kubectl -n billing get pods -l app=export-worker` `[Source: user's code]`
- You should see: the export-worker pods listed, typically with status Running even though the queue is stale.
- If not: if pods are in CrashLoopBackOff or Pending, the cause is not a hung lock; go to "If this doesn't solve it".

### 2. Restart the worker deployment
- Do: `kubectl -n billing rollout restart deploy/export-worker` `[Source: user's code]`
- You should see: `deployment.apps/export-worker restarted`, then new pods reaching Running when you repeat step 1.
- If not: new pods stay out of Running for more than [Gap: acceptable wait time]: escalate.

### 3. Watch the queue drain
- Do: `./bin/queue-stats invoice-export` `[Source: user's code]`
- You should see: `oldest_age` falling below 60 seconds within 5 minutes.
- If not: escalate.

## Confirm success
- `oldest_age` below 60 s on `./bin/queue-stats invoice-export`.
- Alert `BillingExportQueueStale` resolves.

## Undo
A rollout restart replaces pods with the same version and needs no rollback. [Gap: confirm that interrupted jobs
are retried and never exported twice]

## If this doesn't solve it
Page the Payments team in #payments-oncall with the output of steps 1 and 3.

## Revision log
| When | Who | What changed |
|---|---|---|
| 2026-11-17 | [NEEDS INPUT: author] | First version from on-call notes |

## Example 2: API reference from a single route handler

**Request**

> Write the API reference for our orders API so the partner team can integrate. Here's the code I have:
>
> ```js
> router.get('/v2/orders/:orderId', requireApiKey, async (req, res) => {
>   const order = await orders.find(req.params.orderId);
>   if (!order) throw new ServiceError('ORDER_NOT_FOUND', 404);
>   res.json({ id: order.id, status: order.status, totalCents: order.totalCents, currency: order.currency });
> });
> ```

**How the skill handles it**

- Step 1: an external developer audience calling an API, so the **API Reference** template.
- Ground rules: only one endpoint is visible; base URLs, the API-key header name, rate limits, paging and other
  endpoints are not, so they get `[NEEDS INPUT]` instead of plausible inventions.
- Example values are lifelike placeholders, and the sample call is tagged as an illustrative sketch because the
  header name is unknown.

**Answer**

# Orders API: API Reference

## What it is
Lets partner systems read the status and total of an order. [NEEDS INPUT: other operations, if any]
Fastest route to a first call: get an API key, then `GET /v2/orders/{orderId}`.

## Auth
API key, checked by `requireApiKey` `[Source: user's code]`. [NEEDS INPUT: header name, how partners obtain a key]

## Environments and base URLs
| Environment | Base URL |
|---|---|
| Production | [NEEDS INPUT] |
| Staging | [NEEDS INPUT] |
| Sandbox | [NEEDS INPUT] |

## Endpoint catalog

### GET /v2/orders/{orderId}
Returns one order by its ID.

Parameters:

| Name | Sent in | Data type | Mandatory? | Meaning |
|---|---|---|---|---|
| orderId | path | string [NEEDS INPUT: format] | yes | ID of the order |

Sample call `[Source: illustrative sketch — check it against the real API]`:

```bash
curl -H "<API key header>: <your-key>" "<base-url>/v2/orders/ord_48213"
```

Returned fields `[Source: user's code]`:

| Field | Data type | Meaning |
|---|---|---|
| id | string | Order ID |
| status | string | Order status [NEEDS INPUT: allowed values] |
| totalCents | integer | Order total in minor units |
| currency | string | Currency code [NEEDS INPUT: ISO 4217?] |

Sample response `[Source: illustrative sketch — check it against the real API]`:

```json
{ "id": "ord_48213", "status": "shipped", "totalCents": 12990, "currency": "EUR" }
```

Failure cases:

| HTTP status | Error code | Cause | Fix |
|---|---|---|---|
| 404 | ORDER_NOT_FOUND | No order with this ID | Check the ID |
| [NEEDS INPUT] | [NEEDS INPUT] | Missing or invalid API key | [NEEDS INPUT] |

## Rate limiting
[NEEDS INPUT]

## Paging
Not applicable to this endpoint. [NEEDS INPUT: list endpoints, if any]

## Versions and deprecation
Version in the path (`/v2`). [NEEDS INPUT: deprecation policy, status of v1]

## Change history
[NEEDS INPUT]

Before this goes to the partner team, the `[NEEDS INPUT]` items above need answers; the error format for a missing
key and the list of status values matter most for an integration.
