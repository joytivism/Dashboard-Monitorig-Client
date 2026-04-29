'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, TrendingUp, Activity, Settings2, Home, ChevronLeft
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { id: '/admin', label: 'Clients', icon: Users },
    { id: '/admin/performance', label: 'Performance', icon: TrendingUp },
    { id: '/admin/activities', label: 'Activities', icon: Activity },
    { id: '/admin/settings', label: 'System Settings', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-border-main sticky top-0 z-[50]">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 hover:bg-surface2 rounded-xl transition-colors text-text3"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-border-main" />
            <div>
              <h1 className="text-xl font-bold text-text">Command Center</h1>
              <p className="text-[10px] font-bold text-text3 uppercase tracking-widest">Administrator Hub</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {menu.map(item => {
              const active = pathname === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => router.push(item.id)}
                  className={`relative py-2 text-[13px] font-bold transition-all flex items-center gap-2 ${active ? 'text-accent' : 'text-text3 hover:text-text'}`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-accent' : 'text-text3/60'}`} />
                  {item.label}
                  {active && (
                    <div className="absolute -bottom-[22px] left-0 right-0 h-1 bg-accent rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.3)]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-text">Real Advertise</div>
                <div className="text-[10px] font-medium text-text3">Super Admin</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md shadow-accent/20">RA</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] bg-white/90 backdrop-blur-md border border-border-main rounded-[24px] p-2 shadow-2xl flex justify-around items-center">
        {menu.map(item => {
          const active = pathname === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => router.push(item.id)}
              className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-1 ${active ? 'text-accent' : 'text-text3'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
