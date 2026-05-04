import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/components/DataProvider";
import { getDashboardData } from "@/lib/fetch";

export const metadata: Metadata = {
  title: "Real Advertise — Command Center",
  description: "Dashboard Monitoring Client",
};

export const revalidate = 0; // Dynamic rendering for live data

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dashboardData = await getDashboardData();

  return (
    <html
      lang="id"
    >
      <body className="min-h-screen bg-bg text-text">
        <DataProvider value={dashboardData}>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
