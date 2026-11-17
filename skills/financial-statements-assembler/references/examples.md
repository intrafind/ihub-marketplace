# Financial Statements Assembler: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Quarter-end statements from a trial balance

**Request**

> Q3 2026 statements for Lindner Sensortechnik GmbH, EUR thousands, accrual, standalone. Compare with Q2.
> Trial balance 30 Sep (P&L accounts for Q3 only): Dr: Cash 820, Receivables 1,140, Inventory 610, PP&E net 1,480,
> COGS 1,920, Opex 900 (incl. depreciation 60), Interest 20, Tax 100. Cr: Payables 520, Accrued 230, Long-term
> debt 1,200, Share capital 500, Retained earnings (opening) 1,340, Revenue 3,200. No dividends.
> Q2: Revenue 2,900, COGS 1,670, Opex 860, Interest 22, Tax 96. Balance sheet 30 Jun: Cash 650, Receivables 980,
> Inventory 640, PP&E 1,500, Payables 470, Accrued 210, Debt 1,250, Share capital 500, Retained earnings 1,340.

**How the skill handles it**

- Input check: debits 6,990 = credits 6,990, so the trial balance balances; currency, basis and entity are given.
- Step 2: the balance sheet ties (assets 4,050 = liabilities and equity 4,050); the Q3 cash flow is derived with
  the indirect method and reconciles to the change in cash.
- The Q2 cash flow needs the 31 March balance sheet, which was not supplied, so that column says so.
- Step 4: highlights state what changed and by how much, without guessing causes.

**Answer**

FINANCIAL STATEMENTS
Entity: Lindner Sensortechnik GmbH · Period: Q3 2026 · Currency: EUR
Accounting basis: accrual · Units: thousands

> Not professional advice. Qualified professionals must review these statements before use.

**A. Income statement** `[Source: trial balance]`, subtotals `[Source: own calculation]`

| Line | Q3 2026 | Q2 2026 | Δ | Δ % |
|---|---|---|---|---|
| Revenue | 3,200 | 2,900 | 300 | 10.3% |
| COGS | 1,920 | 1,670 | 250 | 15.0% |
| **Gross Profit** | 1,280 | 1,230 | 50 | 4.1% |
| Operating Expenses | 900 | 860 | 40 | 4.7% |
| **Operating Income** | 380 | 370 | 10 | 2.7% |
| Interest & Other | 20 | 22 | (2) | (9.1%) |
| Tax Provision | 100 | 96 | 4 | 4.2% |
| **Net Income** | 260 | 252 | 8 | 3.2% |

**B. Balance sheet**

| Line | 30 Sep 2026 | 30 Jun 2026 | Δ |
|---|---|---|---|
| Cash & Equivalents | 820 | 650 | 170 |
| Accounts Receivable | 1,140 | 980 | 160 |
| Inventory | 610 | 640 | (30) |
| **Total Current Assets** | 2,570 | 2,270 | 300 |
| PP&E, net | 1,480 | 1,500 | (20) |
| **Total Assets** | 4,050 | 3,770 | 280 |
| Accounts Payable | 520 | 470 | 50 |
| Accrued Liabilities | 230 | 210 | 20 |
| Long-term Debt | 1,200 | 1,250 | (50) |
| **Total Liabilities** | 1,950 | 1,930 | 20 |
| Share Capital | 500 | 500 | 0 |
| Retained Earnings (1,340 + 260) | 1,600 | 1,340 | 260 |
| **Total Equity** | 2,100 | 1,840 | 260 |
| **Total Liabilities + Equity** | 4,050 | 3,770 | 280 |

**C. Cash flow statement** `[Source: own calculation]`

| Line | Q3 2026 | Q2 2026 |
|---|---|---|
| Net Income | 260 | Not in the data supplied |
| Non-cash adjustments (depreciation) | 60 | |
| Change in working capital (AR (160), inventory 30, AP 50, accrued 20) | (60) | |
| **Net cash from operating activities** | 260 | |
| Capital expenditures (1,480 − 1,500 + 60) | (40) | |
| **Net cash from investing activities** | (40) | |
| Debt repaid | (50) | |
| **Net cash from financing activities** | (50) | |
| **Net Change in Cash** (650 → 820) | 170 | |

**D. Ratio snapshot**

| Ratio | Q3 2026 | Q2 2026 | Movement |
|---|---|---|---|
| Gross Margin | 40.0% | 42.4% | (241) bp |
| Operating Margin | 11.9% | 12.8% | (88) bp |
| Net Margin | 8.1% | 8.7% | (56) bp |
| EBITDA Margin | 13.8% | not computable — data missing (Q2 D&A) | |
| Current Ratio | 3.43× | 3.34× | +0.09 |
| Debt-to-Equity | 0.57× | 0.68× | (0.11) |
| DSO (92 / 91 days) | 32.8 days | 30.8 days | +2.0 days |

**E. What stands out**
1. Gross margin fell 241 bp to 40.0%: COGS grew 15.0% (+250) against revenue growth of 10.3% (+300). For
   management to investigate; `budget-variance-explainer` can help with the root cause.
2. Receivables rose 160 (16.3%), faster than revenue; DSO up 2.0 days.
3. Operating cash flow of 260 equals net income; working capital absorbed 60.
4. Cash up 170 (26.2%) after 50 of debt repayment.

**F. Caveats and open items**
- Q2 cash flow and Q2 EBITDA need the 31 March balance sheet and Q2 depreciation.
- No tax or interest payable accounts in the trial balance; confirm none exist.

## Example 2: Trial balance that does not balance

**Request**

> Here's the October TB for Brehm Antriebe GmbH, can you produce the monthly statements vs September? Total debits
> 5,412,300, total credits 5,398,100 (EUR). Account list attached.

**How the skill handles it**

- Input check: debits and credits differ, so the skill stops before mapping a single account and builds nothing.
- It reports the size and side of the gap and gives checks to find it, without guessing which account is wrong.

**Answer**

I can't build the October statements yet: the trial balance does not balance.

| | EUR |
|---|---|
| Total debits | 5,412,300 |
| Total credits | 5,398,100 |
| **Difference (debits higher)** | **14,200** |

`[Source: trial balance]`, difference `[Source: own calculation]`

Statements built on this would not tie, and every subtotal and ratio would carry an unknown error. Ways to locate it:

1. **A single posting of 14,200** on one side only: search the October journal for that amount.
2. **A posting on the wrong side:** half the difference, 7,100, entered as a debit instead of a credit.
3. **A transposition error:** the difference is divisible by 9 (14,200 is not, so this is less likely).
4. **Missing accounts:** compare the account list with September; an account that had a balance then and is missing
   now may be the gap.

Send me the corrected trial balance (or the correcting entry) and I'll produce the full package against September.
