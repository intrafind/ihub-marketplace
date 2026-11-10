# The kit: requirements and scripts

Read this file only when the user does not have the kit folder yet, or lacks `outline.py` or `report.py`. Hand over only what they are missing, one file per code block, and say where to save it: `scripts/<name>` inside one kit folder. The scripts are the website-corpus-kit of IntraFind plus two additions (`outline.py`, `report.py`); copy them exactly, since the rest of the skill relies on their output formats.

## requirements.txt

```text
beautifulsoup4
lxml
tiktoken
tokenizers
```

## scripts/sitemap.py

Step 2: collects the page URLs from the sitemap(s).

```python
"""Collect page URLs from a site's sitemap(s) into crawl/all_urls.txt.

Usage: python sitemap.py <workdir> <site_url> [--prefix /de/] [--sitemap URL ...]

Reads robots.txt for Sitemap: lines (falls back to /sitemap.xml, /sitemap_index.xml and
<prefix>sitemap.xml), follows sitemap
indexes, keeps URLs whose path starts with --prefix (if given), and prints a count per first
path segment so you can sanity-check coverage before crawling.
"""

import argparse
import collections
import gzip
import pathlib
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

UA = {"User-Agent": "Mozilla/5.0 (corpus-stats-crawler)"}
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as resp:
        body = resp.read()
    return gzip.decompress(body) if body[:2] == b"\x1f\x8b" else body


def sitemaps_from_robots(site):
    try:
        robots = fetch(urllib.parse.urljoin(site, "/robots.txt")).decode(errors="replace")
    except Exception:  # noqa: BLE001
        return []
    return [line.split(":", 1)[1].strip() for line in robots.splitlines()
            if line.lower().startswith("sitemap:")]


def collect(url, seen):
    if url in seen:
        return []
    seen.add(url)
    try:
        root = ET.fromstring(fetch(url))
    except Exception as e:  # noqa: BLE001
        print(f"skip {url}: {e}")
        return []
    locs = [el.text.strip() for el in root.iter(f"{NS}loc") if el.text]
    if root.tag == f"{NS}sitemapindex":
        return [u for loc in locs for u in collect(loc, seen)]
    return locs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("workdir", type=pathlib.Path)
    ap.add_argument("site")
    ap.add_argument("--prefix", default="", help="keep only URL paths starting with this, e.g. /de/")
    ap.add_argument("--sitemap", nargs="*", help="sitemap URLs (default: from robots.txt)")
    args = ap.parse_args()

    maps = args.sitemap or sitemaps_from_robots(args.site)
    fallbacks = ["/sitemap.xml", "/sitemap_index.xml"]
    if args.prefix:
        fallbacks.append(args.prefix.rstrip("/") + "/sitemap.xml")
    seen, urls = set(), []
    for m in maps:
        urls += collect(m, seen)
    if not urls and not args.sitemap:  # robots.txt named none, or they failed: try the usual places
        for path in fallbacks:
            urls += collect(urllib.parse.urljoin(args.site, path), seen)
    urls = list(dict.fromkeys(u for u in urls if urllib.parse.urlparse(u).path.startswith(args.prefix)))

    out = args.workdir / "crawl"
    out.mkdir(parents=True, exist_ok=True)
    (out / "all_urls.txt").write_text("\n".join(urls) + "\n")

    def segment(u):
        parts = urllib.parse.urlparse(u).path[len(args.prefix):].strip("/").split("/")
        return parts[0] or "(home)"

    print(f"{len(urls)} URLs from {len(seen)} sitemap file(s)")
    for seg, n in collections.Counter(map(segment, urls)).most_common():
        print(f"{n:6d}  {seg}")


if __name__ == "__main__":
    main()
```

## scripts/crawl.py

Step 3: downloads the pages.

```python
"""Fetch every URL in crawl/all_urls.txt and store the raw HTML in crawl/html/.

Usage: python crawl.py <workdir> [--delay 0.5]

Resumable: pages already on disk are skipped. crawl/index.tsv maps file name -> URL.
"""

import argparse
import hashlib
import pathlib
import time
import urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("workdir", type=pathlib.Path)
ap.add_argument("--delay", type=float, default=0.5, help="seconds between requests")
args = ap.parse_args()

root = args.workdir
urls = (root / "crawl/all_urls.txt").read_text().split()
out = root / "crawl/html"
out.mkdir(parents=True, exist_ok=True)

for i, url in enumerate(urls):
    name = hashlib.sha1(url.encode()).hexdigest()[:12] + ".html"
    target = out / name
    if target.exists():
        continue
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (corpus-stats-crawler)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read()
        target.write_bytes(body)
        with open(root / "crawl/index.tsv", "a") as idx:
            idx.write(f"{name}\t{url}\n")
    except Exception as e:  # noqa: BLE001
        print(f"FAIL {url}: {e}", flush=True)
    if i % 50 == 0:
        print(f"{i}/{len(urls)}", flush=True)
    time.sleep(args.delay)
print("done")
```

## scripts/outline.py

Step 4: shows the structure of `<main>` so you can choose what `--drop` removes (added for iHub; not in the original kit).

```python
"""Show the structure of <main> in a few crawled pages, to find what to pass to extract.py --drop.

Usage: python outline.py <workdir> [--pages 3] [--url SUBSTRING ...] [--depth 4]

Prints, for each page, the elements of <main> that carry a class or id (plus sections, lists
and headings), indented by nesting, with the characters of text each one holds. Elements whose
class or id looks like page furniture (breadcrumb, cookie, teaser, slider, share, ...) are
marked "<- drop?". Paste the output into the chat, or read it yourself, and build the selector
for --drop from the marked entries, e.g. --drop ".breadcrumb, .cookie-banner, #teaser-slider".
Without --url the pages are spread evenly over crawl/index.tsv, so different sections show up.
"""
import argparse
import pathlib
import re

import bs4

FURNITURE = re.compile(
    r"breadcrumb|cookie|consent|banner|teaser|slider|carousel|share|social|related|newsletter|"
    r"sidebar|toc|subnav|submenu|menu|skip|pagination|print|toolbar|modal|popup|widget|"
    r"recommend|more-|weitere|crumb", re.I)
KEEP_TAGS = {"section", "article", "aside", "header", "footer", "ul", "ol", "table", "form",
             "h1", "h2", "h3"}
MAX_LINES = 70

ap = argparse.ArgumentParser()
ap.add_argument("workdir", type=pathlib.Path)
ap.add_argument("--pages", type=int, default=3)
ap.add_argument("--url", nargs="*", default=[], help="only pages whose URL contains one of these")
ap.add_argument("--depth", type=int, default=4)
args = ap.parse_args()

root = args.workdir
rows = [r.split("\t") for r in (root / "crawl/index.tsv").read_text().splitlines() if r]
if args.url:
    rows = [r for r in rows if any(u in r[1] for u in args.url)]
step = max(1, len(rows) // max(1, args.pages))
rows = rows[::step][:args.pages]


def label(el):
    out = el.name
    if el.get("id"):
        out += "#" + el["id"]
    classes = el.get("class") or []
    if classes:
        out += "." + ".".join(classes[:3])
    return out


for name, url in rows:
    soup = bs4.BeautifulSoup((root / "crawl/html" / name).read_text(errors="replace"), "lxml")
    main = soup.find("main") or soup.body
    print("=" * 70)
    print(url)
    if main is None:
        print("  no <main> or <body>")
        continue
    print(f"  {label(main)}  [{len(main.get_text(' ', strip=True))} chars in total]")
    lines = 0

    def walk(el, depth):
        global lines
        for child in el.children:
            if not isinstance(child, bs4.Tag) or child.name in ("script", "style", "noscript", "svg"):
                continue
            interesting = child.get("id") or child.get("class") or child.name in KEEP_TAGS
            if interesting and lines < MAX_LINES:
                text = child.get_text(" ", strip=True)
                mark = "  <- drop?" if FURNITURE.search(" ".join(
                    [child.get("id") or ""] + (child.get("class") or []))) else ""
                snippet = re.sub(r"\s+", " ", text)[:50]
                print(f"{'  ' * (depth + 1)}{label(child)}  [{len(text)} chars] {snippet!r}{mark}")
                lines += 1
            if depth < args.depth:
                walk(child, depth + 1)

    walk(main, 1)
    if lines >= MAX_LINES:
        print(f"  ... (shortened at {MAX_LINES} lines; raise --depth or use --url for another page)")
```

## scripts/extract.py

Step 4: extracts the main text of every page.

```python
"""Extract the main content of each crawled page into plain Markdown-ish text.

Usage: python extract.py <workdir> [--prefix /de/] [--drop ".breadcrumbContainer, .teaser"]

Writes corpus/pages/<slug>.md (one file per URL) and corpus/corpus.jsonl.
--prefix is stripped from the URL path when building the slug (use the same value as sitemap.py).
--drop is a CSS selector for site-specific blocks inside <main> to remove (menus, breadcrumbs,
cookie banners). Look at two or three pages first to find them; <nav> is always removed.
"""

import argparse
import json
import pathlib
import re
import urllib.parse

import bs4

ap = argparse.ArgumentParser()
ap.add_argument("workdir", type=pathlib.Path)
ap.add_argument("--prefix", default="")
ap.add_argument("--drop", default="", help="extra CSS selector of blocks to remove")
args = ap.parse_args()

root = args.workdir
pages_dir = root / "corpus/pages"
pages_dir.mkdir(parents=True, exist_ok=True)

BLOCK_CONTAINERS = [
    "div", "p", "section", "article", "ul", "ol", "table", "tr", "td", "th",
    "blockquote", "figcaption", "dt", "dd", "header", "footer",
]
DROP = ", ".join(s for s in ["nav", args.drop] if s)


def to_text(main):
    for tag in main.find_all(["script", "style", "noscript", "form", "svg", "iframe", "button"]):
        tag.decompose()
    for tag in main.select(DROP):
        tag.decompose()
    for br in main.find_all("br"):
        br.replace_with("\n")
    for el in main.find_all(["h1", "h2", "h3", "h4", "h5"]):
        el.insert(0, "\n\n" + "#" * int(el.name[1]) + " ")
        el.append("\n")
    for el in main.find_all("li"):
        el.insert(0, "\n- ")
    for el in main.find_all(BLOCK_CONTAINERS):
        el.insert(0, "\n")
        el.append("\n")
    raw = main.get_text("")
    lines = [re.sub(r"[ \t\xa0]+", " ", line).strip() for line in raw.split("\n")]
    lines = [line for line in lines if line and line not in ("-", "#", "##", "###")]
    out = []
    for line in lines:  # drop consecutive duplicates (sliders, repeated teasers)
        if not out or out[-1] != line:
            out.append(line)
    return "\n".join(out).strip()


rows = [r.split("\t") for r in (root / "crawl/index.tsv").read_text().splitlines()]
hosts = {urllib.parse.urlparse(url).netloc for _, url in rows}


def slug_of(url):
    u = urllib.parse.urlparse(url)
    path = u.path[len(args.prefix):] if u.path.startswith(args.prefix) else u.path
    slug = path.strip("/").replace("/", "__") or "home"
    if len(hosts) > 1:  # several hosts in one sitemap: keep them apart
        slug = f"{u.netloc}__{slug}"
    return re.sub(r"[^\w.\-]", "_", slug)


records = []
for name, url in rows:
    soup = bs4.BeautifulSoup((root / "crawl/html" / name).read_text(errors="replace"), "lxml")
    title = soup.title.get_text(strip=True) if soup.title else ""
    main = soup.find("main") or soup.body
    if main is None:
        print(f"SKIP {url}: no <main> or <body>")
        continue
    text = to_text(main)
    date = None
    t = main.find("time")
    if t is not None:
        date = t.get("datetime") or t.get_text(strip=True)
    slug = slug_of(url)
    (pages_dir / f"{slug}.md").write_text(f"URL: {url}\nTitle: {title}\nDate: {date or '-'}\n\n{text}\n")
    records.append({"url": url, "slug": slug, "title": title, "date": date, "chars": len(text), "text": text})

with open(root / "corpus/corpus.jsonl", "w") as f:
    for r in records:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
print(len(records), "pages,", sum(r["chars"] for r in records), "chars")
```

## scripts/page_stats_csv.py

Step 5: counts tokens per page.

```python
"""Per-page stats CSV: url, section, chars, o200k_tokens, qwen3_tokens, qwen3_tokens_dedup, thin.

Usage: python page_stats_csv.py <workdir> [--prefix /de/]

section = first path segment after --prefix; the section's landing page counts towards it.
Segments with a single page are grouped as "top-level pages"; the root page is "home".
qwen3_tokens_dedup drops every line of >= 40 chars already seen on an earlier page (sitemap
order), so shared boilerplate is counted once. thin = 1 for pages under 300 characters.
"""
import argparse
import collections
import csv
import json
import pathlib
import urllib.parse

import tiktoken
from tokenizers import Tokenizer

ap = argparse.ArgumentParser()
ap.add_argument("workdir", type=pathlib.Path)
ap.add_argument("--prefix", default="")
args = ap.parse_args()

root = args.workdir
o200k = tiktoken.get_encoding("o200k_base")
qwen = Tokenizer.from_pretrained("Qwen/Qwen3-8B")


def first(r):
    path = urllib.parse.urlparse(r["url"]).path
    if path.startswith(args.prefix):
        path = path[len(args.prefix):]
    return path.strip("/").split("/")[0].lower() or "home"


recs = [json.loads(line) for line in open(root / "corpus/corpus.jsonl")]
counts = collections.Counter(first(r) for r in recs)
with open(root / "corpus/page_stats.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "section", "chars", "o200k_tokens", "qwen3_tokens", "qwen3_tokens_dedup", "thin"])
    seen = set()
    for r in recs:
        seg = first(r)
        if seg != "home" and counts[seg] == 1:
            seg = "top-level pages"
        kept = []
        for line in r["text"].split("\n"):
            if len(line) >= 40:
                if line in seen:
                    continue
                seen.add(line)
            kept.append(line)
        w.writerow([r["url"], seg, r["chars"], len(o200k.encode(r["text"])),
                    len(qwen.encode(r["text"]).ids), len(qwen.encode("\n".join(kept)).ids),
                    int(r["chars"] < 300)])
print(len(recs), "rows")
```

## scripts/dup_stats.py

Step 5: reports duplicate content.

```python
"""Duplicate content in the corpus: exact duplicate pages, near-duplicate pages, repeated lines.

Usage: python dup_stats.py <workdir>

Prints a report; writes nothing. Near-duplicates are page pairs (>= 300 chars) whose word
5-gram shingle sets have Jaccard similarity >= 0.8. The comparison is pairwise (O(n^2)),
fine for a few thousand pages.
"""
import collections
import json
import pathlib
import re
import sys

from tokenizers import Tokenizer

root = pathlib.Path(sys.argv[1])
qwen = Tokenizer.from_pretrained("Qwen/Qwen3-8B")


def tok(text):
    return len(qwen.encode(text).ids)


def shingles(text):
    w = re.findall(r"\w+", text.lower())
    return {" ".join(w[i:i + 5]) for i in range(max(1, len(w) - 4))}


recs = [json.loads(line) for line in open(root / "corpus/corpus.jsonl")]
total = sum(tok(r["text"]) for r in recs)

# 1. exact duplicate pages
by_text = collections.defaultdict(list)
for r in recs:
    by_text[r["text"]].append(r["slug"])
exact = [v for v in by_text.values() if len(v) > 1]
exact_tok = sum(tok(t) * (len(v) - 1) for t, v in by_text.items() if len(v) > 1)

# 2. near-duplicate pages
sh = [(r["slug"], shingles(r["text"]), r["text"]) for r in recs if r["chars"] >= 300]
pairs = []
for i in range(len(sh)):
    for j in range(i + 1, len(sh)):
        a, b = sh[i][1], sh[j][1]
        if not a or not b or min(len(a), len(b)) / max(len(a), len(b)) < 0.8:
            continue
        jac = len(a & b) / len(a | b)
        if jac >= 0.8 and sh[i][2] != sh[j][2]:
            pairs.append((round(jac, 2), sh[i][0], sh[j][0]))

# 3. line level: keep each distinct line (>= 40 chars) once across the corpus
seen, kept = set(), []
for r in recs:
    out = []
    for line in r["text"].split("\n"):
        if len(line) >= 40:
            if line in seen:
                continue
            seen.add(line)
        out.append(line)
    kept.append("\n".join(out))
dedup_tok = sum(tok(t) for t in kept)

print(f"total Qwen3 tokens: {total:,}")
print(f"exact duplicate page groups: {len(exact)}, extra copies cost {exact_tok:,} tokens")
for v in exact:
    print("  ", v)
print(f"near-duplicate page pairs (Jaccard>=0.8): {len(pairs)}")
for p in sorted(pairs, reverse=True)[:25]:
    print("  ", p)
print(f"after removing repeated lines (>=40 chars): {dedup_tok:,} tokens "
      f"({100 * (total - dedup_tok) / total:.1f}% less)")
```

## scripts/report.py

Step 5: turns the statistics into the finished report (added for iHub; not in the original kit).

```python
"""Turn corpus/page_stats.csv into the finished sizing report: corpus/report.md.

Usage: python report.py <workdir> --name "Example Corp" [--crawl-date 2026-11-10]
                        [--news-sections blog,news,presse | none]

Every number in the report is computed here from page_stats.csv, so the report can be pasted
or attached to a chat as it is, and nobody has to add up a column by hand. The report holds:
summary tiles, how many 128k / 256k / 1M context windows the corpus fills (full, after dedup,
and "core" pages without news-like sections), tokens by section (table and a Mermaid bar
chart), the 20 largest pages, and the method.

Context windows: 128k = 131,072, 256k = 262,144, 1M = 1,048,576 tokens.
News-like sections are matched by name (first path segment); --news-sections replaces the
default list, and "none" switches the "core pages" rows off.
"""
import argparse
import collections
import csv
import datetime
import pathlib
import urllib.parse

WINDOWS = [("128k", 131_072), ("256k", 262_144), ("1M", 1_048_576)]
NEWS_DEFAULT = ["blog", "news", "newsroom", "aktuelles", "presse", "press", "magazin",
                "magazine", "neuigkeiten"]
THIN_CHARS = 300
CHART_SECTIONS = 10

ap = argparse.ArgumentParser()
ap.add_argument("workdir", type=pathlib.Path)
ap.add_argument("--name", required=True, help="site name, used in the title")
ap.add_argument("--crawl-date", default="", help="YYYY-MM-DD (default: date of crawl/index.tsv)")
ap.add_argument("--news-sections", default=",".join(NEWS_DEFAULT),
                help="comma-separated section names to leave out of the core pages, or 'none'")
args = ap.parse_args()

root = args.workdir
with open(root / "corpus/page_stats.csv", newline="") as f:
    rows = list(csv.DictReader(f))
if not rows:
    raise SystemExit("page_stats.csv has no rows: nothing to report")

for r in rows:
    for key in ("chars", "o200k_tokens", "qwen3_tokens", "qwen3_tokens_dedup", "thin"):
        r[key] = int(r[key])

crawl_date = args.crawl_date
if not crawl_date:
    index = root / "crawl/index.tsv"
    stamp = index.stat().st_mtime if index.exists() else datetime.datetime.now().timestamp()
    crawl_date = datetime.date.fromtimestamp(stamp).isoformat()

news = set() if args.news_sections.strip().lower() == "none" else {
    s.strip().lower() for s in args.news_sections.split(",") if s.strip()}


def total(rs, key):
    return sum(r[key] for r in rs)


def n(x):
    return f"{x:,}"


def share(a, b):
    return f"{100 * a / b:.1f}%" if b else "-"


def windows_cell(tokens, size):
    ratio = tokens / size
    shown = "<0.01" if ratio < 0.005 else f"{ratio:.2f}"
    if ratio <= 1:
        return f"{shown} (fits)"
    return f"{shown} ({-(-tokens // size)} windows)"


def md(text):
    return str(text).replace("|", "\\|")


def link(url):
    path = urllib.parse.urlparse(url).path or "/"
    label = path if len(path) <= 70 else path[:67] + "..."
    safe = url.replace("|", "%7C").replace(")", "%29").replace("(", "%28")
    return f"[{md(label)}]({safe})"


by_section = collections.defaultdict(list)
for r in rows:
    by_section[r["section"]].append(r)
sections = sorted(by_section, key=lambda s: -total(by_section[s], "qwen3_tokens"))

pages = len(rows)
full, dedup, o200k = total(rows, "qwen3_tokens"), total(rows, "qwen3_tokens_dedup"), total(rows, "o200k_tokens")
core = [r for r in rows if r["section"] not in news]
news_found = sorted(s for s in by_section if s in news)
core_full, core_dedup = total(core, "qwen3_tokens"), total(core, "qwen3_tokens_dedup")
thin = total(rows, "thin")

out = []
w = out.append
w(f"# {args.name} Website Corpus")
w("")
fits = [label for label, size in WINDOWS if dedup <= size]
w(f"{args.name}: {n(pages)} pages with {n(full)} Qwen3 tokens ({n(dedup)} after removing repeated "
  f"lines, {n(o200k)} o200k tokens). "
  + (f"After dedup it fits in a single {fits[0]} window." if fits
     else f"After dedup it needs {-(-dedup // WINDOWS[-1][1])} windows of 1M tokens: it does not fit in one."))
w("")
w("| Pages crawled | Qwen3 tokens | Qwen3 tokens after dedup | o200k tokens |")
w("|---:|---:|---:|---:|")
w(f"| {n(pages)} | {n(full)} | {n(dedup)} | {n(o200k)} |")
w("")

w("## Does it fit in one context window?")
w("")
w("Tokens divided by the window size; below 1.00 the corpus fits in one window, above it the "
  "number of windows needed follows in brackets. 128k = 131,072, 256k = 262,144, 1M = 1,048,576 tokens.")
w("")
w("| Corpus | Qwen3 tokens | " + " | ".join(label for label, _ in WINDOWS) + " |")
w("|---|---:|" + "---:|" * len(WINDOWS))
table = [("Full corpus", full), ("After dedup", dedup)]
if news and news_found:
    table += [("Core pages (no " + ", ".join(news_found) + ")", core_full),
              ("Core pages after dedup", core_dedup)]
for label, tokens in table:
    w(f"| {md(label)} | {n(tokens)} | " + " | ".join(windows_cell(tokens, s) for _, s in WINDOWS) + " |")
w("")
if news and not news_found:
    w("No blog or news-like section was found, so there is no separate core-pages row.")
    w("")

w("## Tokens by section")
w("")
top = sections[:CHART_SECTIONS]
rest = sections[CHART_SECTIONS:]
labels = [x.replace('"', "'") for x in top]
fulls = [total(by_section[x], "qwen3_tokens") for x in top]
deds = [total(by_section[x], "qwen3_tokens_dedup") for x in top]
if rest:
    rows_rest = [r for x in rest for r in by_section[x]]
    labels.append(f"other ({len(rest)})")
    fulls.append(total(rows_rest, "qwen3_tokens"))
    deds.append(total(rows_rest, "qwen3_tokens_dedup"))
unit, unit_name = (1000, "thousands") if max(fulls) >= 20_000 else (1, "")
fulls = [round(v / unit) for v in fulls]
deds = [round(v / unit) for v in deds]
w("Qwen3 tokens" + (f" in {unit_name}" if unit_name else "") + ", the largest sections first; "
  "both counts share one bar per section: the taller bar behind is the full count, the bar in front of it the count after dedup.")
w("")
w("```mermaid")
w("xychart-beta")
w('    title "Qwen3 tokens by section' + (f" ({unit_name})" if unit_name else "") + ': full vs. after dedup"')
w("    x-axis [" + ", ".join(f'"{lab}"' for lab in labels) + "]")
w('    y-axis "Tokens' + (f" ({unit_name})" if unit_name else "") + f'" 0 --> {max(fulls + [1])}')
w("    bar [" + ", ".join(map(str, fulls)) + "]")
w("    bar [" + ", ".join(map(str, deds)) + "]")
w("```")
w("")

w("## All sections")
w("")
w(f"Thin pages have under {THIN_CHARS} characters of main text.")
w("")
w("| Section | Pages | Thin pages | Characters | o200k tokens | Qwen3 tokens | Qwen3 after dedup | Dedup saving |")
w("|---|---:|---:|---:|---:|---:|---:|---:|")
for s in sections:
    rs = by_section[s]
    f_, d_ = total(rs, "qwen3_tokens"), total(rs, "qwen3_tokens_dedup")
    w(f"| {md(s)} | {n(len(rs))} | {n(total(rs, 'thin'))} | {n(total(rs, 'chars'))} | "
      f"{n(total(rs, 'o200k_tokens'))} | {n(f_)} | {n(d_)} | {share(f_ - d_, f_)} |")
w(f"| **Total** | **{n(pages)}** | **{n(thin)}** | **{n(total(rows, 'chars'))}** | **{n(o200k)}** | "
  f"**{n(full)}** | **{n(dedup)}** | **{share(full - dedup, full)}** |")
w("")

w("## Largest pages")
w("")
w("| # | Qwen3 tokens | Section | Page |")
w("|---:|---:|---|---|")
for i, r in enumerate(sorted(rows, key=lambda r: -r["qwen3_tokens"])[:20], 1):
    w(f"| {i} | {n(r['qwen3_tokens'])} | {md(r['section'])} | {link(r['url'])} |")
w("")

ratio = f"{full / o200k:.2f}" if o200k else "-"
w("## Method")
w("")
w(f"- **Crawl:** URLs from the site's sitemap(s), fetched on {crawl_date}. Pages missing from the "
  "sitemap are missing from the corpus.")
w("- **Extraction:** the text of `<main>` (`<body>` if there is none). Scripts, styles, forms, "
  "buttons, iframes, `<nav>` and the selectors given to `--drop` are removed; headings and list "
  "items are kept; consecutive identical lines are dropped.")
w("- **Tokenizers:** Qwen3 (`Qwen/Qwen3-8B`) and OpenAI `o200k_base`. Size context windows with the "
  "tokenizer of the model you will actually use.")
w(f"- **Ratio:** the Qwen3 count is {ratio} times the o200k count for this corpus.")
w("- **Dedup:** a line of 40 or more characters is counted only on the first page where it appears, "
  "in sitemap order. Corpus totals do not depend on page order; per-section dedup numbers do.")
if news and news_found:
    w("- **Core pages:** all sections except " + ", ".join(news_found) + ".")
w("")

text = "\n".join(out) + "\n"
(root / "corpus/report.md").write_text(text)
print(text)
print(f"written to {root / 'corpus/report.md'}")
```
