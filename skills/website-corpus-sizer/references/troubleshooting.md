# Troubleshooting

Read this when a tool answers with `error: true`, or a result looks wrong. An error result has a `code` and a `message` that says what to do.

## Error codes

| Code | Meaning | What to do |
|---|---|---|
| `SIGN_IN_REQUIRED` | The tools keep the crawl for the signed-in user | The user signs in; they do not work for anonymous users |
| `INVALID_URL` | `siteUrl` is not an http(s) address | Ask for the full address, such as `https://www.example.com` |
| `HOST_NOT_ALLOWED` | The host is a company-internal address, which the server may not fetch unless an admin allows it | Offer to send a request with `website_corpus_request_domain`; an admin decides, then the discovery is run again. If the message says a request is already waiting or was declined, say that |
| `HOST_NEVER_ALLOWED` | Loopback, link-local or cloud metadata address: no approval changes this | Tell the user; do not offer a request |
| `HOST_NOT_RESOLVED` | The host name does not resolve from this server | Check the spelling; an internal name needs the server's DNS to know it |
| `INVALID_HOST` | The host of a request is not a host name (a pattern, an empty text) | Ask for one host name, such as `intranet.example.corp` |
| `TOO_MANY_REQUESTS` | The user has too many open requests for websites | Wait for an admin to decide on some of them |
| `TOO_MANY_PAGES` | The sitemaps list more pages in this scope than the installation allows | Narrow the scope with a `prefix`, or ask an admin to raise **Most pages per corpus** |
| `CORPUS_NOT_FOUND` | Unknown `corpusId`, or the corpus expired (kept 14 days, five per user, and a sixth removes the oldest) | Start again with `website_corpus_discover` |
| `INVALID_SELECTOR` | The `dropSelector` is not a valid CSS selector list | Fix it; at most 1,000 characters |
| `SELECTOR_CHANGED` | Pages were already crawled with another selector | Keep the old one, or call again with `restart: true` to crawl from the start |
| `PAGE_NOT_FOUND` | No crawled page matches that address yet | Use a part of an address that was crawled |
| `NOTHING_CRAWLED` | The report was asked for before any page was kept | Run the crawl step first |
| `STORAGE_UNAVAILABLE` | The storage provider cannot keep crawled pages | An admin has to fix the storage (Test on the integration shows it) |

## Symptoms

- **`discover` finds no pages.** The site has no sitemap in robots.txt or at `/sitemap.xml`, or the prefix matches none of its URLs. Ask the user for the sitemap address (`sitemapUrls`) or a different prefix.
- **The sections do not match the site.** The sitemap is out of date or incomplete. The corpus covers only what the sitemap lists; say so.
- **Many pages with almost no text.** The site builds its pages in the browser. The crawler reads the HTML the server sends and does not run JavaScript, so the figures do not measure that site.
- **Many failed pages** (`HTTP 403`, `HTTP 429`, a timeout). The site refuses automated access, or answers a bot-protection page. Do not suggest ways around it; report the share that failed and let the user decide.
- **`blockedByRobots` is not zero.** robots.txt forbids those pages for crawlers; they are not fetched and not in the corpus. Name the count.
- **Pages counted as "not HTML".** The sitemap lists PDFs or other files. They are not in the corpus.
- **A page redirected to another site.** It is not kept; it counts as failed with that reason.
- **A crawl call attempted fewer pages than `batchSize`.** Normal: a call stops starting pages after about 22 seconds. Call it again.
- **The tokens look too round or too high.** The report says whether the counts are `o200k_base` or the four-characters-per-token fallback; the fallback is only a rough approximation.
- **An internal site is refused.** The server does not fetch company-internal addresses unless an admin allows the host (the user's request, `website_corpus_request_domain`, goes to the admin queue under Admin → Integrations → Requests), lists it platform-wide under `ssrf.allowedHosts` or `ssl.domainWhitelist`, or switches on **Allow company-internal websites** for the integration.
