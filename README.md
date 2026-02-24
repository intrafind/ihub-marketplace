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

### Apps (25)

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
| `ifinder-document-explorer` | iFinder Document Explorer | intrafind |
| `ifinder-document-actions` | iFinder Document Actions | intrafind |
| `ifinder-research-bot` | iFinder Research Bot | intrafind |
| `ihub-support-bot` | iHub Support Bot | intrafind |
| `iassistant-demo` | iAssistant Demo | intrafind |

### Models (12)

| ID | Name | Provider |
|----|------|----------|
| `gpt-4.1` | GPT-4.1 | OpenAI |
| `gpt-5` | GPT-5 | OpenAI (Responses API) |
| `claude-4-sonnet` | Claude 4 Sonnet | Anthropic |
| `claude-4-opus` | Claude 4 Opus | Anthropic |
| `gemini-2.5-flash` | Gemini 2.5 Flash | Google |
| `gemini-2.5-pro` | Gemini 2.5 Pro | Google |
| `gemini-3-flash` | Gemini 3.0 Flash | Google |
| `gemini-3-pro` | Gemini 3.0 Pro | Google |
| `mistral-small` | Mistral Small | Mistral AI |
| `dall-e-3` | DALL-E 3 | OpenAI |
| `gemini-2.5-flash-image` | Gemini 2.5 Flash Image | Google |
| `gemini-3-pro-image` | Gemini 3 Pro Image | Google |

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

- **Apps**: Must pass the iHub `appConfigSchema` validation. Remove environment-specific `preferredModel` values.
- **Models**: Include the provider API endpoint URL. Do not include API keys.
- **Workflows**: Self-contained workflow definitions. Reference model IDs that users are likely to have.
- **Prompts**: Simple, reusable prompt templates.
- **Skills**: SKILL.md files with YAML frontmatter containing `name` and `description`.

## License

This repository is licensed under the [BSD-3-Clause License](LICENSE).

Content items may have their own licenses as specified in the `license` field of each catalog entry.

---

Maintained by [IntraFind Software AG](https://www.intrafind.de)
