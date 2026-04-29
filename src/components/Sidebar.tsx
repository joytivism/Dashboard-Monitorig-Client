'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Hexagon } from 'lucide-react';
import { clientWorst } from '@/lib/utils';
import { useDashboardData } from './DataProvider';

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS } = useDashboardData();
  const currentPeriod = searchParams.get('period') || '2026-03';
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white flex flex-col p-4 z-40 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.04)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0">
          <Hexagon className="w-5 h-5 fill-current" />
        </div>
        <div>
          <span className="text-base font-bold text-text leading-tight block">Real Advertise</span>
          <span className="text-[10px] font-medium text-text3 block tracking-wide uppercase">Command Center</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-text3 mb-3 px-3 uppercase tracking-wider">Menu</div>
          <div className="flex flex-col gap-1">
            <Link
              href={`/${queryString}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                pathname === '/' 
                  ? 'bg-accent text-white shadow-md shadow-accent/20' 
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href={`/admin${queryString}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                pathname === '/admin' 
                  ? 'bg-accent text-white shadow-md shadow-accent/20' 
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Data Management
            </Link>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-text3 mb-3 px-3 uppercase tracking-wider">Klien Pilot</div>
          <div className="flex flex-col gap-1">
            {CLIENTS.map((cl) => {
              const isActive = pathname === `/client/${cl.key}`;
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, currentPeriod);
              
              return (
                <Link
                  key={cl.key}
                  href={`/client/${cl.key}${queryString}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent text-white shadow-md shadow-accent/20' 
                      : 'text-text2 hover:bg-surface2 hover:text-text'
                  }`}
                >
                  <span className="truncate pr-2">{cl.key}</span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-white shadow-sm' : `bg-${wc}`}`}></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-border-main" />}>
      <SidebarContent />
    </Suspense>
  );
}
