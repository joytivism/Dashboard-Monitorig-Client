'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { id: '/admin', label: 'Dashboard' },
    { id: '/admin/performance', label: 'Performance' },
    { id: '/admin/activities', label: 'Activities' },
    { id: '/admin/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('ra_admin_auth');
    window.location.reload();
  };

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-bg">

      {/* ═══ NAVBAR ═══ */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-main">
        <div className="px-8 h-[72px] flex items-center justify-between">
          
          {/* Left: Logo + Pill Nav */}
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                <span className="text-white text-[13px] font-black tracking-tight">RA</span>
              </div>
              <span className="text-lg font-bold text-text hidden sm:inline">Command Center</span>
            </Link>

            {/* Pill Navigation */}
            <nav className="hidden md:flex items-center bg-surface2 rounded-full p-1 border border-border-main/50">
              {menu.map(item => {
                const active = pathname === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.id)}
                    className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                      active 
                        ? 'bg-text text-white shadow-sm' 
                        : 'text-text3 hover:text-text'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface2 transition-colors text-text3 hover:text-text">
              <Bell className="w-[18px] h-[18px]" />
            </button>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface2 transition-colors text-text3 hover:text-rr" title="Logout">
              <LogOut className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border-main">
              <div className="w-10 h-10 rounded-full bg-text flex items-center justify-center">
                <span className="text-white text-[12px] font-black">AD</span>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[13px] font-bold text-text leading-tight">Real Advertise</div>
                <div className="text-[11px] font-medium text-text3">System Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1 px-6 md:px-8 py-8">
        {children}
      </main>

      {/* ═══ FOOTER ═══ */}
      <div className="px-8 pb-8">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-text3 hover:text-text2 text-[13px] font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Client View
        </button>
      </div>

      {/* ═══ MOBILE NAV ═══ */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-surface border border-border-main rounded-full p-1.5 shadow-main flex items-center gap-1">
        {menu.map(item => {
          const active = pathname === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => router.push(item.id)}
              className={`px-4 py-2.5 rounded-full text-[11px] font-bold transition-all ${active ? 'bg-text text-white' : 'text-text3'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
