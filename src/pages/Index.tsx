import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ScanForm } from "@/components/ScanForm";
import { RiskOverview } from "@/components/RiskOverview";
import { TrackerTable } from "@/components/TrackerTable";
import { TrackerDetail } from "@/components/TrackerDetail";
import { PolicyAnalysisCard } from "@/components/PolicyAnalysisCard";
import { CategoryChart } from "@/components/CategoryChart";
import { PrivacyGradeCard } from "@/components/PrivacyGradeCard";
import { CSVExport } from "@/components/CSVExport";
import type { ScanResult, TrackerInfo } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/AppHeader";
import type { Json } from "@/integrations/supabase/types";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedTracker, setSelectedTracker] = useState<TrackerInfo | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScan = useCallback(async (url: string) => {
    setIsScanning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('scan-website', {
        body: { url }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Scan failed');
      }

      const scanResult: ScanResult = {
        url: data.url,
        timestamp: data.timestamp,
        overallRisk: data.overallRisk,
        riskExplanation: data.riskExplanation,
        suggestedAction: data.suggestedAction,
        trackers: data.trackers || [],
        policyAnalysis: data.policyAnalysis,
        privacyGrade: data.privacyGrade,
      };

      setResult(scanResult);

      // Persist to database
      const { error: dbError } = await supabase.from('scans').insert({
        url: scanResult.url,
        overall_risk: scanResult.overallRisk,
        risk_explanation: scanResult.riskExplanation,
        suggested_action: scanResult.suggestedAction,
        trackers: scanResult.trackers as unknown as Json,
        policy_analysis: scanResult.policyAnalysis as unknown as Json,
        tracker_count: scanResult.trackers.length,
        privacy_grade: (scanResult.privacyGrade ?? null) as Json | null,
      });

      if (dbError) console.error('Failed to save scan:', dbError);
    } catch (err) {
      console.error('Scan error:', err);
      toast({
        title: "Scan Failed",
        description: err instanceof Error ? err.message : "Could not scan the website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container max-w-6xl py-12 space-y-8">
        <section className="py-8">
          <ScanForm onScan={handleScan} isScanning={isScanning} />
        </section>

        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Scan Results</h2>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{result.url} · {new Date(result.timestamp).toLocaleString()}</p>
              </div>
              <CSVExport result={result} />
            </div>

            <RiskOverview result={result} />

            {result.privacyGrade && (
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
          </div>
        )}

        {!result && !isScanning && (
          <div className="text-center py-16 animate-fade-in-up">
            <p className="text-muted-foreground text-sm">
              Enter a URL above to scan for cookies, trackers, and privacy compliance.
            </p>
          </div>
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

export default Index;