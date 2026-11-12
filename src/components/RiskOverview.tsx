import type { ScanResult } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { Shield, AlertTriangle, CheckCircle2, Eye } from "lucide-react";

const actionConfig = {
  Allow: { icon: CheckCircle2, style: "text-success" },
  Deny: { icon: AlertTriangle, style: "text-destructive" },
  "Review Manually": { icon: Eye, style: "text-warning" },
} as const;

export function RiskOverview({ result }: { result: ScanResult }) {
  const trackers = result.trackers ?? [];
  const action = actionConfig[result.suggestedAction] ?? {
    icon: Eye,
    style: "text-muted-foreground",
  };
  const ActionIcon = action.icon;
  const categories = {
    Essential: trackers.filter(t => t.category === "Essential").length,
    Analytics: trackers.filter(t => t.category === "Analytics").length,
    Marketing: trackers.filter(t => t.category === "Marketing").length,
    Suspicious: trackers.filter(t => t.category === "Suspicious").length,
  };

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Overall Risk */}
        <div className="bg-card border border-border rounded-xl p-5 glow-primary">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Overall Risk</span>
          </div>
          <RiskBadge level={result.overallRisk} className="text-sm px-3 py-1" />
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{result.riskExplanation}</p>
        </div>

        {/* Suggested Action */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ActionIcon className={`h-4 w-4 ${action.style}`} />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Suggested Action</span>
          </div>
          <span className={`text-lg font-semibold ${action.style}`}>
            {result.suggestedAction || "Unknown"}
          </span>
          <p className="mt-3 text-xs text-muted-foreground">Based on combined tracker and policy analysis</p>
        </div>

        {/* Tracker Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Trackers Found</span>
          </div>
          <span className="text-3xl font-bold text-foreground">{trackers.length}</span>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
            {Object.entries(categories).map(([cat, count]) => (
              count > 0 && (
                <span key={cat} className="text-muted-foreground">
                  {cat}: <span className="text-foreground">{count}</span>
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
