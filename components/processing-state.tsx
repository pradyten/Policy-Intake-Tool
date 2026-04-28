"use client";

import { Shield } from "lucide-react";

interface ProcessingStateProps {
  status: "extracting" | "analyzing";
}

const messages: Record<string, string[]> = {
  extracting: [
    "Reading your declarations page...",
    "Identifying coverage details...",
  ],
  analyzing: [
    "Analyzing coverage gaps...",
    "Generating talking points...",
  ],
};

export function ProcessingState({ status }: ProcessingStateProps) {
  const statusMessages = messages[status] || messages.extracting;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-navy)]/10">
          <Shield className="h-10 w-10 text-[var(--color-navy)] animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">
          {statusMessages[0]}
        </p>
        {statusMessages[1] && (
          <p className="mt-1 text-sm text-muted-foreground">
            {statusMessages[1]}
          </p>
        )}
      </div>
    </div>
  );
}
