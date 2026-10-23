"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Building2, Calendar, LineChart, PhoneCall, Search, Wrench } from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: BarChart3 },
  { href: "/locations", label: "Locations", icon: Building2 },
  { href: "/digital", label: "Digital", icon: LineChart },
  { href: "/calls", label: "Calls", icon: PhoneCall },
  { href: "/seo", label: "SEO", icon: Search },
  { href: "/budgets", label: "Budgets", icon: Calendar },
  { href: "/tools", label: "Tools", icon: Wrench },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1 border-b px-6 py-2">
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
