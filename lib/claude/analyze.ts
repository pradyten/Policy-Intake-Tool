import type Anthropic from "@anthropic-ai/sdk";

// Tool definition for Claude's tool_use — analyzes coverage gaps
export const analysisTool: Anthropic.Tool = {
  name: "analyze_coverage",
  description:
    "Analyze a home insurance policy for coverage gaps, risks, and optimization opportunities.",
  input_schema: {
    type: "object" as const,
    properties: {
      flags: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            category: {
              type: "string",
              enum: [
                "coverage_gap",
                "deductible",
                "premium",
                "endorsement",
                "expiration",
              ],
            },
            severity: {
              type: "string",
              enum: ["high", "medium", "low"],
            },
            title: { type: "string" },
            description: { type: "string" },
            recommendation: { type: "string" },
          },
          required: [
            "id",
            "category",
            "severity",
            "title",
            "description",
            "recommendation",
          ],
        },
      },
      overallRisk: {
        type: "string",
        enum: ["high", "medium", "low"],
      },
      summary: { type: "string" },
    },
    required: ["flags", "overallRisk", "summary"],
  },
};
