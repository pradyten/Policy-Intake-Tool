import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { PolicyDataSchema } from "@/lib/schemas/policy";
import { extractionTool } from "@/lib/claude/extract";
import { EXTRACTION_PROMPT } from "@/lib/prompts";

export const runtime = "edge";

interface ExtractRequest {
  fileBase64: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExtractRequest;
    const { fileBase64, mimeType } = body;

    if (!fileBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing fileBase64 or mimeType" },
        { status: 400 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const contentBlock: Anthropic.DocumentBlockParam | Anthropic.ImageBlockParam =
      mimeType === "application/pdf"
        ? {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: fileBase64,
            },
          }
        : {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: fileBase64,
            },
          };

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: EXTRACTION_PROMPT,
      tools: [extractionTool],
      tool_choice: { type: "tool", name: "extract_policy_data" },
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: "Extract all policy data from this declarations page.",
            },
          ],
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

    const parsed = PolicyDataSchema.safeParse(toolBlock.input);
    if (!parsed.success) {
      console.error("Zod validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid extraction response", details: parsed.error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Extraction failed" },
      { status: 500 }
    );
  }
}
