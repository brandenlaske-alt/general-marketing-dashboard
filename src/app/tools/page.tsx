import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/utm-builder",
    title: "UTM Builder",
    description: "Generate a properly-tagged destination URL for a QR code or campaign — pastes directly into your ad platform or print asset.",
    meta: "URL builder",
  },
  {
    href: "/tools/catchment-map",
    title: "Catchment Map",
    description: "Pick a location and see the top ZIP codes within its catchment area, sized by lead volume. Great for prospecting + direct-mail targeting.",
    meta: "Geo analytics",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground">
          Utilities for building campaign links, snippets, and other marketing artifacts.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {TOOLS.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group flex flex-col justify-between rounded-md border bg-card p-5 transition-colors hover:border-primary/60 hover:bg-muted/10"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{e.meta}</div>
              <div className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">{e.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.18em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
