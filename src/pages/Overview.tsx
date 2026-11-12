import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield, Activity, AlertTriangle, CheckCircle2, XCircle,
  BarChart3, Cookie, Megaphone, Globe, TrendingUp, Clock,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RiskLevel, TrackerInfo } from "@/lib/types";

interface ScanRow {
  id: string;
  url: string;
  overall_risk: string;
  tracker_count: number;
  trackers: TrackerInfo[];
  privacy_grade: { grade?: string; score?: number } | null;
  created_at: string;
}

const riskColor: Record<string, string> = {
  Low: "text-accent",
  Medium: "text-warning",
  High: "text-destructive",
  Critical: "text-critical",
};

const Overview = () => {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [consents, setConsents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase
      .from("scans")
      .select("id, url, overall_risk, tracker_count, trackers, privacy_grade, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error) setScans(data || []);
        setLoading(false);
      });

    const stored = localStorage.getItem("consent-preferences");
    if (stored) setConsents(JSON.parse(stored));
  }, []);

  const totalScans = scans.length;
  const totalTrackers = scans.reduce((s, r) => s + r.tracker_count, 0);
  const avgTrackers = totalScans ? Math.round(totalTrackers / totalScans) : 0;

  const riskCounts = scans.reduce<Record<string, number>>((acc, s) => {
    acc[s.overall_risk] = (acc[s.overall_risk] || 0) + 1;
    return acc;
  }, {});

  // Aggregate tracker categories across all scans
  const categoryCounts: Record<string, number> = {};
  scans.forEach((scan) => {
    const trackers = (scan.trackers as TrackerInfo[]) || [];
    trackers.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
  });

  const consentLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    essential: { label: "Essential", icon: <Cookie className="h-4 w-4 text-accent" /> },
    analytics: { label: "Analytics", icon: <BarChart3 className="h-4 w-4 text-primary" /> },
    marketing: { label: "Marketing", icon: <Megaphone className="h-4 w-4 text-warning" /> },
    thirdparty: { label: "Third-Party", icon: <Globe className="h-4 w-4 text-destructive" /> },
  };

  // Compute average privacy grade
  const gradeValues: Record<string, number> = {
    "A+": 95, A: 90, "B+": 85, B: 80, "C+": 75, C: 70, "D+": 65, D: 60, F: 40,
  };
  const gradeFromScore = (s: number): string => {
    if (s >= 93) return "A+";
    if (s >= 86) return "A";
    if (s >= 80) return "B+";
    if (s >= 73) return "B";
    if (s >= 66) return "C+";
    if (s >= 60) return "C";
    if (s >= 53) return "D+";
    if (s >= 46) return "D";
    return "F";
  };
  const scansWithGrade = scans.filter((s) => s.privacy_grade?.score != null);
  const avgGradeScore = scansWithGrade.length
    ? Math.round(scansWithGrade.reduce((sum, s) => sum + (s.privacy_grade.score as number), 0) / scansWithGrade.length)
    : null;
  const avgGradeLetter = avgGradeScore != null ? gradeFromScore(avgGradeScore) : null;

  const gradeColorClass: Record<string, string> = {
    "A+": "text-accent", A: "text-accent", "B+": "text-primary", B: "text-primary",
    "C+": "text-warning", C: "text-warning", "D+": "text-destructive", D: "text-destructive", F: "text-critical",
  };

  const recentScans = scans.slice(0, 5);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container max-w-6xl py-12 space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Privacy health at a glance</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-mono">Total Scans</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalScans}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-mono">Total Trackers</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalTrackers}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-mono">Avg / Scan</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{avgTrackers}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-mono">High/Critical</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">
                    {(riskCounts["High"] || 0) + (riskCounts["Critical"] || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card col-span-2 md:col-span-4">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs font-mono">🦆 Avg Privacy Grade</span>
                  </div>
                  {avgGradeLetter ? (
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl font-black ${gradeColorClass[avgGradeLetter] || "text-muted-foreground"}`}>
                        {avgGradeLetter}
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {avgGradeScore}/100 across {scansWithGrade.length} scan{scansWithGrade.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No graded scans yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(["Low", "Medium", "High", "Critical"] as RiskLevel[]).map((level) => {
                    const count = riskCounts[level] || 0;
                    const pct = totalScans ? Math.round((count / totalScans) * 100) : 0;
                    return (
                      <div key={level} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${riskColor[level]}`}>{level}</span>
                          <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Tracker Categories */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">Tracker Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Essential", "Analytics", "Marketing", "Suspicious"].map((cat) => {
                    const count = categoryCounts[cat] || 0;
                    const pct = totalTrackers ? Math.round((count / totalTrackers) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{cat}</span>
                          <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Consent Preferences */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">Consent Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(consentLabels).length > 0 && Object.keys(consents).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(consentLabels).map(([key, { label, icon }]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {icon}
                            <span className="text-sm text-foreground">{label}</span>
                          </div>
                          <Badge variant={consents[key] ? "default" : "outline"} className="text-[10px]">
                            {consents[key] ? "Allowed" : "Blocked"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground mb-3">No preferences set yet</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/consents">Configure Consents</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Scans */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground">Recent Scans</CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                    <Link to="/history">View all →</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentScans.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground mb-3">No scans yet</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/">Start Scanning</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentScans.map((scan) => (
                        <Link
                          key={scan.id}
                          to={`/report/${scan.id}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground truncate">{scan.url}</p>
                            <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {new Date(scan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs font-mono font-medium ${riskColor[scan.overall_risk] || "text-muted-foreground"}`}>
                            {scan.overall_risk}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Overview;
