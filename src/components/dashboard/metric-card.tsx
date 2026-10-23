import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeltaPill } from "./delta-pill";

export function MetricCard({
  label,
  value,
  previous,
  format = "number",
  invert = false,
}: {
  label: string;
  value: number;
  previous: number;
  format?: "number" | "currency" | "percent";
  invert?: boolean;
}) {
  const formatted =
    format === "currency"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
      : format === "percent"
      ? new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value)
      : new Intl.NumberFormat("en-US").format(Math.round(value));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold">{formatted}</div>
        <DeltaPill current={value} previous={previous} invert={invert} />
      </CardContent>
    </Card>
  );
}
