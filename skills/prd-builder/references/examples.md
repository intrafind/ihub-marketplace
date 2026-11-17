# PRD Builder: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Lightweight spec for a small feature

**Request**

> I need a spec for CSV export of the invoice list in our customer portal. Evidence: 46 support tickets in Q3
> asked for it; customers' finance teams currently copy rows by hand into Excel. Engineering estimates 3 days. The
> list already has filters (date range, status). Must export what's filtered. Out of scope: PDF bundles, scheduled
> exports. Only users with the "Billing" role see invoices today. Lists can have up to 5,000 invoices.

**How the skill handles it**

- Phase 1 gate passes: who (customer finance teams), what hurts (manual copying), evidence (46 tickets) and the
  workaround are all given, so no questions.
- "Matching depth": about 3 days is Small, so a lightweight spec with sections 1, 5 and 7 only.
- Phase 2: scope boundaries come straight from the user; the "only one thing" anchor is the filtered export.
- Phase 3: one statement per requirement, testable Given/When/Then; the 5,000-row limit and Billing role become edge
  cases. File encoding is not stated, so it is an open question rather than an assumed constraint.

**Answer**

# PRD: CSV export of the invoice list

Lightweight spec (Small: about 3 days), sections 1, 5 and 7. `[Spec framework]`

## 1. The problem
Finance teams at our customers need invoice data in their own spreadsheets and accounting tools. Today they copy
rows from the portal's invoice list by hand. In Q3, 46 support tickets asked for an export. `[From user input]`
Affected: portal users with the Billing role. How often each customer exports: Data needed — number of distinct
customers among the 46 tickets.

## 5. Requirements, written as user stories

### 5a. Must Have

```
REQUIREMENT R1: Users with the Billing role can export the invoice list as a CSV file.
  User story:        As a customer's finance clerk, I want to download my invoices as CSV
                     so that I can work with them in Excel without copying rows.
  Acceptance criteria:
    GIVEN a user with the Billing role on the invoice list
    WHEN  they choose "Export CSV"
    THEN  a .csv file downloads with one row per invoice and a header row
  Edge cases:
    - The list is empty: the file contains the header row only
    - The user lacks the Billing role: no export option, and a direct call to the export is refused
  Dependencies:      existing invoice list and role check
  Open questions:    see R3
```

```
REQUIREMENT R2: The export contains exactly the invoices that match the active filters.
  User story:        As a finance clerk, I want the export to respect my date and status filters
                     so that I get only the invoices I am reconciling.
  Acceptance criteria:
    GIVEN the list is filtered to status "Paid" and 1–30 September
    WHEN  the user exports
    THEN  the file contains the same invoices, and the same count, as the filtered list
  Edge cases:
    - Filters return 5,000 invoices (the maximum): all 5,000 rows are in the file
  Dependencies:      R1
  Open questions:    none
```

### 5b. Should Have

```
REQUIREMENT R3: The file opens correctly in Excel with umlauts and amounts intact.
  User story:        As a finance clerk in Germany, I want names like "Müller GmbH" and amounts
                     like 1.234,50 to display correctly so that I don't have to clean the data.
  Acceptance criteria:
    GIVEN an invoice for "Müller GmbH" with amount 1,234.50
    WHEN  the exported file is opened in Excel by double-click
    THEN  the name shows "Müller GmbH" and the amount is one numeric cell
  Edge cases:
    - Customer names containing the separator character
  Dependencies:      R1
  Open questions:    Encoding and separator (UTF-8 with BOM? semicolon?) [Requires engineering input]
                     Owner: tech lead, decide by sprint planning
```

### Won't have (this time)
PDF bundles and scheduled exports. `[From user input]`

## 7. Edge-case and error behavior
- Empty result: header-only file, no error message. `[AI suggestion — verify]`
- Missing Billing role: option hidden, export request refused. `[From user input]`
- 5,000 invoices: full export; time limit for generation: `[Requires engineering input]`
- Export fails mid-way (timeout, server error): the user sees "Export failed, please try again" and no partial file
  is downloaded. `[AI suggestion — verify]`

Not included at this size: risks and success metrics. A sensible check after release is whether export-related
tickets drop from the Q3 level of 46. If you want the full standard PRD instead, I'll add sections 2–4 and 6–12. I
can also produce this as a DOCX file.

## Example 2: A solution without a problem (German request)

**Request**

> Unser Vertriebsleiter möchte ein Dashboard mit allen Kundenaktivitäten im Portal. Schreib mir bitte das PRD
> dafür, am besten bis morgen.

**How the skill handles it**

- Phase 1: the only reason given is "stakeholder X wants it", so the skill digs for the problem underneath instead
  of writing requirements.
- Warning sign 1 (no problem statement) is named openly but without lecturing.
- The Phase 1 questions are asked in the prescribed order, in German, and nothing is invented while waiting.

**Answer**

Gern, ich schreibe das PRD. Bevor ich Anforderungen formuliere, brauche ich aber das Problem hinter dem Wunsch:
„Der Vertriebsleiter möchte ein Dashboard" beschreibt eine Lösung, kein Problem. Ohne Problem lässt sich weder der
Umfang begrenzen noch messen, ob das Dashboard etwas gebracht hat. `[Spec framework]`

Fünf Fragen, am besten in dieser Reihenfolge:

1. **Das Problem:** Welche Entscheidung kann der Vertrieb heute nicht oder nur schlecht treffen, und woran sehen Sie
   das? (z. B. Kündigungen, die zu spät auffallen; Upsell-Chancen, die verpasst werden)
2. **Wer ist betroffen:** Wer würde das Dashboard nutzen (Vertriebsleiter, Account Manager, Customer Success), und
   wie oft?
3. **Heutiger Workaround:** Wie verschafft sich der Vertrieb diese Informationen heute: Exporte, Rückfragen beim
   Support, gar nicht?
4. **Warum jetzt:** Hängt das an einem Ziel oder OKR (z. B. Kündigungsquote senken)? Was passiert, wenn wir es
   nicht bauen?
5. **Vorgeschichte:** Gab es schon einen Versuch, etwa einen Report im CRM, und warum hat er nicht gereicht?

Sobald ich Antworten auf 1 bis 3 habe, formuliere ich die Problembeschreibung, und wir legen im nächsten Schritt
gemeinsam fest, was in Version 1 hineingehört und was nicht. Bis morgen ist ein abgestimmter Entwurf realistisch,
wenn die Antworten heute kommen. Passt das?
