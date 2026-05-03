'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Calendar, User, ChevronDown, X, ArrowRight } from 'lucide-react';
import { useDashboardData } from './DataProvider';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, PERIODS, PL } = useDashboardData();
  const currentPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredClients = query.trim()
    ? CLIENTS.filter(c => c.key.toLowerCase().includes(query.toLowerCase()))
    : CLIENTS;

  /* ⌘K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(v => !v); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) { setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 80); }
    else setQuery('');
  }, [searchOpen]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const navigateToClient = useCallback((key: string) => {
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.push(`/client/${encodeURIComponent(key)}${qs}`);
    setSearchOpen(false);
  }, [router, searchParams]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filteredClients.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filteredClients[activeIdx]) navigateToClient(filteredClients[activeIdx].key);
  };

  return (
    <>
      <header className="h-[68px] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border-main"
      >

        {/* Search trigger */}
        <div className="flex-1 flex justify-center max-w-lg mx-auto">
          <button
            id="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 h-10 px-4 bg-white rounded-xl border border-border-main text-sm text-text3 font-medium hover:border-accent/40 hover:shadow-sm transition-all w-full max-w-sm"
          >
            <Search className="w-4 h-4 text-text4 shrink-0" />
            <span className="flex-1 text-left text-text4">Cari klien...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-text4 font-mono">
              <span className="bg-surface3 px-1.5 py-0.5 rounded text-[9px]">⌘K</span>
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Period picker */}
          <div className="relative flex items-center bg-white rounded-xl border border-border-main h-10 px-1 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-text4 ml-2.5 pointer-events-none shrink-0" />
            <select
              value={currentPeriod}
              onChange={handlePeriodChange}
              className="pl-2 pr-7 py-1 text-sm font-semibold text-text bg-transparent border-none focus:ring-0 cursor-pointer appearance-none outline-none"
            >
              {PERIODS.map(p => <option key={p} value={p}>{PL[p] || p}</option>)}
            </select>
            <ChevronDown className="w-3 h-3 text-text4 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block text-right">
              <div className="type-overline !text-text leading-none mb-1">Real Advertise</div>
              <div className="type-overline !text-[10px] leading-none">Admin</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Command Palette ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 transition-opacity" />
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 h-14 border-b border-border-main">
              <Search className="w-4 h-4 text-text3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari nama klien..."
                className="flex-1 text-sm font-medium text-text bg-transparent border-none outline-none placeholder:text-text4"
              />
              <button onClick={() => setSearchOpen(false)} className="p-1.5 hover:bg-surface2 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-text3" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[340px] overflow-y-auto py-1.5">
              {filteredClients.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-text3">Klien tidak ditemukan.</div>
              ) : filteredClients.map((cl, idx) => (
                <button
                  key={cl.key}
                  onClick={() => navigateToClient(cl.key)}
                  className={`w-full flex items-center gap-3 px-5 py-3 transition-colors text-left group ${
                    idx === activeIdx ? 'bg-accent/5' : 'hover:bg-surface2'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-black shrink-0">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text truncate">{cl.key}</div>
                    <div className="text-xs text-text3 truncate">{cl.ind}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-text4 group-hover:text-accent transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border-main bg-surface2/60">
              <span className="text-[10px] text-text3">
                <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[9px] mr-1">↑↓</kbd>navigasi
              </span>
              <span className="text-[10px] text-text3">
                <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[9px] mr-1">↵</kbd>buka
              </span>
              <span className="text-[10px] text-text3">
                <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[9px] mr-1">Esc</kbd>tutup
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
    <React.Suspense fallback={<header className="h-[68px] sticky top-0 z-30 bg-bg border-b border-border-main" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
