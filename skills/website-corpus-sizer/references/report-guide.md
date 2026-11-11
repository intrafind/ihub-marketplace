# Writing the hand-over

Use this in Step 6, when `website_corpus_report` has answered.

## What goes where

The `report` field already holds every table and the chart. Show the tiles table, the window table, the chart, the sections table, the largest pages, the duplicates and the coverage **unchanged**, so the numbers stay what the tool computed. What you add is the reading of them: the verdict, the oddities and the next steps. Do not retype figures into a new table, and do not round them differently in the prose than in the table.

**When Step 7 built a dashboard**, it holds the tiles, the windows, the sections, the largest pages, the duplicates, the method and the formulas, in the Artifacts panel. Then copy only the window table into "The numbers" (the verdict rests on it) and end the section with one line that names the dashboard and says that the rest is there. The Oddities still name their evidence, with the figures as the report gave them.

The sentence at the top of the report names the smallest window the corpus fits in, which may not be the user's window. Leave it out and use your "In one line" for the user's window instead; the window table next to it has every window. Write your own headings and sentences in the user's language; the copied report sections stay as the tool wrote them.

If the app does not render Mermaid, the chart shows as code. Say so in one line; the "All sections" table has the same numbers.

## Template

```
# [Site name]: website corpus sizing

**In one line:** [pages] pages, [tokens after dedup] tokens after dedup ([full] before): [fits / does not fit] in one [window the user cares about] window.

## Verdict
[Two to four sentences: the answer to "is all content in the context realistic for this site?", for the user's model and window, with the number it rests on and the one thing that would change it (core pages only, a different window, a cleaner extraction).]

## The numbers
[The report's sections, copied. With a dashboard: the window table, and one line pointing to the dashboard.]

## Oddities
[Only what the data shows, each with its evidence; see the list below. "None found" if nothing.]

## Method and caveats
[Crawl date and scope, the selector used in Step 3, how tokens were counted (the report says), and the gaps you know of.]

## Next steps
[One to three concrete options.]
```

## How the tokens were counted

The report says which method counted, and the tool result names it in `tokenizer`:

- **`o200k_base`:** exact for OpenAI models, typically within 10 to 20 percent for other model families. Some tokenizers need noticeably more tokens for German text; the original sizing kit measured about 20 to 25% more with Qwen3 than with o200k. Say that the real count of the user's model can differ.
- **`heuristic`:** one token per four characters, because this server has no tokenizer library (current iHub versions ship one, so this means an older version or a deployment that left it out). That is a rough approximation that can be off in either direction. Give the verdict only when the corpus is clearly on one side of the window (below about half of it, or above about twice it). Otherwise say that this accuracy cannot decide it, and that an admin can update iHub, or install the `gpt-tokenizer` package on the server, to get `o200k_base` counts.

## Reading the verdict

Compare the **dedup** tokens with the window of the model the user will actually use. These thresholds are a rule of thumb, not a measured limit; say that when you use them:

| Share of the window | Reading |
|---|---|
| up to 25% | Comfortable. The question, the instructions and the answer have plenty of room |
| 25% to 50% | Feasible. Every request carries that many input tokens, so cost and latency matter; check prompt caching on the provider |
| 50% to 100% | Tight. Little room is left, and answer quality tends to suffer in very long contexts. Look at the core pages alone, or at a subset of sections |
| over 100% | Does not fit. Retrieval, or a chosen subset, is the realistic way; the "core pages" row and the sections table show which parts are worth including |

Give the verdict for the full corpus and, when the report has the rows, for the core pages without blog and news.

## Oddities to look for

| Look at | What it means |
|---|---|
| `complete` is false, or the Coverage table shows pages not yet crawled | The corpus is a part of the site. Finish the crawl before you give a verdict |
| Coverage: failed, blocked by robots.txt, not HTML | Pages that are not in the corpus. Name how many, and a few failed addresses with their reasons (`failedPages`) |
| Thin pages (sections table, "Thin pages" column) | Landing pages, redirects, error pages, or a site rendered by JavaScript. Many of them and tiny totals: the crawl may not have seen the content |
| Exact duplicates and near-duplicate pairs (Duplicates section) | The same content under two URLs, or language or print variants. Name the pages and what they cost in tokens. Line-level dedup removes only identical lines of 40+ characters, so it removes an exact duplicate but barely touches a near-duplicate; the second page of each near-duplicate pair is a further saving the dedup figures do not contain |
| Dedup saving above about 20% (a section's last column, or the total) | Boilerplate inside `<main>` that the selector missed, or genuinely repeated text. Suggest a second look with the outline step |
| Sections that do not belong to the scope | A language or area outside the prefix, for example `en` under `/de/`; pages in the wrong language |
| One very large page | Long product lists, glossaries, documents shown as HTML; it may deserve a place of its own in the next steps |
| Sitemap gaps | Per-section counts from Step 2 against what the user knows of the site |
| With `o200k_base`: characters per token (Method) far from about 3 to 4 | Extraction that kept markup or non-text, or an unusual language mix |

## Next steps to offer

Pick what the numbers support: use the core pages only; choose a window and a subset of sections; crawl again with a better selector (`restart: true`) and compare; name a missing sitemap and crawl again; ask an admin to update iHub or install the tokenizer library; or plan retrieval when the corpus does not fit. A corpus is kept for 14 days, so the report can be asked for again with the same `corpusId`.
