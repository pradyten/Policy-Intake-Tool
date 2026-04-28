import { z } from "zod";

export const CoverageFlagSchema = z.object({
  id: z.string(),
  category: z.enum([
    "coverage_gap",
    "deductible",
    "premium",
    "endorsement",
    "expiration",
  ]),
  severity: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  recommendation: z.string(),
});

export const CoverageAnalysisSchema = z.object({
  flags: z.array(CoverageFlagSchema),
  overallRisk: z.enum(["high", "medium", "low"]),
  summary: z.string(),
});

export type CoverageFlag = z.infer<typeof CoverageFlagSchema>;
export type CoverageAnalysis = z.infer<typeof CoverageAnalysisSchema>;
