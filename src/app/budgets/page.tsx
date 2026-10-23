import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { BUDGET_LINES } from "@/lib/mock-data";

export default function BudgetsPage() {
  const total = BUDGET_LINES.reduce((s, l) => s + l.monthlyBudget, 0);
  const spent = BUDGET_LINES.reduce((s, l) => s + l.mtdSpend, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
        <p className="text-sm text-muted-foreground">
          Month-to-date pacing by channel. Add real spend sources (ad platforms, invoicing) in <code>src/lib/</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pacing · {formatCurrency(spent)} of {formatCurrency(total)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {BUDGET_LINES.map((l) => {
            const pct = Math.min(1, l.mtdSpend / l.monthlyBudget);
            return (
              <div key={l.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{l.channel}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(l.mtdSpend)} / {formatCurrency(l.monthlyBudget)} · {formatPercent(pct)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted/15">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
