# Customer Onboarding Roadmap: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: 90-day plan from a complete sales handoff

**Request**

> Onboarding plan for Ostwind Energie, start 12 Jan 2027. Bought: field-service app, 150 technician licenses, SAP
> S/4HANA integration for work orders. Goal (their words): "by end of March, technicians close 90% of work orders in
> the app instead of on paper". Their team: Henrik Vogt (Head of Service, project lead), Petra Lang (IT admin), COO
> Martin Ruhl (sponsor). Ours: me (Mira Jansen, CSM), Tom Becker (implementation), Ella Schmid (trainer), Clara Engel
> (VP CS, sponsor). Risks: SAP team busy with year-end close until 31 Jan; many technicians rarely use smartphone
> apps. Henrik wants a weekly 30-minute sync.

**How the skill handles it**

- Step 1: all inputs present; the 90% target is the customer's own, so it may appear.
- The SAP constraint moves the integration into Phase 2; Phase 1 exits with a manual pilot use case.
- Checkpoints fall inside the day windows; each risk has a mitigation and an owner.

**Answer**

```
CUSTOMER ONBOARDING PLAN
Account: Ostwind Energie
CSM: Mira Jansen
Start date: 12 Jan 2027
Target completion: 11 Apr 2027
Contract scope: Field-service app, 150 technician licenses, SAP S/4HANA work-order integration [From account data]
Success criteria: By end of March, technicians close 90% of work orders in the app instead of on paper [From account data]

PHASE 1 — FOUNDATION (Days 1–30)
Goal: App configured, admins trained, one site working in the app without SAP
  Milestone 1: Kickoff with all stakeholders
    Owner: Mira Jansen / Henrik Vogt | Due: 14 Jan | Status: Not started
  Milestone 2: Tenant setup, user import, SSO; dispatch admin training
    Owner: Tom Becker, Ella Schmid / Petra Lang | Due: 27 Jan | Status: Not started
  Milestone 3: Pilot site uses the app with manually created work orders
    Owner: Tom Becker / Henrik Vogt | Due: 5 Feb | Status: Not started
  Exit criteria: Platform configured, admins trained, pilot site closing work orders in the app
  30-day checkpoint: 10 Feb

PHASE 2 — ADOPTION (Days 31–60)
Goal: SAP integration live and technicians across all sites trained
  Milestone 1: SAP work-order integration built and tested
    Owner: Tom Becker / Petra Lang | Due: 26 Feb | Status: Not started
  Milestone 2: Hands-on technician training in groups of up to 12, all sites
    Owner: Ella Schmid / Henrik Vogt | Due: 5 Mar | Status: Not started
  Exit criteria: Integration live, all 150 technicians activated, first app-closure rate recorded
  60-day checkpoint: 10 Mar

PHASE 3 — OPTIMIZATION (Days 61–90)
Goal: 90% of work orders closed in the app and handover to ongoing CS
  Milestone 1: Success-metric review against the 90% target
    Owner: Mira Jansen / Henrik Vogt | Due: 31 Mar | Status: Not started
  Milestone 2: Executive sponsor check-in and value summary
    Owner: Clara Engel / Martin Ruhl | Due: 7 Apr | Status: Not started
  Exit criteria: 90% target met, success plan drafted, cadence agreed
  90-day checkpoint: 9 Apr

RISKS & MITIGATIONS:
  1. SAP team unavailable until 31 Jan → integration scheduled from 1 Feb; Phase 1 runs without SAP → Owner: Tom Becker
  2. Technicians rarely use smartphone apps → small hands-on groups, quick card, a super-user per site → Owner: Ella Schmid
  3. Super-users per site not yet named → Owner: Henrik Vogt [CSM input needed: names by kickoff]

COMMUNICATION CADENCE:
  Weekly 30-minute sync (Henrik's request) plus written status; working sessions as needed (Tom Becker);
  escalation by message plus email; checkpoint reviews on video, each with a written record

STAKEHOLDER MAP:
  Your team:     Mira Jansen — CSM, Tom Becker — Implementation, Ella Schmid — Trainer, Clara Engel — Executive Sponsor
  Customer team: Henrik Vogt — Project Lead, Petra Lang — IT/Admin, Martin Ruhl — Executive Sponsor
```

## Example 2: Thin handoff for a small customer with a tight date

**Request**

> New SMB customer, Bäckerei Schuster (3 shops), bought our online pre-order package. Starts Monday 23 Nov. The owner
> wants online orders running before Christmas. That's all sales wrote. Can you draft the onboarding plan?

**How the skill handles it**

- Adapting the timeline: simple product, SMB customer, so 14/30/45 days with light checkpoints.
- Step 1 gaps (success criteria, customer team, setup) become marked placeholders; nothing is invented.
- The Christmas date is a constraint: the first use case goes live in Phase 1.

**Answer**

Before kickoff I need four answers; the draft marks them as placeholders:
1. Who runs the project at the bakery, and who handles the shop tablets or POS?
2. What does "running" mean to the owner: orders taken online, or orders also paid online?
3. Which point-of-sale or payment setup do the shops use today?
4. All three shops before Christmas, or one first?

```
CUSTOMER ONBOARDING PLAN
Account: Bäckerei Schuster
CSM: [CSM input needed]
Start date: 23 Nov 2026
Target completion: 6 Jan 2027 (45-day SMB track)
Contract scope: Online pre-order package, 3 shops [From account data]
Success criteria: [CSM input needed: owner's definition, at least "online orders before Christmas"]

PHASE 1 — FOUNDATION (Days 1–14)
Goal: Online pre-orders live before the Christmas rush
  Milestone 1: Kickoff call with the owner
    Owner: CSM / [CSM input needed: customer lead] | Due: 24 Nov | Status: Not started
  Milestone 2: Shop data, product list and pickup times set up
    Owner: Implementation / [CSM input needed] | Due: 30 Nov | Status: Not started
  Milestone 3: First shop takes online pre-orders
    Owner: CSM / [CSM input needed] | Due: 4 Dec | Status: Not started
  Exit criteria: At least one shop receiving and fulfilling online orders
  14-day checkpoint: 4 Dec (short call)

PHASE 2 — ADOPTION (Days 15–30)
Goal: Remaining shops live through the Christmas weeks
  Milestone 1: Shops 2 and 3 live (if the owner wants all three)
    Owner: Implementation | Due: 11 Dec | Status: Not started
  Exit criteria: Agreed shops live; [CSM input needed: first success measure]
  30-day checkpoint: 21 Dec

PHASE 3 — OPTIMIZATION (Days 31–45)
Goal: Review Christmas and hand over to ongoing CS
  Milestone 1: Review against the owner's success criteria
    Owner: CSM | Due: 6 Jan | Status: Not started
  Exit criteria: Success criteria met; ongoing cadence agreed
  45-day checkpoint: 6 Jan

RISKS & MITIGATIONS:
  1. Christmas deadline leaves no slack → one shop first, the others follow → Owner: CSM

COMMUNICATION CADENCE:
  [CSM input needed: ask the owner at kickoff whether a short weekly email or a call suits them]

STAKEHOLDER MAP:
  Your team:     [CSM input needed]
  Customer team: Owner — Executive Sponsor and decision-maker; [CSM input needed: shop contacts]
```
