# Architecture Decision Guide: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Telemetry ingestion with requirements already worked out

**Request**

> We need an ADR for machine telemetry at Brandt Kunststofftechnik. Requirements are agreed:
> - 1,200 injection-moulding machines, each sends one reading (about 1 KB JSON) every 10 seconds; peaks 1.5x the
>   average after shift changes.
> - Use cases: live dashboard per hall (5-min freshness is fine), monthly OEE reports, alerts on temperature drift.
> - Ranked NFRs: (1) durability: lose at most 1 minute of readings; (2) cost below EUR 4,000/month;
>   (3) operability: 4 engineers, Python + PostgreSQL, business-hours on-call only; (4) availability 99.5%.
> - Constraints: data stays in the EU; go-live in 4 months; keep readings for 12 months.
> Options we discussed: TimescaleDB on our managed PostgreSQL, a managed Kafka + time-series DB, or a managed
> IoT platform.

**How the skill handles it**

- Phase 1 exit gate is met (NFRs ranked and measurable), so the skill asks nothing.
- Phase 3: the options differ on build vs buy, one of the skill's divergence dimensions.
- Phase 5: sizing uses only the user's inputs; every estimate carries the rough-order tag, and processing time
  per message is marked as needing benchmarking rather than invented.
- Phase 6: the ADR is the deliverable, with status "Proposed" until the team accepts it.

**Answer**

# ADR-014: Store machine telemetry in TimescaleDB on managed PostgreSQL

- **Date:** 2026-11-17
- **Status:** Proposed

## Context
Brandt Kunststofftechnik needs to ingest telemetry from 1,200 machines for live hall dashboards, monthly OEE
reports and temperature-drift alerts. Ranked requirements: durability (at most 1 minute of data loss), cost below
EUR 4,000/month, operability for a 4-person Python/PostgreSQL team on business-hours on-call, 99.5% availability.
Constraints: EU data residency, go-live within 4 months, 12-month retention. [Source: user's requirements]

## Decision
We will ingest readings through a small Python service into TimescaleDB on our existing managed PostgreSQL
(EU region), to meet the durability and cost targets with technology the team already runs.

## Alternatives weighed

| Option | Summary | Strengths | Weaknesses |
|---|---|---|---|
| A: TimescaleDB on managed PostgreSQL | Python ingest service writes in batches; aggregates feed dashboards and OEE | Known stack; one datastore; lowest ops load | One primary for writes; vertical scaling limits |
| B: Managed Kafka + time-series DB | Machines publish to Kafka; consumers write to a separate time-series store | Buffers bursts; replay after outages | Two new technologies; more moving parts for a 4-person team |
| C: Managed IoT platform | Vendor handles ingest, storage and dashboards | Fastest to a first dashboard | Vendor lock-in; EU residency and cost must be confirmed per contract |

## Trade-off summary
| Quality attribute | Goal | A | B | C |
|---|---|---|---|---|
| Durability | ≤ 1 min loss | Meets, if machines buffer locally during DB failover | Meets: Kafka retains and replays | Partially meets: depends on vendor SLA |
| Cost | < EUR 4,000/month | Meets, extends an existing service | Partially meets: two managed services | Does not meet or unknown: per-device pricing |
| Operability | 4 engineers, business hours | Meets: known stack | Does not meet: new skills, more on-call | Meets: vendor-run |
| Availability | 99.5% | Meets with managed failover | Meets | Meets per vendor SLA |

Durability and operability tipped the balance: B costs more operations than the team can carry; C cannot be shown
to meet cost and residency. [Source: AI judgment — verify before relying on it]

## Sizing
[Rough order of magnitude — confirm through load tests]
- Peak traffic: 1,200 machines × 8,640 readings/day ÷ 86,400 s × 1.5 = 180 writes/s
- Storage: 10,368,000 readings/day × 1 KB × 365 ≈ 3.8 TB/year raw; × 3 for indices and replicas ≈ 11.4 TB,
  before TimescaleDB compression
- Processing: per-reading insert time [Needs benchmarking against your own workload and setup]; batching
  1-second windows reduces the write rate to about 180 rows per batch statement

## Consequences
- Easier: one database for live and historical data; existing backups and skills apply.
- Harder: write capacity is bounded by the primary.
- New constraint: machines must buffer at least 60 seconds of readings locally to cover a failover.

## What could go wrong
- A failover longer than the machine buffer loses readings. Signal: gaps in the per-machine sequence numbers.
- Storage cost grows faster than planned if compression underperforms. Signal: monthly storage above forecast.

## When to revisit
- More than 3,000 machines or a reading interval below 5 seconds.
- Sub-minute alerting needed in all halls.
- Database cost above EUR 3,000/month.

Open checklist items: RPO/RTO restore test not scheduled; night on-call scope undefined.

## Example 2: "Microservices or Kafka?" with no requirements yet

**Request**

> We're rebuilding our order-management system. Should we go microservices with Kafka? Write the ADR so I can show
> it to the team on Monday.

**How the skill handles it**

- Method rule: no options before Phases 1 and 2 are finished; nothing about load, consistency, team or budget is
  known, so writing an ADR now would justify a choice rather than make one.
- Ground rule: no technology is pushed without context; Kafka is neither endorsed nor rejected.
- It asks for what the Phase 1 exit gate and Phase 2 need, and offers something usable for Monday.

**Answer**

I can't recommend microservices with Kafka yet: an ADR has to show why an option beats the alternatives against
your requirements, and I don't know them. These answers get us to a real decision:

**Requirements (Phase 1)**
1. Load: how many orders per day today, expected in 1 and 3 years, and how bursty (e.g. month-end peaks)?
2. Consistency: must stock reservation and order confirmation be strongly consistent, or is a short delay
   acceptable?
3. Latency: what response time do users need when placing an order (p95)?
4. Availability: what does an hour of downtime cost, and which functions must keep working?
5. Integrations: which systems does order management talk to (ERP, warehouse, payment), and how?

**Constraints (Phase 2)**
6. Team: how many engineers, which languages, and do they run on-call around the clock?
7. Deadline and budget: when must the new system be live, and what may it cost per month?
8. Regulation and contracts: data residency, audit retention, existing cloud commitments?

For Monday I can prepare a one-page brief listing these questions and the option families we would compare
(modular monolith, services with asynchronous messaging, managed platform), without a verdict.
[Source: standard design method]
