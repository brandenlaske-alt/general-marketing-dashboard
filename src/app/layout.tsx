import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/dashboard/app-shell";

export const metadata: Metadata = {
  title: "General Marketing Dashboard",
  description: "A starter template for a multi-location marketing performance dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
