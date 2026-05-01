'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Settings, Hexagon, ChevronRight } from 'lucide-react';
import { clientWorst } from '@/lib/utils';
import { useDashboardData } from './DataProvider';

const STATUS_COLOR: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS } = useDashboardData();
  const currentPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <aside className="fixed left-0 top-0 h-screen w-[248px] bg-white flex flex-col z-40"
      style={{ borderRight: '1px solid #E5E7EB', boxShadow: '2px 0 16px -4px rgba(0,0,0,0.06)' }}>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border-main shrink-0">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm shrink-0">
          <Hexagon className="w-5 h-5 text-white fill-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-text leading-tight">Real Advertise</div>
          <div className="text-[10px] font-semibold text-text3 uppercase tracking-widest">Command Center</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col gap-5 px-3">

        {/* Main Menu */}
        <div>
          <div className="text-[9px] font-black text-text4 uppercase tracking-[0.12em] mb-2 px-2">Menu</div>
          <div className="flex flex-col gap-0.5">
            <Link
              href={`/${queryString}`}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isHome ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">Dashboard</span>
              {!isHome && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
            </Link>
            <Link
              href="/admin"
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isAdmin ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">Admin Hub</span>
              {!isAdmin && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
            </Link>
          </div>
        </div>

        {/* Clients Section */}
        <div className="flex-1">
          <div className="text-[9px] font-black text-text4 uppercase tracking-[0.12em] mb-2 px-2">Klien Aktif</div>
          <div className="flex flex-col gap-0.5">
            {CLIENTS.map((cl) => {
              const isActive = pathname === `/client/${cl.key}`;
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, currentPeriod);
              const dotColor = STATUS_COLOR[wc] || STATUS_COLOR.nn;
              return (
                <Link
                  key={cl.key}
                  href={`/client/${cl.key}${queryString}`}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-colors duration-200 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface3 text-text2'
                  }`}>
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 truncate">{cl.key}</span>
                  {/* Status dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-colors"
                    style={{ background: isActive ? 'rgba(255,255,255,0.7)' : dotColor }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-4 border-t border-border-main shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-accent text-[10px] font-black">RA</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-text leading-tight truncate">Real Advertise</div>
            <div className="text-[10px] text-text3">Admin Dashboard</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={
      <aside className="fixed left-0 top-0 h-screen w-[248px] bg-white border-r border-border-main z-40" />
    }>
      <SidebarContent />
    </Suspense>
  );
}
