# syntax=docker/dockerfile:1

# The iHub marketplace as a container for installations without internet
# access: an nginx that serves the offline bundle (website, catalog.json and
# every file the catalog points at). Add http://<host>:8080/catalog.json as a
# registry in iHub (Admin → Marketplace → Manage Registries). See docs/offline.md.
#
#   docker build -t ihub-marketplace .
#   docker run -d -p 8080:8080 ihub-marketplace
#
# The build needs internet access once: it copies the skills the catalog links
# to on GitHub into the bundle. The image itself needs none. Build from a clone
# with its history and tags (git clone, git fetch --tags): the released
# versions of the integrations are published from them.

# ---- Build the bundle ------------------------------------------------------
# Always on the build machine's own architecture: the bundle is plain files, so
# a multi-architecture image needs no emulation (the final stage only copies).
FROM --platform=$BUILDPLATFORM node:22-alpine AS bundle

# Behind a proxy that re-signs HTTPS, pass these to `docker build`:
#   --build-arg HTTPS_PROXY=http://proxy:3128 --build-arg NODE_USE_ENV_PROXY=1
#   --build-arg NODE_EXTRA_CA_CERTS=/src/corporate-ca.pem   (a file of the build context)
ARG NODE_USE_ENV_PROXY
ARG NODE_EXTRA_CA_CERTS

RUN apk add --no-cache bash git

WORKDIR /src
COPY . .

# The sources belong to another user than the one that builds them here
RUN git config --global --add safe.directory /src \
 && ./scripts/build-offline.sh --no-archive

# ---- Serve it --------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.28-alpine

LABEL org.opencontainers.image.title="iHub Marketplace (offline)" \
      org.opencontainers.image.description="The iHub marketplace as a static site for installations without internet access" \
      org.opencontainers.image.source="https://github.com/intrafind/ihub-marketplace" \
      org.opencontainers.image.licenses="BSD-3-Clause-with-Mandatory-Attribution"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=bundle /src/_offline/ihub-marketplace-offline/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
