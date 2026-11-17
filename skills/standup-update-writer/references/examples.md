# Standup Update Writer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Personal update for a live standup from connected tools

**Request**

> Standup in 10 minutes, what do I say? (Jira and GitHub are connected. Sprint goal: "SEPA direct debit live for
> the three pilot customers by 27 Nov.")
>
> Pulled since Monday 16 Nov:
> - Jira: PAY-412 "Retry SEPA webhook on 5xx" moved to Done; PAY-418 "Mandate reference validation" In Progress;
>   PAY-421 "Connect bank sandbox" Blocked, comment "waiting on sandbox credentials from Nordbank, requested Thu 12 Nov".
>   PAY-425 "Mandate PDF export" in To Do, next in sprint order.
> - GitHub: PR #233 (webhook retry) merged; PR #234 (retry backoff config) merged; PR #237 (mandate reference
>   validation) open, review requested Fri 13 Nov, no reviewer activity; 2 commits "fix typo in README", "prettier".
> - Dependabot PR #239 opened.

**How the skill handles it**

- Step 1: reporting period is the previous business day (Monday 16 Nov); everything is from connected tools, so no
  questions are needed.
- Step 2, rule 1: PAY-421 is blocked in Jira, and PR #237 has waited for review more than 24h, which the skill counts
  as a blocker signal; both go first with what clears them.
- Step 2, rules 2 and 5: the two merged PRs are summarized as one line under PAY-412; typo/formatting commits and the
  Dependabot PR are dropped as noise.
- Step 2, rule 4: PAY-421 has been blocked since 12 Nov and the sandbox is needed before the 27 Nov goal, so it gets
  a risk note. Nothing is invented: only Jira and GitHub items appear, each labelled.
- Step 3: one person, live standup, so the personal format.

**Answer**

## Jonas Weber · daily update · Tuesday 17 Nov 2026

### Blocked on
- PAY-421 Connect bank sandbox — needs sandbox credentials from Nordbank; who on our side can chase their
  integration contact? — blocked since Thu 12 Nov (3 business days) `[From project tracker]`
- PR #237 Mandate reference validation — needs a reviewer from the payments team today — waiting since Fri 13 Nov
  `[From git]`

### Yesterday (done)
- Webhook retry for SEPA (PAY-412) — done: retry on 5xx plus configurable backoff, 2 PRs merged (#233, #234);
  moves the SEPA pilot goal forward `[From project tracker]` `[From git]`

### Planned for today
- PAY-418 Mandate reference validation — address review comments as soon as #237 gets a review, aim to merge today
  `[From project tracker]`
- PAY-425 Mandate PDF export — start once #237 is in review, goal: data mapping drafted by end of day
  `[From project tracker]`

### Risks and heads-ups
- SEPA pilot by 27 Nov depends on the bank sandbox; end-to-end tests cannot start until PAY-421 is unblocked.
  If credentials have not arrived by Thursday, the pilot date is at risk. `[From project tracker]`

Checks: both blockers name what unblocks them; done items state outcomes; reads in about 60 seconds.

## Example 2: Async post in German, one ticket status unknown

**Request**

> Kannst du mir meinen Async-Post für den Teams-Standup schreiben? Nichts angebunden, hier meine Notizen:
> - gestern: Export-Job für Lieferantenstammdaten fertig, ist gemergt (PR 88)
> - Ticket ERP-301 (Rundungsfehler Rechnungsbeträge) — keine Ahnung, ob QA das schon abgenommen hat
> - heute: Mapping für Zolltarifnummern weiterbauen (ERP-307)
> - immer noch warte ich auf den Testmandanten von der IT, das ist jetzt der dritte Standup in Folge

**How the skill handles it**

- Nothing is connected, so the material is the user's notes; every line is labelled as user input (in German, to
  match the request).
- Ground rule "Don't guess a ticket's status": the QA state of ERP-301 is unknown, so it stays out of the post and the
  skill asks one question instead of writing "in QA" or "done".
- Checklist "Nothing has appeared in more than 2 standups": the test-client blocker is on its third standup, so the
  draft says it needs escalation, not just another mention.
- Async format, 3–5 lines; the emoji labels are part of the skill's own format.

**Answer**

Hier ist dein Post, bereit für Teams:

**Lea Hoffmann — 17.11.2026**
✅ Done: Export-Job Lieferantenstammdaten fertig und gemergt (PR 88) `[Laut Nutzerin]`
🔄 Doing: Mapping der Zolltarifnummern (ERP-307), Ziel heute: Mapping-Tabelle vollständig `[Laut Nutzerin]`
🚫 Blocked: Testmandant von der IT fehlt weiter, brauche einen festen Liefertermin von der IT-Leitung, sonst kann
ERP-307 nicht getestet werden `[Laut Nutzerin]`

Zwei Punkte, bevor du postest:

1. **ERP-301 (Rundungsfehler):** Ich habe das Ticket weggelassen, weil ich den Status nicht kenne. Hat QA es schon
   abgenommen? Dann ergänze ich es unter „Done“; ist es noch in Prüfung, unter „Doing“.
2. **Testmandant:** Der Blocker steht jetzt im dritten Standup. Ein weiterer Post wird ihn nicht lösen. Vorschlag:
   heute direkt mit der IT-Leitung oder deinem Teamlead klären, bis wann der Mandant kommt, oder ERP-307 so
   umplanen, dass du zuerst ohne Mandant testbare Teile baust.
