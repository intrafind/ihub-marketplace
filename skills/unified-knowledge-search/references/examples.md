# Unified Knowledge Search: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Finding a specific file that lives in several places

**Request**

> Where's the supplier onboarding checklist? Procurement keeps asking me for it.
>
> (Connected: SharePoint, Confluence, Outlook, Teams, Jira. Hits returned:
> SharePoint "Supplier Onboarding Checklist v3.docx" (sp.example.com/proc/onb-v3), owner Marta Lindqvist, modified
> 02 Oct 2026, text: "All new suppliers must complete steps 1–9 before the first purchase order is released.
> Step 4: sanctions screening via the compliance portal."
> Outlook: mail from Marta Lindqvist, 03 Oct 2026, "New onboarding checklist v3", same .docx attached.
> Teams #procurement: link to the SharePoint file, posted 03 Oct 2026 by Marta Lindqvist.
> Confluence "Supplier onboarding – how it works" (wiki.example.com/x/ONB), owner Daniel Brandt, modified 14 Mar 2025: "Use the checklist
> (v2) attached below. Sanctions screening is done by Finance."
> Jira PROC-88 (jira.example.com/browse/PROC-88) "Update onboarding checklist for sanctions screening", Done 30 Sep 2026.)

**How the skill handles it**

- Step 1: classified as **a specific file**; first sources are document stores and the knowledge base, then email
  and chat. The request is clear, so no question.
- Step 2: the same v3 document appears three times (SharePoint, email attachment, Teams link): collapsed into one
  hit with the SharePoint copy, the most authoritative, and the other two as extra links.
- "Relevant but dated" label for the Confluence page: it points to v2 and contradicts v3 on who does sanctions
  screening, so the skill flags the disagreement instead of hiding the hit.

**Answer**

# Search results for "supplier onboarding checklist"
Sources covered: SharePoint, Confluence, Outlook, Teams, Jira
Hits: 3 (5 before removing duplicates)

## Best matches

### 1. Supplier Onboarding Checklist v3
   Where: SharePoint (Procurement / Policies)
   What: document
   By: Marta Lindqvist
   When: last modified 02 Oct 2026
   Relevance: High — authoritative source, most likely the answer; start here
   Excerpt: "All new suppliers must complete steps 1–9 before the first purchase order is released. Step 4:
   sanctions screening via the compliance portal."
   Open: sp.example.com/proc/onb-v3
   Also at: Outlook mail "New onboarding checklist v3" from Marta Lindqvist, 03 Oct 2026 (attachment);
   Teams #procurement, link posted 03 Oct 2026

### 2. PROC-88 Update onboarding checklist for sanctions screening
   Where: Jira
   What: ticket
   By: not shown in the result
   When: Done 30 Sep 2026
   Relevance: Medium — background on why v3 exists
   Excerpt: title and status only; no description text was returned
   Open: jira.example.com/browse/PROC-88

### 3. Supplier onboarding – how it works
   Where: Confluence
   What: wiki page
   By: Daniel Brandt
   When: last modified 14 Mar 2025
   Relevance: Medium — relevant but dated
   Excerpt: "Use the checklist (v2) attached below. Sanctions screening is done by Finance."
   Open: wiki.example.com/x/ONB

**Sources disagree:** the Confluence page still links v2 and says Finance does sanctions screening; v3 says it runs
through the compliance portal. Send procurement the SharePoint v3 link, and you may want to ask Daniel Brandt to
update or retire the wiki page.

`[Search scope: SharePoint, Confluence, Outlook, Teams, Jira]`

Next steps: want me to look for other versions of the checklist (v1, v2) to see what changed, or find the
compliance portal how-to for step 4?

## Example 2: Policy question with conflicting sources and a missing source

**Request**

> What's our rule on working remotely from another EU country?
>
> (Connected: Confluence, Teams. Email is not connected. Hits:
> Confluence "Remote Work Policy" (wiki.example.com/x/MOB), owner HR (Sabine Krüger), modified 11 Jan 2024:
> "Remote work from another EU country is possible for up to 20 working days per calendar year with prior
> approval from your manager."
> Teams #people-news (teams.example.com/m/4711), Sabine Krüger, 28 Oct 2026: "From 2027 we're planning 30 days in
> other EU countries – the draft is with the works council right now."
> Teams #sales (teams.example.com/m/3820), Jan Ott, 05 Jun 2025: "I spent 4 weeks in Spain, no problem at all.")

**How the skill handles it**

- Step 1: a **decision or policy** question; favors policy documents and the wiki, then chat. Topic widened to
  "workation" and "working abroad".
- Email is not connected, which is where HR approvals would sit: stated up front as a note.
- Ranking: the official policy outranks the chat posts. The HR post is labelled informal and disagreeing; the sales
  message is shown (nothing relevant is held back) but marked as an anecdote, not a rule.
- The answer does not settle the conflict itself: it says which source currently applies and lets the user confirm.

**Answer**

Note: Email is not connected — results may be incomplete for HR approvals and questions sent by email.

# Search results for "remote work from another EU country"
Sources covered: Confluence, Teams
Hits: 3

## Best matches

### 1. Remote Work Policy
   Where: Confluence
   What: wiki page (policy)
   By: HR, Sabine Krüger
   When: last modified 11 Jan 2024
   Relevance: High — authoritative source; start here
   Excerpt: "Remote work from another EU country is possible for up to 20 working days per calendar year with
   prior approval from your manager."
   Open: wiki.example.com/x/MOB

### 2. Announcement of a new rule from 2027
   Where: Teams (#people-news)
   What: chat message
   By: Sabine Krüger
   When: 28 Oct 2026
   Relevance: High, but informal source; confirm against the official policy
   Excerpt: "From 2027 we're planning 30 days in other EU countries – the draft is with the works council right now."
   Open: teams.example.com/m/4711

### 3. Personal experience, Spain
   Where: Teams (#sales)
   What: chat message
   By: Jan Ott
   When: 05 Jun 2025
   Relevance: Medium — a single case, not a rule
   Excerpt: "I spent 4 weeks in Spain, no problem at all."
   Open: teams.example.com/m/3820

**Sources disagree:** the policy in force says 20 working days with approval. The 30 days are, according to HR,
only a draft for 2027 and not yet agreed. Check with HR from when the new rule applies.

`[Search scope: Confluence, Teams]` `[Not searched: Email (not connected)]`

Next steps: should I focus on what HR has published, or look for the works council draft and guidance on
social security certificates for stays abroad?
