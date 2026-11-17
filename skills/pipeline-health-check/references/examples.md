# Pipeline Health Check: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Qualifying a small, standard deal

**Request**

> Can you qualify this deal? We sell maintenance-planning software subscriptions; our average deal is EUR 18,000
> and our average cycle is 45 days. Deal: Brenner Fördertechnik, EUR 12,000/year, standard package, no
> customisation. Opened 21 days ago. Our only contact is Jana Wolff, operations manager. She said they have
> "around 10 to 15k" set aside. She doesn't sign; the managing director does, and we haven't met him. Their pain:
> about 40 hours a month go into planning maintenance in Excel, and their ISO 9001 surveillance audit on 15 March
> requires documented maintenance records, so they want to be live by 1 March.

**How the skill handles it**

- Step 1: value below the customer's average, cycle so far under the average, one contact, one standard product:
  mostly LOW, so BANT with the 3-point scale and status-based forecasting.
- Step 2: each BANT element scored against the table's definitions, using only what the user reported.
- Step 3: first assessment, so the Weak element gets targeted SPIN questions (Situation type fills Authority gaps).
- What to deliver: Lightweight review (scores plus a call), with tags and the human-check line.

**Answer**

**Deal qualification: Brenner Fördertechnik, EUR 12,000/year**

**Complexity:** mostly LOW (value under your EUR 18,000 average, 21 days open against a 45-day average, one
contact, standard package), so BANT applies. `[From CRM/user input]` `[From qualification framework]`

| BANT element | Score | Evidence |
|---|---|---|
| Budget | Adequate (2) | A range of EUR 10,000–15,000 was mentioned by Jana Wolff; not confirmed as allocated `[From CRM/user input]` |
| Authority | Weak (1) | Decision maker identified only by role (managing director), never engaged `[From CRM/user input]` |
| Need | Strong (3) | Quantified (about 40 hours a month of manual planning) with an urgency driver (ISO 9001 audit) `[From CRM/user input]` |
| Timeline | Strong (3) | Specific deadline (live by 1 March) tied to a compelling event (audit on 15 March) `[From CRM/user input]` |

**Deal health:** 9 of 12 (75%), **Yellow**: one element is Weak. `[From qualification framework]`

**Call: Hold.** The deal cannot advance while Authority is Weak; everything else supports it. `[AI assessment]`

**Gap: Authority (first assessment)**, so discovery before anything else. Situation questions for the next call with
Jana Wolff:
- "Who besides you will look at the proposal before the managing director signs it?"
- "How did the last software purchase of this size get approved: in a meeting, by email, by a sign-off form?"
- "Would it help if we joined a 20-minute slot with the managing director to walk through the audit timeline?"

Book that call this week and re-score Authority afterwards. With live-by 1 March, the managing director meeting is
the step that decides whether the timeline holds. `[AI assessment]`

Verify with sales leadership before acting on qualification/risk assessments.

If you want this as a formatted spreadsheet to share, I can produce it as an XLSX file.

## Example 2: Asked for a standard coverage ratio

**Request**

> Our Q1 target is EUR 900,000 and the active pipeline is EUR 2.7m, so we're at 3x coverage, which is the industry
> standard, right? Just confirm we're fine. Last year 120 deals entered the pipeline and 30 were won. 38 of the
> current deals (EUR 1.1m) are older than our typical 90-day cycle.

**How the skill handles it**

- Ground rule 2: the skill does not confirm "3x" as a standard or hand out any ratio; it derives required coverage
  from the customer's own conversion history (Step 5, Coverage).
- Step 5, aging: the old pipeline is shown separately, but its conversion rate is not invented; the skill states
  how to compute it and what data is missing.
- No forecast is built, because the question is about coverage only.

**Answer**

**Coverage check: Q1, target EUR 900,000**

I can't confirm 3x as a standard: there is no ratio that fits every company. What counts is your own conversion
rate, and with your figures the picture is different. `[From qualification framework]`

**1. Historical conversion rate**
30 won ÷ 120 entered = **25%** `[From CRM/user input]`

**2. Required coverage**
1 ÷ 0.25 = **4.0x**, so EUR 900,000 × 4 = **EUR 3.6m** of pipeline needed

**3. Current coverage**
EUR 2.7m ÷ EUR 900,000 = **3.0x**, which is **EUR 900,000 short** of what your own history requires.
`[AI assessment]`

**4. Age adjustment (not yet possible)**
EUR 1.1m of the EUR 2.7m (about 41%) sits in 38 deals older than your 90-day cycle. Older pipeline usually converts
less often, so the real gap is probably larger. To quantify it, pull from the CRM:
- how many of last year's 120 deals were still open after 90 days, and
- how many of those were eventually won.

That gives a separate rate for aged deals. Until then, the younger EUR 1.6m covers 1.8x of the target.
`[From CRM/user input]` `[AI assessment]`

**5. Segmentation**
If win rates differ clearly between new business and renewals, or between lead sources, compute steps 1 to 3 for
each segment; a single blended 25% can hide a weak segment.

**Answer to your question:** on your own numbers you are not fine. You need about EUR 900,000 more pipeline, or a
higher win rate than last year, to reach the Q1 target. Next step: review the 38 aged deals one by one and either
re-qualify them with a dated next step or close them out, so the coverage figure reflects real opportunities.

Verify with sales leadership before acting on qualification/risk assessments.
