# Quick estimate (path C)

Use this only when the user cannot run the kit and wants a first idea. The result is a range, never a measured number, and it cannot see duplicates, hidden boilerplate or pages missing from the sitemap. Say that at the top of the answer.

## What you need

1. **Page counts per section.** The best source is `sitemap.py`'s output. Otherwise, try to read the site's `sitemap.xml` with the page reader; if it returns no URL list, ask the user to paste the sitemap or the section counts. Do not guess a page count.
2. **Sample pages.** With the page reader, open pages across the sections, at least two per large section, and prefer ordinary content pages over the home page. The reader is limited per answer (by default five pages), so say how many you read and continue in the next message if the user agrees.
3. **The language** of the pages.

## Calculation

Do it step by step and show it, because the user must be able to check it:

1. For each sampled page, note its length in characters (what the reader returned, without menus where visible).
2. Per section, take the average of its sampled pages and multiply by the number of pages in that section: characters per section.
3. Convert characters to tokens with a planning range, not a point: for English roughly 3.5 to 4.5 characters per o200k token; for German roughly 3.0 to 4.0. Qwen3 needs about 20 to 25% more tokens than o200k on German text.
4. Add the sections up, and give the sum as a **low and a high figure**.
5. Compare the range with the 128k (131,072), 256k (262,144) and 1M (1,048,576) token windows.

If a section has pages of very different lengths, say that the average is unreliable and which pages pull it.

## What you may conclude

- Both ends of the range lie on the same side of a window: say "very likely fits" or "very likely does not fit", still as an estimate.
- The range crosses a window size, or the corpus is above about half of it: say that the estimate cannot decide it and ask for a measurement (Steps 1–6).

Offer the full measurement in the same answer, with the first command, so the user can start right away.
