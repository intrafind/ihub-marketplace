# Activity Roundup: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Daily digest across connected sources

**Request**

> What did I miss yesterday? (Tuesday 17 Nov 2026, user: Lena Hofer, platform team lead. Connected: Slack, Jira,
> GitHub, Google Calendar. Email is not connected.)
>
> Retrieved for Mon 16 Nov 09:00 to Tue 17 Nov 09:00:
> - Slack #platform, 16 Nov 14:10, Tomasz Wolny: "@Lena can you approve the Redis upgrade window? Need it by Thu."
> - Jira PLAT-412 "Approve Redis 7.4 maintenance window", assigned to Lena by Tomasz, due 19 Nov.
> - GitHub PR #883 "Rate limiter for export API", review requested from Lena by Aylin Kaya, 16 Nov 11:30.
> - Slack #platform thread, 16 Nov 16:45: team agreed to freeze deploys Fri 20 Nov (decision by Marco Ricci).
> - Jira: PLAT-398, PLAT-401 done; PLAT-405 blocked ("waiting on vendor certificate"); 4 in progress.
> - GitHub: 3 PRs merged, 1 build broken on main then fixed (16 Nov 18:02 / 18:40).
> - Confluence-style page in Google Drive "Q1 capacity plan v2" shared by Marco, 16 Nov.
> - Calendar: Wed 18 Nov 10:00 "Redis upgrade review".
> - Slack #general: office closed 24 Dec (HR announcement).

**How the skill handles it**

- Phase 1: "what did I miss?" means a daily digest across all connected sources; no question needed.
- Phase 4: the Slack ask and PLAT-412 are the same request, so one action item with both links; the deadline is
  the one stated in Jira (19 Nov).
- Phase 3: the deploy freeze is a decision affecting the user (Tier 2); the capacity plan was only shared, not
  retrieved, so it is listed by title and link without guessing its content.
- Email is named as not connected in the header and in the completeness section.

**Answer**

# Activity Roundup — 16–17 Nov 2026

**Period**: Mon 16 Nov 2026, 09:00 to Tue 17 Nov 2026, 09:00
**Sources checked**: Slack, Jira, GitHub, Google Calendar, Google Drive
**Not connected**: Email

---

## Your Action Items (2)

| # | Action | Requester | Source | Deadline | Waiting since |
|---|--------|-----------|--------|----------|---------------|
| 1 | Approve or reschedule the Redis 7.4 maintenance window | Tomasz Wolny | [From: Jira] PLAT-412 + [From: Slack] #platform message 16 Nov 14:10 | 19 Nov 2026 | 19 hours |
| 2 | Review PR #883 "Rate limiter for export API" | Aylin Kaya | [From: GitHub] PR #883 | No deadline stated | 21.5 hours |

---

## Decisions and Changes

### Platform Team
- **Deploy freeze on Fri 20 Nov**: the team agreed no deploys on Friday — Marco Ricci — [From: Slack] #platform thread, 16 Nov 16:45

---

## Where things stand

### Tickets and tasks
- 2 completed | 4 in progress | 1 blocked
- Worth noting: PLAT-405 is blocked, "waiting on vendor certificate" [From: Jira]

### Code and deployments
- 3 PRs merged | 1 waiting for your review | 1 build broken and fixed
- Worth noting: main was broken from 18:02 to 18:40 on 16 Nov and is green again [From: GitHub]

---

## Discussions Waiting on You
- **Redis upgrade window**: Tomasz needs your approval before Thursday; same ask as action item 1 — [From: Slack] #platform — waiting 19 hours

---

## FYI — New Content and Announcements
- "Q1 capacity plan v2" — [From: Google Drive] shared by Marco Ricci, 16 Nov — content not retrieved, open the link to read it
- Office closed 24 Dec — [From: Slack] #general — HR announcement
- Upcoming: "Redis upgrade review", Wed 18 Nov 10:00 — [From: Google Calendar] — prepare your decision on PLAT-412 beforehand

---

## How Complete Is This Roundup
- Sources checked: Slack, Jira, GitHub, Google Calendar, Google Drive
- Sources unavailable: Email, so mail-only requests are missing from this list
- Items left out: none

## Example 2: Catching up after leave, window unclear (German)

**Request**

> Ich bin wieder aus dem Urlaub zurück. Was habe ich verpasst? Bitte nur Teams und Jira, und nur Projekt Atlas.

**How the skill handles it**

- Phase 1: sources ("nur Teams und Jira") and scope ("Projekt Atlas") are given, but the time window is genuinely
  unclear because the user was away without saying how long; that is the one case where the skill asks.
- It asks exactly one question and offers a sensible default so the user can answer in a word.
- It retrieves and summarizes nothing yet: without a window, any list would be guessed.

**Answer**

Willkommen zurück! Eine Frage, bevor ich die Übersicht erstelle: **Seit wann warst du weg?** Nenne mir einfach das
Datum deines ersten Urlaubstags, dann erfasse ich alles ab diesem Tag bis heute (17.11.2026).

Was ich dann liefere:
- Quellen: nur Microsoft Teams und Jira, wie gewünscht (E-Mail, Kalender und Code lasse ich weg)
- Umfang: nur Projekt Atlas
- Detailgrad: Zusammenfassung mit deinen Aufgaben ganz oben; sag Bescheid, wenn du nur Schlagzeilen oder die
  ausführliche Fassung mit Gesprächsauszügen willst
