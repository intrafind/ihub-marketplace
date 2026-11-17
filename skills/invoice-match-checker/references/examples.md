# Invoice Match Checker: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Price and quantity variance against a PO

**Request**

> Please check this before we pay. Our approval limits: team lead up to EUR 5,000, Head of Purchasing EUR 5,001 to
> 25,000, CFO above that.
>
> Invoice INV-2026-0912 from Rheinform Kunststoff GmbH, dated 10 Nov 2026, PO 4500-1187, terms Net 30, EUR:
> housing HX-20, 500 × 12.40 = 6,200.00; gasket G-7, 1,000 × 0.85 = 850.00; freight 180.00; subtotal 7,230.00;
> VAT 19% 1,373.70; total 8,603.70.
> PO 4500-1187: HX-20 500 × 11.90; G-7 1,000 × 0.85; freight 180.00. Frame contract: Net 45, EUR.
> Goods receipt 5000-7731: HX-20 500, G-7 950.
> Earlier invoices from this vendor in AP: INV-2026-0874, 14 Oct 2026, EUR 4,120.30.

**How the skill handles it**

- Step 1: all required fields are present, so matching can start.
- Step 2: HX-20 price above PO (High); G-7 billed above the 950 received (High); Net 30 vs Net 45 (Medium).
- Step 3: its arithmetic is correct.
- Step 5: material discrepancies put it on hold; the user's own approval limits replace the default ones.

**Answer**

> Not financial, tax or accounting advice; a qualified professional must review it before anyone acts.

# Invoice Check: Rheinform Kunststoff GmbH
- Invoice no.: INV-2026-0912
- Dated: 10 Nov 2026
- Amount billed: EUR 8,603.70
- Purchase order: 4500-1187
- Outcome: Discrepancies Found

## Invoice compared with the PO and contract
| Item compared | On the invoice | Per contract or PO | Agrees? |
|---|---|---|---|
| Unit price HX-20 | 12.40 [Source: invoice] | 11.90 [Source: PO] | No — off by EUR 0.50 per unit [Source: own calculation] |
| Unit price G-7 | 0.85 [Source: invoice] | 0.85 [Source: PO] | Yes |
| Freight | 180.00 [Source: invoice] | 180.00 [Source: PO] | Yes |
| Quantity HX-20 | 500 [Source: invoice] | 500 ordered [Source: PO] / 500 received [Source: goods receipt] | Yes |
| Quantity G-7 | 1,000 [Source: invoice] | 1,000 ordered [Source: PO] / 950 received [Source: goods receipt] | No — 50 units over receipt |
| Payment terms | Net 30 [Source: invoice] | Net 45 [Source: contract] | No |
| Tax rate | 19% [Source: invoice] | No PO or contract supplied to compare against | — |
| Invoice total (net) | 7,230.00 [Source: invoice] | 6,980.00 PO value [Source: own calculation] | Exceeds by EUR 250.00 |

## Problems found
| No. | Discrepancy type | Specifics | Dollar effect | Severity | Suggested resolution |
|---|---|---|---|---|---|
| 1 | Price variance | HX-20 billed at 12.40, PO 11.90 | EUR 250.00 net | High | Ask vendor for a credit note or explanation |
| 2 | Quantity variance | G-7: 1,000 billed, 950 received | EUR 42.50 net | High | Confirm receipt with the warehouse; if 950 stands, request credit |
| 3 | Terms mismatch | Net 30 on invoice, Net 45 in contract | Timing only | Medium | Pay on Net 45; tell the vendor |

Net overbilling: EUR 292.50. Corrected, the invoice would read EUR 6,937.50 net + 1,318.13 VAT = 8,255.63, which is
EUR 348.07 less [Source: own calculation].

## Arithmetic and duplicate checks
- [x] Every line extension recomputed: 500 × 12.40 = 6,200.00; 1,000 × 0.85 = 850.00; freight 180.00
- [x] Subtotal recomputed: 7,230.00, matches
- [x] Tax recomputed: 7,230.00 × 19% = 1,373.70, matches
- [x] Grand total recomputed: 8,603.70, matches
- [x] No duplicate found: only INV-2026-0874 (14 Oct 2026, EUR 4,120.30) on file; number, amount and date differ

## Where it goes next
- Suggested approver under the delegation of authority: Head of Purchasing (EUR 5,001 to 25,000), once cleared
- Must be cleared before approval: discrepancies 1 and 2 (on hold); 3 to be noted
- For the approver's attention: accepting the higher HX-20 price needs a PO amendment by the PO owner

Checked by [reviewer] on [date]

## Example 2: Beratungsrechnung ohne Bestellung, möglicher Duplikat (auf Deutsch)

**Request**

> Bitte prüfen: Velten Consulting, Rechnung RE-1048 vom 31.10.2026, "Beratung
> Prozessoptimierung Oktober 2026", 12 Tage × 1.150,00 € = 13.800,00 €, USt 19 % 2.622,00 €, gesamt 16.422,00 €,
> 14 Tage netto. Keine Bestellung, kein Vertrag gefunden. In der Kreditorenliste steht schon:
> Velten Consulting, RE-1043, 31.10.2026, 16.422,00 €, Status "in Freigabe".

**How the skill handles it**

- Step 4: same vendor, amount and date as RE-1043: suspected duplicate (Critical); Step 5 routes it to rejection.
- No PO or contract: each comparison says so; no standard terms are assumed.
- Missing documentation is listed too, in case the duplicate is ruled out.
- No approval matrix given: the default amounts are named as placeholders.

**Answer**

> Dies ist keine Finanz-, Steuer- oder Buchhaltungsberatung; eine qualifizierte Fachkraft muss das Ergebnis vor
> jeder Entscheidung prüfen.

# Rechnungsprüfung: Velten Consulting
- Rechnungsnr.: RE-1048
- Datum: 31.10.2026
- Rechnungsbetrag: EUR 16.422,00
- Bestellung: keine angegeben
- Ergebnis: Rejected (Duplikatverdacht)

## Abgleich mit Bestellung und Vertrag
| Prüfpunkt | Auf der Rechnung | Laut Vertrag oder Bestellung | Stimmt? |
|---|---|---|---|
| Tagessatz | 1.150,00 € [Source: invoice] | No PO or contract supplied to compare against | — |
| Menge | 12 Tage [Source: invoice] | No PO or contract supplied to compare against; keine Leistungsbestätigung | — |
| Zahlungsziel | 14 Tage netto [Source: invoice] | No PO or contract supplied to compare against | — |
| Steuersatz | 19 % [Source: invoice] | No PO or contract supplied to compare against | — |
| Rechnungssumme | 16.422,00 € [Source: invoice] | keine Bestellung | — |

## Festgestellte Probleme
| Nr. | Art | Details | Betrag | Schwere | Empfehlung |
|---|---|---|---|---|---|
| 1 | Duplikat | Lieferant, Betrag und Datum wie RE-1043 (in Freigabe) | 16.422,00 € | Critical | Nicht verarbeiten; an Velten zurück |
| 2 | Fehlende Unterlagen | Keine Bestellung, kein Vertrag, keine Leistungsbestätigung | 16.422,00 € | Medium | Von der Fachabteilung einholen |

## Rechen- und Duplikatprüfung
- [x] Positionen nachgerechnet: 12 × 1.150,00 € = 13.800,00 € [Source: own calculation]
- [x] Zwischensumme: 13.800,00 €, stimmt
- [x] Steuer: 13.800,00 € × 19 % = 2.622,00 €, stimmt
- [x] Gesamtbetrag: 16.422,00 €, stimmt
- [ ] Kein Duplikat gefunden: **nicht erfüllt**, siehe Problem 1

## Weiteres Vorgehen
- Empfehlung: abweisen und mit Begründung an Velten Consulting zurückgeben.
- Vor jeder Freigabe zu klären: Ist RE-1048 eine Doppelung von RE-1043 oder eine zweite, eigenständige Leistung?
  Falls eigenständig: Abteilungsleitung muss den Bedarf freigeben und eine Bestellung anlegen lassen.
- Hinweis: Ohne Ihre Freigabematrix ist die Standardtabelle nur Platzhalter (dort Stufe Director/VP). RE-1043
  bis zur Klärung ebenfalls anhalten.

Geprüft von [Prüfer] am [Datum]
