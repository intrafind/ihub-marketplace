# SEO Health Audit: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Audit from supplied tool exports

**Request**

> SEO audit for shiftloom.io (shift-planning SaaS), data 1 Aug–31 Oct 2026. Exports:
> - Crawl: 412 URLs; 38 internal links to 404 pages; 3 redirect chains; sitemap lists 57 noindex URLs.
> - Search Console: 286 of 340 submitted pages indexed. Mobile LCP 3.9 s on /pricing and the blog template.
> - /blog/shift-planning-template: position 7, 18,400 impressions, 290 clicks, traffic declining.
> - "shift scheduling software" (volume 2,900, KD 61): /features/scheduling at 14 and /blog/best-shift-scheduling-software at 11.
> - "shift swap app": volume 1,300, KD 22, we rank 12 with /features/shift-swap.
> - "employee availability form": volume 880, KD 9, we don't rank; rotaplan.com ranks 3.
> - Ahrefs: our DR 41, 610 referring domains; rotaplan.com DR 58, 1,240 referring domains.
> Auditor: Nele Brink. Competitor: rotaplan.com.

**How the skill handles it**

- Phases 1–5 in order; every number comes from the exports.
- Phase 2: the template page has a 1.6% CTR (290 / 18,400): Underperforming; the two scheduling pages Cannibalize.
- Phase 5: scores Impact × Effort × Confidence and ranks by the product; no ranking or traffic gain is promised.

**Answer**

# SEO health audit for shiftloom.io
Date: 17 Nov 2026
Data period: 1 Aug – 31 Oct 2026
Auditor: Nele Brink

## The short version
shiftloom.io is largely indexed but leaks link value through broken links and splits a core keyword across two
pages. Opportunities: fix 38 broken links, lift the template page's CTR, merge the scheduling pages. Risks: slow
mobile LCP on /pricing, the backlink gap to rotaplan.com, a declining top page. `[AI analysis]`

## Technical state of the site
  Critical issues: 0
  High-priority issues: 2

```
TECHNICAL ISSUE
  Area:           crawlability
  What's wrong:   internal links point to 404 pages
  Severity:       high
  Pages affected: 38 links
  Evidence:       crawl export [From SEO data]
  Impact:         wasted crawl budget and lost internal link value
  Fix:            update links to live URLs or 301-redirect the targets
  Effort:         quick fix
```
- High · performance: mobile LCP 3.9 s on /pricing and the blog template [From SEO data]; "good" is under 2.5 s.
  Fix: compress hero images, defer scripts. Significant effort.
- Medium · indexability: sitemap lists 57 noindex URLs [From SEO data]; remove them. Quick fix.
- Medium · indexability: 54 submitted pages not indexed (340 − 286) [From SEO data]; review the reasons.
- Low · crawlability: 3 redirect chains [From SEO data]; point links at the final URL.

## How existing pages perform
  Pages audited: 3 of 412 (the pages in the exports; full inventory `[Data needed]`)
  Performing: 0 | Underperforming: 1 | Thin/remove: 0 | Cannibalizing: 2
- /blog/shift-planning-template: position 7, 18,400 impressions, 290 clicks, CTR 1.6%, declining [From SEO data].
  Recommendation: optimize title and meta, refresh content.
- /features/scheduling (14) and /blog/best-shift-scheduling-software (11) compete for "shift scheduling software"
  [From SEO data]. Recommendation: consolidate into the feature page, 301 the blog post.

## Keywords worth pursuing
  Quick wins: 1
  Content gaps: 1
- Quick win: "shift swap app", volume 1,300, KD 22, position 12, /features/shift-swap [From SEO data]
- Content gap: "employee availability form", volume 880, KD 9, not ranking; rotaplan.com ranks 3 [From SEO data]

## Versus the competition
```
COMPETITOR: rotaplan.com
  Relationship: both
  Where they beat us:
  - Domain strength: DR 58 vs. 41 [From SEO data]
  - Backlinks: 1,240 vs. 610 referring domains [From SEO data]
  Where we beat them:
  - Not measurable from the exports supplied [Data needed]
  Content they have and we don't:
  - "employee availability form": rotaplan.com ranks 3; their URL and traffic [Data needed]
  What to do about it:
  - Publish an availability form page and earn links to it
```

## Action plan, ranked by priority score
| # | Action | Phase | Impact | Effort | Confidence | Score | Owner | Timeline |
|---|---|---|---|---|---|---|---|---|
| 1 | Fix 38 internal links to 404s | Technical | 2 | 3 | 3 | 18 | SEO | 1 week |
| 2 | New title and meta for /blog/shift-planning-template | Content | 2 | 3 | 2 | 12 | Content | 2 weeks |
| 3 | Merge the two "shift scheduling software" pages, 301 the blog post | Content | 3 | 2 | 2 | 12 | SEO + content | 4 weeks |
| 4 | Remove 57 noindex URLs from the sitemap | Technical | 1 | 3 | 3 | 9 | Engineering | 1 week |
| 5 | Create an employee availability form page | Keyword | 2 | 2 | 2 | 8 | Content | 6 weeks |
| 6 | Expand /features/shift-swap | Keyword | 2 | 2 | 2 | 8 | Content | 4 weeks |
| 7 | Mobile LCP below 2.5 s on /pricing and blog | Technical | 2 | 1 | 2 | 4 | Engineering | 8 weeks |

Scores `[Framework methodology]`, ratings `[AI analysis]`. No ranking or traffic change is guaranteed.

## Supporting data
Exports as supplied. Full page inventory and keyword list `[Data needed]`.

## Example 2: Audit request without any data

**Request**

> Do an SEO audit of brauwerk-shop.de and tell me which high-volume keywords we should target. Promise me at least
> +30% organic traffic so I can get budget. We don't have Search Console set up.

**How the skill handles it**

- "Where the data comes from": nothing is connected or supplied, so it asks for exports phase by phase.
- Ground rules: no volumes, no "high volume" labels and no traffic promise; it explains what it can say instead.
- Missing Search Console is itself a Phase 1 finding.

**Answer**

I can't name high-volume keywords or promise +30% yet: every volume and traffic figure has to come from your own
tools, and no one can guarantee a ranking outcome. What I can do is run the audit as soon as I have the data.

**What I need, by phase**
1. Technical: a crawl export, the sitemap URL, PageSpeed results for home, category and product page.
2. Content: a CMS page list (title, meta, word count, last update); 12 months of landing-page traffic.
3. Keywords: current rankings with volume and difficulty from an SEO tool (Sistrix, SEMrush or Ahrefs).
4. Competitors: the 3–5 shops you see as direct competitors.

**Finding already logged**
```
TECHNICAL ISSUE
  Area:           indexability
  What's wrong:   no Search Console property set up
  Severity:       high
  Pages affected: whole site
  Evidence:       stated by the user
  Impact:         no data on index coverage, clicks, CTR or crawl errors; problems go unseen
  Fix:            verify brauwerk-shop.de in Google Search Console and submit the sitemap
  Effort:         quick fix
```

Set up Search Console today. For the budget case, a scored plan with evidence
behind each action is more defensible than a traffic promise. `[AI analysis]`
