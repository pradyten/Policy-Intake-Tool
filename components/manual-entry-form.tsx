"use client";

import { useState } from "react";
import { PenLine, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { PolicyData } from "@/lib/schemas/policy";

interface ManualEntryFormProps {
  onSubmit: (data: PolicyData) => void;
  disabled?: boolean;
}

export function ManualEntryForm({ onSubmit, disabled }: ManualEntryFormProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) => {
      const val = (form.elements.namedItem(name) as HTMLInputElement)?.value;
      return val?.trim() || null;
    };
    const getNum = (name: string) => {
      const val = get(name);
      if (!val) return null;
      const n = parseFloat(val.replace(/[,$]/g, ""));
      return isNaN(n) ? null : n;
    };

    const dwellingA = getNum("dwellingA");

    // Smart defaults
    const otherStructuresB =
      getNum("otherStructuresB") ??
      (dwellingA ? Math.round(dwellingA * 0.1) : null);
    const personalPropertyC =
      getNum("personalPropertyC") ??
      (dwellingA ? Math.round(dwellingA * 0.5) : null);
    const lossOfUseD =
      getNum("lossOfUseD") ??
      (dwellingA ? Math.round(dwellingA * 0.2) : null);

    const policyData: PolicyData = {
      policyIdentification: {
        carrier: get("carrier"),
        policyNumber: get("policyNumber"),
        policyType: get("policyType"),
        effectiveDate: get("effectiveDate"),
        expirationDate: get("expirationDate"),
        agentName: get("agentName"),
        agentContact: get("agentContact"),
      },
      peopleAndProperty: {
        namedInsured: get("namedInsured"),
        propertyAddress: get("propertyAddress"),
        mortgageCompany: get("mortgageCompany"),
        mortgageAddress: get("mortgageAddress"),
      },
      coverages: {
        dwellingA,
        otherStructuresB,
        personalPropertyC,
        lossOfUseD,
        personalLiabilityE: getNum("personalLiabilityE"),
        medicalPaymentsF: getNum("medicalPaymentsF"),
      },
      cost: {
        annualPremium: getNum("annualPremium"),
        premiumBreakdown: [],
        deductibles: get("deductible")
          ? [{ type: "All Perils", amount: get("deductible")! }]
          : [],
      },
      endorsements: [],
      discounts: [],
      confidence: "high",
    };

    onSubmit(policyData);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-[var(--color-navy)] hover:underline mx-auto cursor-pointer">
        <PenLine className="h-4 w-4" />
        Or enter details manually
        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Manual Policy Entry</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the policy details as read by the customer. Fields left blank
              will use smart defaults where possible.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Policy Identification */}
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Policy Identification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="carrier">Insurance Carrier</Label>
                    <Input
                      id="carrier"
                      name="carrier"
                      placeholder="e.g., State Farm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      name="policyNumber"
                      placeholder="e.g., HO-12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyType">Policy Type</Label>
                    <Input
                      id="policyType"
                      name="policyType"
                      placeholder="e.g., HO-3"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      HO-3 is standard, HO-5 is broader, HO-6 is condo
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="annualPremium">Annual Premium ($)</Label>
                    <Input
                      id="annualPremium"
                      name="annualPremium"
                      placeholder="e.g., 1850"
                    />
                  </div>
                </div>
              </div>

              {/* People & Property */}
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  People & Property
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="namedInsured">Policyholder Name</Label>
                    <Input
                      id="namedInsured"
                      name="namedInsured"
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      name="propertyAddress"
                      placeholder="e.g., 123 Main St, City, ST 12345"
                    />
                  </div>
                </div>
              </div>

              {/* Coverages */}
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Coverage Amounts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="dwellingA">
                      A — Dwelling ($)
                    </Label>
                    <Input
                      id="dwellingA"
                      name="dwellingA"
                      placeholder="e.g., 350000"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Rebuild cost for the home structure
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="otherStructuresB">
                      B — Other Structures ($)
                    </Label>
                    <Input
                      id="otherStructuresB"
                      name="otherStructuresB"
                      placeholder="Defaults to 10% of A"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Garage, shed, fence, etc.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="personalPropertyC">
                      C — Personal Property ($)
                    </Label>
                    <Input
                      id="personalPropertyC"
                      name="personalPropertyC"
                      placeholder="Defaults to 50% of A"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Belongings inside the home
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="lossOfUseD">
                      D — Loss of Use ($)
                    </Label>
                    <Input
                      id="lossOfUseD"
                      name="lossOfUseD"
                      placeholder="Defaults to 20% of A"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Temporary living expenses if displaced
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="personalLiabilityE">
                      E — Personal Liability ($)
                    </Label>
                    <Input
                      id="personalLiabilityE"
                      name="personalLiabilityE"
                      placeholder="e.g., 300000"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Protects against lawsuits, $300K+ recommended
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="medicalPaymentsF">
                      F — Medical Payments ($)
                    </Label>
                    <Input
                      id="medicalPaymentsF"
                      name="medicalPaymentsF"
                      placeholder="e.g., 5000"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Per-person limit for guest injuries
                    </p>
                  </div>
                </div>
              </div>

              {/* Deductible */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Deductible</h4>
                <div className="max-w-xs">
                  <Label htmlFor="deductible">Deductible Amount</Label>
                  <Input
                    id="deductible"
                    name="deductible"
                    placeholder="e.g., $1,000"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={disabled}
                className="w-full bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)]"
              >
                Analyze Policy
              </Button>
            </form>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
