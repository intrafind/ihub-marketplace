# Ledger Reconciliation Helper: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: October bank reconciliation

**Request**

> Bank rec for account 1200 Cash – Hanseatic Bank, October 2026, EUR. GL balance 31 Oct: 184,350.20. Bank
> statement 31 Oct: 188,432.20. Items I found:
> - GL 30 Oct: payment to Morlin Tools −6,480.00; on the November statement, cleared 2 Nov.
> - GL 31 Oct: customer receipt Elster AG +3,200.00; on the November statement, credited 3 Nov.
> - Bank 31 Oct: account fees −85.50, not in GL.
> - Bank 28 Oct: Kestrel GmbH "INV 7781" +11,400.00; GL has 11,040.00 for INV 7781. The invoice is 11,400.00.
> - Bank 15 Oct: incoming +527.50, no reference, nothing in GL.
> Last month: 3 items, net gap 2,140.00, none older than 60 days. I'm Jana Pohl; reviewer Felix Haas.

**How the skill handles it**

- Pairing: Bank. Step 1: both balances given; gap 4,082.00.
- Step 3, from evidence: the two November clearings prove Timing; fees are Omission — Book; INV 7781 matches by
  reference with a different amount, and the invoice shows the GL is wrong, so Error — Book (360.00); the
  527.50 has no evidence, so Unidentified, not timing.
- Step 5: adjusted balances agree at 185,152.20, so the reconciliation can be presented as complete.

**Answer**

> This supports your finance workflow and is not financial, tax or accounting advice; a qualified professional
> must review it.

# Reconciliation Worksheet: Cash – Hanseatic Bank — 1200
| Period covered | Prepared by | Reviewed by | Worksheet dated |
|---|---|---|---|
| October 2026 | Jana Pohl | Felix Haas | [date] |

## 1. The two balances
| Side | Period-end balance | Balance date |
|---|---|---|
| Books (general ledger) | 184,350.20 | 31 Oct 2026 |
| Bank statement, Hanseatic Bank | 188,432.20 | 31 Oct 2026 |
| **Gap to explain** | **4,082.00** | |

## 2. Open reconciling items
| No. | Item date | What it is | Amount | Type | Days open | Resolution owner | Open or Resolved |
|---|---|---|---|---|---|---|---|
| 1 | 30 Oct 2026 | Payment Morlin Tools, cleared bank 2 Nov | −6,480.00 | Timing | 1 | Jana Pohl | Open (clearing confirmed) |
| 2 | 31 Oct 2026 | Receipt Elster AG, credited bank 3 Nov | 3,200.00 | Timing | 0 | Jana Pohl | Open (clearing confirmed) |
| 3 | 31 Oct 2026 | Bank account fees not booked | −85.50 | Omission — Book | 0 | Jana Pohl | Open |
| 4 | 28 Oct 2026 | Kestrel INV 7781 booked 11,040.00, received 11,400.00 | 360.00 | Error — Book | 3 | Jana Pohl | Open |
| 5 | 15 Oct 2026 | Incoming payment, no reference | 527.50 | Unidentified | 16 | Jana Pohl | Open |

## 3. Proof that the sides agree
Books side
  Balance per the GL ....................... 184,350.20
  Plus items that raise it ................. 887.50 (items 4, 5)
  Minus items that lower it ................ (85.50) (item 3)
  = GL balance after adjustments ........... 185,152.20

Independent side (Hanseatic Bank)
  Balance per the source ................... 188,432.20
  Plus items that raise it ................. 3,200.00 (item 2)
  Minus items that lower it ................ (6,480.00) (item 1)
  = Source balance after adjustments ....... 185,152.20

Do the two adjusted balances agree? **Yes**

## 4. Open items by age
| Age bucket | Items | Amount outstanding |
|---|---|---|
| Current: 0-30 days | 5 | 10,653.00 (gross) |
| Aged: 31-60 days | 0 | 0.00 |
| Stale: 61-90 days | 0 | 0.00 |
| Critical: over 90 days | 0 | 0.00 |

## 5. Compared with last period
| Measure | This period | Last period | Direction |
|---|---|---|---|
| Number of reconciling items | 5 | 3 | ↑ |
| Unreconciled total (net gap) | 4,082.00 | 2,140.00 | ↑ |
| Items open more than 60 days | 0 | 0 | → |

## 6. Commentary and follow-ups
- Items 1 and 2: clearing confirmed on the November statement; tick off in the November rec.
- Item 3: book fees of 85.50 to bank charges. Item 4: correct INV 7781 receipt by 360.00. Draft both with
  `journal-entry-builder`, citing this worksheet as support.
- Item 5: ask Hanseatic Bank for the remitter details of the 527.50 credit; resolve by 30 Nov 2026 (30 days),
  then escalate. Until identified it must not be booked to revenue.

## 7. Approvals
Prepared by: Jana Pohl, on [date]
Reviewed by: Felix Haas, on [date]

## Example 2: Intercompany balance with a missing side

**Request**

> Reconcile our intercompany receivable from Vardo Polska Sp. z o.o., account 1580, Oct 2026: GL shows EUR
> 62,400.00. I don't have their payable balance yet. The difference is probably timing like always. There's also
> a recharge of EUR 4,150.00 from 12 Jul 2026 they never acknowledged; can we just write it off?

**How the skill handles it**

- Step 1: the counterparty balance is missing, so "No balance supplied for this side yet" and a request; no
  difference can be computed or called timing.
- Ground rules: no default to timing, no write-off recommendation.
- Step 4: the 12 Jul item is 111 days open at 31 Oct, Critical, so it goes to the Controller/CFO.
- The proof is reported as not possible yet.

**Answer**

> This supports your finance workflow and is not financial, tax or accounting advice; a qualified professional
> must review it.

I can't finish this one yet, and I won't label the difference as timing: there is no difference to classify until
Vardo Polska's side is in.

What I need:
1. Vardo Polska's intercompany payable to you at 31 Oct 2026, in EUR, ideally as a transaction list for
   October so the items can be matched one by one.
2. Any correspondence on the 4,150.00 recharge (invoice, their reply or dispute).

On the write-off: I can't recommend one. That is a decision for the Controller or CFO. What I can tell you is
where the item sits:

| No. | Item date | What it is | Amount | Type | Days open | Resolution owner | Open or Resolved |
|---|---|---|---|---|---|---|---|
| 1 | 12 Jul 2026 | Recharge not acknowledged by Vardo Polska | 4,150.00 | Unidentified (not yet known whether booked by them) | 111 | [owner] | Open |

At 111 days it is in the **Critical** bracket (over 90 days): escalate to the Controller/CFO, who decides between
write-off, adjustment or pursuing it with Vardo Polska. Before that, confirm with their accounting team whether
they booked it at all; if they did not, it may be an Omission — External rather than a loss.

Current state of the worksheet:

| Side | Period-end balance | Balance date |
|---|---|---|
| Books (general ledger), 1580 | 62,400.00 | 31 Oct 2026 |
| Vardo Polska Sp. z o.o., IC payable | No balance supplied for this side yet | 31 Oct 2026 |
| **Gap to explain** | **not determinable** | |

Proof: **not possible yet**. The reconciliation stays open until both balances are in and the adjusted balances
agree. Send me their figures and I'll complete the matching and the full worksheet.
