import type { Trend } from "@/lib/types";
import { fmtPct } from "@/lib/bn";

export default function ChangeBadge({ trend, change }: { trend: Trend; change: number }) {
  const cls = trend === "up" ? "bg-success/10 text-success" : trend === "down" ? "bg-error/10 text-error" : "bg-base-300 text-base-content/60";
  const sym = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      <span>{sym}</span>
      <span>{fmtPct(trend === "flat" ? 0 : change)}%</span>
    </span>
  );
}
