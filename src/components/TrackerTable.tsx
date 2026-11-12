import type { TrackerInfo } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { CategoryBadge } from "./CategoryBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Unlock } from "lucide-react";

interface TrackerTableProps {
  trackers: TrackerInfo[];
  onSelect: (tracker: TrackerInfo) => void;
}

export function TrackerTable({ trackers, onSelect }: TrackerTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Detected Trackers</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs font-mono text-muted-foreground">Name</TableHead>
            <TableHead className="text-xs font-mono text-muted-foreground">Domain</TableHead>
            <TableHead className="text-xs font-mono text-muted-foreground">Category</TableHead>
            <TableHead className="text-xs font-mono text-muted-foreground">Risk</TableHead>
            <TableHead className="text-xs font-mono text-muted-foreground">Expiry</TableHead>
            <TableHead className="text-xs font-mono text-muted-foreground text-center">Secure</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trackers.length === 0 ? (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell colSpan={6} className="text-center text-xs font-mono text-muted-foreground py-8">
                No trackers detected in this scan
              </TableCell>
            </TableRow>
          ) : (
            trackers.map((tracker) => (
              <TableRow
                key={tracker.id}
                className="border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => onSelect(tracker)}
              >
                <TableCell className="font-mono text-sm text-foreground">{tracker.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{tracker.domain}</TableCell>
                <TableCell><CategoryBadge category={tracker.category} /></TableCell>
                <TableCell><RiskBadge level={tracker.riskLevel} /></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{tracker.expiry}</TableCell>
                <TableCell className="text-center">
                  {tracker.secure ? (
                    <Lock className="h-3.5 w-3.5 text-success mx-auto" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-destructive mx-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
