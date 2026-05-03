'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Settings, Hexagon, ChevronRight, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { clientWorst } from '@/lib/utils';
import { useDashboardData } from './DataProvider';

const STATUS_COLOR: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, CH_DEF } = useDashboardData();
  const currentPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <aside className="fixed left-0 top-0 h-screen w-[248px] bg-surface border-r border-border-main flex flex-col z-40 uppercase"
      style={{ boxShadow: '2px 0 16px -4px rgba(0,0,0,0.06)' }}>

      {/* ── Logo ── */}
      <div className="h-[60px] flex items-center gap-3 px-6 border-b border-border-main shrink-0 bg-white">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
          <Hexagon className="w-4.5 h-4.5 text-white fill-white" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-black text-text tracking-tight leading-none">Real Advertise</div>
          <div className="text-[9px] font-bold text-text3 tracking-wider mt-0.5">Command Center</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col gap-6 px-3">

        {/* Main Menu */}
        <div>
          <div className="text-[9px] font-black text-text4 tracking-[0.12em] mb-2 px-3">Main Menu</div>
          <div className="flex flex-col gap-0.5">
            <Link
              href={`/${queryString}`}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black transition-all duration-200 ${
                isHome ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${isHome ? 'text-white' : 'text-text4 group-hover:text-accent'}`} />
              <span className="flex-1 truncate tracking-wider">Dashboard</span>
              {isHome && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
            </Link>
            <Link
              href="/admin"
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black transition-all duration-200 ${
                isAdmin ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <Settings className={`w-4 h-4 shrink-0 ${isAdmin ? 'text-white' : 'text-text4 group-hover:text-accent'}`} />
              <span className="flex-1 truncate tracking-wider">Admin Hub</span>
              {isAdmin && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
            </Link>
          </div>
        </div>

        {/* Clients Section */}
        <div className="flex-1">
          <div className="text-[9px] font-black text-text4 tracking-[0.12em] mb-2 px-3">Active Clients</div>
          <div className="flex flex-col gap-0.5">
            {CLIENTS.map((cl) => {
              const isActive = pathname === `/client/${cl.key}`;
              const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, currentPeriod);
              const dotColor = STATUS_COLOR[wc] || STATUS_COLOR.nn;
              return (
                <Link
                  key={cl.key}
                  href={`/client/${cl.key}${queryString}`}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black transition-all duration-200 ${
                    isActive ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:bg-surface2 hover:text-text'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-200 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface3 text-text2 group-hover:bg-accent group-hover:text-white'
                  }`}>
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 truncate tracking-wider">{cl.name}</span>
                  {/* Status dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-all shadow-sm"
                    style={{ background: isActive ? 'rgba(255,255,255,0.8)' : dotColor }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-border-main bg-surface2/50 shrink-0">
        <div className="bg-white rounded-2xl p-4 border border-border-main shadow-sm mb-3">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black">
                 RA
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="text-[10px] font-black text-text truncate leading-none">Real Advertise</span>
                 <span className="text-[9px] font-bold text-text3 tracking-wider mt-1.5">Enterprise Hub</span>
              </div>
           </div>
        </div>
        
        <form action={logout}>
          <button 
            type="submit"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10px] font-black text-rr tracking-wider hover:bg-rr-bg transition-all group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </form>
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
