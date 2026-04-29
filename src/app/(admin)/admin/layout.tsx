'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { id: '/admin', label: 'All' },
    { id: '/admin/performance', label: 'Performance' },
    { id: '/admin/activities', label: 'Activities' },
    { id: '/admin/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('ra_admin_auth');
    window.location.reload();
  };

  return (
    <div className="min-h-screen" style={{ background: '#DAE5F0' }}>
      {/* Navbar - Bankio style */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.03]">
        <div className="max-w-[1400px] mx-auto px-8 h-[68px] flex items-center justify-between">
          
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-10">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-[11px] font-black">RA</span>
              </div>
              <span className="text-[16px] font-extrabold text-gray-900">Command Center</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {menu.map(item => {
                const active = pathname === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.id)}
                    className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 ${
                      active 
                        ? 'text-gray-900' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Search + Icons + Avatar */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-xl px-4 h-10 w-[220px] border border-gray-100">
              <Search className="w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent text-[13px] font-medium text-gray-700 placeholder:text-gray-300 outline-none flex-1"
              />
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-300 hover:text-gray-500">
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white text-[12px] font-black">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <div className="max-w-[1400px] mx-auto px-8 pb-10">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-[13px] font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Client View
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[92%] bg-white border border-black/[0.04] rounded-[20px] p-2 shadow-2xl shadow-black/10 flex justify-around items-center">
        {menu.map(item => {
          const active = pathname === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => router.push(item.id)}
              className={`px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${active ? 'text-gray-900 bg-gray-100' : 'text-gray-400'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
