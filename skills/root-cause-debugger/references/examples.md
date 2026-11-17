# Root Cause Debugger: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: A 500 error after a deploy, with a stack trace

**Request**

> Since Tuesday's deploy, `GET /invoices/:id/pdf` returns 500 for some invoices, not all. Log:
> `TypeError: Cannot read properties of undefined (reading 'toFixed') at formatAmount (src/pdf/format.js:14) at
> renderLineItems (src/pdf/invoice.js:52)`. Invoice 88412 fails, 88413 works every time. Tuesday's deploy contained
> commit 4f2a9c1 "Move discount calculation to pricing service". Line 52 is `formatAmount(item.discountAmount)`.
> 88412 has a line-item discount, 88413 doesn't. Just fixing it with `item.discountAmount ?? 0` OK?

**How the skill handles it**

- Phase 1: the bug is deterministic per invoice and has a time boundary (Tuesday's deploy); no extra repro needed.
- Phase 2–3: the stack trace and the recent commit rank highest; hypotheses are specific and falsifiable.
- Phase 5–6: the proposed `?? 0` patches the symptom and would print a wrong discount; the fix goes at the cause.
- Ground rules: the fix is not called verified until the user replays the failing request.

**Answer**

**1. Reproduction** `[From evidence]`
Symptom: `GET /invoices/88412/pdf` returns 500 every time; 88413 returns a PDF. Boundary: started with Tuesday's
deploy. Difference between the two: 88412 has a line-item discount.

**2. Evidence**
- The error originates in `formatAmount` (format.js:14) and is reached from `renderLineItems` (invoice.js:52),
  which passes `item.discountAmount`. `toFixed` on `undefined` means that field is missing on the item.
- The only change in the window is 4f2a9c1, which moved discount calculation to the pricing service.

**3. Hypotheses, ranked**
1. Since 4f2a9c1 the line item carries the discount under a different field (for example a nested `discount`
   object), so `discountAmount` is undefined only when a discount exists. Fits all evidence; falsified if
   88412's item still has a numeric `discountAmount`. `[Hypothesis — requires testing]`
2. The pricing service fails for some invoices and returns items without discount data. Falsified if its response
   for 88412 contains a discount. `[Hypothesis — requires testing]`

**4. Test to run** (variable substitution, one change at a time)
Log the item object at invoice.js:52 for 88412, or inspect the pricing response for that invoice. Compare its keys
with an item from before Tuesday. Then run `git show 4f2a9c1 -- src/pricing` to see the shape it now returns.

**5. Expected chain if hypothesis 1 holds**
```
Symptom:    PDF download returns 500 for invoice 88412
Why 1:      formatAmount throws on undefined
Why 2:      renderLineItems passes item.discountAmount, which is undefined
Why 3:      Line items no longer carry discountAmount after 4f2a9c1
Why 4:      The commit changed the item shape without updating the PDF renderer
Why 5:      No test renders a PDF for an invoice with a discount
Root cause: 4f2a9c1 changed the discount field's shape and the PDF path still reads the old field
```
This also explains the timing (Tuesday) and why discount-free invoices still work. A further prediction worth
checking: any other consumer of `discountAmount` (e-mails, exports) should show wrong or missing discounts too.

**6. Fix**
Not `?? 0`: it would make the PDF print a discount of 0.00 on invoices that have one, which is a silent billing
error. Instead read the field the pricing service now provides, in `renderLineItems` and in every other consumer
found by searching for `discountAmount`. Add a regression test that fails today:

```js
test('renders a PDF for an invoice with a line-item discount', async () => {
  const pdf = await renderInvoice(invoiceWithDiscount);
  expect(pdf.text).toContain('Discount');
});
```

Status: verification pending until `GET /invoices/88412/pdf` returns the PDF with the correct discount on your side.

**7. Prevention** `[Debugging methodology]`
Add a contract test between the pricing service and its consumers, and an alert on 5xx for the PDF endpoint so the
next regression surfaces within minutes instead of through customer tickets.

## Example 2: An intermittent failure with almost no evidence

**Request**

> Our nightly CSV export job fails maybe twice a week, no pattern. Restarting fixes it. I think it's the database.
> Can you just tell me what to change?

**How the skill handles it**

- Phase 1: intermittent, no error message, no logs; the flaky-failure playbook applies, so it collects data first.
- Ground rules: no invented error text and no fix without evidence; it says exactly which data it needs.
- Phase 3: "the database" is not specific; it turns it into testable hypotheses and marks all of them untested.

**Answer**

I can't tell you what to change yet, and a guess here would most likely move the problem rather than solve it.
"Fails twice a week, restart fixes it" fits several different causes, and "the database" could mean any of them.
Here is how to narrow it down quickly.

**What I need from you** `[Debugging methodology]`
1. The exact error message or exit code of a failed run, and the job's log from the 10 minutes before it.
2. Dates and start times of the last five failures, and of five successful runs.
3. Row count and run time of successful runs. Does the run time grow over the week?
4. Anything else that runs at the same time: backups, other batch jobs, index rebuilds, deploys.
5. Whether "restart" means rerunning the job only, or restarting the worker or database.

**Hypotheses to test once that arrives** (all `[Hypothesis — requires testing]`)

| # | Hypothesis | Supported if | Ruled out if |
|---|---|---|---|
| 1 | The export collides with a nightly backup or other batch job that locks or slows the tables | Failures coincide with the other job's run time; lock-wait or timeout errors | Failures happen on nights the other job didn't run |
| 2 | A query timeout is hit once data volume crosses a threshold | Run time grows toward a fixed limit; error names a timeout | Failed runs are as fast as successful ones |
| 3 | A connection drops mid-export and the job doesn't retry | Network or "connection reset" errors in the log | Database logs show the session open until the job ends |
| 4 | Certain rows break the CSV writer (encoding, null in a required column) | Failure repeats if you rerun the export for the same date range | A rerun on the same data succeeds |

Hypothesis 4 is the quickest to check: rerun the export for a failed night's exact date range. If it fails again,
it is data, not timing, and we compare that night's rows with a good night's.

**Meanwhile** raise logging for the job to record start time, row count per batch, and the full exception, so the
next failure leaves evidence behind. `[Debugging methodology]`
