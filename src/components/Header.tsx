'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Calendar, User, ChevronDown, X } from 'lucide-react';
import { useDashboardData } from './DataProvider';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, PERIODS, PL } = useDashboardData();
  const currentPeriod = searchParams.get('period') || '2026-03';

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredClients = query.trim()
    ? CLIENTS.filter(c => c.key.toLowerCase().includes(query.toLowerCase()))
    : CLIENTS;

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  const navigateToClient = useCallback((key: string) => {
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.push(`/client/${encodeURIComponent(key)}${qs}`);
    setSearchOpen(false);
  }, [router, searchParams]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', newPeriod);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <header className="h-16 px-8 flex items-center justify-between sticky top-0 z-30 bg-bg/80 backdrop-blur-md">
        {/* Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 h-10 px-4 bg-white rounded-xl text-sm text-text3 font-medium hover:bg-surface2 transition-all w-full max-w-sm shadow-sm"
        >
          <Search className="w-4 h-4 text-text3 shrink-0" />
          <span className="flex-1 text-left">Cari klien...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-text3 font-mono">
            <span className="bg-surface2 px-1.5 py-0.5 rounded text-[10px]">⌘K</span>
          </kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Period Picker */}
          <div className="relative flex items-center bg-white rounded-xl shadow-sm h-10 px-1">
            <div className="absolute left-3 text-text3 pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <select 
              value={currentPeriod}
              onChange={handlePeriodChange}
              className="pl-9 pr-8 py-2 text-sm font-bold text-text bg-transparent border-none focus:ring-0 cursor-pointer appearance-none outline-none"
            >
              {PERIODS.map(p => (
                <option key={p} value={p}>{PL[p]}</option>
              ))}
            </select>
            <div className="absolute right-3 text-text3 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 bg-white pl-1.5 pr-4 py-1.5 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-text leading-tight">Real Advertise</div>
              <div className="text-[10px] font-medium text-text3">Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 h-14 border-b border-border-main">
              <Search className="w-5 h-5 text-text3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ketik nama klien..."
                className="flex-1 text-sm font-medium text-text bg-transparent border-none outline-none placeholder:text-text3"
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-surface2 rounded-lg transition-colors">
                <X className="w-4 h-4 text-text3" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto py-2">
              {filteredClients.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-text3">Klien tidak ditemukan.</div>
              ) : (
                filteredClients.map(cl => (
                  <button
                    key={cl.key}
                    onClick={() => navigateToClient(cl.key)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface2 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                      {cl.key.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text truncate">{cl.key}</div>
                    </div>
                    <span className="text-[11px] text-text3 font-medium shrink-0">→</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border-main bg-surface2/50">
              <span className="text-[10px] text-text3 font-medium">
                <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] mr-1">↑↓</kbd> navigasi
              </span>
              <span className="text-[10px] text-text3 font-medium">
                <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] mr-1">Esc</kbd> tutup
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <React.Suspense fallback={<header className="h-16 px-8 flex items-center justify-between sticky top-0 z-30 bg-bg" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
