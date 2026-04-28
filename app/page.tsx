"use client";

import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { SampleCards } from "@/components/sample-cards";
import { ManualEntryForm } from "@/components/manual-entry-form";
import { ProcessingState } from "@/components/processing-state";
import { ResultsDashboard } from "@/components/results-dashboard";
import { usePolicyAnalysis } from "@/hooks/use-policy-analysis";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const analysis = usePolicyAnalysis();

  const isProcessing =
    analysis.status === "extracting" || analysis.status === "analyzing";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {analysis.status === "idle" && (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight">
                Analyze a Policy
              </h2>
              <p className="mt-2 text-muted-foreground">
                Upload a declarations page and get instant coverage analysis,
                gap detection, and agent talking points.
              </p>
            </div>
            <UploadZone onFileSelect={analysis.analyzeDocument} />
            <SampleCards onSelect={analysis.analyzeSample} />
            <ManualEntryForm onSubmit={analysis.analyzeManualEntry} />
          </div>
        )}

        {isProcessing && (
          <ProcessingState
            status={analysis.status as "extracting" | "analyzing"}
          />
        )}

        {analysis.status === "error" && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Something went wrong</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                {analysis.error}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different file or use manual entry instead.
              </p>
            </div>
            <Button variant="outline" onClick={analysis.reset}>
              Try Again
            </Button>
          </div>
        )}

        {analysis.status === "complete" &&
          analysis.policyData &&
          analysis.coverageAnalysis &&
          analysis.talkingPoints &&
          analysis.apiResponse && (
            <ResultsDashboard
              policyData={analysis.policyData}
              coverageAnalysis={analysis.coverageAnalysis}
              talkingPoints={analysis.talkingPoints}
              apiResponse={analysis.apiResponse}
              onReset={analysis.reset}
            />
          )}
      </main>

      <footer className="mt-auto border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>
          Guardian Shield — AI-Powered Policy Intake & Analysis for Guardian
          Service
        </p>
        <p className="mt-1">
          Built with Next.js, Claude AI, and shadcn/ui
        </p>
      </footer>
    </>
  );
}
