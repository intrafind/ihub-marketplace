# WCAG Accessibility Audit: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Audit of a customer portal login form from code

**Request**

> Audit our customer portal login against WCAG 2.2 AA before release; EN 301 549 is our framework. Code:
> `<input type="email" placeholder="E-mail">` `<input type="password" placeholder="Password">`
> Helper text "Min. 12 characters" in #9AA0A6 on #FFFFFF, 14px.
> After 3 failures an image CAPTCHA "Select all tiles with forklifts" appears; no alternative.
> Cookie banner close button: `<div class="x" onclick="close()">×</div>`, 16×16 px.

**How the skill handles it**

- Step 1: target AA as stated; scope is the login screen only, from code, without assistive technology testing.
- Step 2: findings mapped to 3.3.8 (new in 2.2), 4.1.2/2.1.1, 3.3.2/1.3.1 and 1.4.3; the contrast ratio is
  computed from the given hex values (2.64:1), not guessed.
- Step 3: the CAPTCHA and the cookie button lock users out, so Critical; unlabeled fields are Major (users can
  get through by trial); contrast is Minor.

**Answer**

# WCAG 2.2 Audit Report — Customer portal login

## About This Audit
| Item | Detail |
|---|---|
| Carried out on | 17 Nov 2026 |
| Carried out by | Accessibility review (AI-assisted) |
| Conformance target | AA |
| Pages / screens covered | Login screen incl. cookie banner |
| Governing framework | EN 301 549 |

## Key Findings
- Violations found: 4
- Severity split: Critical 2 · Major 1 · Minor 1 · Enhancement 0
- Split by POUR principle: Perceivable 1 · Operable 0 · Understandable 2 · Robust 1
- Most urgent issue: the image CAPTCHA has no alternative, so some users cannot log in at all.
- Conformance verdict: does not conform to WCAG 2.2 Level AA

## Violations, Most Severe First
### Critical (fix immediately)
```
VIOLATION RECORD — LG-1
  WCAG criterion:   3.3.8 Accessible Authentication (Minimum)
  Criterion level:  AA
  Severity rating:  Critical
  Where:            Login, after 3 failed attempts
  The problem:      Image CAPTCHA "Select all tiles with forklifts", no alternative [Seen in supplied materials]
  Who it hurts:     Blind and low-vision users, users with cognitive disabilities; cannot log in
  Behaves now:      Login blocked until the puzzle is solved
  Must behave:      A cognitive test only if an alternative method exists [Per the WCAG spec]
  How to fix:       Replace with rate limiting and a non-interactive bot check, or offer an e-mail login link
  How to verify:    Complete the locked-out flow with keyboard only and with a screen reader

VIOLATION RECORD — LG-2
  WCAG criterion:   4.1.2 Name, Role, Value (also 2.1.1 Keyboard)
  Criterion level:  A
  Severity rating:  Critical
  Where:            Cookie banner close control
  The problem:      <div> with onclick and text "×": no role, no name, not focusable [Seen in supplied materials]
  Who it hurts:     Keyboard and screen reader users; banner cannot be dismissed
  Behaves now:      Only mouse users can close it
  Must behave:      Exposes role "button" and a name, operable by keyboard
  How to fix:       <button type="button" aria-label="Close cookie notice">×</button>, at least 24×24 px (2.5.8)
  How to verify:    Tab to the button, close with Enter and Space; screen reader announces the name
```
### Major (fix within the current cycle)
```
VIOLATION RECORD — LG-3
  WCAG criterion:   3.3.2 Labels or Instructions; 1.3.1 Info and Relationships
  Criterion level:  A
  Severity rating:  Major
  Where:            E-mail and password fields
  The problem:      Placeholder only, no <label>; placeholder disappears on input [Seen in supplied materials]
  Who it hurts:     Screen reader users, users with memory impairments
  Behaves now:      Fields have no persistent, programmatic label
  Must behave:      Each field has a visible label linked to the input
  How to fix:       <label for="email">E-mail</label> plus id; add autocomplete="email" and "current-password" (1.3.5)
  How to verify:    Screen reader announces "E-mail, edit text"; label stays visible while typing

```
### Minor (fix in the next cycle)
```
VIOLATION RECORD — LG-4
  WCAG criterion:   1.4.3 Contrast (Minimum)
  Criterion level:  AA
  Severity rating:  Minor
  Where:            Helper text "Min. 12 characters"
  The problem:      #9AA0A6 on #FFFFFF is 2.64:1 at 14px; 4.5:1 required
  Who it hurts:     Low-vision users; hint hard to read
  Behaves now:      2.64:1
  Must behave:      At least 4.5:1 [Per the WCAG spec]
  How to fix:       Use #6B7280 (4.83:1) or darker
  How to verify:    Contrast checker on the final CSS
```
### Enhancements (backlog)
None.

## Fix Plan
| Phase | Timing | What it covers |
|---|---|---|
| 1 | Immediate: ahead of the next release | LG-1, LG-2 |
| 2 | Current cycle: this sprint or quarter | LG-3 |
| 3 | Planned: the next scheduled cycle | LG-4 |
| 4 | Backlog: future improvement | — |

## Ongoing Testing
- Automated: axe in CI on the login page
- Manual: keyboard-only login, 200% zoom, screen reader pass (NVDA, VoiceOver)
- With users: screen reader users and users with cognitive disabilities

## Method and Limits
- Success criteria checked: 8 (1.3.1, 1.3.5, 1.4.3, 2.1.1, 2.5.8, 3.3.2, 3.3.8, 4.1.2)
- Assistive technology involved: none; review based on code
- Limitations: focus order, focus visibility, zoom and the error state need a live test `[AI judgment — confirm by testing]`

## Example 2: German question about legal compliance with too little material

**Request**

> Ist unser Händlerportal BFSG-konform? Wir haben es letztes Jahr neu gebaut, sieht modern aus.

**How the skill handles it**

- No legal conclusions: whether the BFSG applies or is met is for counsel; the skill offers a WCAG conformance audit.
- No verdict without evidence: nothing about the portal has been shared, so it scopes first (Step 1).

**Answer**

Ob Ihr Portal die Anforderungen des BFSG erfüllt, ist eine rechtliche Frage; die sollte eine fachkundige
Rechtsberatung klären. Ich kann prüfen, ob das Portal WCAG 2.2 Level AA erfüllt; diese Prüfung ist die
technische Grundlage dafür. Ohne Screenshots oder Code kann ich noch keine Aussage machen.

**Vorschlag für den Prüfumfang**
```
SCOPE OF THE AUDIT
  What is audited:       Händlerportal
  Conformance target:    AA
  Pages / flows:         Login, Produktsuche, Bestellung, Rechnungsdownload (bitte bestätigen)
  Out of scope:          noch offen, z. B. eingebundene Drittanbieter-Inhalte
  Disabilities covered:  visuell, auditiv, motorisch, kognitiv
  AT used in testing:    keine; Prüfung anhand Ihrer Unterlagen
  Governing framework:   EN 301 549 / WCAG 2.2 AA
```

**Was ich brauche:** je Seite Screenshot und möglichst HTML, Farbwerte, Beschreibung der Fehlermeldungen und,
falls vorhanden, Ergebnisse eines axe- oder Lighthouse-Laufs.
