import type { TrackerInfo } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  Essential: "hsl(173, 80%, 50%)",
  Analytics: "hsl(260, 60%, 60%)",
  Marketing: "hsl(38, 92%, 50%)",
  Suspicious: "hsl(340, 75%, 55%)",
};

export function CategoryChart({ trackers }: { trackers: TrackerInfo[] }) {
  const data = Object.entries(
    trackers.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Category Distribution</h2>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center">
          <p className="text-xs font-mono text-muted-foreground text-center">
            No trackers detected in this scan
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(220, 18%, 10%)"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || "hsl(220, 14%, 30%)"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
