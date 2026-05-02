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
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-border-main flex items-center justify-between px-8 sticky top-0 z-50">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="text-text4">Admin CC</span>
        <ChevronRight className="w-3.5 h-3.5 text-text4" />
        <span className="text-text font-bold">{currentItem?.label || 'Dashboard'}</span>
      </div>

      {/* ── Top Actions ── */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
           <input 
             type="text" 
             placeholder="Search anything..." 
             className="w-64 h-10 pl-10 pr-4 rounded-xl bg-surface2 border border-border-main text-[13px] font-medium focus:outline-none focus:border-accent transition-all"
           />
        </div>

        <div className="flex items-center gap-2">
           <button className="w-10 h-10 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
           </button>
           <div className="h-6 w-px bg-border-main mx-2" />
           <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                 <div className="text-xs font-bold text-text">Joytivism Admin</div>
                 <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Superuser</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-text flex items-center justify-center text-white text-xs font-bold shadow-sm">
                 JD
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
