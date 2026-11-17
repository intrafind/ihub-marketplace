# SOX Control Tester: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Weekly vendor master review with no exceptions

**Request**

> Workpaper for control P2P-07 from our control matrix: every Monday the AP Lead (Katrin Ober) reviews the system
> report of all vendor master changes from the prior week against the change requests and signs off in the ticket.
> Key, manual, detective, weekly. Assertions: existence, occurrence (payables). The report was validated in IT
> testing in March (IPE). Period 2 Jan–30 Sep 2026, 39 weeks. I picked 8 weeks at random: weeks 3, 9, 14, 18, 22,
> 27, 33, 37. All have the report attached, Katrin's sign-off on the Monday, and every change matched to a request;
> I re-performed week 22 (11 changes) and got the same result. Tester: Jonas Reich, today.

**How the skill handles it**

- Phase 1–2: attributes come from the control matrix; design is effective, and the IPE report was validated.
- Phase 3: 8 of 39 is within the 5–10 range for a weekly control; random selection is recorded item by item.
- Phase 4: inspection on every item plus re-performance on one, so the conclusion does not rest on inquiry.
- Phase 5: no exceptions, so section F is not completed.

**Answer**

# Control Test Workpaper (SOX 404)
| Control ID | Owner | Business process |
|---|---|---|
| P2P-07 | Katrin Ober, AP Lead | Procure to pay |

## A. The control
- What it does: every Monday the AP Lead reviews the system report of all vendor master changes made in the prior
  week, matches each change to an approved change request and signs off in the ticket `[Basis: control matrix]`
- What it is meant to achieve: existence and occurrence of payables; prevents payments to fictitious or altered
  vendors from going unnoticed (accounts payable, cash) `[Basis: control matrix]`

## B. Design evaluation
- Is the design effective? Yes `[Basis: tester's judgment — needs review]`
- Gaps found in the design: None
- IPE validated? Yes, vendor change report validated in IT testing, March 2026 `[Basis: test evidence]`

## C. How the test was planned
| Element | Detail |
|---|---|
| Population | Weekly vendor master change reviews |
| Population size (N) | 39 |
| Sample size (n) | 8 `[Basis: audit methodology]` |
| How items were picked | Random |
| Period tested | 2 Jan 2026 – 30 Sep 2026 |
| Procedures used | Inspection; re-performance (week 22) |

## D. Item-by-item results
| Item no. | What the item is | When the control was performed | Evidence examined | Pass or Fail | Comments |
|---|---|---|---|---|---|
| 1 | Week 3 review | Monday of week 3 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 2 | Week 9 review | Monday of week 9 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 3 | Week 14 review | Monday of week 14 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 4 | Week 18 review | Monday of week 18 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 5 | Week 22 review | Monday of week 22 | Report, ticket sign-off, change requests | Pass | Re-performed: 11 of 11 changes matched |
| 6 | Week 27 review | Monday of week 27 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 7 | Week 33 review | Monday of week 33 | Report, ticket sign-off, change requests | Pass | All changes matched |
| 8 | Week 37 review | Monday of week 37 | Report, ticket sign-off, change requests | Pass | All changes matched |

## E. Results in brief
- Items tested: 8
- Exceptions: 0
- Exception rate: 0/8 = 0%

## F. Deficiency evaluation (complete only when there are exceptions)
Not applicable: no exceptions.

## G. Overall conclusion
Operating effectively `[Basis: test evidence]`

Tested by: Jonas Reich, on 17 Nov 2026
Reviewed by: [name], on [date]

This is not financial or accounting advice; a qualified audit professional must review the workpaper.

## Example 2: Two exceptions and a request to conclude "effective"

**Request**

> Control R2R-12, daily manual journal entry approval: a second person approves every manual JE before posting.
> Population 187 days, I tested 25 random days. Day 14 Mar: JE 4471 (€38,500 accrual) prepared and approved by the
> same person. Day 2 Jul: JE 6120 (€4,200) approved two days after posting. Rest pass. Materiality is €900,000.
> Just classify it as a control deficiency and conclude effective, we need to close this today.

**How the skill handles it**

- Phase 5: the self-approval is a genuine control failure (segregation of duties), not documentation; the late
  approval is a timing failure. Whether either is systematic is unknown, so it recommends expanding the sample.
- Phase 6: it gives a preliminary tier with the factors, plus the mandatory review sentence; it does not adopt the
  user's conclusion without evidence.
- Ground rules: "effective" can't be concluded while exceptions are unevaluated; the conclusion names them.

**Answer**

I can't conclude "effective" on this evidence: one exception is a segregation-of-duties failure, and we don't yet
know whether it is isolated. Here is the update for sections E to G.

## E. Results in brief
- Items tested: 25
- Exceptions: 2
  - 14 Mar: JE 4471 (€38,500 accrual) prepared and approved by the same person `[Basis: test evidence]`
  - 2 Jul: JE 6120 (€4,200) approved two days after posting `[Basis: test evidence]`
- Exception rate: 2/25 = 8%

## F. Deficiency evaluation (complete only when there are exceptions)
- Severity tier: Control Deficiency, pending the expanded sample `[Basis: tester's judgment — needs review]`
- Reasoning: financial magnitude: the two entries total €42,700, about 4.7% of the €900,000 materiality;
  likelihood: the system allowed self-approval, so it may recur; nature of accounts: accruals involve estimates and
  are open to error and override; compensating controls: unknown, please confirm whether a monthly JE review exists;
  pervasiveness: unknown until more items are tested. If the expanded sample shows further self-approvals, a
  Significant Deficiency becomes likely.
- Possible effect on the financial statements: at least €42,700 in the items tested; the exposure across all 187
  days is not yet known
- Compensating controls: to be confirmed
- Is remediation needed? Yes: block self-approval in the ERP

Preliminary view only — audit leadership must review this classification.

## G. Overall conclusion
Pending: no conclusion until the expanded testing is done. Next steps `[Basis: audit methodology]`: expand the
sample to 40–60 days, query all manual JEs in the period where preparer and approver are the same user, and confirm
any compensating review.

This is not financial or accounting advice; a qualified audit professional must review the workpaper.
