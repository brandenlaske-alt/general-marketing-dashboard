"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function CallsCategoryChart({ data }: { data: { category: string; count: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis
            dataKey="category"
            type="category"
            tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
            width={160}
          />
          <Tooltip
            contentStyle={{ border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }}
            formatter={(v: number) => [new Intl.NumberFormat("en-US").format(v), "Calls"]}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
