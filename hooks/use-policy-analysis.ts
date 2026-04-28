"use client";

import { useState, useCallback } from "react";
import type { PolicyData } from "@/lib/schemas/policy";
import type { CoverageAnalysis } from "@/lib/schemas/analysis";
import type { TalkingPoints } from "@/lib/schemas/talking-points";
import type { ApiResponse } from "@/lib/schemas/api-response";
import { getCachedResponse, setCachedResponse } from "@/lib/cache";
import { fileToBase64, getMimeType } from "@/lib/utils";

type Status = "idle" | "extracting" | "analyzing" | "complete" | "error";

interface AnalysisState {
  status: Status;
  policyData: PolicyData | null;
  coverageAnalysis: CoverageAnalysis | null;
  talkingPoints: TalkingPoints | null;
  apiResponse: ApiResponse | null;
  error: string | null;
}

const initialState: AnalysisState = {
  status: "idle",
  policyData: null,
  coverageAnalysis: null,
  talkingPoints: null,
  apiResponse: null,
  error: null,
};

export function usePolicyAnalysis() {
  const [state, setState] = useState<AnalysisState>(initialState);

  const runAnalysisAndTalkingPoints = useCallback(
    async (policyData: PolicyData, startTime: number) => {
      setState((prev) => ({ ...prev, status: "analyzing" }));

      const [analysisRes, talkingPointsRes] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyData),
        }),
        fetch("/api/talking-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyData),
        }),
      ]);

      if (!analysisRes.ok) {
        throw new Error("Coverage analysis failed");
      }
      if (!talkingPointsRes.ok) {
        throw new Error("Talking points generation failed");
      }

      const coverageAnalysis = (await analysisRes.json()) as CoverageAnalysis;
      const talkingPoints = (await talkingPointsRes.json()) as TalkingPoints;

      const apiResponse: ApiResponse = {
        policyData,
        coverageAnalysis,
        talkingPoints,
        metadata: {
          processingTimeMs: Date.now() - startTime,
          confidence: policyData.confidence,
          documentType: policyData.policyIdentification.policyType ?? "Unknown",
          timestamp: new Date().toISOString(),
        },
      };

      setState({
        status: "complete",
        policyData,
        coverageAnalysis,
        talkingPoints,
        apiResponse,
        error: null,
      });

      return apiResponse;
    },
    []
  );

  const analyzeDocument = useCallback(
    async (file: File) => {
      const startTime = Date.now();
      try {
        setState({ ...initialState, status: "extracting" });

        const base64 = await fileToBase64(file);
        const mimeType = getMimeType(file);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: base64, mimeType }),
        });

        if (!extractRes.ok) {
          const err = await extractRes.json();
          throw new Error(err.error || "Extraction failed");
        }

        const policyData = (await extractRes.json()) as PolicyData;
        setState((prev) => ({ ...prev, policyData }));

        await runAnalysisAndTalkingPoints(policyData, startTime);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            error instanceof Error ? error.message : "An unknown error occurred",
        }));
      }
    },
    [runAnalysisAndTalkingPoints]
  );

  const analyzeSample = useCallback(
    async (sampleId: string) => {
      // Check cache first
      const cached = getCachedResponse(sampleId);
      if (cached) {
        setState({
          status: "complete",
          policyData: cached.policyData,
          coverageAnalysis: cached.coverageAnalysis,
          talkingPoints: cached.talkingPoints,
          apiResponse: cached,
          error: null,
        });
        return;
      }

      const startTime = Date.now();
      try {
        setState({ ...initialState, status: "extracting" });

        const pdfRes = await fetch(`/samples/${sampleId}.pdf`);
        const blob = await pdfRes.blob();
        const file = new File([blob], `${sampleId}.pdf`, {
          type: "application/pdf",
        });

        const base64 = await fileToBase64(file);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType: "application/pdf",
          }),
        });

        if (!extractRes.ok) {
          const err = await extractRes.json();
          throw new Error(err.error || "Extraction failed");
        }

        const policyData = (await extractRes.json()) as PolicyData;
        setState((prev) => ({ ...prev, policyData }));

        const apiResponse = await runAnalysisAndTalkingPoints(
          policyData,
          startTime
        );
        setCachedResponse(sampleId, apiResponse);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            error instanceof Error ? error.message : "An unknown error occurred",
        }));
      }
    },
    [runAnalysisAndTalkingPoints]
  );

  const analyzeManualEntry = useCallback(
    async (policyData: PolicyData) => {
      const startTime = Date.now();
      try {
        setState({ ...initialState, status: "analyzing", policyData });
        await runAnalysisAndTalkingPoints(policyData, startTime);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            error instanceof Error ? error.message : "An unknown error occurred",
        }));
      }
    },
    [runAnalysisAndTalkingPoints]
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    analyzeDocument,
    analyzeSample,
    analyzeManualEntry,
    reset,
  };
}
