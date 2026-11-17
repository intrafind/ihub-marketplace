# Skill Builder: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Converting a custom GPT into a skill

**Request**

> Please turn our custom GPT into an iHub skill. Its instructions: "You are a minutes writer for the Operations
> team. Use Canvas. From the transcript or notes, write: Attendees, Decisions, Action items (owner, due date),
> Open questions. Max one page. English." Knowledge file: none. People use it after weekly ops meetings and
> supplier calls. It should never invent owners or dates; if missing write TBD. Not for customer-facing summaries,
> those go to our Customer Recap skill.

**How the skill handles it**

- Path: conversion; role, steps, format and boundaries are already given, so no interview questions are asked.
- Conversion step 4: "Use Canvas" is tied to the old tool and is dropped.
- Step 2: the description is written from scratch with triggers and a "Not for" line, as the overlap with
  Customer Recap would otherwise cause wrong triggering.
- Step 5–6: checks pass; the hand-over has the file, layout, import steps and test prompts.

**Answer**

**SKILL.md**

```
---
name: ops-meeting-minutes
description: "Writes one-page minutes for internal Operations meetings from a transcript or notes: attendees, decisions, action items with owner and due date, and open questions. Use when the user asks for minutes, a meeting summary, action items or a recap of a weekly ops meeting or supplier call. Not for customer-facing summaries; those belong to the Customer Recap skill."
---

# Ops Meeting Minutes

You write minutes for the Operations team from a meeting transcript or notes. The goal is a one-page record that
tells everyone what was decided and who does what by when. Never invent an owner or a date: a wrong name on an
action item causes more trouble than a gap.

## Where the information comes from
Use the transcript, notes or uploaded document the user provides. If none is attached, ask for it.

## Step 1 — Read for decisions and commitments
Mark every decision (something agreed, not just discussed) and every commitment (someone will do something).

## Step 2 — Build the action items
For each commitment, record the action, the owner and the due date as stated. If the owner or date is not stated,
write `TBD`.

## Step 3 — Collect open questions
List questions raised but not answered, with the person who raised them if known.

## Output format
    # Minutes — [meeting name], [date]
    **Attendees:** [names]
    ## Decisions
    - [decision]
    ## Action items
    | Action | Owner | Due |
    |---|---|---|
    | [action] | [name or TBD] | [date or TBD] |
    ## Open questions
    - [question]

Keep it to one page. Write in English.

## Ground rules
- Never invent owners, dates or decisions; use `TBD`.
- Leave out small talk and discussion that led nowhere.
- Do not write customer-facing summaries.
```

**Folder layout**

```
ops-meeting-minutes/
└── SKILL.md
```

**Getting it into iHub**
1. Put `SKILL.md` in a folder named exactly `ops-meeting-minutes`.
2. Zip the folder so the zip contains that one top-level folder (maximum 10 MB).
3. An iHub administrator imports it under **Admin → Skills → Import**, assigns it to the Operations app and grants
   access to the Operations group. The skills feature must be enabled.
4. Users then call it with `/ops-meeting-minutes`, or it is used automatically when a request matches.

**Test prompts**

```
Should trigger:
1. "Write the minutes for today's ops meeting" + notes
2. "Can you pull the action items out of this supplier call transcript?"
3. "Minutes please" + notes with an action that has no owner  → expected: owner is TBD
Should NOT trigger:
4. "Summarize this call for the customer"  → Customer Recap skill
5. "Draft an email to our logistics provider"
```

Suggestion (accept or reject): if the Operations app has a calendar tool, the skill could take the meeting date and
attendees from the invite.

## Example 2: An idea with secrets and personal data attached (German)

**Request**

> Ich schreibe jede Woche dieselbe Antwort an Lieferanten, die eine Rechnung doppelt geschickt haben.
> Mach daraus einen Skill. Ich hänge unsere Lieferantenliste mit Ansprechpartnern und Handynummern an, und unser
> SMTP-Passwort, damit der Skill die Mails gleich verschickt.

**How the skill handles it**

- Path: only an idea, so the full interview; it asks a few questions at a time, starting with the job and the method.
- Ground rules: passwords and personal data never go into a skill; it says why and what to do instead.
- Step 4: changing contact data is better as a connected source than copied into a reference file.
- Boundaries: sending email is an action the skill can't take by itself; that is clarified before drafting.

**Answer**

Gern, das ist ein guter Kandidat für einen Skill. Zwei Dinge vorab:

**Das SMTP-Passwort und die Handynummern gehören nicht in den Skill.** Jeder, der den Skill nutzen darf, kann seine
Dateien lesen. Bitte löschen Sie das Passwort aus der Anlage und ändern Sie es vorsichtshalber, da es schon geteilt
wurde. Ein Skill verschickt auch selbst keine Mails; er entwirft sie. Ob eine App Mails senden darf, entscheidet Ihr
iHub-Administrator über die Werkzeuge dieser App.

**Die Lieferantenliste** ändert sich laufend. Sie ist besser als Quelle an der App angebunden als in einen Skill
kopiert; dann bleibt sie aktuell, und personenbezogene Daten liegen nicht in einer Datei, die viele lesen können.

Nun zur Aufgabe, ein paar Fragen für den Anfang:

1. Beschreiben Sie einen echten Fall der letzten Wochen: Was hatte der Lieferant geschickt, und was haben Sie
   geantwortet?
2. Wer soll den Skill nutzen: nur Sie oder das ganze Kreditorenteam?
3. Welche Angaben brauchen Sie jedes Mal (Rechnungsnummern, Beträge, Daten), und woher kommen sie: aus Ihrem Kopf, aus
   einem Export, aus einem angebundenen System?
4. Haben Sie eine Mail, mit der Sie zufrieden waren? Ein echtes Beispiel hilft mehr als jede Beschreibung.

Danach frage ich noch nach Ton, Sprache und dem, was der Skill nie tun soll, und zeige Ihnen einen ersten Entwurf.
