# Data Storytelling: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Spare-parts revenue for the executive board

**Request**

> I have five minutes with the board on our spare-parts business. Revenue 2026: Q1 €4.10M, Q2 €4.35M, Q3 €4.62M.
> Q3 target was €4.40M. Share ordered through the new customer portal: Q1 18%, Q2 26%, Q3 35%. The rest comes in by
> phone and through field reps. What's the story?

**How the skill handles it**

- Data assessment: a short time series with a part-to-whole split; executive audience, so business impact first,
  one insight per section, no methodology.
- Key insights derived from the figures: portal revenue €0.74M → €1.13M → €1.62M, the rest €3.36M → €3.22M → €3.00M.
- The offline decline is the outlier and the tension in the arc; the Progress and Trend templates frame it.
- Chart choice from the table: change over time with a part-to-whole split, so a stacked column chart.

**Answer**

**1. Narrative Summary**
Spare-parts revenue grew from €4.10M in Q1 to €4.62M in Q3 (+12.7%), and Q3 beat its €4.40M target by €0.22M (5.0%).
The growth comes entirely from the customer portal: its revenue more than doubled, from €0.74M to €1.62M, while
phone and field-rep orders fell 10.7%, from €3.36M to €3.00M. Customers are moving to self-service,
and total revenue is rising as they do. The decision now is how to scale the portal and what the traditional channels should focus on.

**2. Key Insights**
- **Headline:** Q3 revenue €4.62M, 5.0% above target.
- **Trend:** +12.7% from Q1 to Q3; portal share up from 18% to 35% in two quarters.
- **Comparison:** the portal added €0.88M from Q1 to Q3, the other channels lost €0.36M, a net gain of €0.52M.
- **Outlier:** offline orders shrink every quarter even as the total grows.
- **Implication:** the portal is now the growth engine; the effort in phone and field sales needs rethinking.

**3. Visualization Plan**
- Chart: stacked column chart, Q1–Q3, two segments: Portal and Phone & field reps.
- Title: "Portal revenue doubled and carried spare parts past target".
- Y axis: revenue in € million, starting at 0; X axis: quarter.
- Colors: portal in the strong brand color, other channels in neutral grey, so the eye follows the growth.
- Annotations: total above each column (€4.10M, €4.35M, €4.62M); share label on the portal segment (18%, 26%, 35%).
- Reference line: Q3 target at €4.40M, dashed, labeled.

**4. Presentation Structure**
1. Setting: spare parts beat the Q3 target (one number: €4.62M vs €4.40M).
2. Rising action: the chart, where the portal segment grows every quarter.
3. Climax: the portal added €0.88M while other channels lost €0.36M.
4. Resolution: the decision requested from the board.

**5. Call to Action**
Ask the board to decide by the Q1 planning round whether to extend the portal to further customer groups, and to
commission a review of what phone and field sales should focus on as order entry moves online.

## Example 2: Retention story for the data team, with a causal claim the data doesn't support

**Request**

> For our analytics review: the new onboarding emails launched 1 May. 90-day retention by signup cohort: Jan 71%,
> Feb 70%, Mar 72%, Apr 71%; May 78%, Jun 79%, Jul 77%, Aug 78%. About 400 signups per month. Also on 1 May the
> entry plan switched to annual billing only. 10% of May–Aug signups were a holdout without emails: holdout 76.2%,
> email group 78.2%. I'd like the headline "Onboarding emails lifted retention by 7 points".

**How the skill handles it**

- Technical audience: methodology, confidence intervals and correlation vs. causation are part of the story.
- The 7-point rise is real, but two changes happened on the same day; the holdout isolates the email effect at
  2.0 points, with a 95% interval of about ±6.9 points. The requested headline would overstate it.
- The Anomaly template fits ("everything was tracking until 1 May"); the chart pairs a line chart with a
  holdout comparison.

**Answer**

**1. Narrative Summary**
90-day retention held at about 71% from January to April and jumped to about 78% from May (average 71.0% vs 78.0%,
+7.0 points). Two changes landed on 1 May: the onboarding emails and annual-only billing. The 10% holdout separates
them: with emails 78.2%, without 76.2%, a difference of 2.0 points. With 160 holdout users, that difference is not
statistically distinguishable from zero, so most of the 7-point rise coincides with the billing change, and the
email effect is not yet proven.

**2. Key Insights**
- **Headline:** 90-day retention +7.0 points after 1 May (71.0% → 78.0%, cohorts of about 400).
- **Comparison:** email group 78.2% (n ≈ 1,440) vs holdout 76.2% (n ≈ 160): +2.0 points.
- **Uncertainty:** 95% interval for the difference about ±6.9 points (normal approximation), so −4.9 to +8.9.
- **Causation:** the cohort jump is a before/after comparison with a confounder (billing); only the holdout is a
  controlled comparison.
- **Implication:** a suggested headline that holds: "Retention rose 7 points after 1 May; emails account for an
  estimated 2, not yet significant."

**3. Visualization Plan**
- Chart 1: line chart of 90-day retention by cohort, Jan–Aug. Title: "Retention stepped up 7 points in May, when
  two changes launched". Y axis: retention in %, 60–85%; X axis: signup month. Vertical annotation at 1 May:
  "Onboarding emails + annual billing". Dashed reference lines at 71.0% and 78.0%.
- Chart 2: dot plot with error bars, email group vs holdout, 95% intervals. Title: "Email effect: +2 points,
  interval includes zero". Holdout dot in a neutral color, email group in the accent color.

**4. Presentation Structure**
1. Setting: retention flat at about 71% for four cohorts.
2. Rising action: the step to about 78% in May.
3. Climax: two changes on the same day; the holdout attributes only 2 points to emails.
4. Resolution: what it would take to measure the email effect properly.
5. Appendix: cohort table, holdout sizes, interval calculation.

**5. Call to Action**
Keep the holdout running: at the current rate of about 40 holdout users a month the interval narrows slowly, so
decide in this review whether to raise the holdout share (for example to 20%) for the September–December cohorts,
and use the cautious headline until then.
