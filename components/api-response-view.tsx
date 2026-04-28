"use client";

import { useState } from "react";
import { Code, Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import type { ApiResponse } from "@/lib/schemas/api-response";

interface ApiResponseViewProps {
  data: ApiResponse;
}

export function ApiResponseView({ data }: ApiResponseViewProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer flex-1"
              onClick={() => setOpen(!open)}
            >
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-[var(--color-navy)]" />
                API Response
                <span className="text-xs font-normal text-muted-foreground">
                  — Sample response for CRM integration
                </span>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyJson}
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
                    Copy JSON
                  </>
                )}
              </Button>
              <div
                className="cursor-pointer p-1"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-[var(--color-navy)] p-4 text-xs text-green-300 font-mono leading-relaxed max-h-96 overflow-y-auto">
              {jsonString}
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
