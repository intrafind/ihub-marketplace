# Business Question to SQL: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Monthly net revenue by region in Snowflake

**Request**

> Snowflake, one-off analysis for our CFO: net revenue per month and customer region for January to October 2026,
> completed orders only, no test customers. Schema:
> - `analytics.orders` (order_id NUMBER, customer_id NUMBER, order_ts TIMESTAMP_NTZ in UTC, status VARCHAR with
>   'completed' / 'cancelled' / 'refunded', net_amount_cents NUMBER), clustered by order_ts
> - `analytics.customers` (customer_id NUMBER, region VARCHAR, six regions, is_test BOOLEAN)

**How the skill handles it**

- Stage 1: metric (net revenue, completed orders), grain (month × region), filters (Jan–Oct 2026, no test
  customers) and setting (one-off) are all stated, so it writes without asking.
- Stage 2: amounts are integer cents, so the query converts to euros; the timestamp is UTC, so month boundaries are
  UTC, which is stated as an assumption.
- Stage 4 and the "won't write" table: filters sit in the first CTE on the clustering column, and the date range is
  half-open instead of BETWEEN, so orders on 31 October after midnight are not lost.
- Ground rule: no sample output is invented; the result is described by its columns and row count.

**Answer**

```sql
-- Monthly net revenue in EUR by customer region, Jan–Oct 2026, completed orders, test customers excluded
-- Grain: one row per order month and customer region
-- Dialect: Snowflake

WITH
  -- CTE 1: completed orders in the window, filtered on the clustering column first
  completed_orders AS (
    SELECT
      o.customer_id,
      o.order_ts,
      o.net_amount_cents
    FROM analytics.orders AS o
    WHERE o.order_ts >= '2026-01-01'
      AND o.order_ts < '2026-11-01'
      AND o.status = 'completed'
  ),
  -- CTE 2: real customers with their region
  real_customers AS (
    SELECT
      c.customer_id,
      c.region
    FROM analytics.customers AS c
    WHERE COALESCE(c.is_test, FALSE) = FALSE
  )

SELECT
  DATE_TRUNC('month', co.order_ts) AS order_month,
  rc.region,
  SUM(co.net_amount_cents) / 100.0 AS net_revenue_eur,
  COUNT(*) AS completed_order_count
FROM completed_orders AS co
INNER JOIN real_customers AS rc
  ON co.customer_id = rc.customer_id
GROUP BY
  DATE_TRUNC('month', co.order_ts),
  rc.region
ORDER BY
  order_month,
  rc.region
;
```

**What it does:** returns net revenue in euros for each month from January to October 2026, split by customer
region, counting only completed orders and leaving out test customers.

**What comes back:**
- `order_month`: first day of the month (UTC)
- `region`: the customer's region [From schema]
- `net_revenue_eur`: sum of net order amounts, converted from cents
- `completed_order_count`: number of completed orders behind that revenue
- Roughly 60 rows: 10 months × 6 regions, fewer if a region had no orders in a month

**Assumptions:**
- [Assumption — verify] Month boundaries are in UTC. If finance closes months in Berlin time, convert with
  `CONVERT_TIMEZONE('UTC', 'Europe/Berlin', o.order_ts)` before truncating.
- [Assumption — verify] A NULL in `is_test` counts as a real customer.
- [Assumption — verify] The customer's current region is used, not the region at the time of the order.
- [Assumption — verify] Refunded orders are excluded entirely; a partial refund on a completed order is not
  deducted.

**Known limitations:**
- Orders whose customer_id has no match in `customers` are dropped by the inner join; check that count if totals
  must match the finance ledger.
- [Optimization note] For a recurring report, a view on `completed_orders` would be worth considering; no DDL added.

## Example 2: Ambiguous metric, partial schema

**Request**

> BigQuery. How many active customers did we have last quarter? We have `prod.events` (account_id STRING,
> event_name STRING, event_ts TIMESTAMP, partitioned by DATE(event_ts)). Just write the query quickly, use
> `BETWEEN '2026-07-01' AND '2026-09-30'`.

**How the skill handles it**

- Stage 1: "active customer" has no definition (which events count, and is a customer an account?), so the skill
  asks before writing: a correct query for the wrong metric is worse than none.
- Ground rule "don't guess table or column names": nothing is known about how test or internal accounts are marked,
  so it asks instead of inventing an `is_internal` column.
- "SQL you won't write by default": BETWEEN on a timestamp misses events on 30 September after midnight; it explains
  the half-open range it will use instead.
- It shows the planned shape so the user can answer quickly, without inventing output.

**Answer**

Before I write this, three questions, so the number answers the question you actually have:

1. **What makes a customer "active"?** Any event at all, or specific ones (for example `login` or
   `report_created`)? Automated events such as syncs would inflate the count.
2. **Is a customer the same as an `account_id`?** If several accounts belong to one company, I need the table that
   maps accounts to customers, with its column names.
3. **Which accounts to exclude?** Are test or internal accounts marked somewhere, for example a flag in an accounts
   table? Please give me the table and column.

One change to your date filter: on a TIMESTAMP column, `BETWEEN '2026-07-01' AND '2026-09-30'` stops at midnight at
the start of 30 September and drops that whole day. I'll filter with `event_ts >= '2026-07-01' AND event_ts <
'2026-10-01'`, which also keeps the partition filter on `DATE(event_ts)` so BigQuery scans only Q3.

Once I have your answers, the query will return one row: the number of distinct active customers in Q3 2026, using
an exact `COUNT(DISTINCT ...)` since this is a reporting figure. [Optimization note] Run it with `--dry_run` first
to see the bytes scanned.
