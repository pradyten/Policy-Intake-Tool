"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { PolicyData } from "@/lib/schemas/policy";
import type { CoverageAnalysis } from "@/lib/schemas/analysis";
import type { TalkingPoints } from "@/lib/schemas/talking-points";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #1a1a2e",
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  headerSub: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    marginBottom: 8,
    marginTop: 16,
    borderBottom: "1px solid #ddd",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "0.5px solid #f0f0f0",
  },
  label: {
    color: "#666",
    width: "45%",
  },
  value: {
    fontFamily: "Helvetica-Bold",
    width: "55%",
    textAlign: "right",
  },
  flag: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  flagHigh: { backgroundColor: "#fef2f2", borderLeft: "3px solid #dc2626" },
  flagMedium: { backgroundColor: "#fffbeb", borderLeft: "3px solid #d97706" },
  flagLow: { backgroundColor: "#f0fdf4", borderLeft: "3px solid #16a34a" },
  flagTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 2 },
  flagText: { fontSize: 9, color: "#444" },
  bullet: { marginBottom: 4, paddingLeft: 12 },
  reshop: {
    padding: 10,
    backgroundColor: "#eef2ff",
    borderRadius: 4,
    marginTop: 8,
  },
  reshopText: {
    fontFamily: "Helvetica-Oblique",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function formatCurrency(val: number | null): string {
  if (val === null) return "N/A";
  return "$" + val.toLocaleString();
}

interface ReportProps {
  policyData: PolicyData;
  coverageAnalysis: CoverageAnalysis;
  talkingPoints: TalkingPoints;
}

function PolicyReport({
  policyData,
  coverageAnalysis,
  talkingPoints,
}: ReportProps) {
  const { policyIdentification, peopleAndProperty, coverages, cost } =
    policyData;

  return (
    <Document>
      {/* Page 1: Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Guardian Shield</Text>
            <Text style={styles.headerSub}>
              Policy Intake & Analysis Report
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Policy Identification</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Carrier</Text>
          <Text style={styles.value}>
            {policyIdentification.carrier ?? "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Policy Number</Text>
          <Text style={styles.value}>
            {policyIdentification.policyNumber ?? "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Policy Type</Text>
          <Text style={styles.value}>
            {policyIdentification.policyType ?? "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Period</Text>
          <Text style={styles.value}>
            {policyIdentification.effectiveDate ?? "?"} –{" "}
            {policyIdentification.expirationDate ?? "?"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>People & Property</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Named Insured</Text>
          <Text style={styles.value}>
            {peopleAndProperty.namedInsured ?? "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Property Address</Text>
          <Text style={styles.value}>
            {peopleAndProperty.propertyAddress ?? "N/A"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Coverage Amounts</Text>
        <View style={styles.row}>
          <Text style={styles.label}>A — Dwelling</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.dwellingA)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>B — Other Structures</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.otherStructuresB)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>C — Personal Property</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.personalPropertyC)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>D — Loss of Use</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.lossOfUseD)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E — Personal Liability</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.personalLiabilityE)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>F — Medical Payments</Text>
          <Text style={styles.value}>
            {formatCurrency(coverages.medicalPaymentsF)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Cost</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Premium</Text>
          <Text style={styles.value}>
            {formatCurrency(cost.annualPremium)}
          </Text>
        </View>
        {cost.deductibles.map((d, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.label}>Deductible — {d.type}</Text>
            <Text style={styles.value}>{d.amount}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>Generated by Guardian Shield</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </View>
      </Page>

      {/* Page 2: Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Coverage Analysis</Text>
        <Text style={{ marginBottom: 10, color: "#444" }}>
          Overall Risk: {coverageAnalysis.overallRisk.toUpperCase()} —{" "}
          {coverageAnalysis.summary}
        </Text>
        {coverageAnalysis.flags.map((flag) => (
          <View
            key={flag.id}
            style={[
              styles.flag,
              flag.severity === "high"
                ? styles.flagHigh
                : flag.severity === "medium"
                  ? styles.flagMedium
                  : styles.flagLow,
            ]}
          >
            <Text style={styles.flagTitle}>
              [{flag.severity.toUpperCase()}] {flag.title}
            </Text>
            <Text style={styles.flagText}>{flag.description}</Text>
            <Text style={[styles.flagText, { marginTop: 2 }]}>
              Recommendation: {flag.recommendation}
            </Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>Generated by Guardian Shield</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </View>
      </Page>

      {/* Page 3: Talking Points */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Agent Talking Points</Text>
        <Text style={{ marginBottom: 12, lineHeight: 1.5 }}>
          {talkingPoints.currentCoverageSummary}
        </Text>

        <Text
          style={[styles.sectionTitle, { fontSize: 12, color: "#16a34a" }]}
        >
          What&apos;s Good
        </Text>
        {talkingPoints.whatsGood.map((p, i) => (
          <Text key={i} style={styles.bullet}>
            • {p}
          </Text>
        ))}

        <Text
          style={[styles.sectionTitle, { fontSize: 12, color: "#d97706" }]}
        >
          What to Discuss
        </Text>
        {talkingPoints.whatToDiscuss.map((p, i) => (
          <Text key={i} style={styles.bullet}>
            • {p}
          </Text>
        ))}

        <View style={styles.reshop}>
          <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
            Reshop Angle
          </Text>
          <Text style={styles.reshopText}>{talkingPoints.reshopAngle}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Generated by Guardian Shield</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function PdfDownloadButton(props: ReportProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(<PolicyReport {...props} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guardian-shield-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={generating}
    >
      <Download className="mr-2 h-4 w-4" />
      {generating ? "Generating..." : "Download PDF Report"}
    </Button>
  );
}
