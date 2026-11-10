# Writing the hand-over

Use this in Step 6, when `report.md` and the `dup_stats` output are in hand.

## What goes where

`report.md` already holds every table and the chart. Copy the tiles table, the window table, the chart, the sections table and the largest pages **unchanged**, so the numbers stay what the kit computed. What you add is the reading of them: the verdict, the oddities and the next steps. Do not retype figures into a new table, and do not round them differently in the prose than in the table.

The one sentence at the top of `report.md` names the smallest window the corpus fits in, which may not be the user's window. Leave it out and use your "In one line" for the user's window instead; the window table next to it has every window. Write your own headings and sentences in the user's language; the copied report sections stay as the kit wrote them.

If the app does not render Mermaid, the chart shows as code. Say so in one line; the "All sections" table has the same numbers.

## Template

```
# [Site name]: website corpus sizing

**In one line:** [pages] pages, [Qwen3 tokens after dedup] Qwen3 tokens after dedup ([full] before): [fits / does not fit] in one [window the user cares about] window.

## Verdict
[Two to four sentences: the answer to "is all content in the context realistic for this site?", for the user's model and window, with the number it rests on and the one thing that would change it (core pages only, a different window, a cleaner extraction).]

## The numbers
[Summary tiles, the context-window table, the chart, the sections table and the largest pages, copied from report.md.]

## Oddities
[Only what the data shows, each with its evidence; see the list below. "None found" if nothing.]

## Method and caveats
[Crawl date and scope, the --drop selectors used (from Step 4 of this chat; on path B ask the user, since report.md does not hold them), tokenizers, the dedup rule in one sentence, and the gaps you know of.]

## Next steps
[One to three concrete options.]
```

## Reading the verdict

Compare the **dedup** tokens with the window of the model the user will actually use. These thresholds are a rule of thumb, not a measured limit; say that when you use them:

| Share of the window | Reading |
|---|---|
| up to 25% | Comfortable. The question, the instructions and the answer have plenty of room |
| 25% to 50% | Feasible. Every request carries that many input tokens, so cost and latency matter; check prompt caching on the provider |
| 50% to 100% | Tight. Little room is left, and answer quality tends to suffer in very long contexts. Look at the core pages alone, or at a subset of sections |
| over 100% | Does not fit. Retrieval, or a chosen subset, is the realistic way; the "core pages" row and the sections table show which parts are worth including |

Give the verdict for the full corpus and, when `report.md` has the rows, for the core pages without blog and news. Name the tokenizer. If the user's model uses neither Qwen3 nor o200k, say that the real count differs (usually by a few tens of percent) and that the Qwen3 figure is the more cautious one for German text.

## Oddities to look for

| Look at | What it means |
|---|---|
| Thin pages (section table, "Thin pages" column) | Landing pages, redirects, error pages, or a site rendered by JavaScript. Many of them and tiny totals: the crawl may not have seen the content |
| Exact duplicates and near-duplicate pairs (`dup_stats`) | The same content under two URLs, or language or print variants. Name the pages and what they cost in tokens. Line-level dedup removes only identical lines of 40+ characters, so it removes an exact duplicate but barely touches a near-duplicate (similar, not identical, lines): the tokens of the second page of each near-duplicate pair are a further saving that the dedup figures do not contain |
| Dedup saving above about 20% (a section's last column, or the total) | Boilerplate inside `<main>` that `--drop` missed, or genuinely repeated text. Suggest a second look with `outline.py` |
| Sections that do not belong to the scope | A language or area outside the prefix, for example `en` under `/de/`; pages in the wrong language |
| One very large page | Long product lists, glossaries, PDFs shown as HTML; it may deserve a place of its own in the next steps |
| Sitemap gaps | Per-section URL counts from Step 2 against what the user knows of the site; pages that kept printing `FAIL` |
| Qwen3 to o200k ratio far from 1.2 to 1.3 on German text | A different language mix, or extraction that kept markup or non-text |

## Next steps to offer

Pick what the numbers support: use the core pages only; choose a window and a subset of sections; re-run extraction with a better `--drop` and compare; add the missing URLs and crawl again; or plan retrieval when the corpus does not fit. For a site that changes, the crawl and the report are repeatable in the same working folder: delete `crawl/html/` and `crawl/index.tsv` for a fresh crawl.
