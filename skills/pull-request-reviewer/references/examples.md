# Pull Request Reviewer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Small endpoint with an access-control hole

**Request**

> Please review PR #218, "Invoice PDF download" (ticket BILL-412: customers download their own invoices as PDF).
> Express 4, PostgreSQL. `requireAuth` sets `req.user` with `id` and `customerId`. New file
> `src/routes/invoices.js`:
>
> ```js
> router.get('/invoices/:id/pdf', requireAuth, async (req, res) => {
>   const result = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
>   const pdf = await renderPdf(result.rows[0]);
>   res.type('application/pdf').send(pdf);
> });
> ```
>
> Test added: one test that downloads invoice 1 as its owner.

**How the skill handles it**

- Pass 1: small change (5 lines), but billing data behind a public route, so high risk; intent from BILL-412.
- Passes 2–3: the query never checks the invoice's customer, an IDOR (Broken Access Control), traced from the route
  parameter to the response: Critical. A missing row reaches `renderPdf(undefined)`, and Express 4 does not catch
  rejected async handlers: Major, with the assumption about `renderPdf` stated.
- Passes 4–6: nothing measurable on performance; operations noted as a Minor.
- The parameterised query is credited; repeated patterns don't apply here.

**Answer**

**Review of PR #218: Invoice PDF download**

Size: small (5 lines). Risk: high, because it serves billing documents. Two blocking issues: any logged-in user can
download any customer's invoice, and a missing invoice leaves the request hanging. Good: the query is
parameterised, so there's no SQL injection here.

### Critical — Any authenticated user can download any invoice

**File**: src/routes/invoices.js, line 2
**Category**: Security

**Issue**: The query selects the invoice by `id` only. A user of customer A can request
`/invoices/1043/pdf` and receive customer B's invoice, including names, addresses and amounts (IDOR, Broken
Access Control).

**Suggestion**: Scope the query to the caller's customer and return 404 when nothing matches, so the response
doesn't reveal which IDs exist:

```js
const result = await db.query(
  'SELECT * FROM invoices WHERE id = $1 AND customer_id = $2',
  [req.params.id, req.user.customerId]
);
```

**Evidence**: `req.params.id` flows unchanged into the WHERE clause; `req.user.customerId` is set by `requireAuth`
but never used. [From code]

### Major — Unknown invoice IDs leave the request hanging

**File**: src/routes/invoices.js, lines 3–4
**Category**: Correctness

**Issue**: For an unknown ID, `result.rows[0]` is `undefined` and goes into `renderPdf`. Assuming `renderPdf`
throws on `undefined`, the async handler rejects; Express 4 does not route rejected promises to the error handler,
so the client gets no response until it times out. [Suspected — verify execution path] for the behaviour of
`renderPdf`, which isn't in the diff.

**Suggestion**: Return early with 404 when `result.rows.length === 0`, and wrap the handler (try/catch passing the
error to `next`, or the project's async wrapper if it has one).

**Evidence**: Traced `GET /invoices/999999/pdf` → empty result → `renderPdf(undefined)` → rejected promise with no
`.catch`. [From code]

### Minor — Tests cover only the happy path

**File**: tests for src/routes/invoices.js
**Category**: Style

**Issue**: The single test downloads an invoice as its owner. The two findings above would both pass unnoticed.

**Suggestion**: Add a test for another customer's invoice (expect 404) and for an unknown ID (expect 404).

**Evidence**: Test list in the PR. [From code]

### Suggestion — Select only the columns the PDF needs

**File**: src/routes/invoices.js, line 2
**Category**: Maintainability

**Issue**: `SELECT *` passes every column to the renderer, including any added later. Not wrong today.

**Suggestion**: List the columns `renderPdf` uses. [AI assessment — verify]

**Evidence**: Query in the diff. [From code]

**Merge recommendation:** blocked until the Critical and Major findings are fixed and covered by tests.

## Example 2: "Is this 1,800-line PR safe?" without the code

**Request**

> Quick one: PR #305 changes 1,800 lines across 41 files (auth middleware, a new billing service, a DB migration,
> lots of UI). No description yet. Can you just tell me if it's safe to merge? I've only got the file list.

**How the skill handles it**

- Ground rule "Don't assume code you can't see": without the diff, no safety verdict either way.
- Pass 1: no intent (no description) and a very large size; the size is itself reported as a finding.
- Risk ranking from the file list decides where review effort goes once the diff is available.

**Answer**

I can't tell you it's safe to merge: I haven't seen the code, and a verdict on a file list would be a guess. What I
can say from what you shared:

### Major — The PR is too large to review reliably

**File**: PR #305 as a whole (41 files, about 1,800 lines)
**Category**: Operations

**Issue**: Over 1,000 lines mixing authentication, billing, a database migration and UI. Changes this size hide
bugs, and the migration and auth changes can't be rolled back independently of the UI.

**Suggestion**: Split into at least three PRs: (1) migration, (2) auth middleware, (3) billing service plus UI. If
splitting isn't feasible, I'll review it in those chunks, highest risk first.

**Evidence**: File count and areas from the list you shared. [From code]

To do the review, I need:
1. **The intent:** a PR description or the linked ticket. Without it I can't tell a bug from deliberate behaviour.
2. **The diff**, or access to the repository through a connected Git provider.
3. **For the migration:** whether it must run while the old version still serves traffic.

I'd start with the auth middleware and the migration, then billing, then UI.
