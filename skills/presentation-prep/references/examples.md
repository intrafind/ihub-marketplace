# Presentation Prep: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Budget decision in front of the management board

**Request**

> I'm head of IT and have 10 minutes (3 of them for questions) in Thursday's management board meeting, 20 Nov, in
> person. I need approval to replace our VPN with zero-trust access. Facts: 14 VPN outages this year, 2.5 hours on
> average; 320 remote users; new solution EUR 85,000/year; current VPN EUR 52,000/year licence plus EUR 30,000 for
> hardware renewal due in March. The CFO will ask about money. Give me outline, notes and questions.

**How the skill handles it**

- Step 1: audience, goal, slot and format are all given, so no questions; the goal becomes one sentence.
- Step 2: a decision for a board, so "answer first" with the recommendation on slide 2.
- Step 3: 7 minutes of content gives six slides at about 1–1.5 minutes; the outage cost in lost work hours is not
  in the material, so it stays `[Input required]` rather than being estimated.
- Step 5: money first (CFO), then the other angles that fit; the three most-feared questions included.

**Answer**

# Replacing the VPN with zero-trust access: management board, 20 Nov, 10 minutes (3 for Q&A)
Goal: After this talk, the board will approve EUR 85,000/year for zero-trust access because it ends recurring VPN
outages for 320 remote users at nearly the cost of keeping the VPN.

| # | Slide headline | Content | Visual | Time |
|---|---|---|---|---|
| 1 | Replacing the VPN: decision request, head of IT | — | — | 0:30 |
| 2 | We recommend replacing the VPN for EUR 3,000/year more than keeping it | EUR 85,000 vs EUR 82,000; ends outages; decision needed before March renewal | Two bars: keep vs replace | 1:30 |
| 3 | 14 outages this year cost remote staff 35 hours of access | 14 × 2.5 h; 320 users affected; productivity loss `[Input required]` | Timeline of outages | 1:30 |
| 4 | Of three options, only replacement solves the outages | Keep and renew / renew plus redundancy / replace | Option table | 1:30 |
| 5 | The main risk is the switchover, and we can phase it | Pilot group first; VPN as fallback until cut-over | Three-step rollout | 1:00 |
| 6 | We ask for approval today so the hardware renewal can be cancelled | Budget approval; contract signature by 15 Dec; pilot in January | — | 1:00 |
| Backup | Licence breakdown; outage log; security benefits | | | — |

Speaker notes

Slide 2: We recommend replacing the VPN ⏱ 1:30
- Open: **"My recommendation: replace the VPN, at EUR 3,000 a year more than keeping it."** (must-say)
- Point: Keeping it costs EUR 52,000 licence plus EUR 30,000 hardware in March: EUR 82,000. `[From your material]`
- Point: Zero-trust costs EUR 85,000 and removes the box that keeps failing.
- Transition: "Why does the box matter? Here's this year."

Slide 3: 14 outages ⏱ 1:30
- Open: "Fourteen times this year, nobody working remotely could reach our systems."
- Point: Two and a half hours on average, 35 hours in total, 320 people affected.
- Transition: "We looked at three ways to fix that."

Slide 4: Three options ⏱ 1:30
- Point: Renewing keeps the same failure point; redundancy doubles hardware cost `[Input required: quote]`.
- Transition: "Replacement has one real risk."

Slide 5: Switchover risk ⏱ 1:00
- Point: A pilot group first, VPN kept running as fallback until everyone is moved.
- Transition: "So here's what I need from you today."

Slide 6: The ask ⏱ 1:00
- Open: **"I'm asking for EUR 85,000 a year, approved today, so we can cancel the March renewal."** (must-say)
- Point: Contract by 15 December, pilot in January.

Cut list (if the slot shrinks to 6 minutes): drop slide 4 and mention the options in one line on slide 2.

Q&A sheet

Q: Why pay more every year for something that works most of the time?
Short answer: It's EUR 3,000 more than keeping the VPN, and 14 outages are not "most of the time" for 320 people.
Proof: slide 2, outage log in backup.
If pushed: "The full cost of the outages in lost hours I'll bring you by Monday."

Q: What happens if the new system fails during the switch?
Short answer: The VPN stays live until the last user has moved.
Proof: slide 5.
If pushed: "The hardware runs until March either way; the switch happens before then."

Q: Did you consider just adding a second VPN appliance?
Short answer: Yes; it removes single outages but keeps the old access model and doubles hardware cost.
Proof: option table, slide 4.
If pushed: "I don't have the final quote with me; I'll send it Friday."

Questions you'd rather not get: the outage cost in hours lost (prepare the number); whether security signed off;
who runs the rollout alongside daily operations.

Bridging line: "Fair point. What matters for today's decision is whether we renew in March."

Inputs still required: productivity loss per outage; quote for a redundant appliance; security team's view.

## Example 2: No goal and no slot (German request)

**Request**

> Ich soll nächste Woche dem Betriebsrat das neue Schichtmodell für die Montage vorstellen. Kannst du mir die
> Folien machen?

**How the skill handles it**

- Step 1: the audience and topic are known, but goal, slot and constraints are not; the skill does not assume the
  goal (inform? get consent?), because the storyline depends on it.
- It asks the missing points together, in German, and says what it delivers once they are answered.

**Answer**

Gern. Damit die Folien zum Termin passen, brauche ich noch vier Angaben:

1. **Ziel:** Soll der Betriebsrat nach dem Termin zustimmen (Mitbestimmung bei Arbeitszeiten), nur informiert
   sein oder Einwände einbringen? Davon hängt der Aufbau ab.
2. **Zeitrahmen:** Wie viele Minuten haben Sie insgesamt, und wie viel davon für Fragen?
3. **Material:** Gibt es schon Unterlagen zum Modell (Schichtplan, Anzahl Beschäftigte, Zeitpunkt der Umstellung)?
   Bitte hochladen; Zahlen ohne Quelle markiere ich mit `[Input required]`.
4. **Vorgaben:** Gibt es eine Folienvorlage oder Themen, die noch vertraulich sind?

Sobald ich das habe, bekommen Sie eine Folienübersicht mit einer Kernaussage pro Folie, Sprechnotizen und eine
Liste der kritischen Fragen, die der Betriebsrat voraussichtlich stellt.
