"use client";

import { useState } from "react";
import { FileText, MapPin, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
    file: "/samples/florida-sample.pdf",
  },
  {
    id: "dc-sample",
    state: "Washington, DC",
    carrier: "Sample Homeowners Policy",
    description: "Comprehensive dec page with all coverage lines, $450K dwelling",
    icon: "🏛️",
    file: "/samples/dc-sample.pdf",
  },
  {
    id: "oklahoma-sample",
    state: "Oklahoma",
    carrier: "Annotated Sample Policy",
    description: "Educational format with labeled sections and coverage details",
    icon: "🌾",
    file: "/samples/oklahoma-sample.pdf",
  },
];

export function SampleCards({ onSelect, disabled }: SampleCardsProps) {
  const [previewSample, setPreviewSample] = useState<typeof samples[number] | null>(null);

  return (
    <>
      <div className="w-full">
        <p className="mb-3 text-sm font-medium text-muted-foreground text-center">
          Or try with a sample declarations page
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {samples.map((sample) => (
            <Card
              key={sample.id}
              className={`
                transition-all hover:shadow-md hover:border-[var(--color-navy)]/30
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
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => !disabled && onSelect(sample.id)}
                    className="flex items-center gap-1 text-xs text-[var(--color-navy)] font-medium hover:underline underline-offset-2 cursor-pointer"
                  >
                    <FileText className="h-3 w-3" />
                    Analyze
                  </button>
                  <span className="text-border">|</span>
                  <button
                    onClick={() => setPreviewSample(sample)}
                    className="flex items-center gap-1 text-xs text-muted-foreground font-medium hover:text-foreground hover:underline underline-offset-2 cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!previewSample} onOpenChange={(open) => !open && setPreviewSample(null)}>
        {previewSample && (
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{previewSample.icon}</span>
                {previewSample.carrier}
              </DialogTitle>
              <DialogDescription>
                {previewSample.state} — {previewSample.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-muted/30">
              <iframe
                src={previewSample.file}
                className="w-full h-[60vh]"
                title={`Preview: ${previewSample.carrier}`}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  const id = previewSample.id;
                  setPreviewSample(null);
                  onSelect(id);
                }}
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Analyze This Document
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
