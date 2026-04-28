import type Anthropic from "@anthropic-ai/sdk";

// Tool definition for Claude's tool_use — generates agent talking points
export const talkingPointsTool: Anthropic.Tool = {
  name: "generate_talking_points",
  description:
    "Generate plain-English talking points for an insurance agent to use during a customer call.",
  input_schema: {
    type: "object" as const,
    properties: {
      currentCoverageSummary: {
        type: "string",
        description:
          "One paragraph summarizing what the customer currently has, using specific numbers.",
      },
      whatsGood: {
        type: "array",
        items: { type: "string" },
        description: "2-4 bullet points highlighting solid coverage areas.",
      },
      whatToDiscuss: {
        type: "array",
        items: { type: "string" },
        description:
          "2-4 items the agent should bring up (gaps, savings, missing endorsements).",
      },
      reshopAngle: {
        type: "string",
        description:
          "One sentence pitch for why the customer should let Guardian Service compare options.",
      },
    },
    required: [
      "currentCoverageSummary",
      "whatsGood",
      "whatToDiscuss",
      "reshopAngle",
    ],
  },
};
