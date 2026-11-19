# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities privately, not through a public GitHub issue. This covers
the catalog content (apps, prompts, skills, workflows, integration definitions), the scripts that
check and package it, the marketplace website and the offline marketplace image.

**Contact:** [security@intrafind.com](mailto:security@intrafind.com)

Include as much detail as you can: the affected item or commit, steps to reproduce, and the
potential impact. We'll acknowledge your report and work with you on a fix and a disclosure
timeline.

Vulnerabilities in iHub Apps itself belong to
[intrafind/ihub-apps](https://github.com/intrafind/ihub-apps/blob/main/SECURITY.md); the same
contact applies.

## Automated Checks

Every pull request and push to `main` runs a secret scan (gitleaks), a workflow audit (zizmor) and
an infrastructure-as-code scan of the Dockerfile (Trivy) — see `.github/workflows/security.yml`.
OpenSSF Scorecard grades the repository weekly (`.github/workflows/scorecard.yml`), and Dependabot
keeps the pinned actions and the base image current.
