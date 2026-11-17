# Interface Microcopy Writer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Deleting a board, with brand voice guidelines

**Request**

> We need copy for deleting a board in Taskweave, our planning tool. When an admin deletes a board, all its cards
> and comments go too, and it can't be restored. We need the dialog and the success toast. Voice guidelines: warm,
> plain-spoken, expert; conversational; "we" and "you"; contractions yes; no emoji; we say "board" and "card", never
> "project" or "task"; avoid "oops". Toast max 60 characters.

**How the skill handles it**

- Step 1: an admin doing a destructive action on purpose, likely focused, maybe anxious; tone calm and precise.
- Step 2: two copy types, a confirmation prompt and success copy.
- Step 3/4: three variants each, tested on the seven questions; the confirm button repeats the verb ("Delete
  board"), never "OK", and "Are you sure?" never stands alone.
- Voice: applies the given guidelines (contractions, "board"/"card"); the dynamic board name and card count are
  flagged as variables, not invented.

**Answer**

# Microcopy for Taskweave board deletion

## Context
- Feature: Board settings, delete board `[From product context]`
- User flow: admin selects "Delete board" in board settings; dialog; toast after deletion
- Voice: warm, plain-spoken, expert; conversational; "we"/"you"; contractions; no emoji

## The copy, element by element

### Dialog title
  Recommended: Delete "{boardName}"?
  Variants: "Delete this board?" · "Delete {boardName} for everyone?"
  Type: confirmation prompt
  Notes: Quoting the name shows which board it is; the body already covers who is affected. `[Copy pattern]`

### Dialog body
  Recommended: You'll permanently delete this board and its {cardCount} cards, including all comments. You can't undo this.
  Variants: "This board, its {cardCount} cards and all comments will be gone for good." · "Everyone loses access to this board and its {cardCount} cards. Deleted boards can't be restored."
  Type: confirmation prompt
  Notes: {cardCount} needs plural handling ("1 card"). Recommended version names every affected item and the
  consequence; "gone for good" is an idiom that translates poorly. `[AI-drafted — review with product team]`

### Confirm button
  Recommended: Delete board
  Variants: "Delete permanently" · "Yes, delete board"
  Type: CTA (destructive)
  Notes: Same verb as the title; style as a destructive button. "Yes, …" adds a word without adding meaning.

### Cancel button
  Recommended: Keep board
  Variants: "Cancel" · "Go back"
  Type: CTA (dismiss)
  Notes: "Keep board" states the safe outcome; "Cancel" is fine if other dialogs use it, for consistency.

### Success toast
  Recommended: Board deleted. Its cards and comments are gone too.
  Variants: "Board deleted" · "We've deleted {boardName}."
  Type: success
  Notes: 51 characters, within the 60 limit. No undo link, because deletion is permanent; offering "Undo" would
  promise something the product can't do. `[AI-drafted — review with product team]`

## Accessibility and localization
- Reading level: short sentences, everyday words; suitable for a general audience.
- Screen readers: the dialog title should be the dialog's accessible name; the confirm button's visible text is
  enough, no separate aria-label needed. Announce the toast via a polite live region.
- Localization: allow 30–40% expansion in the toast; {boardName} and {cardCount} must stay movable in the
  sentence, as word order differs by language.

## Example 2: Kritik einer Berechtigungsfehlermeldung (auf Deutsch)

**Request**

> Unsere Support-Tickets häufen sich wegen dieser Meldung in unserem Rechnungsportal: "Fehler 403: Zugriff
> verweigert. Sie haben keine Berechtigung für diese Aktion." Sie erscheint, wenn Sachbearbeiter eine Rechnung
> freigeben wollen, das aber nur Teamleitungen dürfen. Platz: max. 140 Zeichen. Styleguide haben wir keinen.

**How the skill handles it**

- Step 1: user tried to approve an invoice and is blocked; likely frustrated; tone helpful and neutral.
- No voice guidelines: neutral, professional tone, formal "Sie" as in the existing text; no voice is guessed.
- Pattern library: the PERMISSION template (what they can't do, why, how to get access); the error code goes,
  as it is not user-facing information.
- Uses only the terms given ("Rechnung freigeben", "Teamleitung"); does not invent a role-request feature.

**Answer**

# Microcopy für das Rechnungsportal: Freigabe ohne Berechtigung

## Kontext
- Funktion: Rechnung freigeben `[From product context]`
- Ablauf: Sachbearbeiter klickt auf Freigeben; Meldung erscheint statt der Freigabe
- Stimme: keine Vorgaben vorhanden, daher neutral und professionell, Anrede "Sie"

**Was an der bisherigen Meldung nicht funktioniert**
- "Fehler 403" ist ein technischer Code ohne Nutzen für die Leserin oder den Leser.
- "Zugriff verweigert" klingt nach Fehlverhalten und erklärt nicht, warum.
- Es fehlt der nächste Schritt; deshalb landen die Fälle im Support.

## Die Texte im Einzelnen

### Fehlermeldung bei Freigabe ohne Berechtigung
  Empfohlen: Sie können diese Rechnung nicht freigeben, weil Freigaben Teamleitungen vorbehalten sind. Bitten Sie Ihre Teamleitung um die Freigabe.
  Varianten: "Rechnungen geben nur Teamleitungen frei. Bitte leiten Sie die Rechnung an Ihre Teamleitung weiter." · "Freigabe nicht möglich: Dafür brauchen Sie die Rolle Teamleitung."
  Typ: Fehler (Berechtigung)
  Hinweise: Empfehlung hat 134 Zeichen, unter der Grenze von 140. Variante 2 setzt eine Weiterleitungsfunktion
  voraus; nur verwenden, wenn es sie gibt. Variante 3 ist knapp, nennt aber keinen nächsten Schritt.
  `[AI-drafted — review with product team]`

### Optionaler Button in der Meldung
  Empfohlen: Teamleitung benachrichtigen
  Varianten: "Freigabe anfordern" · "Schließen"
  Typ: CTA
  Hinweise: Nur einbauen, wenn das Portal eine solche Benachrichtigung bietet; das haben Sie nicht beschrieben.
  Sonst reicht "Schließen". `[Copy pattern]`

**Prüfung der Empfehlung:** klar ohne Vorwissen, kein entbehrliches Wort, nennt den nächsten Schritt, nutzt Ihre
Begriffe, keine Fachsprache, keine Annahmen über die Person, sachlicher Ton.

Noch besser wäre, den Freigeben-Button für Sachbearbeiter gar nicht erst aktiv anzuzeigen; dann bräuchte es die
Meldung nur als Tooltip: "Freigaben sind Teamleitungen vorbehalten."

## Barrierefreiheit und Lokalisierung
- Lesbarkeit: zwei kurze Hauptsätze, Alltagssprache.
- Screenreader: Meldung als Alert-Rolle ausgeben, damit sie sofort vorgelesen wird; ein deaktivierter Button
  braucht den Tooltip-Text auch als zugängliche Beschreibung.
- Lokalisierung: keine Redewendungen; "Teamleitung" sollte im Glossar stehen, damit alle Sprachen denselben
  Rollennamen verwenden.
