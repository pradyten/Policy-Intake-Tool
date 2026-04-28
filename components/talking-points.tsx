"use client";

import { useState } from "react";
import {
  MessageSquare,
  Copy,
  Check,
  ThumbsUp,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TalkingPoints as TalkingPointsType } from "@/lib/schemas/talking-points";

interface TalkingPointsProps {
  data: TalkingPointsType;
}

export function TalkingPoints({ data }: TalkingPointsProps) {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = [
      "COVERAGE SUMMARY",
      data.currentCoverageSummary,
      "",
      "WHAT'S GOOD",
      ...data.whatsGood.map((p) => `• ${p}`),
      "",
      "WHAT TO DISCUSS",
      ...data.whatToDiscuss.map((p) => `• ${p}`),
      "",
      "RESHOP ANGLE",
      data.reshopAngle,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-[var(--color-navy)]" />
            Agent Talking Points
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3.5 w-3.5" />
                Copy All
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary */}
        <div>
          <p className="text-sm leading-relaxed text-foreground">
            {data.currentCoverageSummary}
          </p>
        </div>

        {/* What's Good */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-green-700 mb-2">
            <ThumbsUp className="h-4 w-4" />
            What&apos;s Good
          </h4>
          <ul className="space-y-2">
            {data.whatsGood.map((point, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-foreground/80 pl-1"
              >
                <span className="text-green-500 mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* What to Discuss */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 mb-2">
            <AlertCircle className="h-4 w-4" />
            What to Discuss
          </h4>
          <ul className="space-y-2">
            {data.whatToDiscuss.map((point, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-foreground/80 pl-1"
              >
                <span className="text-amber-500 mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Reshop Angle */}
        <div className="rounded-lg bg-[var(--color-navy)]/5 border border-[var(--color-navy)]/10 p-4">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] mb-2">
            <TrendingUp className="h-4 w-4" />
            Reshop Angle
          </h4>
          <p className="text-sm text-foreground/80 italic">
            &ldquo;{data.reshopAngle}&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
