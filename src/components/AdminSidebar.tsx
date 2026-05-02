'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Database, Activity, Users,
  Hexagon, LogOut, ChevronRight, ShieldCheck, Settings,
} from 'lucide-react';

const NAV = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Command Center', sub: 'Overview & statistik' },
  { href: '/admin/data',     icon: Database,        label: 'Input Data',     sub: 'Performa per channel' },
  { href: '/admin/activity', icon: Activity,        label: 'Activity Log',   sub: 'Promo & event' },
  { href: '/admin/clients',  icon: Users,           label: 'Klien',          sub: 'Manajemen klien' },
  { href: '/admin/settings', icon: Settings,        label: 'Settings',       sub: 'API & Konfigurasi AI' },
];

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[240px] bg-white flex flex-col z-40"
      style={{ borderRight: '1px solid #E5E7EB', boxShadow: '2px 0 16px -4px rgba(0,0,0,0.06)' }}
    >
      {/* ── Brand ── */}
      <div className="px-5 py-5 border-b border-border-main shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm shrink-0">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-text leading-tight">Real Advertise</div>
            <div className="text-[10px] font-semibold text-text3 uppercase tracking-widest">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col gap-1">
        <div className="text-[9px] font-black text-text4 uppercase tracking-[0.12em] mb-2 px-2">Menu</div>

        {NAV.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight truncate">{item.label}</div>
                <div className={`text-[10px] leading-tight mt-0.5 truncate ${isActive ? 'text-white/60' : 'text-text4'}`}>
                  {item.sub}
                </div>
              </div>
              {!isActive && (
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-border-main" />

        {/* Back to client dashboard */}
        <Link
          href="/"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-text2 hover:bg-surface2 hover:text-text transition-all duration-200"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold leading-tight">Dashboard</div>
            <div className="text-[10px] text-text4 leading-tight mt-0.5">Client view</div>
          </div>
          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
        </Link>
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-4 border-t border-border-main shrink-0 space-y-2">
        {/* Admin badge */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-text leading-tight">Real Advertise</div>
            <div className="text-[10px] text-text3 leading-tight">Admin aktif</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text3 hover:bg-rr-bg hover:text-rr-text transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-sm font-semibold">Keluar dari Admin</span>
        </button>
      </div>
    </aside>
  );
}
