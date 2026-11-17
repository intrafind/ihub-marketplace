# IT Knowledge Documenter: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Runbook from a chat thread

**Request**

> Turn this into a proper runbook, team Order Platform owns it. From our chat: "When orderbridge stops consuming
> (queue `orderbridge.in` keeps growing), restart it. Check you're on context `prod-eu1` with
> `kubectl config current-context`. Then `kubectl -n orders rollout restart deploy/orderbridge` and
> `kubectl -n orders rollout status deploy/orderbridge --timeout=300s`, should say successfully rolled out. Queue:
> `kubectl -n orders exec rabbitmq-0 -- rabbitmqctl list_queues name messages | grep orderbridge.in`, should drop
> within 5 minutes. If pods go CrashLoopBackOff, it's nearly always the DB password secret rotated; check
> `kubectl -n orders get secret orderbridge-db`. Did it last Thursday, 12 Nov 2026, takes about 10 minutes."

**How the skill handles it**

- Step 1: steps to recover one system under pressure, so a **Runbook**.
- User's commands verbatim; each step gets expected output and a failure path.
- Uses the user's own duration (10 min) and test date; escalation contacts were not given, so they are marked
  `[ORGANIZATION TO DEFINE]`, and the backing-out step the notes don't cover is marked `[INPUT REQUIRED: …]`.

**Answer**

# Runbook — Restart the order consumer on orderbridge

`[Template structure]` with commands `[Supplied by the user]`

| Field | Value |
|---|---|
| Owning team | Order Platform |
| Last tested | 2026-11-12 |
| Last updated | 2026-11-17 |
| Typical duration | 10 minutes |

## When to use this
Use this when orderbridge stops consuming and the queue `orderbridge.in` keeps growing.

## Access and tools you need
- [ ] kubectl access to the `orders` namespace on context `prod-eu1`
- [ ] kubectl installed, version `[INPUT REQUIRED: minimum kubectl version]`
- [ ] Kubeconfig credential, obtained from `[INPUT REQUIRED: where the prod-eu1 kubeconfig is stored]`

## Before you start

1. Make sure you are in the right environment:
   ```bash
   kubectl config current-context
   ```
   You should see: `prod-eu1`
2. Record the current queue depth:
   ```bash
   kubectl -n orders exec rabbitmq-0 -- rabbitmqctl list_queues name messages | grep orderbridge.in
   ```
   You should see: `orderbridge.in` with a message count. Note it.

## Steps

### Step 1: Restart the orderbridge deployment
```bash
kubectl -n orders rollout restart deploy/orderbridge
```
**You should see**: `deployment.apps/orderbridge restarted`
**If this fails**: re-check the context; a permissions error means your kubeconfig lacks access to `orders`.

### Step 2: Wait for the rollout
```bash
kubectl -n orders rollout status deploy/orderbridge --timeout=300s
```
**You should see**: `deployment "orderbridge" successfully rolled out`
**If this fails**: if pods show `CrashLoopBackOff`, go to Known problems below.

## Confirming success

1. Re-run the queue check:
   ```bash
   kubectl -n orders exec rabbitmq-0 -- rabbitmqctl list_queues name messages | grep orderbridge.in
   ```
   You should see: the count lower than the number you noted.
2. Watch for 5 minutes, re-running the check.
   You should see: the count dropping steadily.

## Backing out
`[INPUT REQUIRED: what to do if the restarted pods behave worse than before]`

## Known problems and fixes

| What you observe | Probable reason | Fix |
|---|---|---|
| Pods in `CrashLoopBackOff` after restart | Database password secret was rotated | Check the secret with `kubectl -n orders get secret orderbridge-db`; `[INPUT REQUIRED: how to update the secret]` |

## Who to contact next
When neither the steps nor the known-problems table solve it:
- **Office hours**: `[ORGANIZATION TO DEFINE]`
- **Outside office hours**: `[ORGANIZATION TO DEFINE]`

## Example 2: ADR mit Lücken (auf Deutsch)

**Request**

> Schreib bitte ein ADR dazu, dass wir für die Suche in unserem Ersatzteilportal OpenSearch statt der
> PostgreSQL-Volltextsuche nehmen. Grund: Facettensuche und Tippfehlertoleranz gingen mit Postgres nur mühsam,
> das Portal hat 1,2 Mio. Artikel. Entschieden haben das Miriam Kolb und Daniel Ast im Architektur-Board.
> Unsere ADRs gehen bis ADR-017.

**How the skill handles it**

- Step 1: a technology choice with its reasoning, so an **ADR**, numbered ADR-018 in sequence.
- Missing date, effort, third alternative and downsides become `[INPUT REQUIRED: …]`, not guesses.
- Records the rejected option (PostgreSQL full-text search) with the reasons given.
- Status stays "Proposed" until the date and decision record are confirmed.

**Answer**

# ADR-018: OpenSearch für die Suche im Ersatzteilportal

- **Entschieden am**: `[INPUT REQUIRED: Datum der Board-Entscheidung]`
- **Status**: Proposed (auf Accepted setzen, sobald Datum und Protokoll bestätigt sind)
- **Entschieden von**: Miriam Kolb, Daniel Ast (Architektur-Board) `[Supplied by the user]`

## Kontext
Das Ersatzteilportal durchsucht 1,2 Mio. Artikel. Die Suche lief bisher über die PostgreSQL-Volltextsuche.
Facettensuche und Tippfehlertoleranz ließen sich damit nur mühsam umsetzen. `[Supplied by the user]`
`[INPUT REQUIRED: geschäftlicher Anlass, z. B. Beschwerden, Konversionsziele, Zeitrahmen]`

## Entscheidungstreiber
- Facettensuche über das Sortiment `[Supplied by the user]`
- Tippfehlertolerante Suche `[Supplied by the user]`
- Datenmenge von 1,2 Mio. Artikeln `[Supplied by the user]`
- `[INPUT REQUIRED: Budget-, Betriebs- oder Know-how-Vorgaben]`

## Geprüfte Alternativen

### Alternative A: PostgreSQL-Volltextsuche beibehalten
Suche weiter direkt in der bestehenden Datenbank.
- **Dafür**: `[INPUT REQUIRED: z. B. keine zusätzliche Komponente]`
- **Dagegen**: Facettensuche und Tippfehlertoleranz nur mühsam umsetzbar `[Supplied by the user]`
- **Aufwand**: `[INPUT REQUIRED]`

### Alternative B: OpenSearch als eigener Suchdienst
Artikel werden in einen OpenSearch-Index übertragen, das Portal fragt diesen ab.
- **Dafür**: Facetten und Tippfehlertoleranz sind dort Kernfunktionen `[Structured by AI — SME to confirm]`
- **Dagegen**: `[INPUT REQUIRED: z. B. Betrieb, Synchronisation der Daten]`
- **Aufwand**: `[INPUT REQUIRED]`

### Alternative C: `[INPUT REQUIRED: weitere Option, falls geprüft; sonst streichen]`

## Entscheidung
OpenSearch (Alternative B), weil es Facettensuche und Tippfehlertoleranz für 1,2 Mio. Artikel abdeckt, die mit
PostgreSQL nur mühsam erreichbar waren. `[Supplied by the user]`

## Konsequenzen
- **Gut**: Facetten und tippfehlertolerante Suche im Portal
- **Schlecht**: `[INPUT REQUIRED: bewusst akzeptierte Nachteile]`
- **Neutral**: `[INPUT REQUIRED]`

## Nächste Schritte
- [ ] `[INPUT REQUIRED: Umsetzungsaufgabe mit Verantwortlichem]`
- [ ] `[INPUT REQUIRED: Maßnahme gegen ein bekanntes Risiko]`

## Siehe auch
- `[INPUT REQUIRED: Board-Protokoll, frühere ADRs zur Suche]`
