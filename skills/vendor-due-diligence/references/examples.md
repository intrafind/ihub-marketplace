# Vendor Due Diligence: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: New employee survey tool handling personal data

**Request**

> HR wants PulseBoard for engagement surveys: 1,200 employees, SSO via Entra ID, HR exports results, not critical
> if down a day, GDPR applies. From their security pack: ISO 27001 certificate valid to 2028,
> scope "PulseBoard SaaS platform and operations"; no SOC 2. Hosting AWS Frankfurt. SAML SSO, SCIM. MFA enforced
> for admins, optional for others. AES-256 at rest, TLS 1.2+. Pentest by a third party, March 2026, remediation
> letter attached. DPA per Art. 28, breach notice within 48h, deletion within 30 days of contract end with
> certificate. Sub-processors: AWS (DE), support ticketing tool in the US under SCCs 2021/914; TIA "available on
> request". CSV and API export. 99.5% uptime SLA. Review by IT security (me, Katrin Vogel), 17 Nov 2026.

**How the skill handles it**

- Step 1: survey answers are employee personal data (Confidential); 1,200 users make SCIM and the Confidential+
  criteria mandatory; criticality Operational.
- Steps 2–3: ISO 27001 scope covers the service; MFA for all users is "always" mandatory and is not met. The US
  support sub-processor triggers the Schrems II checklist; the TIA was not seen, so that point stays open.
- Step 5: three domains scored 4/5 with the gaps named; Confidential data, many users: risk level High, so CISO,
  legal and management sign off. Every statement carries a source tag.

**Answer**

# Vendor Review: PulseBoard

| Item | Entry |
|------|-------|
| Offering under review | PulseBoard SaaS, employee engagement surveys |
| Review date | 17 Nov 2026 |
| Reviewed by | Katrin Vogel, IT security |
| Review trigger | New vendor |

## Bottom line
- **Risk level:** High
- **Decision:** Approve with conditions
- **What matters most:**
  - MFA is optional for non-admin users; enforcement is mandatory for all tiers `[Assessment criteria]`
  - Support data goes to a US sub-processor under SCCs; the TIA has not been reviewed `[Vendor-supplied evidence]`
  - ISO 27001 scope covers the service itself `[Vendor-supplied evidence]`

## Scope recap
| Question | Answer |
|----------|--------|
| Intended use | Engagement surveys for 1,200 employees, results exported by HR `[User's stated requirement]` |
| Data sensitivity | Confidential (employee personal data) |
| How deeply it connects | SSO |
| Business criticality | Operational |
| Regulations in play | GDPR |

## Security: 4/5
SAML SSO and SCIM available; AES-256 at rest, TLS 1.2+; third-party pentest March 2026 with remediation letter
`[Vendor-supplied evidence]`. Gap: MFA enforced for admins only. With SSO, MFA can be enforced by Entra ID, which
is a workable compensating control `[AI judgment — confirm with the vendor]`. Tenant isolation, backup, network
security: Not assessed.

## Compliance: 4/5
ISO 27001 certificate valid to 2028, scope "PulseBoard SaaS platform and operations"; Statement of Applicability
not yet reviewed. No SOC 2. DPA per Art. 28; breach notice within 48h leaves time for our 72h duty; deletion
within 30 days with certificate `[Vendor-supplied evidence]`. Sub-processor change notification and right to
object: Not assessed.

## Capability: 4/5
Fits the HR use case; CSV and API export support exit; 99.5% uptime SLA is adequate for Operational criticality
`[Vendor-supplied evidence]`. Support, viability: Not assessed.

## EU residency and transfers
Data at rest in Frankfurt (AWS, DE). Support tickets go to a US ticketing sub-processor under EU SCCs 2021/914
`[Vendor-supplied evidence]`. Schrems II: flow mapped and legal basis named; the destination-law assessment
depends on the vendor's TIA, which we have not seen. Safeguard: no survey content in support tickets
`[AI judgment — confirm with the vendor]`.

## Risk log
| Ref | Risk | Severity (H/M/L) | Probability (H/M/L) | Mitigation | Accountable owner | State |
|-----|------|------------------|---------------------|------------|-------------------|-------|
| V1 | Accounts without MFA | H | M | Enforce MFA via Entra ID conditional access for all PulseBoard users | IT identity team | Open |
| V2 | US transfer without reviewed TIA | M | M | Obtain and review TIA; keep personal data out of support tickets | Data protection officer | Open |
| V3 | SoA exclusions unknown | M | L | Request and review the ISO 27001 SoA | IT security | Open |

## Approval conditions
1. MFA enforced for all users via Entra ID — before go-live.
2. TIA received and reviewed by the DPO — before signature.
3. Statement of Applicability reviewed — within 30 days of signing.

Sign-off required: CISO, legal review and management.

## Next look
- Scheduled re-review: November 2027 (High = annual)
- Early re-review triggers: new non-EU sub-processors, use beyond HR surveys, a vendor security incident

## Example 2: Request for a verdict from memory, and a ranking

**Request**

> Is DataNest GDPR compliant? You must know them. And is DataNest more secure than CloudVault? We want to store
> customer contracts there. We haven't requested any documents yet.

**How the skill handles it**

- Ground rules: no security or compliance status from training data, and no ranking of vendors. The skill says so
  and explains how a comparison would work (one assessment per vendor).
- Step 1 can be started from what the user said: customer contracts are Confidential at least, possibly
  Restricted. The skill lists the scope questions still open and the evidence to request.

**Answer**

I can't answer either question as asked. Whether a vendor is GDPR compliant I judge only from its documents, not
from memory; certifications and contracts change. I also don't say one vendor is "more secure" than another: I
assess each vendor separately against the same criteria. Choosing between two assessed vendors is what the
Vendor Evaluator skill is for. `[Assessment criteria]`

**Scope so far:** customer contracts are at least Confidential, and Restricted if they hold personal data.
`[User's stated requirement]`

**Still open (Step 1)**
1. Who will use the tool, and how many people?
2. Storage only, or connected to CRM or ERP?
3. What happens if the tool is down for a day?
4. Do rules beyond GDPR apply, for example NIS2?

**To request from both vendors**
- ISO 27001 certificate with scope and Statement of Applicability; SOC 2 Type II report or C5 if available
- Data processing agreement per GDPR Art. 28 and the sub-processor list with locations
- Storage and processing locations, transfer mechanism and Transfer Impact Assessment
- Security questionnaire (CAIQ or SIG is fine), latest pentest report, deletion and export process

With these I'll write a separate assessment per vendor, with risk level and approval path.
