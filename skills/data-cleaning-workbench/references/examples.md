# Data Cleaning Workbench: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: CRM contact export before a campaign

**Request**

> Please clean contacts_2026-11.csv (8,420 rows, one row per contact) so marketing can segment by country and
> industry and send a mailing. Columns: contact_id, company, country, email, phone, created_at, industry,
> annual_revenue, owner. What I found: 312 rows are exact duplicates; 95 more share an email with another row but
> have a different contact_id; country has 23 spellings for 9 countries ("DE", "Germany", "Deutschland"); 640 emails
> empty, 18 without "@"; created_at is text like "03.11.2026", 4 rows say "00.00.0000"; annual_revenue is text ("1.2
> Mio", "850000"), 1,980 rows "n/a"; 57 company names look like "MÃ¼ller GmbH".

**How the skill handles it**

- Stages 1–3 only: documents the state, catalogs each problem with count, share and impact, and proposes fixes.
  Nothing is executed before the user confirms.
- Every fix writes to a new column next to the original; exact duplicates are the only rows proposed for removal.
- No imputation for revenue: filling 23.5% of rows would invent segment data.

**Answer**

**Current state**
- Schema: 9 columns, all stored as text; created_at and annual_revenue should be date and number.
- Grain: one row per contact, broken by the duplicates below. Volume: 8,420 rows × 9 columns.
- Intended use: segmentation by country and industry, then a mailing. Country and duplicates block it; missing
  emails block only the mailing.

**Problems found** [Source value, unchanged]

| Problem | Count (share of 8,420) | Columns | Impact | Blocking? |
|---|---|---|---|---|
| Exact duplicate rows | 312 (3.7%) | all | Contacts counted and mailed twice | Yes |
| Same email, different ID | 95 (1.1%) | email, contact_id | Double mailing; segment counts inflated | Yes, for the mailing |
| 23 spellings for 9 countries | not counted per row | country | Segments split | Yes |
| Empty email | 640 (7.6%) | email | Not reachable by mail | Mailing only |
| Email without "@" | 18 (0.2%) | email | Bounces | Mailing only |
| Date stored as text; "00.00.0000" sentinel | 8,420; 4 | created_at | No date filtering | No |
| Revenue as mixed text; "n/a" | 8,420; 1,980 (23.5%) | annual_revenue | No revenue bands | No, caveat |
| Mojibake | 57 (0.7%) | company | Wrong names in salutations | No |

**Proposed fixes** [Proposed, needs your check]

```
Proposed fix #1
  Problem:           UTF-8 company names read as Latin-1
  Scope:             57 rows (0.7%)
  Suggested action:  Re-decode into company_cleaned ("MÃ¼ller GmbH" → "Müller GmbH")
  Gain vs. cost:     Correct names; one extra column
  Other options:     Fix by hand
  Can it be undone?: Yes
```
```
Proposed fix #2
  Problem:           created_at stored as text, 4 sentinel values
  Scope:             8,420 rows; 4 sentinels (0.05%)
  Suggested action:  Parse DD.MM.YYYY into created_date; sentinels become null with created_date_missing = true
  Gain vs. cost:     Date filters work; the 4 original strings stay in created_at
  Other options:     Leave as text
  Can it be undone?: Yes
```
```
Proposed fix #3
  Problem:           Exact duplicate rows
  Scope:             312 rows (3.7%)
  Suggested action:  Remove, keeping one copy of each
  Gain vs. cost:     Correct counts; no information lost, the rows are identical
  Other options:     Flag only
  Can it be undone?: Yes, from the original file
```
```
Proposed fix #4
  Problem:           Same email under different contact_ids
  Scope:             95 rows (1.1%)
  Suggested action:  Flag with duplicate_email = true and list the pairs for you to decide; no merge yet
  Gain vs. cost:     No wrong merge of two people sharing an address (e.g. info@); the mailing list needs a decision
  Other options:     Keep the most complete record; merge fields
  Can it be undone?: Yes
```
```
Proposed fix #5
  Problem:           Country spellings
  Scope:             all rows; 23 variants
  Suggested action:  Lookup table of the 23 variants to ISO codes, shown to you first; result in country_iso
  Gain vs. cost:     Clean segments; you check the 23 mappings once
  Other options:     Automatic fuzzy matching (can miss edge cases)
  Can it be undone?: Yes
```
```
Proposed fix #6
  Problem:           Missing and invalid emails
  Scope:             640 empty (7.6%), 18 invalid (0.2%)
  Suggested action:  Keep the rows; add email_status = ok / missing / invalid
  Gain vs. cost:     Contacts stay in the segmentation; the mailing filters on email_status = ok
  Other options:     Delete the rows (loses 658 contacts from segmentation)
  Can it be undone?: Yes
```
```
Proposed fix #7
  Problem:           Revenue stored as mixed text
  Scope:             8,420 rows; 1,980 "n/a" (23.5%)
  Suggested action:  Parse into revenue_eur ("1.2 Mio" → 1200000); "n/a" stays null, no imputation
  Gain vs. cost:     Revenue bands possible for 76.5% of contacts; the rest show as "unknown"
  Other options:     Impute the median per industry (would invent values for almost a quarter of rows)
  Can it be undone?: Yes
```

Order after approval: #1, #2, #7 (structure and types), #3, #4 (duplicates), #6 (missing values), #5 (standardize).
Which fixes do you approve, and may I show you the country mapping first?

## Example 2: "Just delete every row with a gap"

**Request**

> orders_q3.xlsx, 12,000 rows, for a Q3 revenue-by-channel chart. No time for questions: delete every row with an
> empty cell and remove duplicates. FYI from a quick filter: 5,610 rows have at least one empty cell; sales_rep empty
> in 3,480 rows (all channel = web), discount empty in 2,150, delivery_date empty in 410; 120 exact duplicate rows.

**How the skill handles it**

- Ground rules: no transformation runs without confirmation, and dropping data needs explicit agreement after its
  cost is clear, so it states the cost first.
- Stage 2 impact check: deleting 5,610 rows (46.8%) would remove every web order and break revenue by channel.
- Short: one proposal, one yes/no.

**Answer**

Deleting every row with an empty cell would remove 5,610 of 12,000 rows (46.8%), including all 3,480 web orders,
because web orders never have a sales rep. The chart would then show no web revenue at all. [Source value, unchanged]

Proposal, ready to run on one "yes" [Proposed, needs your check]:
1. Remove the 120 exact duplicate rows (1.0%); nothing is lost, they are identical.
2. Keep all other rows. Empty sales_rep, discount and delivery_date do not affect revenue by channel; I leave them
   empty and add no imputed values.
3. Afterwards: reconcile 12,000 − 120 = 11,880 rows and compare revenue per channel before and after.

If you still want every row with a gap deleted, say so explicitly and I will run it, with the 5,610 rows listed in
the reconciliation.
