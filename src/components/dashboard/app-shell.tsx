import Link from "next/link";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary" aria-hidden />
            <span className="font-semibold tracking-tight">General Marketing</span>
            <span className="text-xs text-muted-foreground">Dashboard template</span>
          </Link>
          <div className="text-xs text-muted-foreground">v0.1 · demo data</div>
        </div>
        <AppNav />
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-xs text-muted-foreground">
        Starter template · all data shown is fictional.
      </footer>
    </div>
  );
}
