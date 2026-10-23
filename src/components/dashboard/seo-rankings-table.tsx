import type { KeywordRanking } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

function intentVariant(intent: KeywordRanking["intent"]) {
  switch (intent) {
    case "Brand": return "success" as const;
    case "Local": return "default" as const;
    case "Commercial": return "warn" as const;
    case "Informational": return "muted" as const;
  }
}

export function SeoRankingsTable({ rankings }: { rankings: KeywordRanking[] }) {
  const sorted = [...rankings].sort((a, b) => a.position - b.position);
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/5">
          <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-medium">Keyword</th>
            <th className="px-4 py-2 font-medium">Intent</th>
            <th className="px-4 py-2 text-right font-medium">Position</th>
            <th className="px-4 py-2 text-right font-medium">Change</th>
            <th className="px-4 py-2 text-right font-medium">Volume / mo</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const delta = r.positionPrev - r.position; // positive = improved
            const Icon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
            return (
              <tr key={r.keyword} className="border-t transition-colors hover:bg-muted/5">
                <td className="px-4 py-2 font-medium">{r.keyword}</td>
                <td className="px-4 py-2">
                  <Badge variant={intentVariant(r.intent)}>{r.intent}</Badge>
                </td>
                <td className="px-4 py-2 text-right font-semibold">{r.position}</td>
                <td className="px-4 py-2 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                      delta > 0 && "bg-emerald-500/10 text-emerald-700",
                      delta < 0 && "bg-rose-500/10 text-rose-700",
                      delta === 0 && "bg-muted/10 text-muted-foreground",
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {Math.abs(delta)}
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-muted-foreground">{formatNumber(r.volume)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
