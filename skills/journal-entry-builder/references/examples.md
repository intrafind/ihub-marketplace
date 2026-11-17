# Journal Entry Builder: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Month-end accrual for consulting services

**Request**

> October close for Halvard Systems GmbH. Brandt IT Services worked 18 days in October at EUR 950/day under
> contract C-2026-044; their invoice only comes in November. Our controller already said: accrue it in October.
> Accounts: 6300 External consulting, 2410 Accrued liabilities, cost center 410 (IT). I'm Ana Kovac, preparer,
> posting limit EUR 25,000. Timesheets approved by the IT lead are in the close folder.

**How the skill handles it**

- Step 1: services received in October, invoice in November, so an **Accrual** in the October period with
  auto-reversal on 1 Nov 2026; the controller has already decided the treatment.
- Step 2: uses the codes given; debit expense, credit accrued liabilities (expense accrual pattern).
- Step 3: 18 × 950 = 17,100.00 on both sides, so the entry balances.
- Step 4/5: timesheets and contract as support; within the posting limit; approver left empty.

**Answer**

> Not professional advice: a qualified professional must review this before it is posted.

```
JOURNAL ENTRY [ref #] · October 2026

| Header field | Value |
|---|---|
| Legal entity | Halvard Systems GmbH |
| Currency | EUR |
| Entry type | Accrual |
| Prepared | Ana Kovac, on [date] |
| Approved | [approver], on [date] |
| Auto-reversal | Yes · reverses on 2026-11-01 |

Lines
| # | GL code · title | What the line is | Dr | Cr | Dept | Memo |
|---|---|---|---|---|---|---|
| 1 | 6300 · External consulting | October consulting expense | 17,100.00 | | 410 | Brandt IT, 18 days × EUR 950, C-2026-044 |
| 2 | 2410 · Accrued liabilities | Liability for services not invoiced | | 17,100.00 | 410 | Invoice expected November 2026 |
| Totals | | | 17,100.00 | 17,100.00 | | |

Why this entry exists
Brandt IT Services delivered 18 consulting days in October 2026 (contract C-2026-044); the invoice arrives in
November. The accrual puts the expense in October and reverses on 1 November.

Support on file
- [ ] Timesheets for October, approved by the IT lead — 18 days — close folder
- [ ] Contract C-2026-044 — day rate EUR 950 — [contract repository location]
- [ ] Controller's instruction to accrue — [email or close checklist reference]

Pre-approval checks
- [x] Dr total equals Cr total (17,100.00 = 17,100.00)
- [ ] GL codes confirmed valid (6300, 2410 open for posting)
- [x] Posting period is the right one (October 2026)
- [ ] Support attached
- [x] Amount inside the preparer's posting limit (17,100.00 ≤ 25,000.00)
- [ ] Preparer and approver are different people (approver to be named)
```

Figure sources: 18 days `[Per schedule, computed]` from the approved timesheets; EUR 950/day `[Per contract]`;
17,100.00 `[Per schedule, computed]`.

## Example 2: Capitalize or expense, not yet decided

**Request**

> We paid Nordlicht Consulting EUR 48,000 for configuring our new ERP system (invoice NC-2211, 15 Oct 2026). I
> think that's capex, right? Book it as an asset for October. I'm not sure which asset account we use. The
> invoice is currently on 6300 External consulting.

**How the skill handles it**

- "Where your role stops": capitalize or expense is a treatment decision, and the user is unsure; the skill does
  not answer "right?" and asks who decides.
- Ground rules: the asset account code was not given, so it stays `[Code not yet assigned]`, not guessed.
- Prepares the reclassification for the case capitalization is confirmed, marked as pending.

**Answer**

> Not professional advice: a qualified professional must review this before it is posted.

Capitalize or expense is an accounting treatment decision for your controller or another qualified accountant,
so I can't confirm "capex" here. They will want the invoice breakdown, the go-live date and your capitalization
policy.

If they confirm capitalization, this is the entry, ready except for the asset account:

```
JOURNAL ENTRY [ref #] · October 2026 · PENDING TREATMENT DECISION

| Header field | Value |
|---|---|
| Legal entity | [Value still open] |
| Currency | EUR |
| Entry type | Reclassification |
| Prepared | [preparer], on [date] |
| Approved | [approver], on [date] |
| Auto-reversal | No · N/A |

Lines
| # | GL code · title | What the line is | Dr | Cr | Dept | Memo |
|---|---|---|---|---|---|---|
| 1 | [Code not yet assigned] · [asset account] | Capitalize ERP configuration | 48,000.00 | | [Value still open] | Nordlicht NC-2211, 15 Oct 2026 |
| 2 | 6300 · External consulting | Remove amount from expense | | 48,000.00 | [Value still open] | Originally booked here |
| Totals | | | 48,000.00 | 48,000.00 | | |

Why this entry exists
Invoice NC-2211 (ERP configuration) was booked to External consulting. If the controller decides it qualifies
for capitalization, this entry moves it to the asset account.

Support on file
- [ ] Invoice NC-2211 — EUR 48,000, ERP configuration — [location]
- [ ] Controller's written treatment decision, with the policy reference — [still to be obtained]
- [ ] Original posting reference on 6300 — [document number]

Pre-approval checks
- [x] Dr total equals Cr total (48,000.00 = 48,000.00)
- [ ] GL codes confirmed valid (asset account still missing)
- [ ] Posting period is the right one (October 2026, once the decision is made in time)
- [ ] Support attached (treatment decision missing)
- [ ] Amount inside the preparer's posting limit
- [ ] Preparer and approver are different people
```

Figure sources: EUR 48,000.00 `[Per invoice]`.

Before this can go for approval I need: the controller's decision, the asset account code, the legal entity, and
the cost center. If the decision is to expense, the existing booking on 6300 stays and no entry is needed.
