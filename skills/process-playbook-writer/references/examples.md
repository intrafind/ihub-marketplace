# Process Playbook Writer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Credit notes for disputed invoices

**Request**

> Document our credit note process. Customer disputes an invoice by support ticket; support agent checks it
> against the contract in the CRM and, if valid, creates a credit note request in the ERP. Finance team lead
> approves up to EUR 2,000, head of finance above. AR clerk issues the credit note in the ERP, emails the PDF to
> the customer (copy to account manager), closes the ticket. Targets: decision within 3 working days of the ticket,
> credit note within 2 days of approval. Already paid: AR clerk asks treasury, which refunds within 5 working days.
> Cancelled-contract refunds are a separate process.

**How the skill handles it**

- Step 1: trigger, steps, roles, systems, thresholds, SLAs and one exception are given; nothing is added.
- Step 3: approval would have two As, so it is split into 3a and 3b by amount; each step has exactly one A.
- Step 5: the paid invoice is a known exception; approver absence was not described, so it stays a placeholder.

**Answer**

# Credit notes for disputed invoices

## At a glance
- Purpose: correct a disputed invoice with a credit note
- Owner: `[to be defined by process owner]`
- Last reviewed: 17 November 2026
- Review frequency: `[to be defined by process owner]`
- Version: 1.0

## What this process covers
- Trigger: a customer disputes an invoice through a support ticket
- In scope: claim check, approval, credit note, refund of paid invoices
- Out of scope: refunds for cancelled contracts (separate process)
- Related processes: cancellation refunds `[Placeholder — link]`

## Who takes part
Support agent (checks, requests); finance team lead (approves to EUR 2,000); head of finance (approves above);
AR clerk (issues credit note); treasury (refunds); account manager (informed).

## RACI Matrix

| Step | Support agent | Finance team lead | Head of finance | AR clerk | Treasury | Account manager |
|---|---|---|---|---|---|---|
| 1. Check claim against contract | R/A | | | | | |
| 2. Create credit note request | R/A | I | | | | |
| 3a. Approve (up to EUR 2,000) | I | R/A | | | | |
| 3b. Approve (above EUR 2,000) | I | C | R/A | | | |
| 4. Issue credit note | | | | R/A | | I |
| 5. Refund paid invoice (exception) | | | | R/A | R | I |

RACI check: one A and at least one R per step; no orphan roles. `[Framework methodology]`

## Step-by-step procedure

```
STEP 1: Check the disputed invoice against the contract
  Responsible:    Support agent
  Input:          Support ticket
  Action:         Compare the disputed invoice with the contract in the CRM.
  System:         CRM
  Decision point: If the claim is valid, continue at Step 2. If not: [to be defined by
                  process owner]
  Output:         Assessment noted in the ticket
  Handoff:        None
  SLA:            Within the 3 working days to decision
  Notes:          None

STEP 2: Create the credit note request
  Responsible:    Support agent
  Input:          Valid claim from Step 1
  Action:         Create a credit note request in the ERP with invoice number, amount and reason.
  System:         ERP
  Decision point: If the amount is up to EUR 2,000, go to Step 3a; above, Step 3b.
  Output:         Credit note request
  Handoff:        ERP approval workflow
  SLA:            Within the 3 working days to decision
  Notes:          None

STEP 3: Approve the credit note request (3a up to EUR 2,000 / 3b above EUR 2,000)
  Responsible:    Finance team lead (3a) or head of finance (3b)
  Input:          Credit note request
  Action:         Review reason and amount; approve or reject in the ERP.
  System:         ERP
  Decision point: If rejected: [to be defined by process owner]
  Output:         Approved or rejected request
  Handoff:        ERP workflow to AR clerk
  SLA:            Decision within 3 working days of the ticket
  Notes:          Approver absent: [to be defined by process owner]

STEP 4: Issue the credit note and inform the customer
  Responsible:    AR clerk
  Input:          Approved request
  Action:         Issue it in the ERP, email the PDF to the customer (copy to account manager),
                  close the ticket.
  System:         ERP, email, support tool
  Decision point: If already paid, follow the exception "Paid invoice".
  Output:         Credit note sent; ticket closed
  Handoff:        Email to customer
  SLA:            Within 2 working days of approval
  Notes:          None
```

## When things deviate

```
EXCEPTION: Paid invoice
  Occurs at:    Step 4
  Condition:    The disputed invoice has already been paid
  Response:     Issue the credit note, then ask treasury for the refund (paid within 5 working days).
  Escalation:   [to be defined by process owner]
  Return point: Step 4, close the ticket after the refund
```

## Terms used
- **Credit note:** a document reducing an issued invoice

## Change log
| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 17 Nov 2026 | Process owner | First version |

Open points: owner, review cadence, rejection paths, approver absence, refund escalation. DOCX on request.

## Example 2: A thin description with people's names

**Request**

> Write up our onboarding for IT equipment: when someone new starts, Petra from HR tells Max in IT, Max sets up the
> laptop, done.

**How the skill handles it**

- Step 1: trigger, systems, output, exceptions and SLAs are missing; the skill asks instead of inventing steps.
- Pitfalls ("Individual names"): Petra and Max become role titles.
- It delivers the boundary block it can already fill, with placeholders.

**Answer**

The description covers only the happy path in one line. Before I write steps, please tell me:

1. **Trigger:** what sets it off (signed contract, HR system entry?), and how long before the start date?
2. **Input:** what IT needs to know (role, software, start date), and how it arrives (email, ticket, form)?
3. **Further steps:** accounts, access rights, handover? Who does each?
4. **Systems:** where are requests tracked and devices recorded?
5. **Done and SLA:** what counts as finished, by when?
6. **Exceptions:** no stock, late notice, remote starters?

I've used role titles instead of names (HR coordinator, IT support technician). What I can fill in already:

```
PROCESS BOUNDARY
  Process name:      IT equipment for new employees
  Purpose:           [Placeholder — define with process owner]
  Trigger:           HR coordinator informs IT of a new starter [From process description]
  Starts when:       [to be defined by process owner]
  Ends when:         [to be defined by process owner]
  In scope:          Laptop setup [From process description]
  Out of scope:      [to be defined by process owner]
  Related processes: [to be defined by process owner]
```
