# CKAN Open Data Portal

Connects iHub to any open data portal built on [CKAN](https://ckan.org): GovData and the German state and city portals, data.gov, open.canada.ca, data.gov.uk, hundreds of municipal portals, and internal data catalogs. One installation per portal.

## What the model can do

| Action | CKAN call | Default |
| --- | --- | --- |
| `search_datasets` | `package_search` (full text, filters, facets) | on |
| `get_dataset` | `package_show` (license, maintainer, dates, extras, resources) | on |
| `get_resource` | `resource_show` (one file or API endpoint, download URL) | on |
| `list_organizations`, `get_organization` | publishers | on |
| `list_groups` | thematic groups | on |
| `describe_datastore`, `query_datastore` | DataStore columns and rows (`datastore_active` resources) | on |
| `search_resources`, `list_tags`, `portal_status` | | off |
| `query_datastore_sql` | read-only SQL, portals with `ckan.datastore.sqlsearch.enabled` | off, needs **Allow SQL queries** |

Every dataset in an answer is cited with a link to its portal page. Publishers (organizations) are offered as a scope the user can pick per chat.

## Install

1. **Admin → Marketplace → Integrations → CKAN Open Data Portal → Install**, then **Set up integration**.
2. **Portal URL**: the root of the site, including a path prefix if it has one, e.g. `https://demo.ckan.org`, `https://www.govdata.de/ckan`, `https://opendata.schleswig-holstein.de`.
3. **Sign-in**: *No sign-in* for a public portal. For private datasets choose *Shared service account* and paste an API token (CKAN: User › API tokens); the token header is `Authorization` on CKAN 2.10+ and `X-CKAN-API-Key` on older portals (Advanced settings).
4. **Test connection**, then **Install**.
5. Bind it to an app under **Admin → Apps → Installed integrations**, or install the **Open Data Assistant** app from this marketplace, which binds the installation `open-data-portal`.

## Notes

- Tested on 2026-10-30 against demo.ckan.org (2.11), ckan.govdata.de (2.10), opendata.schleswig-holstein.de (2.11), open.canada.ca (2.10) and data.boston.gov (DataStore + SQL).
- data.europa.eu offers a CKAN-compatible search under `/api/hub/search/ckan`; set **API path** accordingly. Only `search_datasets` works there.
- DCAT-AP.de portals (GovData and most German portals) return URIs for formats and licenses; the model shows the last path segment.
- Responses are trimmed (`extras`, hashes, internal flags) before the model sees them; **Results per search** caps the rows a search returns.
