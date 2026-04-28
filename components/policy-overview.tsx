"use client";

import {
  ClipboardList,
  Users,
  Shield,
  DollarSign,
  Tag,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { PolicyData } from "@/lib/schemas/policy";
import { formatCurrency } from "@/lib/utils";

interface PolicyOverviewProps {
  data: PolicyData;
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={value ? "font-medium" : "text-muted-foreground/50"}>
        {value ?? "Not found"}
      </span>
    </div>
  );
}

export function PolicyOverview({ data }: PolicyOverviewProps) {
  const { policyIdentification, peopleAndProperty, coverages, cost } = data;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-[var(--color-navy)]" />
          Policy Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Policy Identification */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
            <Tag className="h-3.5 w-3.5" />
            Policy Identification
          </h4>
          <div className="rounded-lg bg-muted/50 px-4 py-2">
            <DataRow label="Carrier" value={policyIdentification.carrier} />
            <DataRow
              label="Policy Number"
              value={policyIdentification.policyNumber}
            />
            <DataRow
              label="Policy Type"
              value={policyIdentification.policyType}
            />
            <DataRow
              label="Effective Date"
              value={policyIdentification.effectiveDate}
            />
            <DataRow
              label="Expiration Date"
              value={policyIdentification.expirationDate}
            />
            <DataRow label="Agent" value={policyIdentification.agentName} />
            <DataRow
              label="Agent Contact"
              value={policyIdentification.agentContact}
            />
          </div>
        </div>

        <Separator />

        {/* People & Property */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
            <Users className="h-3.5 w-3.5" />
            People & Property
          </h4>
          <div className="rounded-lg bg-muted/50 px-4 py-2">
            <DataRow
              label="Named Insured"
              value={peopleAndProperty.namedInsured}
            />
            <DataRow
              label="Property Address"
              value={peopleAndProperty.propertyAddress}
            />
            <DataRow
              label="Mortgage Company"
              value={peopleAndProperty.mortgageCompany}
            />
            <DataRow
              label="Mortgage Address"
              value={peopleAndProperty.mortgageAddress}
            />
          </div>
        </div>

        <Separator />

        {/* Coverages */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
            <Shield className="h-3.5 w-3.5" />
            Coverages
          </h4>
          <div className="rounded-lg bg-muted/50 px-4 py-2">
            <DataRow
              label="A — Dwelling"
              value={formatCurrency(coverages.dwellingA)}
            />
            <DataRow
              label="B — Other Structures"
              value={formatCurrency(coverages.otherStructuresB)}
            />
            <DataRow
              label="C — Personal Property"
              value={formatCurrency(coverages.personalPropertyC)}
            />
            <DataRow
              label="D — Loss of Use"
              value={formatCurrency(coverages.lossOfUseD)}
            />
            <DataRow
              label="E — Personal Liability"
              value={formatCurrency(coverages.personalLiabilityE)}
            />
            <DataRow
              label="F — Medical Payments"
              value={formatCurrency(coverages.medicalPaymentsF)}
            />
          </div>
        </div>

        <Separator />

        {/* Cost */}
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
            <DollarSign className="h-3.5 w-3.5" />
            Cost
          </h4>
          <div className="rounded-lg bg-muted/50 px-4 py-2">
            <DataRow
              label="Annual Premium"
              value={formatCurrency(cost.annualPremium)}
            />
            {cost.deductibles.map((d, i) => (
              <DataRow
                key={i}
                label={`Deductible — ${d.type}`}
                value={d.amount}
              />
            ))}
          </div>
          {cost.premiumBreakdown.length > 0 && (
            <div className="mt-2 rounded-lg bg-muted/50 px-4 py-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Premium Breakdown
              </p>
              {cost.premiumBreakdown.map((item, i) => (
                <DataRow
                  key={i}
                  label={item.item}
                  value={formatCurrency(item.amount)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Endorsements & Discounts */}
        {(data.endorsements.length > 0 || data.discounts.length > 0) && (
          <>
            <Separator />
            <div className="space-y-4">
              {data.endorsements.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
                    <Award className="h-3.5 w-3.5" />
                    Endorsements
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {data.endorsements.map((e, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.discounts.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Discounts</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {data.discounts.map((d, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-[var(--color-severity-low)] text-[var(--color-severity-low)]"
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
