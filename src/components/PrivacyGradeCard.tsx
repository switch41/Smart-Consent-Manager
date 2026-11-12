import type { PrivacyGrade } from "@/lib/types";
import { Shield } from "lucide-react";

const gradeColors: Record<string, string> = {
  "A+": "text-accent border-accent/30 bg-accent/10",
  A: "text-accent border-accent/30 bg-accent/10",
  "B+": "text-primary border-primary/30 bg-primary/10",
  B: "text-primary border-primary/30 bg-primary/10",
  "C+": "text-warning border-warning/30 bg-warning/10",
  C: "text-warning border-warning/30 bg-warning/10",
  "D+": "text-destructive border-destructive/30 bg-destructive/10",
  D: "text-destructive border-destructive/30 bg-destructive/10",
  F: "text-critical border-critical/30 bg-critical/10",
};

const breakdownLabels: { key: keyof PrivacyGrade["breakdown"]; label: string }[] = [
  { key: "trackerPenalty", label: "Trackers" },
  { key: "fingerprintPenalty", label: "Fingerprinting" },
  { key: "prevalencePenalty", label: "Prevalence" },
  { key: "policyPenalty", label: "Policy" },
  { key: "httpsPenalty", label: "HTTPS" },
];

export function PrivacyGradeCard({ grade }: { grade: PrivacyGrade }) {
  const colorClass = gradeColors[grade.grade] || "text-muted-foreground border-border bg-card";

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          🦆 Privacy Grade
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${colorClass}`}>
          <span className="text-2xl font-black">{grade.grade || "—"}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{grade.score ?? "—"}/100</span>
            <span className="text-xs text-muted-foreground font-mono">DuckDuckGo-style scoring</span>
          </div>
          <div className="mt-2 space-y-1">
            {breakdownLabels.map(({ key, label }) => {
              const value = grade.breakdown?.[key] ?? 0;
              if (value === 0) return null;
              return (
                <div key={key} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-muted-foreground w-24">{label}</span>
                  <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-destructive/70 rounded-full transition-all"
                      style={{ width: `${Math.min((value / 30) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-destructive w-8 text-right">-{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
