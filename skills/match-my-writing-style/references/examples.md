# Match My Writing Style: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Building a voice card from samples

**Request**

> I want drafts that sound like me. Here are four things I wrote (about 900 words in total): two internal emails, one
> customer email, and a few Teams messages. Excerpts:
>
> Internal email: "Quick one: can you send me the Q3 numbers by Thursday? I need them for the board pack. Thanks!
> Lars" / "Short version: we're late on the Hansa rollout, about two weeks. Not great, not a disaster. Plan below."
> followed by 4 bullets.
>
> Customer email: "Dear Ms Albers, thank you for your patience. The fix for the export issue is live since this
> morning. If anything still looks off, call me directly: +49 40 1234 567. Best regards, Lars Mertens"
>
> Teams: "yep, on it" / "can we move to 2? clash with the steering call" / "nice work on the demo"
>
> (Quoted replies and my email signature block removed.)

**How the skill handles it**

- "Where the samples come from": four pasted samples, about 900 words, covering chat, internal and external email, so the minimum is met.
- Step 1: every trait gets a short quote as evidence; documents are not in the samples, so that row says "not enough evidence" instead of guessing.
- Step 2: the card fits on one screen and ends with the question whether it feels right, before any drafting.

**Answer**

```
# Voice card: Lars Mertens
Built from: 4 samples, about 900 words (internal email, customer email, Teams chat), 17 Nov 2026

## In one sentence
Direct and friendly, puts the point in the first line, short sentences, calm about bad news.

## Traits
| Trait | Where on the scale | Evidence from the samples |
|---|---|---|
| Formal ↔ casual | 4 internal, 2 external | "Quick one:" / "Dear Ms Albers" |
| Reserved ↔ warm | 3 | "nice work on the demo" |
| Diplomatic ↔ blunt | 4 | "Not great, not a disaster." |
| Concise ↔ expansive | 1 | "yep, on it" |

## Habits to keep
- Opens with a label for the message: "Quick one:", "Short version:"
- States the ask or the news first, context after
- Bullets for plans and lists of three or more items
- Gives a direct phone number when a customer may need help
- Signs internal mail with "Thanks!" and first name; external with "Best regards" and full name

## Things this voice never does
- No "I hope this email finds you well" or other warm-up openers
- No exclamation marks in external mail (one "Thanks!" internally is the limit)
- No emoji
- No hedging such as "just wanted to", "perhaps we could consider"

## Signature words and phrases
"Quick one", "Short version", "Plan below", "Not great, not a disaster", "call me directly"

## By context
| Context | Shift |
|---|---|
| Chat | Lowercase starts, one line, no greeting |
| Internal email | Label opener, 2–5 short sentences, bullets for plans |
| External email | Full salutation and sign-off, still short, ends with a direct contact |
| Documents | Not enough evidence |
```

Does this feel like you? In particular: do you want to keep "Not great, not a disaster" as a habit for bad news, and should I treat the no-emoji rule as firm? If you send a report or a longer document you wrote, I can fill in the Documents row.

To reuse the card in later chats, save it as a personal prompt in the prompt library, keep it as a file to upload, or store it with the Personal Context Keeper skill if you use it.

## Example 2: German rewrite with a check that cannot pass

**Request**

> Hier meine Voice Card von letzter Woche (Auszug: „Direkt, freundlich, kurze Sätze. Kunden: ‚Guten Tag Frau/Herr …',
> Schluss ‚Viele Grüße'. Nie: ‚Wir bedauern die Unannehmlichkeiten', keine Ausrufezeichen extern.") Bitte schreib
> diese Mail so um, dass sie nach mir klingt, und sag dazu, dass wir die Lieferung kostenlos nachliefern:
>
> „Sehr geehrter Herr Krämer, wir bedauern die entstandenen Unannehmlichkeiten zutiefst! Aufgrund eines Fehlers in
> unserem Lager wurden statt 40 nur 32 Ventile geliefert. Die fehlenden 8 Stück werden am Mittwoch, 25. November,
> nachgeliefert. Mit freundlichen Grüßen, Katrin Vogel"

**How the skill handles it**

- "Reusing the voice card": an existing card is given, so Steps 1 and 2 are skipped.
- Step 3.1: content is settled by the user; "kostenlos" is a new commitment the user asked for, so it goes in and is flagged as added content, not voice.
- Step 3 rewrite rule: facts stay (40 ordered, 32 delivered, 8 follow on Wednesday 25 November); only wording and tone change.
- Step 4: all checks pass except one the card cannot decide; the skill says so instead of bending the content.

**Answer**

Guten Tag Herr Krämer,

in Ihrer Lieferung fehlen 8 Ventile: Sie haben 40 bestellt, bei Ihnen sind 32 angekommen. Der Fehler lag bei uns im Lager.

Die 8 fehlenden Ventile kommen am Mittwoch, 25. November, bei Ihnen an. Die Nachlieferung ist für Sie kostenlos.

Entschuldigen Sie bitte den Aufwand. Wenn Sie die Ventile früher brauchen, melden Sie sich direkt bei mir.

Viele Grüße
Katrin Vogel

---

**Check gegen die Voice Card**

| Prüfung | Ergebnis |
|---|---|
| Anrede und Schluss | Erfüllt: „Guten Tag Herr …", „Viele Grüße" [From your samples] |
| Satzlänge | Erfüllt: alle Sätze unter 15 Wörtern |
| Verbotene Formulierungen | Erfüllt: „Wir bedauern die Unannehmlichkeiten" entfernt, kein Ausrufezeichen |
| Signature-Wendungen | Nicht erzwungen; die Karte nennt keine für Reklamationen |
| Formatierung | Erfüllt: Fließtext, keine Aufzählung nötig |
| Ton | Erfüllt: direkt, Fehler klar benannt |
| Generischer Assistententon | Erfüllt |

**Hinweise**

- Inhaltlich neu ist nur „kostenlos", wie von Ihnen gewünscht. [Input required] Bitte bestätigen Sie, dass das freigegeben ist, denn es ist eine Zusage an den Kunden.
- „Wenn Sie die Ventile früher brauchen, melden Sie sich direkt bei mir" ist mein Vorschlag, damit die Mail wie Ihre anderen Kundenmails mit einem direkten Kontakt endet. [My suggestion] Streichen Sie den Satz, falls eine frühere Lieferung nicht möglich ist; eine Telefonnummer habe ich nicht ergänzt, weil sie in Ihrer Vorlage fehlt.
