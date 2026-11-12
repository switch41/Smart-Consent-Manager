import type { ScanResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function CSVExport({ result }: { result: ScanResult }) {
  const handleExport = () => {
    const headers = ["Tracker Name", "Domain", "Category", "Risk Level", "Confidence", "Expiry", "Secure", "SameSite", "Explanation", "Website URL", "Scan Timestamp"];
    const rows = result.trackers.map(t => [
      t.name, t.domain, t.category, t.riskLevel,
      Math.round((t.confidence ?? 0) * 100) + "%",
      t.expiry, t.secure ? "Yes" : "No", t.sameSite,
      `"${(t.explanation || "").replace(/"/g, '""')}"`,
      result.url, result.timestamp,
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consent-scan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
