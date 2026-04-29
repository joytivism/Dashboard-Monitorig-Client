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
    <div className="flex-1 w-full min-h-screen flex flex-col bg-white">

      {/* ═══ NAVBAR ═══ */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="px-8 h-[72px] flex items-center justify-between">
          
          {/* Left: Logo + Pill Nav */}
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <span className="text-white text-[13px] font-black tracking-tight">RA</span>
              </div>
              <span className="text-[17px] font-extrabold text-[#111827] hidden sm:inline">Command Center</span>
            </Link>

            {/* Pill Navigation */}
            <nav className="hidden md:flex items-center bg-[#F3F4F6] rounded-full p-1">
              {menu.map(item => {
                const active = pathname === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.id)}
                    className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                      active 
                        ? 'bg-[#111827] text-white shadow-sm' 
                        : 'text-[#6B7280] hover:text-[#111827]'
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
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors text-[#9CA3AF]">
              <Bell className="w-[18px] h-[18px]" />
            </button>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors text-[#9CA3AF]" title="Logout">
              <LogOut className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white text-[12px] font-black">AD</span>
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-[13px] font-bold text-[#111827]">Real Advertise</div>
                <div className="text-[11px] font-medium text-[#9CA3AF]">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1 px-6 md:px-8 py-6">
        {children}
      </main>

      {/* ═══ FOOTER ═══ */}
      <div className="px-8 pb-8">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#6B7280] text-[13px] font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Client View
        </button>
      </div>

      {/* ═══ MOBILE NAV ═══ */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-white border border-[#F3F4F6] rounded-full p-1.5 shadow-xl shadow-black/5 flex items-center gap-1">
        {menu.map(item => {
          const active = pathname === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => router.push(item.id)}
              className={`px-4 py-2.5 rounded-full text-[11px] font-bold transition-all ${active ? 'bg-[#111827] text-white' : 'text-[#9CA3AF]'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
