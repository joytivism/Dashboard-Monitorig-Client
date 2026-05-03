import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AppShell from "@/components/layout/AppShell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      variant="client"
      sidebar={<Sidebar />}
      topbar={<Header />}
      contentClassName="pb-20"
    >
      {children}
    </AppShell>
  );
}
