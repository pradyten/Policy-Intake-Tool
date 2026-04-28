import type Anthropic from "@anthropic-ai/sdk";

// Tool definition for Claude's tool_use — extracts policy data from dec page
export const extractionTool: Anthropic.Tool = {
  name: "extract_policy_data",
  description:
    "Extract structured policy data from a home insurance declarations page.",
  input_schema: {
    type: "object" as const,
    properties: {
      policyIdentification: {
        type: "object",
        properties: {
          carrier: { type: ["string", "null"] },
          policyNumber: { type: ["string", "null"] },
          policyType: { type: ["string", "null"] },
          effectiveDate: { type: ["string", "null"] },
          expirationDate: { type: ["string", "null"] },
          agentName: { type: ["string", "null"] },
          agentContact: { type: ["string", "null"] },
        },
        required: [
          "carrier",
          "policyNumber",
          "policyType",
          "effectiveDate",
          "expirationDate",
          "agentName",
          "agentContact",
        ],
      },
      peopleAndProperty: {
        type: "object",
        properties: {
          namedInsured: { type: ["string", "null"] },
          propertyAddress: { type: ["string", "null"] },
          mortgageCompany: { type: ["string", "null"] },
          mortgageAddress: { type: ["string", "null"] },
        },
        required: [
          "namedInsured",
          "propertyAddress",
          "mortgageCompany",
          "mortgageAddress",
        ],
      },
      coverages: {
        type: "object",
        properties: {
          dwellingA: { type: ["number", "null"] },
          otherStructuresB: { type: ["number", "null"] },
          personalPropertyC: { type: ["number", "null"] },
          lossOfUseD: { type: ["number", "null"] },
          personalLiabilityE: { type: ["number", "null"] },
          medicalPaymentsF: { type: ["number", "null"] },
        },
        required: [
          "dwellingA",
          "otherStructuresB",
          "personalPropertyC",
          "lossOfUseD",
          "personalLiabilityE",
          "medicalPaymentsF",
        ],
      },
      cost: {
        type: "object",
        properties: {
          annualPremium: { type: ["number", "null"] },
          premiumBreakdown: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                amount: { type: "number" },
              },
              required: ["item", "amount"],
            },
          },
          deductibles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                amount: { type: "string" },
              },
              required: ["type", "amount"],
            },
          },
        },
        required: ["annualPremium", "premiumBreakdown", "deductibles"],
      },
      endorsements: {
        type: "array",
        items: { type: "string" },
      },
      discounts: {
        type: "array",
        items: { type: "string" },
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
      },
    },
    required: [
      "policyIdentification",
      "peopleAndProperty",
      "coverages",
      "cost",
      "endorsements",
      "discounts",
      "confidence",
    ],
  },
};
