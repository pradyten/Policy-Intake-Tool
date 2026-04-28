"use client";

import { FileText, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SampleCardsProps {
  onSelect: (sampleId: string) => void;
  disabled?: boolean;
}

const samples = [
  {
    id: "florida-sample",
    state: "Florida",
    carrier: "Citizens Property Insurance",
    description: "Standard HO-3 policy, $160K dwelling, $859 annual premium",
    icon: "🌴",
  },
  {
    id: "dc-sample",
    state: "Washington, DC",
    carrier: "Sample Homeowners Policy",
    description: "Comprehensive dec page with all coverage lines, $450K dwelling",
    icon: "🏛️",
  },
  {
    id: "oklahoma-sample",
    state: "Oklahoma",
    carrier: "Annotated Sample Policy",
    description: "Educational format with labeled sections and coverage details",
    icon: "🌾",
  },
];

export function SampleCards({ onSelect, disabled }: SampleCardsProps) {
  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-medium text-muted-foreground text-center">
        Or try with a sample declarations page
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {samples.map((sample) => (
          <Card
            key={sample.id}
            onClick={() => !disabled && onSelect(sample.id)}
            className={`
              cursor-pointer transition-all hover:shadow-md hover:border-[var(--color-navy)]/30
              ${disabled ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{sample.icon}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {sample.state}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">
                  {sample.carrier}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {sample.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--color-navy)] font-medium mt-1">
                <FileText className="h-3 w-3" />
                Try this sample
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
