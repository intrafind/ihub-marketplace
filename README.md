# iHub Official Marketplace

The official marketplace registry for [iHub Apps](https://github.com/intrafind/ihub-apps) — a curated collection of AI-powered apps, language model configurations, workflows, prompts, and skills ready to install into your iHub instance.

**Browse the catalog online: [intrafind.github.io/ihub-marketplace](https://intrafind.github.io/ihub-marketplace/)**

## Adding This Registry to iHub Apps

Current iHub Apps releases ship with this registry preconfigured as **iHub Official Marketplace**, so you can go straight to **Admin → Marketplace → Browse**. To add it manually (for example on an older install):

1. Open your iHub Apps instance and navigate to **Admin → Marketplace → Registries**
2. Click **Add Registry**
3. Enter the catalog URL:
   ```
   https://raw.githubusercontent.com/intrafind/ihub-marketplace/main/catalog.json
   ```
4. Click **Save**
5. Browse and install content from **Admin → Marketplace → Browse**

## Content Inventory

### Apps (90)

#### General (21)

| ID | Name | Category |
|----|------|----------|
| `chat` | Chat | utility |
| `email-composer` | Email Composer | communication |
| `translator` | Translator | communication |
| `summarizer` | Summarizer | analysis |
| `deep-researcher` | Deep Researcher | analysis |
| `image-generator` | Image Generator | creative |
| `mermaid-diagrams` | Mermaid Diagrams | productivity |
| `meeting-assistant` | Meeting Assistant | productivity |
| `gdpr-anonymizer` | GDPR Anonymizer | compliance |
| `social-media` | Social Media | writing |
| `prompt-generator` | Prompt Generator | utility |
| `idea-coach` | Idea Coach | writing |
| `research-assistant` | Research Assistant | analysis |
| `file-analysis` | File Analysis | analysis |
| `key-info-extractor` | Key Info Extractor | productivity |
| `nda-risk-analyzer` | NDA Risk Analyzer | legal |
| `hr-assistant` | HR Assistant | business |
| `dictation` | Dictation | utility |
| `note-assistant` | Note Assistant | writing |
| `app-generator` | App Generator | utility |
| `ihub-support-bot` | iHub Support Bot | intrafind |

#### Department Assistants (69)

Ready-to-use assistants for common tasks in data, engineering, finance, HR, security, leadership, legal, marketing, operations, product, PR, sales, and support. Each app ships with a structured system prompt (persona, task, context, format), two starter prompts, and a tuned temperature, in English and German.

Apps marked with *file upload* work best when users upload their own reference material (guidelines, templates, schemas, past examples) into the chat; the greeting of each app says which documents help. Admins can alternatively connect that material permanently as a source.

| ID | Name | Department | Category | Features |
|----|------|------------|----------|----------|
| `metrics-assistant` | Metrics Assistant | Data & Analytics | analysis | file upload |
| `sql-query-assistant` | SQL Query Assistant | Data & Analytics | analysis | file upload |
| `data-model-assistant` | Data Model Assistant | Data & Analytics | analysis | file upload |
| `data-analysis-assistant` | Data Analysis Assistant | Data & Analytics | analysis | file upload |
| `coding-assistant` | Coding Assistant | Engineering | coding | file upload, extended thinking |
| `bug-analyzer` | Bug Analyzer | Engineering | coding | extended thinking |
| `excel-formula-assistant` | Excel Formula Assistant | Finance | finance | — |
| `board-report-assistant` | Board Report Assistant | Finance | finance | file upload |
| `depreciation-assistant` | Depreciation Assistant | Finance | finance | file upload |
| `job-description-writer` | Job Description Writer | HR | hr | file upload |
| `interview-assistant` | Interview Assistant | HR | hr | file upload |
| `onboarding-assistant` | Onboarding Assistant | HR | hr | file upload |
| `intranet-writer` | Intranet Writer | HR | hr | file upload |
| `course-designer` | Course Designer | HR | hr | file upload |
| `training-plan-assistant` | Training Plan Assistant | HR | hr | file upload |
| `security-awareness-trainer` | Security Awareness Trainer | InfoSec | security | file upload |
| `incident-response-assistant` | Incident Response Assistant | InfoSec | security | file upload |
| `policy-compliance-assistant` | Policy & Compliance Assistant | InfoSec | security | file upload |
| `grc-assistant` | GRC Assistant | InfoSec | security | file upload |
| `security-knowledge-assistant` | Security Knowledge Assistant | InfoSec | security | file upload |
| `security-code-reviewer` | Security Code Reviewer | InfoSec | security | file upload, extended thinking |
| `security-architecture-assistant` | Security Architecture Assistant | InfoSec | security | file upload |
| `feedback-coach` | Feedback Coach | Leadership | leadership | — |
| `goal-setting-coach` | Goal Setting Coach | Leadership | leadership | — |
| `strategy-advisor` | Strategy Advisor | Leadership | leadership | file upload |
| `one-on-one-coach` | 1:1 Coaching Assistant | Leadership | leadership | — |
| `contract-qa-assistant` | Contract Q&A Assistant | Legal | legal | file upload |
| `compliance-questionnaire-assistant` | Compliance Questionnaire Assistant | Legal | legal | file upload |
| `legal-questions-assistant` | Legal Questions Assistant | Legal | legal | file upload |
| `contract-analyst` | Contract Analyst | Legal | legal | file upload |
| `linkedin-post-writer` | LinkedIn Post Writer | Marketing | marketing | file upload |
| `update-announcement-writer` | Update Announcement Writer | Marketing | marketing | file upload |
| `content-writer` | Content Writer | Marketing | marketing | file upload |
| `cross-posting-assistant` | Cross-Posting Assistant | Marketing | marketing | file upload |
| `seo-copywriter` | SEO Copywriter | Marketing | marketing | file upload |
| `internationalization-assistant` | Internationalization Assistant | Marketing | marketing | file upload |
| `competitive-positioning-assistant` | Competitive Positioning Assistant | Marketing | marketing | file upload |
| `marketing-insights-analyst` | Marketing Insights Analyst | Marketing | marketing | file upload |
| `workplace-safety-inspector` | Workplace Safety Inspector | Operations | operations | image upload |
| `office-questions-assistant` | Office Questions Assistant | Operations | operations | file upload |
| `workshop-designer` | Workshop Designer | Operations | operations | file upload |
| `acronym-explainer` | Acronym Explainer | Operations | operations | file upload |
| `language-coach` | Language Coach | Operations | operations | — |
| `persona-simulator` | Persona Simulator | Product | product | file upload |
| `feedback-analyzer` | Feedback Analyzer | Product | product | file upload |
| `argument-strengthener` | Argument Strengthener | Product | product | — |
| `prioritization-assistant` | Prioritization Assistant | Product | product | file upload |
| `product-strategy-assistant` | Product Strategy Assistant | Product | product | file upload |
| `writing-enhancer` | Writing Enhancer | Product | product | — |
| `market-research-assistant` | Market Research Assistant | Product | product | web search, file upload |
| `feature-definition-assistant` | Feature Definition Assistant | Product | product | file upload |
| `press-inquiry-assistant` | Press Inquiry Assistant | Public Relations | communication | file upload |
| `company-researcher` | Company Researcher | Sales | sales | web search |
| `sales-outreach-writer` | Sales Outreach Writer | Sales | sales | file upload |
| `case-study-writer` | Case Study Writer | Sales | sales | file upload |
| `competitor-analyst` | Competitor Analyst | Sales | sales | web search, file upload |
| `meddicc-assistant` | MEDDICC Assistant | Sales | sales | file upload |
| `battlecard-assistant` | Battlecard Assistant | Sales | sales | file upload |
| `rfp-assistant` | RFP Assistant | Sales | sales | file upload |
| `reference-customer-finder` | Reference Customer Finder | Sales | sales | web search, file upload |
| `support-answer-assistant` | Support Answer Assistant | Support | support | file upload |
| `error-explainer` | Error Explainer | Support | support | file upload |
| `support-trainer` | Support Trainer | Support | support | file upload |
| `it-helpdesk-assistant` | IT Helpdesk Assistant | Support | support | file upload |
| `prompt-engineering-coach` | Prompt Engineering Coach | Miscellaneous | utility | — |
| `glossary-translator` | Glossary Translator | Miscellaneous | communication | file upload |
| `text-assistant` | Text Assistant | Miscellaneous | writing | — |
| `personal-coach` | Personal Coach | Miscellaneous | utility | — |
| `ai-use-case-finder` | AI Use Case Finder | Miscellaneous | utility | — |

### Models (19)

Model configurations mirror the defaults shipped with the current iHub Apps release. Gemini models start at Gemini 3; iHub no longer supports Gemini 2.x.

| ID | Name | Provider |
|----|------|----------|
| `gpt-5` | GPT-5 | OpenAI (Responses API) |
| `gpt-4.1` | GPT-4.1 | OpenAI |
| `claude-fable-5-1` | Claude Fable 5.1 | Anthropic |
| `claude-opus-5` | Claude Opus 5 | Anthropic |
| `claude-sonnet-5` | Claude Sonnet 5 | Anthropic |
| `claude-haiku-4-5` | Claude Haiku 4.5 | Anthropic |
| `gemini-flash-latest` | Gemini Flash (latest) | Google |
| `gemini-flash-lite-latest` | Gemini Flash Lite (latest) | Google |
| `gemini-3.8-flash` | Gemini 3.8 Flash | Google |
| `gemini-3.5-flash-lite` | Gemini 3.5 Flash Lite | Google |
| `gemini-3.1-pro` | Gemini 3.1 Pro | Google |
| `mistral-large` | Mistral Large | Mistral AI |
| `mistral-medium` | Mistral Medium | Mistral AI |
| `mistral-small` | Mistral Small | Mistral AI |
| `gemini-3-pro-image` | Nano Banana Pro (Gemini 3 Pro Image) | Google |
| `gemini-3.1-flash-image` | Nano Banana 2 (Gemini 3.1 Flash Image) | Google |
| `gemini-3.1-flash-lite-image` | Nano Banana 2 Lite (Gemini 3.1 Flash Lite Image) | Google |
| `gemini-3.5-transcribe` | Gemini 3.5 Transcribe | Google (transcription) |
| `gemini-3.5-transcribe-live` | Gemini 3.5 Transcribe Live | Google (transcription) |

> **Note:** Model configurations include API endpoints but no API keys. Configure your API keys via environment variables in your iHub Apps instance.

### Workflows (6)

| ID | Name | Description |
|----|------|-------------|
| `research-assistant` | Research Assistant | Multi-step research with web search |
| `approval-workflow` | Research with Approval | Research with human checkpoint |
| `iterative-research-human` | Iterative Research (Human Review) | Multi-step research with manual approval |
| `iterative-research-auto` | Iterative Research (Autonomous) | Adaptive autonomous research |
| `knowledge-qa` | Knowledge Base Q&A | RAG-powered question answering |
| `document-analysis` | Document Analysis | Upload and analyze documents |

### Prompts (5)

| ID | Name | Description |
|----|------|-------------|
| `summarize` | Summarize Text | Quickly summarize text blocks |
| `translate-de` | Translate to German | Translate text to German |
| `prompt-meeting-summarizer` | Meeting Summarizer | Summarize meeting transcripts |
| `faq-question` | Ask FAQ | Answer FAQ questions |
| `app-generator` | App Generator | Generate iHub app configs |

### Skills (98)

#### General (5)

| ID | Name | Description |
|----|------|-------------|
| `seo-content-optimizer` | SEO Content Optimizer | Optimize content for search engines |
| `business-proposal-writer` | Business Proposal Writer | Generate structured business proposals |
| `technical-documentation` | Technical Documentation | Write API docs, guides, and READMEs |
| `data-storytelling` | Data Storytelling | Turn data into compelling narratives |
| `email-campaign-creator` | Email Campaign Creator | Create complete email campaigns |

#### Department Skills (93)

Task-focused skills for legal, compliance, finance, security, HR, sales, customer success, support, IT operations, operations, marketing, product, design and UX research, engineering, data, and personal productivity. Each skill is a `SKILL.md` with a step-by-step method, reference frameworks, output templates, and guardrails. Skills that work with company data expect it to come from the user, uploaded documents, or connected tools and sources, never from model memory. Legal, finance, and HR skills carry a reminder that their output needs review by a qualified professional.

| ID | Name | Department | Category |
|----|------|------------|----------|
| `contract-playbook-review` | Contract Playbook Review | Legal | legal |
| `nda-intake-triage` | NDA Intake Triage | Legal | legal |
| `signing-readiness-check` | Signing Readiness Check | Legal | legal |
| `legal-inquiry-responder` | Legal Inquiry Responder | Legal | legal |
| `legal-risk-matrix` | Legal Risk Matrix | Legal | legal |
| `legal-meeting-briefing` | Legal Meeting Briefing | Legal | legal |
| `eu-regulation-navigator` | EU Regulation Navigator | Compliance | compliance |
| `gdpr-operations-playbook` | GDPR Operations Playbook | Compliance | compliance |
| `compliance-gap-tracker` | Compliance Gap Tracker | Compliance | compliance |
| `budget-variance-explainer` | Budget Variance Explainer | Finance | finance |
| `financial-statements-assembler` | Financial Statements Assembler | Finance | finance |
| `month-end-close-coordinator` | Month-End Close Coordinator | Finance | finance |
| `department-budget-builder` | Department Budget Builder | Finance | finance |
| `journal-entry-builder` | Journal Entry Builder | Finance | finance |
| `ledger-reconciliation-helper` | Ledger Reconciliation Helper | Finance | finance |
| `invoice-match-checker` | Invoice Match Checker | Finance | finance |
| `sox-control-tester` | SOX Control Tester | Finance | finance |
| `vendor-due-diligence` | Vendor Due Diligence | InfoSec | security |
| `change-threat-modeler` | Change Threat Modeler | InfoSec | security |
| `structured-interview-designer` | Structured Interview Designer | HR | hr |
| `pay-equity-reviewer` | Pay & Equity Reviewer | HR | hr |
| `development-plan-designer` | Development Plan Designer | HR | hr |
| `new-hire-onboarding-designer` | New Hire Onboarding Designer | HR | hr |
| `role-profile-architect` | Role Profile Architect | HR | hr |
| `performance-calibration-guide` | Performance & Calibration Guide | HR | hr |
| `account-intelligence-brief` | Account Intelligence Brief | Sales | sales |
| `prospect-outreach-composer` | Prospect Outreach Composer | Sales | sales |
| `sales-call-briefing` | Sales Call Briefing | Sales | sales |
| `call-recap-and-follow-up` | Call Recap & Follow-Up | Sales | sales |
| `buying-committee-mapper` | Buying Committee Mapper | Sales | sales |
| `pipeline-health-check` | Pipeline Health Check | Sales | sales |
| `revenue-forecast-modeler` | Revenue Forecast Modeler | Sales | sales |
| `competitive-battlecard-builder` | Competitive Battlecard Builder | Sales | sales |
| `deal-collateral-crafter` | Deal Collateral Crafter | Sales | sales |
| `customer-onboarding-roadmap` | Customer Onboarding Roadmap | Customer Success | support |
| `joint-success-plan` | Joint Success Plan | Customer Success | support |
| `customer-health-monitor` | Customer Health Monitor | Customer Success | support |
| `business-review-composer` | Business Review Composer | Customer Success | sales |
| `renewal-readiness-brief` | Renewal Readiness Brief | Customer Success | sales |
| `escalation-brief-builder` | Escalation Brief Builder | Customer Success | support |
| `kcs-article-writer` | KCS Article Writer | Support | support |
| `incident-command-guide` | Incident Command Guide | IT Operations | operations |
| `itil-change-request-writer` | ITIL Change Request Writer | IT Operations | operations |
| `it-knowledge-documenter` | IT Knowledge Documenter | IT Operations | operations |
| `operational-risk-register` | Operational Risk Register | Operations | operations |
| `process-improvement-analyst` | Process Improvement Analyst | Operations | operations |
| `process-playbook-writer` | Process Playbook Writer | Operations | operations |
| `sop-and-runbook-author` | SOP & Runbook Author | Operations | operations |
| `capacity-demand-planner` | Capacity & Demand Planner | Operations | operations |
| `change-adoption-planner` | Change Adoption Planner | Operations | leadership |
| `campaign-blueprint` | Campaign Blueprint | Marketing | marketing |
| `marketing-first-draft` | Marketing First Draft | Marketing | marketing |
| `drip-sequence-designer` | Drip Sequence Designer | Marketing | marketing |
| `brand-voice-framework` | Brand Voice Framework | Marketing | marketing |
| `seo-health-audit` | SEO Health Audit | Marketing | marketing |
| `campaign-measurement-lab` | Campaign Measurement Lab | Marketing | marketing |
| `product-thinking-partner` | Product Thinking Partner | Product | product |
| `competitive-landscape-brief` | Competitive Landscape Brief | Product | product |
| `prd-builder` | PRD Builder | Product | product |
| `roadmap-prioritization-studio` | Roadmap Prioritization Studio | Product | product |
| `sprint-scope-planner` | Sprint Scope Planner | Product | product |
| `product-metrics-diagnostics` | Product Metrics Diagnostics | Product | product |
| `product-update-communicator` | Product Update Communicator | Product | product |
| `research-study-planner` | Research Study Planner | Design & UX Research | product |
| `ux-research-synthesizer` | UX Research Synthesizer | Design & UX Research | product |
| `product-research-synthesizer` | Product Research Synthesizer | Design & UX Research | product |
| `usability-heuristics-review` | Usability Heuristics Review | Design & UX Research | product |
| `wcag-accessibility-audit` | WCAG Accessibility Audit | Design & UX Research | product |
| `interface-microcopy-writer` | Interface Microcopy Writer | Design & UX Research | product |
| `design-system-steward` | Design System Steward | Design & UX Research | product |
| `design-dev-handoff-spec` | Design-to-Dev Handoff Spec | Design & UX Research | product |
| `architecture-decision-guide` | Architecture Decision Guide | Engineering | coding |
| `root-cause-debugger` | Root Cause Debugger | Engineering | coding |
| `pull-request-reviewer` | Pull Request Reviewer | Engineering | coding |
| `test-strategy-architect` | Test Strategy Architect | Engineering | coding |
| `tech-debt-prioritizer` | Tech Debt Prioritizer | Engineering | coding |
| `release-readiness-checklist` | Release Readiness Checklist | Engineering | coding |
| `blameless-postmortem-facilitator` | Blameless Postmortem Facilitator | Engineering | operations |
| `developer-docs-author` | Developer Docs Author | Engineering | coding |
| `dataset-profiler` | Dataset Profiler | Data & Analytics | analysis |
| `data-cleaning-workbench` | Data Cleaning Workbench | Data & Analytics | analysis |
| `business-question-to-sql` | Business Question to SQL | Data & Analytics | analysis |
| `statistical-methods-advisor` | Statistical Methods Advisor | Data & Analytics | analysis |
| `analysis-qa-reviewer` | Analysis QA Reviewer | Data & Analytics | analysis |
| `html-dashboard-maker` | HTML Dashboard Maker | Data & Analytics | analysis |
| `unified-knowledge-search` | Unified Knowledge Search | Productivity | productivity |
| `multi-source-answer-synthesizer` | Multi-Source Answer Synthesizer | Productivity | productivity |
| `meeting-readiness-pack` | Meeting Readiness Pack | Productivity | productivity |
| `standup-update-writer` | Standup Update Writer | Productivity | productivity |
| `weekly-planning-review` | Weekly Planning Review | Productivity | productivity |
| `cross-team-status-report` | Cross-Team Status Report | Productivity | productivity |
| `activity-roundup` | Activity Roundup | Productivity | productivity |
| `personal-context-keeper` | Personal Context Keeper | Productivity | productivity |

## Repository Structure

```
ihub-marketplace/
├── catalog.json                    # Main catalog — referenced by iHub Apps
├── apps/                           # App configuration files
├── models/                         # Model configuration templates
├── workflows/                      # Workflow definition files
├── prompts/                        # Prompt template files
├── skills/                         # Skill packages, one folder per skill with a SKILL.md
├── site/                           # Marketplace website (GitHub Pages)
├── scripts/build-site.sh           # Assembles the website with the catalog and content
└── .github/workflows/pages.yml     # Builds on every PR, deploys main to GitHub Pages
```

## Website

The marketplace website at [intrafind.github.io/ihub-marketplace](https://intrafind.github.io/ihub-marketplace/) lets anyone browse the catalog without an iHub instance. It looks like the marketplace in the iHub admin panel: type tabs, search, category filter, item cards, and a detail panel with the item's description and its full content (app JSON, rendered `SKILL.md`, …). It also has a getting-started guide and links to iHub Apps, IntraFind, and this repository. Visitors can enter the address of their own iHub, and every item then gets an **Open in iHub** button that opens it in **Admin → Marketplace**.

The site is plain HTML, CSS, and JavaScript with no build step. It reads `catalog.json` at runtime, so new catalog entries show up on the next deployment without touching `site/`. UI strings live in `site/assets/i18n.js` (English and German).

Preview it locally:

```bash
./scripts/build-site.sh        # writes _site/ and checks that every catalog path exists
python3 -m http.server 8080 --directory _site
# open http://localhost:8080
```

The **Marketplace Website** workflow builds the site on every pull request (failing if `catalog.json` references a missing file) and deploys `main` to GitHub Pages. GitHub Pages must be enabled once under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Catalog Format

The `catalog.json` follows the iHub catalog schema. Each item specifies a `source` with a `relative` path to its content file:

```json
{
  "type": "app",
  "name": "my-app",
  "displayName": { "en": "My App" },
  "description": { "en": "Description of my app" },
  "version": "1.0.0",
  "author": "Author Name",
  "category": "utility",
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "licenseUrl": "https://opensource.org/license/mit",
  "source": { "type": "relative", "path": "apps/my-app.json" }
}
```

`license` is the license name shown to admins; `licenseUrl` links that name to the full license text. Content published by IntraFind uses `"license": "BSD-3-Clause-with-Mandatory-Attribution"` with `"licenseUrl": "https://github.com/intrafind/ihub-marketplace/blob/main/LICENSE"`.

## Contributing

To add new content to this marketplace:

1. Fork this repository
2. Add your content file in the appropriate directory (`apps/`, `models/`, `workflows/`, `prompts/`, or `skills/`)
3. Add an entry to `catalog.json` following the existing format
4. Ensure all JSON files are valid and conform to iHub schemas
5. Run `./scripts/build-site.sh` to check that the catalog entry points at an existing file
6. Submit a pull request

### Content Guidelines

- **Apps**: Must pass the iHub `appConfigSchema` validation. Remove environment-specific `preferredModel` values. Nested keys the schema does not declare are dropped without a warning, so check them too, not only top-level keys.
- **Models**: Include the provider API endpoint URL. Do not include API keys. Use `contextWindow` / `maxOutputTokens` (not `tokenLimit`) and `thinking.level` (not `thinking.budget`), and keep `default` exactly as iHub ships it (only `gemini-flash-latest` is `true`). Installing overwrites a local model with the same id, so a copy of a shipped model that differs in `default` changes which model is the system default.
- **Workflows**: Self-contained workflow definitions. Reference model IDs that users are likely to have.
- **Prompts**: Simple, reusable prompt templates.
- **Skills**: SKILL.md files with YAML frontmatter containing `name` and `description`.

## License

This repository is licensed under the [BSD 3-Clause License with Mandatory Attribution](LICENSE), the same license as [iHub Apps](https://github.com/intrafind/ihub-apps). Products, services, and derivative works must display **"Powered by IntraFind – https://intrafind.com/"**; commercial use carries additional attribution requirements. See [LICENSE](LICENSE) and [NOTICE](NOTICE) for the full terms.

Content items may have their own licenses as specified in the `license` and `licenseUrl` fields of each catalog entry. All content currently in this repository is published under the same [BSD 3-Clause License with Mandatory Attribution](LICENSE) (`BSD-3-Clause-with-Mandatory-Attribution`).

The website bundles third-party components under their own licenses: [Inter](site/assets/fonts/Inter-LICENSE.txt) (SIL Open Font License 1.1), [marked](site/assets/vendor/marked.LICENSE.md) (MIT), and [DOMPurify](site/assets/vendor/dompurify.LICENSE) (Apache-2.0 or MPL-2.0).

---

Powered by IntraFind – https://intrafind.com/

Maintained by [IntraFind Software AG](https://intrafind.com/)
