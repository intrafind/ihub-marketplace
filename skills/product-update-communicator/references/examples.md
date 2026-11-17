# Product Update Communicator: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Weekly executive update with a launch at risk

**Request**

> Weekly exec update for the customer portal relaunch, week 46 (10–14 Nov), for the leadership team. I'm Lena
> Brandt. Done: 1.2 million invoices migrated to the new archive; beta live with 12 pilot customers. Problem: SSO
> with customers' Azure AD is blocked; our security team hasn't finished its review, expected 21 Nov. Without it,
> the 1 Dec launch slips to 15 Dec. Of our 340 customers, 136 use SSO, the rest log in with passwords. Pilot task
> success rate 87%, target 90%. Options: launch 1 Dec for password customers and add SSO customers on 15 Dec, or
> launch everyone on 15 Dec. I prefer the phased launch. Next: training videos ready 26 Nov.

**How the skill handles it**

- Reader: executives, so business impact and the decision lead; no ticket-level detail.
- Status: a named risk to the launch date with mitigation under way and a decision needed, so At Risk (Amber); not
  Red, because the security review is still expected before the launch window closes.
- "Delivering bad news": fact, impact, mitigation, ask and next check-in, placed at the top.
- Executive template in full; the 204 password customers are derived from the user's figures (340 − 136).

**Answer**

```
Customer portal relaunch update · Week 46 (10–14 Nov 2026)
For: Leadership team · Sent by: Lena Brandt · 14 Nov 2026

Overall: At Risk
Bottom line: The 1 Dec launch is at risk because SSO is blocked by an open security review; we propose launching
for 204 password customers on 1 Dec and adding the 136 SSO customers on 15 Dec.

At risk: SSO for customer launch
- Fact: SSO with customers' Azure AD cannot go live until our security review is complete, expected 21 Nov.
- Impact: launching all 340 customers together moves the launch from 1 Dec to 15 Dec.
- Mitigation: everything else is on track; the phased launch keeps 1 Dec for 204 customers.
- Ask: approve the phased launch (decision below) by 19 Nov.
- Next check-in: 21 Nov, once the security review result is in.

Delivered since last time
- 1.2 million invoices migrated to the new archive: customers keep their full invoice history at launch
- Beta live with 12 pilot customers: real usage before launch

Up next
- Security review of SSO, due 21 Nov
- Training videos for customers, due 26 Nov
- Launch, due 1 Dec (password customers) / 15 Dec (SSO customers), subject to decision

Risks and blockers
- SSO blocked by security review | Handling it by: review prioritised, phased launch prepared | Needs a decision? Yes (see below)

Numbers
- Pilot task success rate: now 87%, aiming for 90%, behind

Decisions we need from you
- Launch approach | Choices: A) phased: 204 password customers on 1 Dec, 136 SSO customers on 15 Dec;
  B) all 340 customers on 15 Dec | We recommend: A, because most customers get the new portal on time and
  the SSO group is not delayed beyond B
  Needed by: 19 Nov
```
(source: user or project data) for all facts and figures; status rating and wording (AI-drafted: check before it
goes out)

I can also produce this as a DOCX file if you want to send it as a document.

## Example 2: Customer newsletter from internal notes

**Request**

> Turn this into the DocuBase customer "What's new" for November. Notes: Project FALCON (new search) shipped 4 Nov, finds
> documents by content now, not just file name. Excel export now 3x faster. Fixed: date filter ignored time zones.
> Bulk tagging is planned for 12 Feb. We cancelled the Outlook add-in. Competitor X has no content search, mention
> that!

**How the skill handles it**

- Customer rules: value first; internal project name "FALCON" removed; the 12 Feb date becomes a range; the
  cancelled add-in and the competitor comparison are left out.
- The 3x speed-up is reported as given, without a percentage the user didn't supply.
- The feedback section has no channel in the notes, so it is marked `[Awaiting data]` rather than invented.
- It tells the user what was changed and why, so nothing is dropped silently.

**Answer**

**What's new in DocuBase: November 2026**

**Just released**
- **Content search:** find documents by what's inside them, not only by their file name.
  Try it: type a phrase from the document into the search bar. `[Awaiting data: link to help article]`

**On the horizon**
- **Bulk tagging:** tag many documents in one step instead of one by one.
  Timing: First quarter of 2027

**Smaller improvements**
- **Faster Excel export:** exports now run three times faster, so large lists are ready sooner.
- **Date filter fix:** the date filter now respects your time zone, so results match the dates you choose.

**Tell us what you think**
`[Awaiting data: feedback channel, e.g. feedback email or form link]`

(source: user or project data) for features and figures; wording (AI-drafted: check before it goes out)

What I changed from your notes, following the rules for customer-facing updates:
- Removed the project name "FALCON": customers don't know internal names.
- Turned 12 Feb into "First quarter of 2027": customer updates give ranges, not dates, so a slip doesn't break a
  promise.
- Left out the cancelled Outlook add-in and the comparison with Competitor X: cancelled features only confuse
  readers, and competitive context doesn't belong in a customer update.
