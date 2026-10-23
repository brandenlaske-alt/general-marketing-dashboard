"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FIELDS = [
  { key: "utm_source", label: "Source", placeholder: "google, meta, newsletter" },
  { key: "utm_medium", label: "Medium", placeholder: "cpc, email, qr" },
  { key: "utm_campaign", label: "Campaign", placeholder: "spring_launch_2026" },
  { key: "utm_term", label: "Term (optional)", placeholder: "brand_keyword" },
  { key: "utm_content", label: "Content (optional)", placeholder: "banner_v2" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function UtmBuilderForm() {
  const [url, setUrl] = useState("https://example.com/landing");
  const [vals, setVals] = useState<Record<FieldKey, string>>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      const u = new URL(url);
      Object.entries(vals).forEach(([k, v]) => {
        if (v.trim()) u.searchParams.set(k, v.trim());
      });
      return u.toString();
    } catch {
      return "";
    }
  }, [url, vals]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Destination URL
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://example.com/landing"
            />
          </label>
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</div>
              <input
                type="text"
                value={vals[f.key]}
                onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder={f.placeholder}
              />
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tagged URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[7rem] break-all rounded-md border bg-muted/10 p-3 font-mono text-xs">
            {output || <span className="text-muted-foreground">Enter a valid URL to see the tagged output.</span>}
          </div>
          <button
            onClick={() => {
              if (!output) return;
              navigator.clipboard.writeText(output).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            disabled={!output}
            className="mt-3 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
