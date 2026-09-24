# iHub Official Marketplace

The official marketplace registry for [iHub Apps](https://github.com/intrafind/ihub-apps) — a curated collection of AI-powered apps, language model configurations, workflows, prompts, and skills ready to install into your iHub instance.

## Adding This Registry to iHub Apps

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

### Skills (5)

| ID | Name | Description |
|----|------|-------------|
| `seo-content-optimizer` | SEO Content Optimizer | Optimize content for search engines |
| `business-proposal-writer` | Business Proposal Writer | Generate structured business proposals |
| `technical-documentation` | Technical Documentation | Write API docs, guides, and READMEs |
| `data-storytelling` | Data Storytelling | Turn data into compelling narratives |
| `email-campaign-creator` | Email Campaign Creator | Create complete email campaigns |

## Repository Structure

```
ihub-marketplace/
├── catalog.json                    # Main catalog — referenced by iHub Apps
├── apps/                           # App configuration files
├── models/                         # Model configuration templates
├── workflows/                      # Workflow definition files
├── prompts/                        # Prompt template files
└── skills/                         # Skill packages (SKILL.md files)
    ├── seo-content-optimizer/
    ├── business-proposal-writer/
    ├── technical-documentation/
    ├── data-storytelling/
    └── email-campaign-creator/
```

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
  "source": { "type": "relative", "path": "apps/my-app.json" }
}
```

## Contributing

To add new content to this marketplace:

1. Fork this repository
2. Add your content file in the appropriate directory (`apps/`, `models/`, `workflows/`, `prompts/`, or `skills/`)
3. Add an entry to `catalog.json` following the existing format
4. Ensure all JSON files are valid and conform to iHub schemas
5. Submit a pull request

### Content Guidelines

- **Apps**: Must pass the iHub `appConfigSchema` validation. Remove environment-specific `preferredModel` values. Nested keys the schema does not declare are dropped without a warning, so check them too, not only top-level keys.
- **Models**: Include the provider API endpoint URL. Do not include API keys. Use `contextWindow` / `maxOutputTokens` (not `tokenLimit`) and `thinking.level` (not `thinking.budget`), and keep `default` exactly as iHub ships it (only `gemini-flash-latest` is `true`). Installing overwrites a local model with the same id, so a copy of a shipped model that differs in `default` changes which model is the system default.
- **Workflows**: Self-contained workflow definitions. Reference model IDs that users are likely to have.
- **Prompts**: Simple, reusable prompt templates.
- **Skills**: SKILL.md files with YAML frontmatter containing `name` and `description`.

## License

This repository is licensed under the [BSD-3-Clause License](LICENSE).

Content items may have their own licenses as specified in the `license` field of each catalog entry.

---

Maintained by [IntraFind Software AG](https://www.intrafind.de)
