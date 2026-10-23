"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import type { ChannelPerformance } from "@/lib/types";
import { DeltaPill } from "./delta-pill";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

const COLORS = ["#2563eb", "#1877f2", "#ef4444", "#8b5cf6", "#06b6d4", "#f59e0b"];

export function PpcBreakdown({ channels }: { channels: ChannelPerformance[] }) {
  const chartData = channels.map((c) => ({ name: c.channel, spend: c.spend, leads: c.leads }));

  return (
    <div className="space-y-6">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }}
              formatter={(v: number, name) => (name === "spend" ? [formatCurrency(v), "Spend"] : [formatNumber(v), "Leads"])}
            />
            <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/5">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-medium">Channel</th>
              <th className="px-4 py-2 text-right font-medium">Spend</th>
              <th className="px-4 py-2 text-right font-medium">Impressions</th>
              <th className="px-4 py-2 text-right font-medium">Clicks</th>
              <th className="px-4 py-2 text-right font-medium">CTR</th>
              <th className="px-4 py-2 text-right font-medium">Leads</th>
              <th className="px-4 py-2 text-right font-medium">CPL</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c, i) => {
              const cpl = c.leads ? c.spend / c.leads : 0;
              const cplPrev = c.leadsPrev ? c.spendPrev / c.leadsPrev : 0;
              const ctr = c.impressions ? c.clicks / c.impressions : 0;
              return (
                <tr key={c.channel} className="border-t">
                  <td className="px-4 py-2 font-medium">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: COLORS[i % COLORS.length] }} />
                    {c.channel}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div>{formatCurrency(c.spend)}</div>
                    <DeltaPill current={c.spend} previous={c.spendPrev} invert className="mt-0.5" />
                  </td>
                  <td className="px-4 py-2 text-right">{formatNumber(c.impressions)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(c.clicks)}</td>
                  <td className="px-4 py-2 text-right">{formatPercent(ctr, 2)}</td>
                  <td className="px-4 py-2 text-right">
                    <div>{formatNumber(c.leads)}</div>
                    <DeltaPill current={c.leads} previous={c.leadsPrev} className="mt-0.5" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div>{formatCurrency(cpl)}</div>
                    <DeltaPill current={cpl} previous={cplPrev} invert className="mt-0.5" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
