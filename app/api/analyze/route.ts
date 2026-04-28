import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { CoverageAnalysisSchema } from "@/lib/schemas/analysis";
import { analysisTool } from "@/lib/claude/analyze";
import { ANALYSIS_PROMPT } from "@/lib/prompts";
import type { PolicyData } from "@/lib/schemas/policy";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const policyData = (await request.json()) as PolicyData;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: ANALYSIS_PROMPT,
      tools: [analysisTool],
      tool_choice: { type: "tool", name: "analyze_coverage" },
      messages: [
        {
          role: "user",
          content: `Analyze this policy data:\n\n${JSON.stringify(policyData, null, 2)}`,
        },
      ],
    });

    const toolBlock = response.content.find(
      (block) => block.type === "tool_use"
    );
    if (!toolBlock || toolBlock.type !== "tool_use") {
      return NextResponse.json(
        { error: "No tool response from Claude" },
        { status: 500 }
      );
    }

    const parsed = CoverageAnalysisSchema.safeParse(toolBlock.input);
    if (!parsed.success) {
      console.error("Zod validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid analysis response", details: parsed.error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
