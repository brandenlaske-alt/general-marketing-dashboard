import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "muted" | "success" | "warn" | "danger";

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const map: Record<Variant, string> = {
    default: "bg-primary/10 text-primary border-primary/20",
    muted: "bg-muted/10 text-muted-foreground border-border",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        map[variant],
        className,
      )}
      {...props}
    />
  );
}
