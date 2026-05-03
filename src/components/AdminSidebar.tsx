'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Database, Activity, Users, LayoutDashboard, Settings2, Hexagon, LogOut, ChevronRight, ExternalLink, Zap
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface AdminSidebarProps {
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Admin Hub' },
  { href: '/admin/data',     icon: Database,        label: 'Input Data' },
  { href: '/admin/activity', icon: Activity,        label: 'Activity Log' },
  { href: '/admin/ai',       icon: Zap,             label: 'AI Monitoring' },
  { href: '/admin/clients',  icon: Users,           label: 'Kelola Klien' },
  { href: '/admin/settings', icon: Settings2,       label: 'Pengaturan' },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[248px] h-screen sticky top-0 bg-surface border-r border-border-main flex flex-col shrink-0 z-40" style={{ boxShadow: '2px 0 16px -4px rgba(0,0,0,0.06)' }}>
      {/* ── Logo Section ── */}
      <div className="h-[60px] px-6 flex items-center border-b border-border-main shrink-0 bg-white">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-all shrink-0">
            <Hexagon className="w-4.5 h-4.5 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-text tracking-tight uppercase leading-none">Real Advertise</div>
            <div className="text-[9px] font-bold text-text3 uppercase tracking-wider mt-0.5">Command Center</div>
          </div>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
        <div className="px-3 py-2 mb-1">
           <span className="text-[9px] font-black text-text4 uppercase tracking-[0.12em]">Main Navigation</span>
        </div>
        
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent text-white shadow-sm rounded-xl' 
                  : 'text-text2 hover:bg-surface2 hover:text-text rounded-xl'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-text4 group-hover:text-accent'}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="ml-auto w-3.5 h-3.5 text-white/40" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer / User Section ── */}
      <div className="p-4 border-t border-border-main bg-surface2/50">
        <div className="bg-white rounded-2xl p-4 border border-border-main shadow-sm mb-3">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black">
                 AD
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="text-xs font-bold text-text truncate leading-none">Admin User</span>
                 <span className="text-[10px] font-bold text-text3 uppercase tracking-wider mt-1.5">Superuser</span>
              </div>
           </div>
           
           <Link 
             href="/" 
             className="flex items-center justify-between w-full h-9 px-3 rounded-xl text-[10px] font-bold text-text2 hover:bg-surface2 hover:text-text transition-all border border-border-main/50 group"
           >
             <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3 text-text4 group-hover:text-accent transition-colors" />
                DASHBOARD
             </div>
             <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
           </Link>
        </div>

        <form action={logout}>
          <button 
            type="submit"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[10px] font-bold text-rr uppercase tracking-wider hover:bg-rr-bg transition-all group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
