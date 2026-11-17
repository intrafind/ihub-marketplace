# Test Strategy Architect: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Test plan for volume discount tiers

**Request**

> Test plan for SHOP-882, volume discounts in our B2B shop. Acceptance criteria: (1) per order line 0% below 100
> units, 5% from 100, 10% from 500; (2) if a promo code applies, only the higher of the two discounts is used;
> (3) discount shown in the cart and on the invoice PDF. Changes in the pricing service, the cart API and the
> invoice service (separate services, REST). Pricing module line coverage today: 81% (CI report).

**How the skill handles it**

- Step 1: the risk is revenue (wrong prices on real invoices), so risk level High and pricing logic counts as
  business-critical (90%+).
- Step 2: logic-heavy change, so the standard pyramid fits; boundary value analysis drives the unit cases.
- Step 3: contract tests apply because two services consume the pricing API; performance tests are left out.

**Answer**

# Test Plan: Volume discount tiers (SHOP-882)

## Summary of the change
- Feature: tiered volume discount per order line, applied in pricing, shown in cart and invoice
- Risk level: High, because a wrong discount reaches customer invoices `[From user context]`
- Test types chosen: unit, integration, contract, E2E
- Estimated test effort: 3 days `[AI recommendation — verify]`

## Pyramid Allocation
- Unit tests: about 70% — tier boundaries, promo comparison, rounding
- Integration tests: about 20% — cart API and invoice service reading discounts from pricing
- E2E tests: about 10% — one order from cart to invoice PDF
- Other: contract tests, 2 (cart ↔ pricing, invoice ↔ pricing) — discount fields in the pricing response
`[Testing methodology]`

## Cases to run

```
TEST CASE: Discount tier boundaries per order line
  Type:            Unit
  Requirement:     AC 1
  Preconditions:   Article list price 20.00 EUR, no promo code
  Input:           Quantities 99, 100, 101, 499, 500, 501
  Expected result: 0%, 5%, 5%, 5%, 10%, 10% discount on the line
  Edge cases:      0 and negative quantity rejected with a validation error
  Priority:        Critical

TEST CASE: Higher of volume and promo discount wins
  Type:            Unit
  Requirement:     AC 2
  Preconditions:   Line of 500 units (10% volume discount)
  Input:           Promo codes worth 8%, 10% and 12%
  Expected result: 10%, 10% (no stacking), 12% applied; never 18% or more
  Edge cases:      Expired promo code; promo for a different article
  Priority:        Critical

TEST CASE: Invoice shows the same discount as the cart
  Type:            E2E
  Requirement:     AC 3
  Preconditions:   Test customer, staging, article with list price 20.00 EUR
  Input:           Order 120 units, check out
  Expected result: Cart and invoice PDF both show 5% and a line total of 2,280.00 EUR
  Edge cases:      Order with mixed lines (one line at 99, one at 500 units)
  Priority:        High
```

## How much coverage we aim for
- New code: 90% line and branch coverage in the pricing module (business-critical) `[Testing methodology]`
- Modified code: no decrease from today's 81%; ratchet towards 90% `[From user context]`
- Excluded from coverage: generated REST client code (verifies the generator, not our logic)

## CI pass/fail gates
- On every PR: all tests pass; no new failures; 90% on new pricing code; coverage delta ≥ 0% (all block merge)
- Pre-deploy: security scan, no critical or high findings (blocks)
- Post-deploy to staging: E2E smoke suite incl. the invoice case, 100% pass (blocks production deploy)
`[Testing methodology]`

## Known gaps and risks
- Performance tests left out: no throughput change expected `[AI recommendation — verify]`
- Invoice PDF checked by text extraction; layout not covered

## Example 2: Request for test code on a legacy interface

**Request**

> We're moving the nightly stock export to our logistics partner from FTP to SFTP. The export code is ten years old
> and has no tests. Just write me the tests for it.

**How the skill handles it**

- Ground rule: no test code before the codebase, language and test library are known. The skill plans and asks.
- Step 2: legacy code without unit tests plus an infrastructure change, so the pyramid is flipped: integration and
  smoke tests first, unit tests while refactoring.
- No coverage figures given: it uses the prescribed sentence instead of a number.

**Answer**

I'll write tests once I know the code and the test framework. Until then, here is the strategy.

# Test Plan: Stock export via SFTP

## Summary of the change
- Feature: nightly stock export to the logistics partner, transport moved from FTP to SFTP
- Risk level: High, a missing or partial export stops picking at the partner `[AI recommendation — verify]`
- Test types chosen: integration, smoke, security; unit tests during refactoring
- Estimated test effort: open, depends on the code

## Pyramid Allocation
Inverted pyramid: legacy code without tests and an infrastructure change `[Testing methodology]`
- Integration tests: the main focus, export against an SFTP test server
- Smoke test: after each deployment, upload and check a test file
- Unit tests: later, for logic extracted during refactoring

## Cases to run

```
TEST CASE: Export arrives complete via SFTP
  Type:            Integration
  Requirement:     File is delivered as before, only over SFTP
  Preconditions:   SFTP test server with key-based login, test stock with 3 articles
  Input:           Start the export job manually
  Expected result: File is in the target folder, byte-identical to the previous FTP export
  Edge cases:      Empty stock; umlauts in article names
  Priority:        Critical

TEST CASE: Failure is reported, not silently ignored
  Type:            Integration
  Requirement:     Risk: partner receives no data
  Preconditions:   SFTP test server with a wrong host key, or stopped
  Input:           Start the export job
  Expected result: Job ends with an error, alert is raised, no partial file in the target folder
  Edge cases:      Connection drops mid-upload
  Priority:        Critical
```

## How much coverage we aim for
Current coverage data needed — request from CI reports. Target for new and modified code afterwards: 80%, with
today's value as the floor (ratcheting).

## CI pass/fail gates
- On every PR: all tests pass, no new failures, no coverage decrease
- Pre-deploy: security scan with no critical or high findings

## Known gaps and risks
- The partner's real SFTP server is not reachable from CI: acceptance with a test file before switching over

**So I can continue:** which language is the export written in, which test framework does the team use, and is
there a sample file of today's export?
