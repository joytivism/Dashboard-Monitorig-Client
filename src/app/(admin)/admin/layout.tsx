'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, TrendingUp, Activity, Settings2, Search, ArrowLeft
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { id: '/admin', label: 'All', icon: Users },
    { id: '/admin/performance', label: 'Performance', icon: TrendingUp },
    { id: '/admin/activities', label: 'Activities', icon: Activity },
    { id: '/admin/settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#E8EFF6' }}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
          
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-10">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <span className="text-white text-[14px] font-black">RA</span>
              </div>
              <span className="text-[17px] font-extrabold text-gray-900 tracking-tight">Command Center</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {menu.map(item => {
                const active = pathname === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.id)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                      active 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Search + Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-2xl px-4 h-10 w-[240px] border border-gray-100">
              <Search className="w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-300 outline-none flex-1"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-[12px] font-black shadow-lg">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <div className="max-w-[1440px] mx-auto px-8 pb-8">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-[13px] font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Client View
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[92%] bg-white/95 backdrop-blur-xl border border-black/[0.04] rounded-[20px] p-2 shadow-2xl shadow-black/10 flex justify-around items-center">
        {menu.map(item => {
          const active = pathname === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => router.push(item.id)}
              className={`p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${active ? 'text-emerald-600' : 'text-gray-300'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-extrabold uppercase tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
