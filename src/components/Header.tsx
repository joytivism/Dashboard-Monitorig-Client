'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Calendar, User, ChevronDown } from 'lucide-react';
import { useDashboardData } from './DataProvider';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { PERIODS, PL } = useDashboardData();
  const currentPeriod = searchParams.get('period') || '2026-03';

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', newPeriod);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 bg-bg">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-text3 absolute left-4" />
          <input 
            type="text" 
            placeholder="Cari klien atau campaign..." 
            className="w-full h-11 pl-11 pr-12 bg-surface2 border-none rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-border-main transition-all placeholder:text-text3"
          />
          <div className="absolute right-4 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-text3 font-mono font-medium">
              <span className="bg-surface border border-border-main px-1.5 py-0.5 rounded shadow-sm">⌘</span>
              <span className="bg-surface border border-border-main px-1.5 py-0.5 rounded shadow-sm">K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6 ml-4">
        {/* Period Picker */}
        <div className="relative flex items-center bg-white rounded-full border border-border-main shadow-sm p-1">
          <div className="absolute left-3 text-text3 pointer-events-none">
            <Calendar className="w-4 h-4" />
          </div>
          <select 
            value={currentPeriod}
            onChange={handlePeriodChange}
            className="pl-9 pr-8 py-1.5 text-sm font-bold text-text bg-transparent border-none focus:ring-0 cursor-pointer appearance-none outline-none"
          >
            {PERIODS.map(p => (
              <option key={p} value={p}>{PL[p]}</option>
            ))}
          </select>
          <div className="absolute right-3 text-text3 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Profile */}
        <button className="flex items-center gap-3 bg-white border border-border-main p-1.5 pr-4 rounded-full hover:bg-surface2 transition-colors shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden text-accent">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-text leading-tight">Real Advertise</div>
            <div className="text-[10px] font-medium text-text3">Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-text3 ml-1" />
        </button>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <React.Suspense fallback={<header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 bg-bg" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
