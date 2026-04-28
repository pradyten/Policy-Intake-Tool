import { z } from "zod";
import { PolicyDataSchema } from "./policy";
import { CoverageAnalysisSchema } from "./analysis";
import { TalkingPointsSchema } from "./talking-points";

export const ApiResponseSchema = z.object({
  policyData: PolicyDataSchema,
  coverageAnalysis: CoverageAnalysisSchema,
  talkingPoints: TalkingPointsSchema,
  metadata: z.object({
    processingTimeMs: z.number(),
    confidence: z.enum(["high", "medium", "low"]),
    documentType: z.string(),
    timestamp: z.string(),
  }),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
