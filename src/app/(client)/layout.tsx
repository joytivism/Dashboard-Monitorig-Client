import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 ml-[248px] flex flex-col min-h-screen bg-bg">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
