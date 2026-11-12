import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { RiskOverview } from "@/components/RiskOverview";
import { TrackerTable } from "@/components/TrackerTable";
import { TrackerDetail } from "@/components/TrackerDetail";
import { PolicyAnalysisCard } from "@/components/PolicyAnalysisCard";
import { CategoryChart } from "@/components/CategoryChart";
import { CSVExport } from "@/components/CSVExport";
import { PrivacyGradeCard } from "@/components/PrivacyGradeCard";
import type { ScanResult, TrackerInfo } from "@/lib/types";
import { ensurePrivacyGrade } from "@/lib/privacyGrade";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTracker, setSelectedTracker] = useState<TrackerInfo | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("scans")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Failed to load scan:", error);
        } else {
          const trackers = (data.trackers as TrackerInfo[]) || [];
          const policyAnalysis = data.policy_analysis as ScanResult["policyAnalysis"];
          setResult({
            url: data.url,
            timestamp: data.created_at,
            overallRisk: data.overall_risk as ScanResult["overallRisk"],
            riskExplanation: data.risk_explanation,
            suggestedAction: data.suggested_action as ScanResult["suggestedAction"],
            trackers,
            policyAnalysis,
            privacyGrade: ensurePrivacyGrade(
              (data as { privacy_grade?: unknown }).privacy_grade,
              trackers,
              policyAnalysis,
              data.url,
            ),
          });
        }
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container max-w-6xl py-12 space-y-6">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to History
        </Link>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !result ? (
          <div className="text-center py-20 text-sm text-muted-foreground">Scan not found.</div>
        ) : (
          <ErrorBoundary>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-foreground">Privacy Report</h1>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {result.url} · {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CSVExport result={result} />
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/sandbox?url=${encodeURIComponent(result.url)}`}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    Browse Safely
                  </Link>
                </Button>
              </div>
            </div>

            <RiskOverview result={result} />

            {result.privacyGrade?.grade && (
              <PrivacyGradeCard grade={result.privacyGrade} />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrackerTable trackers={result.trackers} onSelect={setSelectedTracker} />
              </div>
              <div>
                <CategoryChart trackers={result.trackers} />
              </div>
            </div>

            <PolicyAnalysisCard analysis={result.policyAnalysis} />
          </ErrorBoundary>
        )}
      </main>

      <TrackerDetail
        tracker={selectedTracker}
        open={!!selectedTracker}
        onClose={() => setSelectedTracker(null)}
      />
    </div>
  );
};

export default Report;
