# Analysis QA Reviewer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Conversion analysis with a join problem

**Request**

> Please QA this before it goes to our CMO on Friday. "Impact of the new onboarding email sequence on
> trial-to-paid conversion", author Jana Petrovic.
> - Method: trials started Jul–Sep 2026 (after launch) vs Apr–Jun 2026 (before). Trials table joined to the
>   invoices table on account_id; "converted" = count of joined rows with an invoice.
> - Results (Jul–Sep): SMB 1,840 trials / 202 converted / 11.0%; Mid-market 620 / 105 / 16.9%; Enterprise
>   140 / 31 / 22.1%; Total 2,600 / 338 / 13.0%. Apr–Jun total: 10.4%.
> - Conclusion: "The sequence caused a 25% lift in conversion. We should extend it to all segments."
> - Footnote: list prices for SMB were cut by 15% on 1 Aug 2026.
> - Chart: bar chart of 10.4% vs 13.0%, y-axis from 9% to 14%.

**How the skill handles it**

- Step order: the method is checked first; the causal claim rests on a before/after comparison with a price cut
  in the "after" window, so that finding is material for the method and blocking for the conclusion.
- Step 2, joins: counting joined invoice rows is a fan-out risk (monthly billing gives up to three invoices per
  account in a quarter), so the conversion counts cannot be trusted: blocking.
- Step 2: the segment arithmetic checks out and is tagged [Verified].
- Ground rule: the reviewer points to the errors and does not recompute the conversion rate itself.

**Answer**

# Pre-Release Review of the Analysis

## Review details
- Analysis reviewed: Impact of the new onboarding email sequence on trial-to-paid conversion
- Author: Jana Petrovic
- Reviewed by: AI-assisted review
- Date: 17 Nov 2026

## Verdict
- Confidence: **Low**
- Recommendation: **Address issues first**

## Issue count by severity
- Blocking issues: 2
- Material issues: 2
- Minor issues: 1

## Findings by area

### Method and fit to the question
- **Material** [Issue found]: a before/after comparison cannot isolate the email sequence. The SMB price cut of
  1 Aug 2026 and any seasonal difference between Q2 and Q3 fall into the same window. [Recommendation] Compare
  segments not affected by the price cut, or use a holdout group if one exists.

### Numbers and formulas
- **Blocking** [Issue found]: "converted" counts joined invoice rows, not distinct accounts. With monthly billing
  an account that converted in July can contribute up to three rows by September, which inflates every
  conversion figure. [Recommendation] Count distinct account_id with at least one invoice.
- [Verified]: segment rates match their counts (202/1,840 = 11.0%, 105/620 = 16.9%, 31/140 = 22.1%), segments sum
  to 2,600 trials and 338 conversions, 338/2,600 = 13.0%, and 13.0% vs 10.4% is a 25% relative lift.
- [Unable to verify]: the Apr–Jun figure of 10.4%; its counts were not shared, and it may carry the same join
  problem.

### Underlying data
- **Minor** [Issue found]: the Jul–Sep cohort is still maturing; trials started in late September have had little
  time to convert. [Recommendation] State the cut-off date and conversion window.

### Charts and dashboards
- **Material** [Issue found]: the bar chart's y-axis starts at 9%, which makes a 2.6-point difference look like
  a several-fold jump. [Recommendation] Start the axis at zero, or show the change as a labelled number.

### From evidence to conclusions
- **Blocking** [Issue found]: "the sequence caused a 25% lift" is a causal claim the method cannot support, and
  the 25% itself rests on inflated counts. [Recommendation] Reword as an observed change with the price cut named
  as a competing explanation, after the counts are corrected.

## Fixes in priority order
1. Recount conversions as distinct accounts, for both periods; every figure downstream depends on it.
2. Drop the causal wording, or add a comparison that controls for the SMB price cut.
3. Redraw the chart with a zero-based axis.
4. State the conversion window and the data cut-off date.

## Example 2: Asked to "just fix it" with only a summary to go on

**Request**

> Our churn dashboard says "Customers using the Reports module churn 40% less (8.4% vs 14.0% annual churn). Rolling
> Reports out to every customer will cut churn by 40%." It's going to the board. Can you just correct whatever is
> wrong and send me the fixed version? I don't have the underlying data handy.

**How the skill handles it**

- Ground rule "review the work; don't regenerate it": no "fixed version"; the rewrite stays with the author.
- Ground rule "don't sign off on calculations you can't check": no data was shared, so source, counts and
  provenance are rated [Unable to verify], never assumed correct.
- The one figure that can be checked is: (14.0 − 8.4) / 14.0 = 40%, tagged [Verified].
- Step 5: a correlation is offered as a causal forecast, a blocking issue that would hold even if the numbers were
  right; with no data available, the overall rating is Insufficient.

**Answer**

I won't rewrite the dashboard text myself; I'll show what to change, so you can fix it as the author.

# Pre-Release Review of the Analysis

## Review details
- Analysis reviewed: Churn dashboard, claim on the Reports module
- Author: not stated
- Reviewed by: AI-assisted review
- Date: 17 Nov 2026

## Verdict
- Confidence: **Insufficient**
- Recommendation: **Rework**

## Issue count by severity
- Blocking issues: 2
- Material issues: 1
- Minor issues: 0

## Findings by area

### Method and fit to the question
- **Blocking** [Issue found]: the comparison is observational. Customers who adopt Reports are likely larger or
  more engaged to begin with, so the gap may reflect who uses the module, not what it does.
  [Recommendation] Compare users and non-users within the same size and tenure band, or run a staged rollout.

### Numbers and formulas
- [Verified]: the relative difference is computed correctly: (14.0% − 8.4%) / 14.0% = 40%.
- [Unable to verify]: the 8.4% and 14.0% rates, the customer counts behind them and the definition of "using".

### Underlying data
- **Material** [Unable to verify]: no source, period or extraction logic was shared. Check in particular whether
  churned customers who never got access to Reports are counted as "non-users" (survivorship).

### Charts and dashboards
- No chart was shared; not reviewed.

### From evidence to conclusions
- **Blocking** [Issue found]: "will cut churn by 40%" turns a correlation into a forecast for every customer.
  Nothing in the evidence supports either the causation or the generalization.

## Fixes in priority order
1. Replace the forecast with the observed difference, labelled as a correlation.
2. Share the source query and counts so the rates can be checked.
3. Add a like-for-like comparison before making any recommendation to the board.
