"use client";

import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
  Shield,
  DollarSign,
  FileWarning,
  Calendar,
  Puzzle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoverageAnalysis as CoverageAnalysisType } from "@/lib/schemas/analysis";

interface CoverageAnalysisProps {
  data: CoverageAnalysisType;
}

const severityConfig = {
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: ShieldAlert,
    iconColor: "text-red-600",
  },
  medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  low: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: Info,
    iconColor: "text-green-600",
  },
};

const categoryIcons: Record<string, React.ElementType> = {
  coverage_gap: Shield,
  deductible: DollarSign,
  premium: DollarSign,
  endorsement: Puzzle,
  expiration: Calendar,
};

const overallRiskConfig = {
  high: {
    label: "High Risk",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: ShieldAlert,
  },
  medium: {
    label: "Medium Risk",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: AlertTriangle,
  },
  low: {
    label: "Low Risk",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: ShieldCheck,
  },
};

export function CoverageAnalysis({ data }: CoverageAnalysisProps) {
  const riskConfig = overallRiskConfig[data.overallRisk];
  const RiskIcon = riskConfig.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileWarning className="h-5 w-5 text-[var(--color-navy)]" />
            Coverage Analysis
          </CardTitle>
          <Badge variant="outline" className={riskConfig.className}>
            <RiskIcon className="mr-1 h-3.5 w-3.5" />
            {riskConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{data.summary}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...data.flags].sort((a, b) => {
          const order = { high: 0, medium: 1, low: 2 };
          return order[a.severity] - order[b.severity];
        }).map((flag) => {
          const config = severityConfig[flag.severity];
          const SeverityIcon = config.icon;
          const CategoryIcon = categoryIcons[flag.category] || Shield;

          return (
            <div
              key={flag.id}
              className={`rounded-lg border ${config.border} ${config.bg} p-4`}
            >
              <div className="flex items-start gap-3">
                <SeverityIcon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{flag.title}</h4>
                    <Badge variant="outline" className={`text-xs ${config.badge}`}>
                      {flag.severity}
                    </Badge>
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <CategoryIcon className="h-3 w-3" />
                      {flag.category.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {flag.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground/90">
                    Recommendation: {flag.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
