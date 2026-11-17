# Design System Steward: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Audit of a small web design system

**Request**

> Quarterly audit of Harbor DS, v2.4.0, web only, 9 components, 214 tokens. Our groups are "Core" and "Composite".
> Core: Button (documented, code consistent), TextField (documented, code: error text 12px vs 14px in Figma), Icon
> (no docs, code consistent), Tooltip (documented, consistent, but no product uses it any more).
> Composite: Card (documented, consistent), ProductCard and InfoTile (no docs, both basically Card with an image
> slot; ProductCard hard-codes #0A66C2 and 18px padding), Modal (documented, code only partly built, Esc doesn't
> close it), DataTable (no docs, used in 5 products). We don't track adoption yet.

**How the skill handles it**

- "Before you start": the job is an audit and the user named their own taxonomy, so the matrix uses Core/Composite
  instead of the default Primitives/Patterns/Templates.
- Phase 2 logs one finding per problem kind seen; adoption stays `[Not yet measured]` because no figures were given.
- Phase 4: the Esc fix is a patch (no API change); folding ProductCard and InfoTile into a Card variant is a minor
  release with a deprecation; their removal is breaking, so it lands in a major no sooner than two minors later.
- Component specs are left out: the deliverable section appears only for documentation work.

**Answer**

# Harbor DS: Design System Audit

## The system at a glance
| Name | Release | Platforms | Components | Tokens |
|---|---|---|---|---|
| Harbor DS | 2.4.0 | web | 9 | 214 |

`[User's system data]`

## Audit results
- Reviewed: 9 components
- With documentation: 5 of 9 (55.6%)
- Design and code in sync: 7 of 9 (77.8%)
- Problems logged: 6 (drift 2, redundant 1, undocumented 1 covering 2 components, orphaned 1, token violation 1)

| Measure | Core | Composite |
|---|---|---|
| Total components | 4 | 5 |
| Documented | 3 | 2 |
| Implemented | 4 | 4 (+1 partly: Modal) |
| Consistent | 3 | 4 |
| Adoption | [Not yet measured] | [Not yet measured] |

## Findings and fixes

```
FINDING 1
  Kind of problem:  drift
  Affected:         Modal
  What you saw:     Partly implemented; Esc does not close it in code
  Why it matters:   Keyboard users can be trapped in the dialog; accessibility defect
  Proposed fix:     Implement Esc-to-close and focus return; patch release
  Effort to fix:    Low

FINDING 2
  Kind of problem:  redundant
  Affected:         Card, ProductCard, InfoTile
  What you saw:     Three components for one job; the two newer ones only add an image slot
  Why it matters:   Three APIs to maintain; teams pick at random
  Proposed fix:     Add an optional image slot to Card; deprecate ProductCard and InfoTile
  Effort to fix:    Medium

FINDING 3
  Kind of problem:  token violation
  Affected:         ProductCard
  What you saw:     Hard-coded #0A66C2 and 18px padding
  Why it matters:   Breaks on any theme or token change
  Proposed fix:     Resolved by Finding 2; until then map to existing tokens [Team to decide which]
  Effort to fix:    Low

FINDING 4
  Kind of problem:  undocumented
  Affected:         DataTable, Icon
  What you saw:     In active use without documentation; DataTable in 5 products
  Why it matters:   High bus-factor risk, divergent usage
  Proposed fix:     Write Phase 3 specs, DataTable first
  Effort to fix:    Medium

FINDING 5
  Kind of problem:  drift
  Affected:         TextField
  What you saw:     Error text 12px in code, 14px in Figma
  Why it matters:   Visible inconsistency
  Proposed fix:     Align code to design via the typography token; patch release
  Effort to fix:    Low

FINDING 6
  Kind of problem:  orphaned
  Affected:         Tooltip
  What you saw:     Documented and built, but used by no product
  Why it matters:   Maintenance cost without benefit
  Proposed fix:     Keep or deprecate [Team to decide]
  Effort to fix:    Low
```

## Release plan
- Now on: 2.4.0
- Coming up: 2.4.1 (patch) Modal Esc fix, TextField error text; 2.5.0 (minor) Card image slot, deprecation of
  ProductCard and InfoTile
- Phase-out timeline: ProductCard and InfoTile removed in 3.0.0, not before 2.7.0 has shipped `[Steward framework]`

## Adoption by product
[Not yet measured]. To start, count per product: system components in use, custom overrides, token compliance and
coverage, as in the Phase 5 table.

## How the system is governed
Next quarterly audit and deprecation review in Q1; owners for DataTable and Icon docs `[Team to decide]`.

## Example 2: Deprecation notice without usage data

**Request**

> We want to retire the "InfoBox" component in our DS (currently 4.3.0); "Alert" can do everything it does now.
> Please write the deprecation notice. We don't know how many teams still use InfoBox.

**How the skill handles it**

- Phase 4: deprecation in the next minor (4.4.0); removal no sooner than two minor versions later and, as a
  breaking change, in a major: 5.0.0, not before 4.6.0.
- Ground rules: usage counts are unknown, so they are marked `[Not yet measured]`; the prop mapping between InfoBox
  and Alert is not known either and stays a gap, not a guess.

**Answer**

```
DEPRECATION NOTICE
  Retiring:         InfoBox
  Why:              Alert covers every InfoBox use case; two components for one job [User's system data]
  Use instead:      Alert
  Deprecated as of: 4.4.0
  Removed as of:    5.0.0, not before 4.6.0 has shipped
  How to migrate:   1. Find InfoBox usages in your code
                    2. Replace them with Alert; prop mapping [Team to decide]
                    3. Check visually, especially icons and color variants
                    4. Report the finished migration in the DS channel
```

Still open before the notice is published:
- **Affected products and teams:** [Not yet measured]. A code search for `InfoBox` per repository gives the number;
  without it the timeline can't be judged.
- **Prop mapping InfoBox → Alert:** send me the props of both components and I'll add the table for step 2.
- **Communication:** a changelog entry for 4.4.0 and a short migration guide `[Steward framework]`.
