# Buying Committee Mapper: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Standard map for a new-business deal

**Request**

> Map the buying committee for our supplier-quality portal deal at Valtra Medizintechnik (EUR 180K ARR, our typical
> cycle is 9 months). From my CRM notes:
> - Dr. Helena Roos, VP Quality: pushed for the pilot, meets me every two weeks, last call 10 Nov.
> - Marc Feldmann, CFO: signs anything over EUR 100K. Never met him.
> - Ivo Petric, IT architect: runs the security review, last meeting 4 Nov, asked about SSO.
> - Sven Aalto, Head of Procurement: prefers extending their ERP quality module, last contact 28 Oct.
> - Lea Brandt, quality engineer, speaks for the 8 pilot users, positive feedback on 6 Nov.
> Milestones: security review was due 27 Oct, still open; pilot sign-off due 20 Nov; budget decision in January.

**How the skill handles it**

- Step 1: five stakeholders in one defined buying center, so Standard mapping: matrix, structured engagement plan,
  milestone tracking and the full health check, but no Mutual Action Plan.
- Step 3: multi-threading shows the gap: a strong champion, no relationship with the Economic Buyer.
- Step 4, stall detection: threshold set at 5% of a 9-month cycle (about 14 days); the security review is 21 days
  overdue, so it is flagged.
- Ground rules: every fact comes from the CRM notes; the verification note closes the map.

**Answer**

**Stakeholder map: Valtra Medizintechnik, supplier-quality portal** (Standard tier) [From mapping framework]

| Stakeholder | Role | Influence (1-5) | Relationship (1-5) | Stance | Last touchpoint | Next planned action |
|---|---|---|---|---|---|---|
| Dr. Helena Roos, VP Quality | Champion | 4 | 4 | Support | 10 Nov | Co-write the business case for the CFO |
| Marc Feldmann, CFO | Economic Buyer | 5 | 1 | Neutral (unknown) | None | Intro via Helena Roos before pilot sign-off |
| Ivo Petric, IT architect | Technical Evaluator | 3 | 3 | Neutral | 4 Nov | Send SSO documentation, close security review |
| Sven Aalto, Head of Procurement | Blocker | 3 | 2 | Block | 28 Oct | Meeting on ERP-module comparison |
| Lea Brandt, quality engineer | End User | 2 | 3 | Support | 6 Nov | Collect pilot results as proof points |

Stances are from your notes [From account data]; scores are [AI recommendation] based on them.

**Engagement plan**
1. **Economic Buyer gap first.** Ask Helena Roos to set up a 30-minute meeting with Marc Feldmann before 20 Nov;
   lead with business outcomes (fewer supplier deviations, audit readiness), not features. [AI recommendation]
2. **Arm the champion.** Give Helena a one-page business case with Lea Brandt's pilot results. [AI recommendation]
3. **Unblock the technical thread.** Send Ivo Petric the SSO documentation and agree a closing date for the review.
4. **Address the blocker's concern.** Sven Aalto's preference for the ERP module may be fair; prepare a side-by-side
   comparison and, if he declines a meeting, route it through Helena. [AI recommendation]

**Milestone tracking**
| Milestone | Due | Status | Depends on |
|---|---|---|---|
| Security review closed | 27 Oct | **Stalled: 21 days overdue** (threshold 14 days) | SSO documentation |
| Pilot sign-off | 20 Nov | Open | Security review |
| Budget decision | January 2027 | Open | Pilot sign-off, CFO meeting |

**Health check**
| Factor | Assessment |
|---|---|
| Relationship coverage | Champion and Technical Evaluator covered; Economic Buyer not engaged: risk |
| Influence balance | Strongest relationship (Roos, 4) is high-influence, but the highest-influence person (Feldmann, 5) has none |
| Engagement trend | No data available — requires input (earlier interaction history) |
| Champion strength | Active, meets every two weeks; political exposure unknown |
| Blocker status | Concern stated, not yet addressed |

Verify stakeholder information with account owner.

## Example 2: Renewal after the champion left

**Request**

> Renewal at Korvik Foods in 10 weeks. My champion Jan Mertens (Head of Planning) left in October. I've heard their
> procurement team now handles all renewals over EUR 50K; we're at EUR 72K. Usage spread to the Bremen plant this
> year, but I don't know who uses it there. Who should I engage?

**How the skill handles it**

- Renewal section: procurement gains weight, the champion is gone, and new users appeared; all three apply here.
- Ground rule 2: successor, procurement contact and Bremen users are unknown, so those fields read "No data
  available — requires input" instead of invented names.
- Champion loss is the highest-risk event (Step 5), so finding a new champion leads the plan.

**Answer**

**Stakeholder map: Korvik Foods renewal** (Standard tier, renewal mode) [From mapping framework]

| Stakeholder | Role | Influence (1-5) | Relationship (1-5) | Stance | Last touchpoint | Next planned action |
|---|---|---|---|---|---|---|
| Jan Mertens (left Oct 2026) | Former Champion | n/a | n/a | n/a | No data available — requires input | Ask for a referral to his successor |
| Successor as Head of Planning | Champion (to be won) | No data available — requires input | 1 | Unknown | None | Identify via CRM or your Korvik contacts |
| Procurement lead | Economic Buyer gate for >EUR 50K | No data available — requires input | 1 | Unknown | None | Get onto the map now, not at contract stage |
| Bremen plant users | End Users | No data available — requires input | No data available — requires input | Unknown | None | Pull usage data by site |

The departure and the procurement rule are from your note [From account data]; the procurement rule is hearsay,
so confirm it.

**Plan for the next 10 weeks** [AI recommendation]
1. **Weeks 1–2: rebuild the champion thread.** Find out who took over planning; if Jan Mertens is reachable, ask
   him for an introduction.
2. **Weeks 1–3: bring procurement in early.** Confirm the EUR 50K rule and request a contact; ask what they need
   for a renewal decision.
3. **Weeks 2–4: map Bremen.** Pull usage by site from the product data and invite the most active Bremen users to a
   feedback call; a satisfied new site is your strongest value proof.
4. **Weeks 4–6: prove value.** Prepare usage and outcome metrics for the economic buyer conversation.

**Health check:** Relationship coverage Red (no champion, no economic buyer contact); engagement trend declining
since October; blocker status unknown.

Verify stakeholder information with account owner.
