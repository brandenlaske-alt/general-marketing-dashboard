import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";

export function DeltaPill({
  current,
  previous,
  invert = false,
  className,
}: {
  current: number;
  previous: number;
  invert?: boolean;
  className?: string;
}) {
  if (!previous) return <span className={cn("text-xs text-muted-foreground", className)}>—</span>;
  const delta = (current - previous) / previous;
  const positive = delta > 0.005;
  const negative = delta < -0.005;
  const good = invert ? negative : positive;
  const bad = invert ? positive : negative;
  const Icon = positive ? ArrowUp : negative ? ArrowDown : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        good && "bg-emerald-500/10 text-emerald-700",
        bad && "bg-rose-500/10 text-rose-700",
        !good && !bad && "bg-muted/10 text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {formatPercent(Math.abs(delta))}
    </span>
  );
}
