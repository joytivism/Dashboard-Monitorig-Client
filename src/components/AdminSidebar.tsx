'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Database, Activity, 
  Users, Settings, LogOut, Hexagon, 
  ChevronRight, ExternalLink, Shield
} from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
}

const NAV_ITEMS = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Admin Hub',    desc: 'Overview & Stats' },
  { href: '/admin/data',     icon: Database,        label: 'Input Data',   desc: 'Update Performa' },
  { href: '/admin/activity', icon: Activity,        label: 'Activity Log', desc: 'Catat Aktivitas' },
  { href: '/admin/clients',  icon: Users,           label: 'Kelola Klien', desc: 'Daftar Portfolio' },
  { href: '/admin/settings', icon: Settings,        label: 'Pengaturan',   desc: 'Sistem & AI' },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen sticky top-0 bg-white border-r border-border-main flex flex-col shrink-0 z-[60]">
      {/* ── Logo Section ── */}
      <div className="h-[72px] px-8 flex items-center border-b border-border-main bg-surface2/30">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-all">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-text tracking-tight uppercase leading-none">Real Advertise</span>
            <span className="text-[10px] font-bold text-accent tracking-widest mt-1">COMMAND CENTER</span>
          </div>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
        <div className="px-4 py-3 mb-2">
           <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">Menu Utama</span>
        </div>
        
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-text text-white shadow-md shadow-text/10' 
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <div className={`shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${
                isActive ? 'text-white' : 'text-text4 group-hover:text-accent'
              }`}>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{item.label}</span>
                {/* <span className={`text-[10px] truncate ${isActive ? 'text-white/60' : 'text-text4'}`}>{item.desc}</span> */}
              </div>
              {isActive && (
                <div className="ml-auto">
                   <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer / Profile ── */}
      <div className="p-4 border-t border-border-main bg-surface2/30">
        <div className="bg-white rounded-2xl p-4 border border-border-main shadow-sm mb-4">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-text3 border border-border-main">
                 <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="text-xs font-bold text-text truncate">Administrator</span>
                 <span className="text-[10px] font-medium text-text4 truncate">admin@finexy.com</span>
              </div>
           </div>
           
           <Link 
             href="/" 
             className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-bold text-text2 hover:bg-surface2 hover:text-accent transition-all border border-transparent hover:border-accent/10"
           >
             <ExternalLink className="w-3.5 h-3.5" />
             Lihat Dashboard Utama
           </Link>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-text3 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-4.5 h-4.5 text-text4 group-hover:text-red-500" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
