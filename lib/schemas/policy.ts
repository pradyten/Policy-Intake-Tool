import { z } from "zod";

export const PremiumBreakdownSchema = z.object({
  item: z.string(),
  amount: z.number(),
});

export const DeductibleSchema = z.object({
  type: z.string(),
  amount: z.string(),
});

export const PolicyDataSchema = z.object({
  policyIdentification: z.object({
    carrier: z.string().nullable(),
    policyNumber: z.string().nullable(),
    policyType: z.string().nullable(),
    effectiveDate: z.string().nullable(),
    expirationDate: z.string().nullable(),
    agentName: z.string().nullable(),
    agentContact: z.string().nullable(),
  }),
  peopleAndProperty: z.object({
    namedInsured: z.string().nullable(),
    propertyAddress: z.string().nullable(),
    mortgageCompany: z.string().nullable(),
    mortgageAddress: z.string().nullable(),
  }),
  coverages: z.object({
    dwellingA: z.number().nullable(),
    otherStructuresB: z.number().nullable(),
    personalPropertyC: z.number().nullable(),
    lossOfUseD: z.number().nullable(),
    personalLiabilityE: z.number().nullable(),
    medicalPaymentsF: z.number().nullable(),
  }),
  cost: z.object({
    annualPremium: z.number().nullable(),
    premiumBreakdown: z.array(PremiumBreakdownSchema),
    deductibles: z.array(DeductibleSchema),
  }),
  endorsements: z.array(z.string()),
  discounts: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});

export type PolicyData = z.infer<typeof PolicyDataSchema>;
export type PremiumBreakdown = z.infer<typeof PremiumBreakdownSchema>;
export type Deductible = z.infer<typeof DeductibleSchema>;
