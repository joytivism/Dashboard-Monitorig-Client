import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { DataProvider } from "@/components/DataProvider";
import { getDashboardData } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
      className={`${inter.variable} antialiased`}
    >
      <body className="bg-bg text-text min-h-screen flex">
        <DataProvider value={dashboardData}>
          <Sidebar />
          <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-8 pt-4">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
