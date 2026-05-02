'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Bell, Search, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin',          label: 'Admin Hub' },
  { href: '/admin/data',     label: 'Input Data' },
  { href: '/admin/activity', label: 'Activity Log' },
  { href: '/admin/clients',  label: 'Kelola Klien' },
  { href: '/admin/settings', label: 'Pengaturan' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const currentItem = NAV_ITEMS.find(item => 
    item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href))
  );

  return (
    <header 
      className="h-[60px] sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 border-b"
      style={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottomColor: 'rgba(229,231,235,0.6)'
      }}
    >
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-text3">Admin CC</span>
        <ChevronRight className="w-3 h-3 text-text4" />
        <span className="font-semibold text-text">{currentItem?.label || 'Dashboard'}</span>
      </div>

      {/* ── Top Actions ── */}
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text4" />
           <input 
             type="text" 
             placeholder="Search commands..." 
             className="w-56 h-9 pl-9 pr-4 rounded-xl bg-surface2 border border-border-main text-xs font-medium focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
           />
        </div>

        <div className="flex items-center gap-2">
           <button className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-colors relative">
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white" />
           </button>
           <div className="h-4 w-px bg-border-main mx-1" />
           <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right hidden sm:block">
                 <div className="text-xs font-bold text-text">Admin User</div>
                 <div className="text-[9px] font-black text-accent uppercase tracking-wider">Superuser</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black border border-border-main/50">
                 AD
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
