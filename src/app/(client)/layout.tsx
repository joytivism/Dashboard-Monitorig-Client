import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 pt-4">
          {children}
        </main>
      </div>
    </>
  );
}
