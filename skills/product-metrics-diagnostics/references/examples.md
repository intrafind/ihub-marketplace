# Product Metrics Diagnostics: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Monthly review with a drop in the North Star

**Request**

> October review for our project tool, compared with September. North Star, weekly active projects (average):
> 18,400 (Sep 19,600; last 12 months mean 19,300, SD 350; target 20,000). Inputs: new projects per week 2,150
> (2,180); share of new projects with tasks in week 2: 41% (52%); collaborators invited per project 3.1 (3.2).
> Health: support tickets 648 (480); Android crash rate 1.9% (0.4%). Integrations: weekly projects with a connected
> integration 3,600 (3,300). Mobile 5.2 shipped 7 Oct with a new task-creation flow; mobile task creations are down
> 28% since. Analytics confirms no tracking changes in October. Owners: mobile lead, growth PM, support lead.

**How the skill handles it**

- Step 1: cadence review, October vs September, whole product; known context is the 5.2 release.
- Step 3: the North Star is 900 below its 12-month mean, about 2.6 SD, so a sudden shift; activation fell 11 points.
- Step 4: measurement change ruled out first (analytics confirmed); the timing lines up with 5.2 and the crash rate,
  so "product change" with medium confidence, since crash and flow effects are not yet separated.
- Figures first, interpretation second; every element tagged.

**Answer**

```
Metrics review · October 2026 vs September 2026

Bottom line: Weekly active projects fell 6.1%, an anomaly that lines up with mobile release 5.2:
fewer new projects get tasks in their second week, and Android crashes rose almost fivefold.

1. Scan results

North Star — Weekly active projects
| This period | Comparison period | Delta          | Direction         | Versus target |
|-------------|-------------------|----------------|-------------------|---------------|
| 18,400      | 19,600            | -1,200 (-6.1%) | Down this month   | Under target (20,000) |
[User or analytics data]

Input metrics
- New projects per week — now 2,150, before 2,180, moved -30 (-1.4%); no target defined
- New projects with tasks in week 2 — now 41%, before 52%, moved -11 points; no target defined
- Collaborators invited per project — now 3.1, before 3.2, moved -0.1; no target defined
[User or analytics data]

Health metrics
- Support tickets — now 648, before 480, moved +168 (+35%)
- Android crash rate — now 1.9%, before 0.4%, moved +1.5 points
[User or analytics data]

2. Anomalies — 2 found
| # | Metric | Movement | Diagnosed cause | Confidence | Next step and who owns it |
|---|--------|----------|-----------------|------------|---------------------------|
| 1 | Weekly active projects | -6.1%, about 2.6 SD below 12-month mean | Release 5.2: crashes and new task flow reduce task creation in new projects | M | Separate crash vs flow effect — Mobile lead |
| 2 | Android crash rate | 0.4% -> 1.9% | Release 5.2 | M | Hotfix and crash monitoring — Mobile lead |
[AI interpretation — verify]

Anomaly under diagnosis: weekly active projects moved by -1,200 during October
1st why -> Fewer new projects become active: week-2 task share fell from 52% to 41%
2nd why -> Fewer tasks are created; mobile task creations down 28% since 7 Oct
3rd why -> Release 5.2 changed the mobile task-creation flow and raised Android crashes
4th why -> Unclear whether users abandon the new flow or the app crashes during it
5th why -> Cause not yet fully identified — further investigation needed (crash vs flow)
How sure are we: Medium
Supporting data: timing matches 7 Oct release; no tracking change (confirmed by analytics)

3. Wins
- Projects with a connected integration: 3,600, up from 3,300 (+9.1%) [User or analytics data]

4. Watch list
- Collaborators invited per project (3.2 -> 3.1): small, not anomalous; check next month
- Support tickets (+35%): likely linked to crashes; confirm by ticket topic [AI interpretation — verify]

5. What we recommend
| # | Action | Owner | Priority | Due |
|---|--------|-------|----------|-----|
| 1 | Ship Android crash fix for 5.2 | Mobile lead | High | This sprint |
| 2 | Compare task-flow completion on crash-free sessions vs before 5.2 | Growth PM | High | 2 weeks |
| 3 | Tag October tickets by topic to confirm the crash link | Support lead | Medium | 1 week |

6. Still unexplained
- How much of the drop is crashes and how much the new flow — Growth PM, see action 2
```

## Example 2: A "drop" right after a tracking change

**Request**

> Panic: our new Templates feature launched three weeks ago. Adoption was 12% and 13% in weeks 1 and 2, now it's 4%
> in week 3. Nothing shipped this week. Oh, and the analytics team renamed some events last Tuesday, not sure if
> related. What happened?

**How the skill handles it**

- Step 3: only three periods of history, fewer than 8, so the skill says anomaly detection is unreliable and uses
  directional judgment.
- Step 4 and ground rules: measurement change ruled out first; the event rename lines up with a clean break, so it
  is the leading hypothesis, not a confirmed cause.
- No root cause is asserted; the investigation gets a concrete task.

**Answer**

**Bottom line:** the drop is most likely not real until the event rename is ruled out. `[AI interpretation — verify]`

| Week | Templates adoption |
|---|---|
| 1 | 12% |
| 2 | 13% |
| 3 | 4% |
`[User or analytics data]`

**How far we can trust the comparison:** with three weeks of history there is no reliable variance band (it needs
8–12 periods), so I can only judge direction: a fall from 13% to 4% in one week is sharp. `[Framework guidance]`

**Measurement check first.** A sudden, clean break in the week events were renamed, with no release that week, is
the typical signal of a measurement change. If the adoption metric counts the old event name, every use since
Tuesday is invisible to it. `[Framework guidance]` `[AI interpretation — verify]`

**Cause:** not yet identified — further investigation needed.

**What to check, in this order:**
1. Ask the analytics team which events were renamed, and whether the Templates adoption metric uses one of them.
2. If yes: count week 3 under both the old and the new name. If the total is back near 12–13%, fix the metric
   definition and restate week 3 for everyone who saw the 4%.
3. If no: check error rates and support tickets mentioning Templates for week 3, then segment adoption by platform
   to see whether the drop is limited to one.

Until step 1 is answered, I'd hold off on any product change to Templates.
