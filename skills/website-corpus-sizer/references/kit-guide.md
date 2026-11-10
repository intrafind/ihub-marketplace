# Kit guide: options, outputs and troubleshooting

Read this when a step does not behave as expected or the user asks what a script does exactly.

## What each script writes

| Script | Writes | What it does |
|---|---|---|
| `sitemap.py` | `crawl/all_urls.txt` | Reads the sitemaps named in robots.txt (else `/sitemap.xml`, `/sitemap_index.xml`, `<prefix>sitemap.xml`), follows sitemap indexes, keeps URLs under `--prefix`, prints a count per first path segment |
| `crawl.py` | `crawl/html/`, `crawl/index.tsv` | Fetches each URL, `--delay` seconds apart (default 0.5); skips pages already on disk |
| `outline.py` | printed | Shows the elements of `<main>` with class or id, their text length, and marks likely page furniture |
| `extract.py` | `corpus/pages/*.md`, `corpus/corpus.jsonl` | Keeps `<main>` (else `<body>`); removes scripts, styles, forms, svg, iframes, buttons, `<nav>` and the `--drop` selectors; keeps headings and list items; drops consecutive duplicate lines |
| `page_stats_csv.py` | `corpus/page_stats.csv` | One row per page: section, characters, o200k tokens, Qwen3 tokens, Qwen3 tokens after dedup, thin flag |
| `dup_stats.py` | printed | Exact duplicate pages, near-duplicate pairs (Jaccard of word 5-grams at 0.8 or more, pages of 300+ characters), saving from line-level dedup |
| `report.py` | `corpus/report.md` | The finished report: tiles, context-window table, tokens by section (table and Mermaid chart), largest pages, method |

## Options worth knowing

- `sitemap.py --sitemap URL URL…` uses these sitemaps instead of robots.txt.
- `crawl.py --delay 2` for a site whose robots.txt sets a `Crawl-delay`.
- `outline.py --pages N`, `--url PART …`, `--depth N`: more pages, specific pages, deeper nesting.
- `extract.py --drop "<css selector list>"`: blocks inside `<main>` to remove. `nav` is always removed.
- `report.py --news-sections blog,news,presse` replaces the default list of news-like section names (blog, news, newsroom, aktuelles, presse, press, magazin, magazine, neuigkeiten) used for the "core pages" rows. `--news-sections none` leaves those rows out. Section names are the first path segment after the prefix, in lower case.
- `report.py --crawl-date YYYY-MM-DD` sets the date shown in the method; it defaults to the date of `crawl/index.tsv`.

## Definitions the report relies on

- **Section:** the first path segment after `--prefix`. A segment with a single page is grouped as `top-level pages`; the root page is `home`.
- **Thin page:** under 300 characters of main text.
- **Dedup:** a line of 40 or more characters is counted only on the first page where it appears, in sitemap order. Corpus totals do not depend on the order; the per-section dedup numbers do.
- **Windows:** 128k = 131,072, 256k = 262,144, 1M = 1,048,576 tokens.

## Limits and checks

- **No JavaScript.** The crawler reads the HTML the server sends. A site that builds its pages in the browser gives near-empty pages (many thin pages, tiny token counts). The result is then not a measurement of the site.
- **Robots and politeness.** The kit does not read robots.txt for you. The user checks it (Step 1) and sets `--delay` accordingly.
- **A crawl that was killed** can leave a page on disk that is missing from `crawl/index.tsv`; the next run skips it and extraction never sees it. Compare `ls crawl/html | wc -l` with `wc -l < crawl/index.tsv`; if the first is larger, delete the extra files in `crawl/html/` that are not named in the index, then crawl again.
- **Several hosts in one sitemap:** the page files are named `host__path`, so nothing collides.
- **Same `--prefix` everywhere.** A different prefix in `extract.py` and `page_stats_csv.py` changes slugs and sections.
- **Size of `dup_stats.py`:** it compares every page pair, which is fine for a few thousand pages and slow beyond about 5,000. Say so before they start, and offer to skip that step for a very large site.
- **Tokenizer downloads.** Qwen3 comes from Hugging Face (`Qwen/Qwen3-8B`, a few MB, no login); o200k comes from OpenAI's public blob storage and is cached (`TIKTOKEN_CACHE_DIR`). Behind a proxy, set `HTTPS_PROXY`. Without internet access, someone downloads `tokenizer.json` of the Qwen3 model elsewhere and the scripts use `Tokenizer.from_file("tokenizer.json")` in place of `Tokenizer.from_pretrained(...)`; tell the user that change when you suggest it.
- **Python 3** with `venv` and `pip`; the kit was tested with 3.13. On Windows the interpreter is `.venv\Scripts\python`, and `nohup … &` does not exist: run the crawl in a second terminal instead.
