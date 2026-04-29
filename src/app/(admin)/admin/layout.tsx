'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, ArrowLeft, Home, FileText, BarChart3, Database, Plus } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { id: '/admin', label: 'Home', icon: Home },
    { id: '/admin/performance', label: 'Analytics', icon: BarChart3 },
    { id: '/admin/activities', label: 'Documents', icon: FileText },
    { id: '/admin/settings', label: 'Database', icon: Database },
  ];

  const handleLogout = () => {
    localStorage.removeItem('ra_admin_auth');
    window.location.reload();
  };

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-bg">

      {/* ═══ NAVBAR ═══ */}
      <header className="sticky top-0 z-[100] bg-white border-b border-border-main">
        <div className="px-8 h-[80px] flex items-center justify-between relative">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-text flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-[12px] font-black">A</span>
              </div>
              <span className="text-xl font-bold text-text tracking-tight uppercase tracking-[0.1em]">Admin</span>
            </Link>
          </div>

          {/* Center: Pill Navigation */}
          <nav className="hidden lg:flex items-center bg-white rounded-full p-1.5 border border-border-main shadow-sm absolute left-1/2 -translate-x-1/2">
            {menu.map(item => {
              const active = pathname === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 ${
                    active 
                      ? 'bg-text text-white shadow-lg' 
                      : 'text-text3 hover:text-text hover:bg-surface2'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Icons + User Profile */}
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white border border-border-main text-text3 hover:text-text transition-all">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rr rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-text flex items-center justify-center border-2 border-border-main hover:border-accent transition-all">
                <span className="text-white text-[12px] font-black">AD</span>
              </button>
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
