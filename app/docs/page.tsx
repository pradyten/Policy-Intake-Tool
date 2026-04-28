"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  Check,
  ArrowLeft,
  Server,
  FileJson,
  AlertTriangle,
  Plug,
} from "lucide-react";
import Link from "next/link";

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={copy}
        className="absolute top-2 right-2 text-xs text-white/60 hover:text-white"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      <pre className="overflow-x-auto rounded-lg bg-[var(--color-navy)] p-4 text-xs text-green-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const sampleResponse = `{
  "policyData": {
    "policyIdentification": {
      "carrier": "State Farm",
      "policyNumber": "HO-98765432",
      "policyType": "HO-3",
      "effectiveDate": "01/15/2025",
      "expirationDate": "01/15/2026",
      "agentName": "Jane Wilson",
      "agentContact": "(555) 234-5678"
    },
    "peopleAndProperty": {
      "namedInsured": "John & Sarah Smith",
      "propertyAddress": "456 Oak Drive, Tampa, FL 33601",
      "mortgageCompany": "Wells Fargo Home Mortgage",
      "mortgageAddress": null
    },
    "coverages": {
      "dwellingA": 350000,
      "otherStructuresB": 35000,
      "personalPropertyC": 175000,
      "lossOfUseD": 70000,
      "personalLiabilityE": 300000,
      "medicalPaymentsF": 5000
    },
    "cost": {
      "annualPremium": 2150,
      "premiumBreakdown": [],
      "deductibles": [
        { "type": "All Perils", "amount": "$1,000" },
        { "type": "Hurricane", "amount": "2%" }
      ]
    },
    "endorsements": ["Water Backup", "Equipment Breakdown"],
    "discounts": ["Multi-policy", "Claims-free"],
    "confidence": "high"
  },
  "coverageAnalysis": {
    "flags": [
      {
        "id": "hurricane-deductible",
        "category": "deductible",
        "severity": "medium",
        "title": "Separate Hurricane Deductible",
        "description": "Policy has a 2% hurricane deductible ($7,000 on $350K dwelling).",
        "recommendation": "Ensure the customer understands this higher deductible for hurricane claims."
      }
    ],
    "overallRisk": "medium",
    "summary": "Solid coverage with one concern: the hurricane deductible could be a surprise."
  },
  "talkingPoints": {
    "currentCoverageSummary": "You have an HO-3 policy with State Farm covering your home at 456 Oak Drive for $350,000...",
    "whatsGood": [
      "Your liability coverage at $300K meets industry recommendations.",
      "You have water backup and equipment breakdown endorsements."
    ],
    "whatToDiscuss": [
      "Your hurricane deductible is 2% — that's $7,000 out of pocket for hurricane damage.",
      "Consider adding scheduled personal property if you have valuables over $2,500."
    ],
    "reshopAngle": "Your renewal is in 9 months — let us start comparing rates now so you have options."
  },
  "metadata": {
    "processingTimeMs": 4523,
    "confidence": "high",
    "documentType": "HO-3",
    "timestamp": "2026-04-27T12:00:00.000Z"
  }
}`;

const curlExample = `curl -X POST https://your-domain.vercel.app/api/extract \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileBase64": "<base64-encoded-pdf>",
    "mimeType": "application/pdf"
  }'`;

const curlManualExample = `# Step 1: Analyze coverage
curl -X POST https://your-domain.vercel.app/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "policyIdentification": { "carrier": "State Farm", ... },
    "coverages": { "dwellingA": 350000, ... },
    ...
  }'

# Step 2: Generate talking points (can run in parallel with Step 1)
curl -X POST https://your-domain.vercel.app/api/talking-points \\
  -H "Content-Type: application/json" \\
  -d '{ ... same policy data ... }'`;

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            API Documentation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Reference design for production deployment. These endpoints power
            the Guardian Shield UI and can be integrated into any CRM or
            quoting system.
          </p>
          <Badge variant="outline" className="mt-2">
            REST API — JSON over HTTPS
          </Badge>
        </div>

        <div className="space-y-8">
          {/* Endpoints Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-[var(--color-navy)]" />
                Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600">POST</Badge>
                  <code className="text-sm font-mono">/api/extract</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Extracts policy data from a declarations page (PDF or image).
                  Accepts base64-encoded file.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600">POST</Badge>
                  <code className="text-sm font-mono">/api/analyze</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyzes extracted policy data for coverage gaps and risks.
                  Accepts PolicyData JSON.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600">POST</Badge>
                  <code className="text-sm font-mono">
                    /api/talking-points
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generates agent talking points from policy data. Can run in
                  parallel with /api/analyze.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Request: Extract */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[var(--color-navy)]" />
                Extract — Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send a base64-encoded PDF or image of a declarations page.
              </p>
              <CopyBlock
                               code={`{
  "fileBase64": "<base64-encoded-file>",
  "mimeType": "application/pdf"  // or "image/jpeg", "image/png"
}`}
              />
              <h4 className="text-sm font-semibold mt-4">cURL Example</h4>
              <CopyBlock code={curlExample} />
            </CardContent>
          </Card>

          {/* Request: Manual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[var(--color-navy)]" />
                Analyze & Talking Points — Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For manual entry or when you already have extracted data, send
                PolicyData JSON directly to the analysis and talking points
                endpoints.
              </p>
              <CopyBlock code={curlManualExample} />
            </CardContent>
          </Card>

          {/* Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-[var(--color-navy)]" />
                Combined Response Example
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The UI combines all three endpoint responses into a single
                ApiResponse object. Here&apos;s the full shape:
              </p>
              <CopyBlock code={sampleResponse} />
            </CardContent>
          </Card>

          {/* Error Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[var(--color-navy)]" />
                Error Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Badge variant="destructive">400</Badge>
                  <div>
                    <p className="text-sm font-medium">Bad Request</p>
                    <p className="text-xs text-muted-foreground">
                      Missing required fields (fileBase64, mimeType)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Badge variant="destructive">422</Badge>
                  <div>
                    <p className="text-sm font-medium">
                      Unprocessable Entity
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI response failed Zod schema validation. The document
                      may not be a declarations page.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Badge variant="destructive">500</Badge>
                  <div>
                    <p className="text-sm font-medium">
                      Internal Server Error
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI provider error or unexpected failure
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CRM Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-[var(--color-navy)]" />
                CRM Integration Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This API is designed to integrate with Guardian Service&apos;s
                existing CRM and quoting systems. Example integration flow:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80">
                <li>
                  Agent uploads a dec page to the customer&apos;s record in
                  Salesforce
                </li>
                <li>
                  A Salesforce trigger sends the file to{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    POST /api/extract
                  </code>
                </li>
                <li>
                  Extracted data is written back to the customer profile
                  fields
                </li>
                <li>
                  Analysis and talking points are generated and attached as a
                  note
                </li>
                <li>
                  Agent sees the analysis when they open the customer record
                  — no manual data entry needed
                </li>
              </ol>
              <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Production deployment note
                </p>
                <p>
                  This API specification is a reference design. For production
                  deployment on AWS/GCP, the edge runtime handlers would be
                  replaced with containerized services behind an API gateway,
                  with authentication, rate limiting, and persistent storage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
