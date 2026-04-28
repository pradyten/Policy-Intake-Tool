# Guardian Shield - Product Requirements
## AI-Powered Insurance Policy Intake & Analysis Tool for Guardian Service

---

## 1. WHAT THIS IS

An internal tool for insurance agents at Guardian Service. An agent uploads a customer's home insurance declarations page (PDF or image), and the system extracts every coverage detail, analyzes the policy for gaps and risks, generates a plain-English summary the agent can use on a call, and exposes the entire result through a clean REST API that could plug into Guardian Service's existing CRM or quoting systems.

**Target user:** A Guardian Service insurance agent who just received a customer's current policy and needs to quickly understand what they have, what's missing, and what to say.

**Why this matters to Guardian Service:** This is the first step of their core workflow. Every customer interaction starts with understanding the current policy. Right now agents read dec pages manually and type data into quoting systems by hand. This tool does that in seconds.

**Why this matters for the interview:** The job description says "rapidly prototype internal tools that remove manual work and improve team efficiency" and "build applications that connect with operational systems like email, CRM, telephony, and internal data stores." This demo does exactly that.

---

## 2. USER FLOW

1. Agent opens the tool
2. Sees a clean upload area: "Upload a declarations page" with drag-and-drop and click-to-browse
3. Agent uploads a PDF or image of the customer's dec page
4. A processing state shows progress as the system works (should feel fast, under 10 seconds)
5. Results appear in a structured dashboard with four sections:
   - Policy Overview (extracted data in a clean table)
   - Coverage Analysis (gap detection, risk flags)
   - Agent Talking Points (plain-English summary ready for a customer call)
   - API Response (raw JSON the agent or developer can copy)
6. Agent can download the full analysis as a PDF report to attach to the customer's file
7. Agent can copy the talking points to clipboard for use in email or call notes
8. Agent can start over with a new document

**Alternative input:** In addition to file upload, the agent can manually paste or type policy details into a structured form (carrier name, premium, dwelling amount, deductible, etc.) for cases where they don't have a PDF but the customer read them the numbers over the phone.

---

## 3. FEATURES

### 3A. Document Upload & Processing

- Accept PDF files (single or multi-page) and images (JPG, PNG)
- Support drag-and-drop and click-to-browse
- Show file name and size after selection
- Show a processing indicator while extraction runs
- Handle errors gracefully: if the document is unreadable, blurry, or not an insurance document, show a clear message suggesting the agent try a different file or use manual entry instead

### 3B. Policy Data Extraction

The system should extract the following fields from a home insurance declarations page. Not every field will appear on every document. Missing fields should be clearly marked as "Not found" rather than guessed.

**Policy identification:**
- Insurance carrier/company name
- Policy number
- Policy type (HO-3, HO-5, HO-6, etc.)
- Policy period (effective date and expiration date)
- Agent/agency name and contact

**People and property:**
- Named insured (policyholder name)
- Property address
- Mortgage company name and address (if listed)

**Coverage amounts (Section I - Property):**
- Coverage A: Dwelling (the structure of the home)
- Coverage B: Other Structures (garage, shed, fence)
- Coverage C: Personal Property (belongings)
- Coverage D: Loss of Use (temporary living expenses)

**Coverage amounts (Section II - Liability):**
- Coverage E: Personal Liability (per occurrence)
- Coverage F: Medical Payments to Others (per person)

**Cost:**
- Annual or semi-annual premium (total)
- Premium breakdown by coverage line (if available)
- Deductible amount(s) (may have separate deductibles for wind/hail, hurricane, all other perils)

**Endorsements and riders:**
- List of any endorsements, riders, or optional coverages added to the policy
- Any listed discounts

### 3C. Coverage Analysis

After extraction, the system should analyze the policy and flag potential issues. This is where the AI adds value beyond simple data extraction. The analysis should cover:

**Coverage gap detection:**
- Is Coverage A (dwelling) potentially too low? Compare against typical rebuild costs for the property's region if discernible. Flag if dwelling coverage seems significantly below what would be expected for the area
- Is Coverage B suspiciously low or missing?
- Is Coverage C below the standard 50-75% of Coverage A ratio?
- Is personal liability (Coverage E) below $300K? (Industry recommendation is at least $300K)
- Are there common endorsements missing that most homeowners should consider? (Water backup, equipment breakdown, identity theft, scheduled personal property for valuables)

**Deductible analysis:**
- Is the deductible unusually high relative to the premium savings?
- Are there separate wind/hail or hurricane deductibles that the homeowner might not be aware of?

**Premium assessment:**
- Flag if the premium seems high relative to coverage amounts (this is approximate, not a quote)
- Note the policy renewal date and whether it's coming up soon (reshopping opportunity)

**Risk level for each flag:**
- High (red): Likely underinsured or significant gap
- Medium (amber): Worth discussing with the customer
- Low (green): Minor optimization opportunity

### 3D. Agent Talking Points

Generate a plain-English summary that an agent could read or reference during a customer call. This is not a technical report. It should sound like how a helpful insurance agent would talk to a customer.

The talking points should include:
- A one-paragraph summary of what the customer currently has ("You have a standard HO-3 policy with Travelers, covering your home at 123 Main St for $350,000 in dwelling coverage with a $1,000 deductible. Your annual premium is $1,850.")
- A "what's good" section highlighting areas where coverage is solid
- A "what to discuss" section with 2-4 specific items the agent should bring up (coverage gaps, potential savings, missing endorsements)
- A "reshop angle" sentence: what specific pitch the agent should use when suggesting Guardian Service can find something better ("Your renewal is in 3 months. With premiums up 30% since 2019, now is a great time to let us compare what 50+ carriers would offer for the same or better coverage.")

### 3E. Manual Entry Mode

For cases where the agent doesn't have a PDF (customer called in and read their numbers), provide a structured form with fields for all the extracted data points listed in 3B. When the agent fills in the form and submits, the system runs the same analysis (3C) and generates the same talking points (3D).

The form should have smart defaults and helper text:
- Coverage B defaults to 10% of Coverage A if left blank
- Coverage C defaults to 50% of Coverage A if left blank
- Coverage D defaults to 20% of Coverage A if left blank
- Helper text explains what each coverage type means in plain language

### 3F. API Endpoint

The entire analysis should be available through a REST API endpoint, not just the UI. This demonstrates that the tool could be integrated into Guardian Service's existing systems.

**Endpoint:** POST /api/analyze

**Input options:**
- File upload (multipart form data with PDF or image)
- JSON body with manually entered policy details

**Output:** A structured JSON response containing:
- All extracted policy data (3B fields)
- All analysis flags with severity levels (3C)
- Agent talking points as a text string (3D)
- Metadata: processing time, confidence level, document type detected
- Timestamp

**The API should be documented.** Include a simple API documentation page or section in the app that shows the endpoint, request format, and a sample response. This page should be accessible from the main UI (a link or tab).

### 3G. Export & Copy

- **Copy talking points:** One-click button that copies the agent talking points to clipboard
- **Copy API response:** One-click button that copies the JSON response to clipboard
- **Download PDF report:** Generate a clean, branded PDF report containing the policy overview, analysis, and talking points that the agent can attach to the customer's file or email to them

### 3H. Sample Data

Include 3 pre-loaded sample declarations pages that a reviewer can click to test without needing to find their own PDF. These should be the publicly available sample dec pages from state insurance departments (Oklahoma, Florida, DC). Display them as clickable cards: "Try with a sample" with the carrier name and state visible.

---

## 4. DESIGN

### 4A. Visual Identity

This is an internal tool for Guardian Service, so the design should feel like it belongs to their brand.

**Brand colors from Guardian Service's website:**
- Primary: Deep navy blue (their logo and headers)
- Accent: A warm gold/amber (their shield icon accent)
- Background: Clean white with very light gray sections
- Success/good: Green
- Warning/discuss: Amber/gold
- Critical/gap: Red

**Typography:** Clean, professional, sans-serif. Two weights maximum: bold for headings, regular for body. The tool should feel like a polished internal dashboard, not a consumer marketing page.

**Logo/branding:** Include "Guardian Shield" as the tool name with a small shield icon. Do NOT use Guardian Service's actual logo (we don't have permission). Create a simple shield-inspired icon that evokes the brand without copying it.

### 4B. Layout

**Single page application with clear sections:**

**Header:** Tool name, shield icon, and a subtle "Internal Tool" badge to make it clear this is agent-facing.

**Upload area:** Prominent, centered, with generous whitespace. Drag-and-drop zone with a dashed border. Below it, a row of 3 sample document cards the reviewer can click. Below those, a link to "Or enter details manually" that expands the manual entry form.

**Results area (appears after processing):** Four clearly separated sections, each in its own card:
1. **Policy Overview** - Table/grid layout showing all extracted fields organized by category (identification, people/property, coverages, cost)
2. **Coverage Analysis** - List of flags with severity indicators (colored dots or badges), each with a short explanation
3. **Agent Talking Points** - Clean text block with the generated summary, with a copy button in the corner
4. **API Response** - Collapsible section with syntax-highlighted JSON and a copy button

**Each section should have:**
- A clear heading
- An icon representing the section
- Action buttons where relevant (copy, download)

### 4C. States

1. **Empty/upload state:** Upload area prominent, sample cards visible, no results
2. **Processing state:** Upload area collapses, processing indicator appears with a brief message about what's happening ("Reading your declarations page..." then "Analyzing coverage..." then "Generating talking points...")
3. **Results state:** Full dashboard with all four sections
4. **Error state:** Clear message with suggested actions (try different file, use manual entry)
5. **Manual entry state:** Form replaces the upload area, results appear below after submission

### 4D. Responsive Design

The primary use case is desktop (agents at their desk), but it should be usable on a tablet. Mobile is not a priority but should not be broken.

---

## 5. API DOCUMENTATION PAGE

Include a dedicated section or page (accessible via a tab or link from the main app) that documents the API. This is critical because the JD specifically mentions "design clean system architectures, APIs, async workflows, and integration patterns."

The documentation should include:
- The endpoint URL and method
- Request format (both file upload and JSON body examples)
- Response format with a complete annotated sample
- Error responses
- A curl command example that a developer could copy and run
- A brief note on how this could integrate with a CRM system (e.g., "Trigger this endpoint when a new dec page is uploaded to the customer's record in Salesforce, and write the extracted data back to the customer profile")

---

## 6. WHAT THIS DEMO COMMUNICATES TO THE INTERVIEWER

When presenting this demo, the following points should be immediately apparent without explanation:

1. **"I understand your business."** The demo solves a real problem Guardian Service agents face daily.
2. **"I build fast."** This was prototyped overnight, demonstrating the hackathon-style velocity the JD asks for.
3. **"I think in systems, not just UIs."** The API endpoint and documentation show this tool was designed to integrate with existing infrastructure, not exist as a standalone toy.
4. **"I know AI/LLMs pragmatically."** The extraction and analysis use LLMs as practical tools, not as a gimmick.
5. **"I ship."** It's deployed, it works, you can use it right now.

---

## 7. SAMPLE DECLARATIONS PAGES FOR TESTING

Use these publicly available sample dec pages from state insurance departments:

1. **Florida CFO sample** - Has clear dollar amounts ($160K dwelling, $859 premium)
   Source: https://myfloridacfo.com/docs-sf/consumer-services-libraries/consumerservices-documents/understanding-coverage/sample-declarations-page.pdf

2. **DC DISB sample** - Detailed with all coverage lines ($450K dwelling, $1,200 premium)
   Source: https://disb.dc.gov/sites/default/files/dc/sites/disb/publication/attachments/Declaration%20Page%20Sample%20Homeowners%2012.pdf

3. **Oklahoma Insurance Dept sample** - Annotated educational format
   Source: https://www.oid.ok.gov/wp-content/uploads/2024/04/UnderstandingYourHOPolicyDeclarations.pdf

Download these PDFs and include them as sample data in the project so reviewers can test immediately.

---

## 8. OUT OF SCOPE

These are things the demo should NOT try to do:
- Actually pull quotes from carriers (would require carrier API access we don't have)
- Store customer data between sessions (no database, no user accounts)
- Compare against real market rates (we don't have rate data)
- Handle auto insurance or other policy types (home insurance only for this demo)
- Integrate with a real CRM (the API endpoint demonstrates the integration pattern; actual CRM connection is out of scope)

---

## 9. ENVIRONMENT VARIABLES

The app will need API keys for the AI provider(s) used for extraction and analysis. The specific provider choice is an implementation decision, not a product decision. Store keys as environment variables, never commit to the repo.

---

## 10. DEPLOYMENT

Deploy to a public URL so the interviewer can access it without running anything locally. The URL should be clean and professional (not a random hash). Include the GitHub repo link prominently in the app footer or header.