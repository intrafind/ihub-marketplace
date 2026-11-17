# Change Threat Modeler: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: E-signature integration before go-live

**Request**

> Pre-deployment review, please. Our contract app (internal, Azure West Europe) will send contracts to the e-signature
> SaaS "SignFlow". F1: app calls SignFlow's API (OAuth 2.0 client credentials, TLS) with the PDF, signer names, emails. F2: SignFlow calls our webhook when a document is signed; the webhook URL carries a static token
> as a query parameter, no signature check. F3: the receiver writes the status to the contract DB as db_owner. SignFlow hosts in the EU but uses a US sub-processor for email. It keeps
> documents 10 years by default; we keep contracts 6 years. Reviewer: IT Security, 12 Nov 2026.

**How the skill handles it**

- Step 1 fixes scope to F1–F3; SignFlow's internals are out of scope.
- Steps 2–3: the inbound webhook (F2) crosses a trust boundary; the "Webhook receiver" pattern adds the HMAC check.
- Step 5: a US sub-processor raises the transfer and DPA questions; DPIA judged not triggered, to be confirmed.
- Step 6: a High finding means approval waits for a dated plan. Nothing is called secure.

**Answer**

# Security Review: SignFlow e-signature integration

| Item | Entry |
|------|-------|
| Under review | Contract app integration with SignFlow (flows F1–F3) |
| Review date | 12 Nov 2026 |
| Reviewed by | IT Security |
| Kind of review | Pre-deployment |
| Overall risk | High |

## Summary for decision-makers
The webhook accepts any request carrying a static URL token, so anyone who obtains the URL can mark contracts as
signed. The database service account holds far more rights than it needs, and the transfer basis for the US email
sub-processor is unconfirmed. Go-live waits for a dated plan to add webhook signature verification.

## Coverage
In scope: flows F1–F3 and their components [Per system description]. Out of scope: SignFlow's infrastructure, app login.

## How the data moves
| Flow | From | To | Payload | Sensitivity | Auth mechanism | Encryption | Persistence |
|------|------|----|---------|-------------|----------------|------------|-------------|
| F1 | Contract app | SignFlow API | Contract PDF, signer names, emails | Restricted/PII | OAuth 2.0 client credentials | TLS | SignFlow, 10 years |
| F2 | SignFlow | Webhook receiver | Document ID, status, timestamp | Internal | Static token in query string | TLS | Not stored |
| F3 | Webhook receiver | Contract DB | Status update | Internal | Service account (db_owner) | TLS | Contract DB, 6 years |

Trust boundary crossings: F1 outbound and F2 inbound.

## STRIDE results
| # | Component or flow | Category | Threat | Controls already present | Risk left over | Rating | Recommended action |
|---|---|---|---|---|---|---|---|
| 1 | F2 | S/T | Forged webhook marks an unsigned contract as signed | Static URL token | Token appears in proxy and access logs | H | Verify SignFlow's HMAC signature; drop the URL token |
| 2 | F3 | E | Compromised receiver can alter or drop any table | None | Full database control | M | Grant UPDATE on the status table only |
| 3 | Webhook receiver | R/D | No record of status changes; no rate limit | None | Untraceable disputes, delayed updates | L | Log event IDs; rate-limit |

Not evaluated: Information Disclosure and Denial of Service for F1, as SignFlow's API controls and SLA were not
provided. [AI inference — security team to confirm]

## Authentication and authorization
**What works well**
- F1 uses OAuth 2.0 client credentials, not a static API key. [Per system description]

**Weaknesses found**
| Ref | Weakness | Potential consequence | Rating | Suggested fix |
|-----|----------|-----------------------|--------|---------------|
| A1 | Webhook auth by URL token only | Forged status changes | H | HMAC verification |

**Over-provisioned access**
| Account, role, or service | Access held today | Access actually needed | Fix |
|---------------------------|-------------------|------------------------|-----|
| Webhook service account | db_owner | UPDATE on contract status | Reduce |

## Personal data and GDPR
Signer names and emails are processed. US sub-processor: confirm transfer mechanism and Article 28 DPA. SignFlow's 10-year retention exceeds your 6 years: configure deletion. No profiling or special
categories, so a DPIA appears not to be triggered; add SignFlow to the ROPA. [AI inference — security team to confirm]

## Findings register
| Ref | Issue | Area | Rating | Fix | Accountable owner | State |
|-----|-------|------|--------|-----|-------------------|-------|
| R1 | Unauthenticated webhook | STRIDE | H | HMAC verification | Contract app team | Open |
| R2 | db_owner service account | Access | M | Least privilege | DBA team | Open |
| R3 | US transfer basis unconfirmed | Data Protection | M | Confirm DPA and transfer mechanism | Data protection officer | Open |
| R4 | Retention 10 vs. 6 years | Data Protection | L | Set deletion at SignFlow | Contract app team | Open |

## Approval conditions
- A dated remediation plan for R1; meanwhile, as compensating control, allow F2 only from SignFlow's IP ranges.

## Risks knowingly accepted
None.

## Example 2: "Confirm it's secure" with no architecture (German)

**Request**

> Wir binden nächste Woche unser Kundenportal an den neuen Zahlungsdienstleister an. Können Sie kurz bestätigen,
> dass das sicher ist? Wir brauchen das für die Freigabe.

**How the skill handles it**

- Ground rules: never calls a system "secure", and produces no findings for an assumed architecture.
- Step 1 cannot be completed, so it asks the scope questions. Answers in German.

**Answer**

Dass die Anbindung „sicher“ ist, kann ich nicht bestätigen: Eine Prüfung zeigt bekannte Risiken auf, sie belegt
nicht, dass keine bestehen. Ich kann einen Sicherheitsbericht mit Freigabebedingungen liefern. Dafür brauche ich
Ihre Beschreibung der Architektur:

1. **Datenflüsse:** Welche Daten gehen vom Portal zum Zahlungsdienstleister und zurück (Kartendaten, IBAN, Name,
   Bestellbetrag)? Leitet das Portal Kartendaten selbst weiter oder nutzt es ein gehostetes Zahlungsformular?
2. **Anbindungsart:** API-Schlüssel, OAuth, Webhook für Zahlungsbestätigungen, eingebettetes iFrame?
3. **Authentifizierung:** Wo liegen Schlüssel und Secrets, und wer kann sie ändern?
4. **Regulatorik:** Welche Vorgaben gelten (z. B. PCI DSS, DSGVO), und wo verarbeitet der Dienstleister die Daten?
5. **Abgrenzung:** Was soll ausdrücklich nicht geprüft werden?

Eine Architekturskizze oder die Integrationsdokumentation genügt. Daraus erstelle ich Datenflussregister,
STRIDE-Analyse, Berechtigungs- und DSGVO-Prüfung und bewerte jeden Befund mit seiner Wirkung auf die Freigabe:
Bei Kritisch nur mit dokumentierter Unterschrift des CISO, bei Hoch mit datiertem Maßnahmenplan.
