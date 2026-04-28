import { z } from "zod";

export const TalkingPointsSchema = z.object({
  currentCoverageSummary: z.string(),
  whatsGood: z.array(z.string()),
  whatToDiscuss: z.array(z.string()),
  reshopAngle: z.string(),
});

export type TalkingPoints = z.infer<typeof TalkingPointsSchema>;
