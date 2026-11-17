# Campaign Measurement Lab: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Choosing an attribution model for a B2B pipeline

**Request**

> We sell HR software to mid-size companies and still report everything on last-click from Google Analytics. Leadership
> wants a better attribution model. Our facts: average sales cycle 95 days (Salesforce, last 12 months), median 7
> touchpoints per closed deal (HubSpot journey report), multi-touch tracking is set up in HubSpot. Active channels:
> LinkedIn Ads, Google Ads, webinars, SEO content, email nurture. Two trade fairs a year, roughly 20% of logged
> touchpoints. Every deal starts with a demo request form. One marketing ops analyst. Which model should we use?

**How the skill handles it**

- Part 1 pre-filter: offline is about 20% of touchpoints, under half, so the five-factor scoring applies.
- Scores all five factors against the table; all five land on multi-touch, so no split decision is needed.
- Walks the multi-touch tree: the demo request is a distinct lead-creation event and the business is B2B, so W-shaped.
- Moving off last-click is a migration, so the five migration steps apply; the attribution model change is flagged
  for human sign-off and tagged per the ground rules. No benchmark values are offered.

**Answer**

**Recommendation: W-shaped multi-touch attribution, introduced in parallel with last-click** [AI analysis] [High confidence]

Factor scoring [Framework methodology]:

| Factor | Your situation [From customer data] | Points to |
|---|---|---|
| Sales cycle | 95 days average (Salesforce, last 12 months) | Multi-touch (30–180 days) |
| Touchpoints per conversion | Median 7 (HubSpot journey report) | Multi-touch (4–10) |
| Data maturity | Multi-touch tracking in HubSpot; no cross-device or offline stitching | Multi-touch |
| Active channels | 5 digital channels plus 2 trade fairs | Multi-touch (3–5); the fairs are the edge case |
| Analytics investment | One marketing ops analyst | Multi-touch (moderate) |

All five factors point the same way, so single-touch and hybrid are out. Last-click in particular hides how
awareness is generated: with 7 touches per deal, LinkedIn and webinars almost never get credit today.

Which multi-touch model [Framework methodology]: every deal starts with a demo request, a clear lead-creation
moment, and you sell B2B, so the tree leads to **W-shaped**. Start from the common 30/30/30/10 split (first touch /
demo request / last touch / middle touches) and tune it once you have side-by-side data. Algorithmic modeling is not
the right starting point with one analyst.

Trade fairs: at about 20% of touchpoints they are not dominant, but they are invisible to HubSpot unless badge scans
are imported as touchpoints. Decide whether you import them; otherwise the report must say the fairs are excluded.

Migration plan [Framework methodology]:

1. Run W-shaped and last-click side by side for 1–2 full sales cycles; at 95 days that is roughly one to two quarters.
2. Compare the two outputs per channel and note where they agree and where they differ.
3. Investigate the differences: expect them to show which channels last-click over- or under-credits.
4. Switch primary reporting only after leadership agrees on what the new model implies.
5. Keep last-click running for comparison in the first quarter after the switch.

Write the reasons for this choice down before implementation and review them every quarter.

Needs human verification: the change of attribution model and any budget shift that follows from it.

## Example 2: Funnel drop-off, asked for a benchmark

**Request**

> Our MQL numbers dropped last quarter and my boss asks whether 4% visit-to-MQL is bad for SaaS. What's the typical
> rate, and what's going on? Data (HubSpot): Q2 45,000 visits, 2,250 MQLs, 630 SQLs. Q3 48,000 visits, 1,920 MQLs,
> 576 SQLs. We don't track opportunities as a stage. Mid-August we added five fields to the whitepaper form (now 9).

**How the skill handles it**

- Ground rules: declines to give a "typical" SaaS rate and compares against the user's own Q2 baseline instead.
- Part 5, steps 1–3: uses the user's stages, calculates every conversion from their data, flags the missing
  opportunity stage as a blind spot, and ranks drop-off by absolute volume.
- Steps 4–6: checks the causes for that transition, states a root-cause hypothesis in the prescribed sentence form
  and a specific intervention; step 7 hands it to the Part 4 test design.

**Answer**

On the benchmark: I don't provide industry averages or typical conversion rates. The meaningful comparison is your
own history, and that already shows the problem. [Framework methodology]

**Your funnel** [From customer data: HubSpot, Q2 and Q3]

| Stage transition | Q2 | Q3 | Change |
|---|---|---|---|
| Visits → MQL | 2,250 / 45,000 = 5.0% | 1,920 / 48,000 = 4.0% | −1.0 pt |
| MQL → SQL | 630 / 2,250 = 28.0% | 576 / 1,920 = 30.0% | +2.0 pts |
| SQL → Opportunity | not tracked | not tracked | blind spot |

**Where the loss is** [AI analysis] [High confidence]: Visits → MQL. At the Q2 rate, Q3's 48,000 visits would have
produced 2,400 MQLs; you got 1,920, i.e. 480 fewer. MQL → SQL actually improved, so lead quality did not fall. Traffic
grew 6.7%, so the volume problem sits at the form, not in reach.

**Diagnosis** [AI analysis] [Medium confidence]: for this transition the candidate causes are landing-page friction,
CTA clarity and targeting. Your own note points to friction: the form went from 4 to 9 fields in mid-August, inside
the decline period. Not yet separable from targeting changes, because I have no monthly split.

Root-cause hypothesis: If the longer form is the cause, then cutting the whitepaper form back to 4 fields will raise
visit-to-MQL conversion by about 1 point, back toward your Q2 level of 5.0%, because the drop started when the
fields were added while traffic and MQL quality held.

Intervention: A/B test the 4-field form (variant B) against the 9-field form (A) on the whitepaper page, one variable
only. Primary metric: visit-to-MQL rate. Guardrail: MQL → SQL rate must not fall (more leads could mean weaker ones).
Set the sample size with a significance calculator for a 1-point minimum detectable effect, run at least full weeks,
and do not stop early.

**Data needed to confirm** [Framework methodology]:
- Monthly Visits → MQL for July, August, September, to see if the drop starts in mid-August.
- Form-start vs. form-submit counts, if your form tool logs them.
- An opportunity stage in the CRM: until it exists, insufficient data to determine where SQLs are lost.

Needs human verification: any KPI target you set from this.
