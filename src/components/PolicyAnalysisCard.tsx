import type { PolicyAnalysis } from "@/lib/types";
import { FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const typeIcon = {
  positive: CheckCircle2,
  negative: XCircle,
  warning: AlertTriangle,
};

const typeStyle = {
  positive: "text-success",
  negative: "text-destructive",
  warning: "text-warning",
};

const scoreStyle = {
  "Likely Compliant": "text-success",
  "Review Recommended": "text-warning",
  "Potentially Non-Compliant": "text-destructive",
};

export function PolicyAnalysisCard({ analysis }: { analysis: PolicyAnalysis }) {
  const score = analysis?.score;
  const highlights = analysis?.highlights ?? [];
  const foundKeywords = analysis?.foundKeywords ?? [];
  const missingKeywords = analysis?.missingKeywords ?? [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Privacy Policy Analysis</h2>
        </div>
        <span className={`text-sm font-semibold ${score ? scoreStyle[score] || "text-muted-foreground" : "text-muted-foreground"}`}>
          {score || "Not recorded"}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {highlights.length === 0 && foundKeywords.length === 0 && missingKeywords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No policy analysis was recorded for this scan.</p>
        ) : (
          <div className="space-y-2">
            {highlights.map((h, i) => {
              const Icon = typeIcon[h.type] || AlertTriangle;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${typeStyle[h.type] || "text-muted-foreground"}`} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.text}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Found Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              {foundKeywords.length === 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">None found</span>
              )}
              {foundKeywords.map(kw => (
                <span key={kw} className="bg-success/10 text-success text-[10px] font-mono px-2 py-0.5 rounded-full border border-success/20">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Missing Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.length === 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">None missing</span>
              )}
              {missingKeywords.map(kw => (
                <span key={kw} className="bg-destructive/10 text-destructive text-[10px] font-mono px-2 py-0.5 rounded-full border border-destructive/20">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
