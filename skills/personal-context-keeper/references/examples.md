# Personal Context Keeper: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Taking in a mixed "remember this" message

**Request**

> Remember this: I lead Project Falcon, moving our ERP to the cloud, go-live 1 April 2027, sponsor is our CFO
> Martina Feld. We call the steering committee "SteerCo" and it meets every second Tuesday. I want summaries as
> five bullets max, in English. I'm based in Vienna. Oh, and Tom in IT is unreliable, keep that in mind.

**How the skill handles it**

- "One fact per entry": the message is split into six self-contained entries across five categories.
- "Check you understood": it restates everything and asks for confirmation before saving; one ambiguity ("every second Tuesday") is asked about.
- "Facts only, no inferences": Vienna is stored as stated, with no time zone or language derived from it.
- "Collecting data about other people": the opinion about Tom is not stored; at most his name and team.

**Answer**

Here is what I understood. Please confirm, and tell me if anything is off, before I save it.

```
STORED CONTEXT:
  Category:   Projects
  Key:        Project Falcon
  Value:      You lead Project Falcon: moving the ERP to the cloud; go-live 1 April 2027
  Added:      17 Nov 2026
  Source:     user-provided
```

```
STORED CONTEXT:
  Category:   Team
  Key:        Martina Feld
  Value:      CFO; sponsor of Project Falcon
  Added:      17 Nov 2026
  Source:     user-provided
```

```
STORED CONTEXT:
  Category:   Terminology
  Key:        SteerCo
  Value:      Your team's name for the steering committee
  Added:      17 Nov 2026
  Source:     user-provided
```

```
STORED CONTEXT:
  Category:   Processes
  Key:        SteerCo cadence
  Value:      Meets every second Tuesday [to confirm: every other week, or the second Tuesday of each month?]
  Added:      17 Nov 2026
  Source:     user-provided
```

```
STORED CONTEXT:
  Category:   Preferences
  Key:        Summary format
  Value:      Summaries as five bullets maximum, in English
  Added:      17 Nov 2026
  Source:     user-provided
```

```
STORED CONTEXT:
  Category:   Preferences
  Key:        Base location
  Value:      Based in Vienna
  Added:      17 Nov 2026
  Source:     user-provided
```

**Not stored:** "Tom in IT is unreliable." I don't keep opinions or evaluations about other people. If it helps, I can store "Tom: IT" so I recognise the name.

Once you confirm, I'll save these six entries and use them automatically, for example when you mention Falcon or SteerCo.

## Example 2: Overview, a conflict, a stale entry and a sensitive item (German)

**Request**

> Was weißt du eigentlich alles über mich? Und merk dir bitte meine IBAN für Spesen: AT12 3456 7890 1234 5678.
> Ach ja, der Wochenbericht geht jetzt an Jana Roth, nicht mehr an Uwe.

Stored context before this message:
- Projects · Lighthouse: Onboarding-Redesign, Leitung Sarah Kühn — added 12 Mar 2026
- Projects · Falcon: ERP-Migration in die Cloud, Go-live 1 April 2027 — added 2 Oct 2026
- Team · Uwe Brenner: Bereichsleiter, Empfänger des Wochenberichts — added 2 Oct 2026
- Preferences · Sprache: Zusammenfassungen auf Deutsch, Stichpunkte — added 2 Oct 2026
- Tools & systems · Aufgaben: Jira — added 12 Mar 2026

**How the skill handles it**

- "Pitfalls to avoid": the IBAN is financial account data, so it declines to store it and says why.
- "Keeping the collection current": the new recipient conflicts with the Uwe entry, so it updates it and confirms the old and new value.
- The Lighthouse and Jira entries are older than 6 months (12 March), so it flags them for review instead of applying them silently.
- German request, German answer; overview in the prescribed layout.

**Answer**

**Ihre IBAN speichere ich nicht.** Bankverbindungen gehören zu den sensiblen Daten, die ich grundsätzlich nicht ablege. Für Spesen hinterlegen Sie sie am besten direkt im Spesensystem.

**Aktualisiert:** „Empfänger des Wochenberichts" von „Uwe Brenner" auf „Jana Roth" geändert. Soll ich zu Jana Roth auch ihre Rolle speichern? Bisher kenne ich nur den Namen. Uwe Brenner bleibt als Bereichsleiter eingetragen, ohne den Wochenbericht.

```
# What I Have on File for You

## Projects
  - Lighthouse: Onboarding-Redesign, Leitung Sarah Kühn — added 12 Mar 2026 [noch aktuell?]
  - Falcon: ERP-Migration in die Cloud, Go-live 1 April 2027 — added 2 Oct 2026

## Team
  - Uwe Brenner: Bereichsleiter — added 2 Oct 2026, updated 17 Nov 2026
  - Jana Roth: Empfängerin des Wochenberichts — added 17 Nov 2026

## Preferences
  - Sprache: Zusammenfassungen auf Deutsch, Stichpunkte — added 2 Oct 2026

## Tools & systems
  - Aufgaben: Jira — added 12 Mar 2026 [noch aktuell?]
```

**Bitte kurz prüfen:** Zwei Einträge sind über sechs Monate alt.

1. Läuft Lighthouse noch, und leitet Sarah Kühn es weiterhin? Wenn das Projekt abgeschlossen ist, archiviere ich es.
2. Planen Sie Ihre Aufgaben weiterhin in Jira?
