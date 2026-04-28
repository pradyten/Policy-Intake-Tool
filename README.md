# Guardian Shield

AI-powered insurance policy intake & analysis tool built for Guardian Service agents.

Upload a home insurance declarations page (PDF or image), and Guardian Shield extracts every coverage detail, analyzes the policy for gaps and risks, and generates plain-English talking points ready for a customer call.

## Features

- **Document Upload** — Drag-and-drop PDF/image upload with instant processing
- **AI Extraction** — Claude AI reads declarations pages and extracts all policy data (carrier, coverages, deductibles, endorsements, etc.)
- **Coverage Analysis** — Automated gap detection with severity-ranked flags (liability too low, missing endorsements, high deductibles, etc.)
- **Agent Talking Points** — Natural-language summary, what's good, what to discuss, and reshop angle — ready for a customer call
- **Manual Entry** — Structured form with smart defaults for phone-call scenarios
- **PDF Export** — Download a branded 3-page analysis report
- **API Documentation** — Full REST API reference at `/docs` demonstrating CRM integration patterns
- **Sample Documents** — 3 bundled sample dec pages (Florida, DC, Oklahoma) for instant testing
- **Response Caching** — localStorage cache for sample docs after first API call

## Tech Stack

- **Framework:** Next.js 16 (App Router, Edge Runtime)
- **AI:** Claude Sonnet 4 via Anthropic SDK (tool_use for structured output)
- **Validation:** Zod schemas for all AI responses
- **UI:** shadcn/ui + Tailwind CSS
- **PDF Generation:** @react-pdf/renderer
- **Deployment:** Vercel

## Architecture

```
Upload/Sample/Manual Entry
        |
   [Extract API]  ← Claude vision reads the document
        |
   PolicyData (Zod-validated)
        |
   ┌────┴────┐
   |         |
[Analyze] [Talking Points]  ← parallel Claude calls
   |         |
   └────┬────┘
        |
   Results Dashboard
   (Overview + Analysis + Talking Points + API Response)
```

Three edge-runtime API routes handle the Claude calls:
- `POST /api/extract` — Document → PolicyData (vision)
- `POST /api/analyze` — PolicyData → CoverageAnalysis
- `POST /api/talking-points` — PolicyData → TalkingPoints

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key

### Setup

```bash
# Install dependencies
npm install

# Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click a sample document to test.

## Project Structure

```
app/
  page.tsx                      # Main SPA (upload → results)
  docs/page.tsx                 # API documentation page
  api/
    extract/route.ts            # Claude extraction (edge)
    analyze/route.ts            # Coverage analysis (edge)
    talking-points/route.ts     # Talking points (edge)
components/
  header.tsx                    # Branding + nav
  upload-zone.tsx               # Drag-and-drop upload
  sample-cards.tsx              # 3 sample document cards
  manual-entry-form.tsx         # Manual policy entry form
  processing-state.tsx          # Animated loading states
  results-dashboard.tsx         # Results container
  policy-overview.tsx           # Extracted data display
  coverage-analysis.tsx         # Gap flags with severity
  talking-points.tsx            # Agent call notes
  api-response-view.tsx         # Collapsible JSON response
  pdf-report.tsx                # PDF export (3 pages)
lib/
  schemas/                      # Zod schemas (policy, analysis, talking-points)
  claude/                       # Claude tool definitions (JSON schemas)
  prompts.ts                    # System prompts for all 3 Claude calls
  cache.ts                      # localStorage cache for samples
  utils.ts                      # Helpers (base64, currency format)
hooks/
  use-policy-analysis.ts        # Orchestration state machine
public/
  samples/                      # 3 bundled sample declaration pages
```

## License

MIT
