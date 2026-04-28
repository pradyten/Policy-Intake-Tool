"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PolicyOverview } from "@/components/policy-overview";
import { CoverageAnalysis } from "@/components/coverage-analysis";
import { TalkingPoints } from "@/components/talking-points";
import { ApiResponseView } from "@/components/api-response-view";
import type { PolicyData } from "@/lib/schemas/policy";
import type { CoverageAnalysis as CoverageAnalysisType } from "@/lib/schemas/analysis";
import type { TalkingPoints as TalkingPointsType } from "@/lib/schemas/talking-points";
import type { ApiResponse } from "@/lib/schemas/api-response";
import dynamic from "next/dynamic";

const PdfDownloadButton = dynamic(
  () =>
    import("@/components/pdf-report").then((mod) => mod.PdfDownloadButton),
  { ssr: false }
);

interface ResultsDashboardProps {
  policyData: PolicyData;
  coverageAnalysis: CoverageAnalysisType;
  talkingPoints: TalkingPointsType;
  apiResponse: ApiResponse;
  onReset: () => void;
}

export function ResultsDashboard({
  policyData,
  coverageAnalysis,
  talkingPoints,
  apiResponse,
  onReset,
}: ResultsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          <Badge variant="outline" className="text-xs">
            {apiResponse.metadata.processingTimeMs}ms
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <PdfDownloadButton
            policyData={policyData}
            coverageAnalysis={coverageAnalysis}
            talkingPoints={talkingPoints}
          />
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PolicyOverview data={policyData} />
        <CoverageAnalysis data={coverageAnalysis} />
      </div>
      <TalkingPoints data={talkingPoints} />
      <ApiResponseView data={apiResponse} />
    </div>
  );
}
