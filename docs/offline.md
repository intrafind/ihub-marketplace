# Offline marketplace (air-gapped installations)

An iHub without internet access cannot reach `raw.githubusercontent.com`, so it cannot use the
official registry. The **offline marketplace** is the same catalog as a folder of static files that
you host inside your network and add to iHub as a registry. It contains everything: the website,
`catalog.json`, and every file the catalog points at. Nothing is fetched from the internet, neither
by iHub nor by the website.

You can get it in two forms. Both are built from the same sources by the **Offline Marketplace**
workflow (`.github/workflows/docker.yml`) and published together as one
[release](#releases-and-versions):

| Form                 | What it is                                                                | Use it when                                  |
| -------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| **Docker image**     | `ghcr.io/intrafind/ihub-marketplace`: nginx serving the bundle, port 8080 | You run containers (the easiest way)         |
| **Bundle (.tar.gz)** | The static files, with a `.sha256` file, attached to the GitHub release   | You have a web server already (nginx, Apache, IIS, Caddy, S3 website, …) |

## Quick start with Docker

On a machine **with** internet access, pull the image and write it to a file:

```bash
docker pull ghcr.io/intrafind/ihub-marketplace:latest
docker save ghcr.io/intrafind/ihub-marketplace:latest | gzip > ihub-marketplace-image.tar.gz
```

Carry the file into the air-gapped network and load it there (or `docker push` it to your internal
registry):

```bash
docker load < ihub-marketplace-image.tar.gz
docker run -d --name ihub-marketplace --restart unless-stopped -p 8080:8080 \
  ghcr.io/intrafind/ihub-marketplace:latest
```

Open `http://<host>:8080/` for the website, which shows the registry URL to use in iHub
(`http://<host>:8080/catalog.json`). The image needs no volume, configuration or internet access. It
runs as a non-root user, also with `--read-only --cap-drop ALL`, answers `GET /healthz` and is about
90 MB. Images are published for `linux/amd64` and `linux/arm64`. Tag them by version, not by
`latest`, in production: `ghcr.io/intrafind/ihub-marketplace:<version>` (see
[Releases and versions](#releases-and-versions)).

## Quick start without Docker

1. On a machine with internet access, open the
   [latest release](https://github.com/intrafind/ihub-marketplace/releases/latest) and download
   `ihub-marketplace-offline-<version>.tar.gz` and its `.sha256` file. (Or build it yourself, see
   [Building it yourself](#building-it-yourself).)
2. Carry both files into the network, verify and unpack the bundle where your web server serves
   files from:

   ```bash
   sha256sum -c ihub-marketplace-offline-*.tar.gz.sha256
   mkdir -p /var/www/marketplace
   tar -xzf ihub-marketplace-offline-*.tar.gz --strip-components=1 -C /var/www/marketplace
   ```

3. Serve that folder over HTTP(S). It is static: no PHP, no rewrites, no CORS headers, and it can sit
   below any path (`https://tools.example.com/marketplace/catalog.json`). With nginx:

   ```nginx
   server {
     listen 8080;
     root /var/www/marketplace;
     add_header Cache-Control "no-cache" always;   # a new bundle is seen at once
   }
   ```

   To try it out: `python3 -m http.server 8080 --directory /var/www/marketplace`.

## Adding it to iHub

1. In iHub open **Admin → Marketplace → Manage Registries → Add Registry**.
2. Name it, give it an ID such as `ihub-offline`, and enter the **Catalog URL**
   `http://<host>:8080/catalog.json`. The website shows this URL, ready to copy.
3. **Test Connection**, **Save**, then press **Refresh** on the registry. The marketplace now lists
   items of the catalog (347 at the time of writing).
4. Switch off the two preconfigured registries, **iHub Official Marketplace** and **iHub Examples**:
   they live on GitHub and cannot be refreshed without internet access.

Things to know:

- **One host.** iHub downloads an item and its companion files only from the host of the catalog (or
  from public addresses). A bundle on a private address works, because the registry's own host is
  always allowed. Keep the whole bundle on one host.
- **TLS with a private CA.** If you serve the bundle over HTTPS with a certificate from your own
  CA, iHub must trust it: add the CA to the server's trust store (`NODE_EXTRA_CA_CERTS`), or list the
  host under the platform's SSL settings (`ssl.domainWhitelist`). A registry URL with `http://`
  needs no certificate; the catalog and the items are then fetched over `http://`, too.
- **A web server with sign-in.** If the bundle sits behind authentication, set it under
  **Authentication** (Bearer Token, Basic Auth or Custom Header) in the registry form.
- **iHub version.** The 89 skills that the official catalog links to on GitHub are copied into the
  bundle and installed with their reference files from the registry itself. That needs an iHub
  release that supports skill companion files from a registry's own host (see the release notes
  entry *Marketplace: Offline Registry*). Older releases install the other items and the 27 copied
  skills without reference files, and fail on the 62 copied skills that have some.

## What is in the bundle

Everything the official catalog lists: 92 apps, 19 models, 5 prompts, 195 skills, 6 workflows and 30
integrations, plus the website and the released versions of every integration (so version pins and
the release channel work as online).

What differs from `https://intrafind.github.io/ihub-marketplace/`:

- **89 skills are copied in.** The Google skills are listed in the official catalog as links to
  [google/skills](https://github.com/google/skills) and
  [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills), each at a fixed
  commit. The build downloads exactly those files into `skills/<name>/` and lists them as ordinary
  skills of the registry. Nothing is dropped: the bundle has the same items, with the same names,
  versions and companion files. The Apache-2.0 license text of each repository is in
  `third-party/<owner>/<repo>/<commit>/LICENSE.txt` (the website links to it), and
  `offline-manifest.json` lists every copied file with its SHA-256.
- **The website is in offline mode**: no links to GitHub, and the registry URL it shows is the
  address it is served from.
- **The links in the catalog entries** (`licenseUrl`) still name GitHub. iHub shows them as links
  that do not open without internet access; the license texts are in the bundle.

What the bundle cannot change is what the items connect to:

- The **29 MCP integrations** (Linear, Stripe, GitHub, …) are hosted services on the internet. They
  install, but they work only where iHub can reach those services. The **CKAN** integration works
  against any portal iHub can reach, for example an internal one.
- **Model configurations** name the endpoint of their provider and contain no API keys. Use the
  models that your iHub can reach, or point a model at your own endpoint
  ([local LLM providers](https://github.com/intrafind/ihub-apps/blob/main/docs/local-llm-providers.md)).
- Apps, prompts, workflows and skills need nothing but iHub and a model.

## Releases and versions

Every pull request that is merged to `main` is a release, and so is the weekly rebuild that picks up
the security updates of the image's base image. The **version** is the UTC time of the build as
`yyyymmddhhmm`, for example `202611032031` (two releases in the same minute: the second takes the
next one). A release holds, under the same version:

- the **Docker image** `ghcr.io/intrafind/ihub-marketplace:<version>`. `latest` is the newest release,
  `sha-<commit>` names the commit it was built from, and the image's
  `org.opencontainers.image.version` label carries the version;
- the **bundle** `ihub-marketplace-offline-<version>.tar.gz` and
  `ihub-marketplace-offline-<version>.tar.gz.sha256`, attached to the
  [GitHub release](https://github.com/intrafind/ihub-marketplace/releases) `<version>`, which also
  lists what was merged since the release before.

The same version is in the bundle's `offline-manifest.json` (`version`, with the `commit`), so a
running copy tells which release it is: `curl http://<host>:8080/offline-manifest.json`. Pull requests
build and test everything but publish nothing.

## Updating

Publish a new release the way you published the first one and iHub finds it:

- **Docker:** `docker pull` and `docker save` on the connected side, `docker load` and
  `docker rm -f` / `docker run` again on the other (the container holds no data).
- **Tarball:** unpack into a new folder and switch the web server over (or unpack over the old
  folder; files that were removed upstream stay behind, so a new folder is cleaner).

In iHub, press **Refresh** on the registry, or switch on **Auto Refresh** (every 1–168 hours). Items
with a newer version then show **Update available**, as with the online marketplace.

## Checking a hosted copy

`scripts/check-served-bundle.js` requests the catalog and every file it lists and reports what the web
server does not serve, for example after a copy that lost a folder:

```bash
node scripts/check-served-bundle.js http://<host>:8080/
# http://<host>:8080/: <n> catalog items, <m> files, all served
```

## Building it yourself

You need Node.js 20+, bash, git and internet access, once. Clone the repository **with its tags**
(`git clone` and `git fetch --tags`): the released versions of the integrations are published from
them.

```bash
./scripts/build-offline.sh                 # npm run build:offline
# _offline/ihub-marketplace-offline/                      the bundle
# _offline/ihub-marketplace-offline-<catalog version>-<commit>.tar.gz (+ .sha256)
```

`--version <version>` sets the release version, which names the archive and is recorded in the
manifest (`./scripts/build-offline.sh --version 202611032031`); the release workflow passes the UTC
time of its run.

The script builds the website (`scripts/build-site.sh`, which validates the catalog), downloads the
skills the catalog links to elsewhere (`scripts/build-offline.js`) and writes the archive. It fails
instead of leaving something out: a download that fails, a skill whose `SKILL.md` names another
skill, a source it cannot copy, or a result with fewer items than the catalog. Behind a proxy:

```bash
NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://proxy:3128 NODE_EXTRA_CA_CERTS=/path/to/ca.pem \
  ./scripts/build-offline.sh
```

The image is built from the same sources (the `Dockerfile` runs the script in a first stage):

```bash
docker build -t ihub-marketplace .                              # add --build-arg VERSION=<version> to set the version label
docker run -d -p 8080:8080 ihub-marketplace
```

Behind a proxy that re-signs HTTPS, add
`--build-arg HTTPS_PROXY=http://proxy:3128 --build-arg NODE_USE_ENV_PROXY=1 --build-arg NODE_EXTRA_CA_CERTS=/src/ca.pem`
(with `ca.pem` in the repository folder, so that it is part of the build context).

### Your own catalog

A private fork of this repository can publish its own offline marketplace in the same way: the
workflow builds the image into the fork's GitHub Container Registry. A source of `type: "url"` is
copied into the bundle if it is a skill (`SKILL.md`) on an https address, with a `licenseUrl` of the
form `https://github.com/<owner>/<repo>/blob/<commit>/LICENSE`. The build refuses any other source
that points away from the catalog's own folder.
