# Dataset Profiler: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: A pasted order export

**Request**

> Got this export from our webshop, before I build a revenue report can you check what's in it?
>
> ```
> order_id,customer_id,order_date,country,amount_eur,status
> 1001,C01,2026-10-01,DE,120.00,paid
> 1002,C02,2026-10-01,Germany,85.50,paid
> 1003,C01,2026-10-02,AT,0.00,cancelled
> 1004,C03,2026-10-03,DE,240.00,paid
> 1005,C04,2026-10-03,CH,,pending
> 1006,C02,2026-10-05,DE,95.00,paid
> 1006,C02,2026-10-05,DE,95.00,paid
> 1007,C05,2026-10-06,AT,1890.00,paid
> 1008,,2026-10-07,DE,60.00,paid
> 1009,C03,2026-10-09,de,130.00,refunded
> ```

**How the skill handles it**

- Phase 1: the full file fits in context, so no sampling; grain hypothesis "one order per row".
- Phase 2 tests the grain: `order_id` has 9 distinct values in 10 rows because 1006 appears twice as an exact duplicate.
- Phase 3 separates the real null in `amount_eur` (pending order) from the 0.00 on a cancelled order, which may be a
  placeholder rather than a price.
- Phase 5: only one numeric column, so correlations are reported as not computable instead of skipped silently.
- Every figure is computed from the ten rows and tagged; meanings of columns are stated as hypotheses.

**Answer**

# Dataset Profile: webshop order export

## Where the data comes from
  Dataset: webshop order export (pasted CSV) · Source: pasted file, comma-delimited, header row · Profiled on: 2026-11-17
  Rows: 10 · Columns: 6 · Grain: one order per row `[Inferred — verify]`, broken by one duplicate
  Time range: 2026-10-01 to 2026-10-09, no orders on 10-04 and 10-08 `[Computed from data]`

## Columns at a glance

| Column | Type | Distinct | Nulls | Examples | Suspected role |
|---|---|---|---|---|---|
| order_id | integer | 9 | 0 (0%) | 1001, 1006, 1009 | primary key (not unique) |
| customer_id | string | 5 | 1 (10%) | C01, C03, C05 | foreign key to customers |
| order_date | date | 7 | 0 (0%) | 2026-10-01, 2026-10-06 | timestamp |
| country | categorical | 5 | 0 (0%) | DE, Germany, de | dimension |
| amount_eur | float | 8 | 1 (10%) | 0.00, 95.00, 1890.00 | measure |
| status | categorical | 4 | 0 (0%) | paid, pending, refunded | flag/dimension |

`[Computed from data]`. Grain test: `order_id` is not unique; rows 6 and 7 are identical copies of order 1006. Once
deduplicated, `order_id` alone is the key.

## Data quality scorecard

```
QUALITY SCORECARD
  Dataset:      webshop order export
  Profiled:     2026-11-17
  Rows:         10
  Columns:      6

  Completeness:  96.7% (58 of 60 cells non-null)
  Uniqueness:    90.0% (9 of 10 rows unique on order_id)
  Validity:      97.4% (38 of 39 checked values pass: amount >= 0, valid date, ISO country code, known status)
  Consistency:   Medium: Germany written as "DE", "Germany" and "de"

  Top Issues:
    1. order_id: exact duplicate row (1006), High, 1 row
    2. customer_id: null on order 1008, High (join key), 1 row
    3. country: three spellings of Germany, Medium, 2 non-standard values
    4. amount_eur: null on pending order 1005, 0.00 on cancelled order 1003, Medium, 2 rows

  Overall Readiness: Needs cleaning before analysis
```

## Notable distributions
- `amount_eur`: mean 301.72, median 95.00, so strongly right-skewed; std dev 599.02, IQR 85.50 to 130.00, range
  0.00 to 1,890.00. Three of 9 values (33.3%) sit outside 1.5×IQR: 0.00, 240.00 and 1,890.00. With 9 values this
  rule is fragile; 1,890.00 (order 1007) alone is about 20 times the median. `[Computed from data]`
- `status`: "paid" covers 7 of 10 rows (70%), including the duplicate; cancelled, pending, refunded 1 each.
- `country` after normalising case and names: DE 7 (70%), AT 2 (20%), CH 1 (10%). `[Computed from data]`

## How the columns relate
- Correlations: not computable, only one numeric column.
- `amount_eur` depends on `status`: the only 0.00 is cancelled, the only null is pending. `[Computed from data]`
- `customer_id` C01, C02 and C03 each place two orders; order 1006 of C02 is counted twice. `[Computed from data]`

## Problems and what to do next

### Blocking issues to fix first
1. High · `order_id` · duplicate row for order 1006 inflates revenue by 95.00. `[Recommendation]` Deduplicate on
   all columns before any sum.
2. High · `customer_id` · order 1008 has no customer. `[Recommendation]` Look it up in the shop system or exclude
   it from per-customer analysis.

### Caveats that travel with the data
1. Only nine days of October 2026 are covered; no conclusions about monthly trend.
2. A revenue report must decide whether cancelled, pending and refunded orders count; the file does not say whether
   "refunded" amounts are already netted. `[Inferred — verify]`
3. `country` needs mapping to ISO codes (Germany and de to DE) before grouping.

### Suggested follow-up analyses
1. Net paid revenue per day: `order_date`, `amount_eur`, `status`; after deduplication and a status rule.
2. Revenue by country: `country`, `amount_eur`; after normalising country codes.
3. Repeat-purchase share: `customer_id`, `order_date`; after resolving order 1008 and on a longer date range.

## Example 2: Request without data

**Request**

> We have a new table in Snowflake with machine data from the Ulm plant. Can you tell me whether the data is usable?
> The table is called something with SENSOR.

**How the skill handles it**

- "Where the data can come from": no warehouse integration and no file is connected in this app, so the skill
  cannot introspect the schema or count rows, and asks for the data instead of profiling from a description.
- Ground rule "Don't invent data": it gives no readiness verdict and no guessed columns.
- It says exactly what it needs, so that one reply is enough.

**Answer**

Happy to profile it, but there is no Snowflake connection in this app, and without the data I can't say anything
about completeness or quality without guessing.

To build the profile, please send one of these:

1. **An export** (CSV, Excel or Parquet). If the table is large, a random sample is enough, e.g.
   `SELECT * FROM <table> SAMPLE (50000 ROWS)`; the report will then state that it is based on a sample.
2. **Also helpful:** the exact table name, the total row count (`SELECT COUNT(*)`) and, if one exists, a data
   dictionary for the columns.

You then get the full report: column overview, quality scorecard, notable distributions, relationships between
columns, and the list of issues to fix before analysis.
