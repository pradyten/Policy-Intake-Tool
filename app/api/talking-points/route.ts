import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { TalkingPointsSchema } from "@/lib/schemas/talking-points";
import { talkingPointsTool } from "@/lib/claude/talking-points";
import { TALKING_POINTS_PROMPT } from "@/lib/prompts";
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
      system: TALKING_POINTS_PROMPT,
      tools: [talkingPointsTool],
      tool_choice: { type: "tool", name: "generate_talking_points" },
      messages: [
        {
          role: "user",
          content: `Generate talking points for this policy:\n\n${JSON.stringify(policyData, null, 2)}`,
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

    const parsed = TalkingPointsSchema.safeParse(toolBlock.input);
    if (!parsed.success) {
      console.error("Zod validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid talking points response", details: parsed.error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Talking points error:", error);
    return NextResponse.json(
      { error: "Talking points generation failed" },
      { status: 500 }
    );
  }
}
