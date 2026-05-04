'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Calendar, User, X, ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { useDashboardData } from './DataProvider';
import { useAppShell } from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { cn } from '@/lib/utils';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openMobileNav } = useAppShell();
  const { CLIENTS, PERIODS, PL } = useDashboardData();
  const currentPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setActiveIdx(0);
    setQuery('');
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setActiveIdx(0);
  };

  const filteredClients = query.trim()
    ? CLIENTS.filter((client) => client.key.toLowerCase().includes(query.toLowerCase()) || client.ind.toLowerCase().includes(query.toLowerCase()))
    : CLIENTS;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (event.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  const navigateToClient = (key: string) => {
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.push(`/client/${encodeURIComponent(key)}${qs}`);
    closeSearch();
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIdx((value) => Math.min(value + 1, filteredClients.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIdx((value) => Math.max(value - 1, 0));
    }
    if (event.key === 'Enter' && filteredClients[activeIdx]) {
      navigateToClient(filteredClients[activeIdx].key);
    }
  };

  const title = pathname === '/' ? 'Portfolio Overview' : pathname.startsWith('/client/') ? 'Client Portfolio' : 'Workspace';

  return (
    <>
      <TopBar
        title={title}
        breadcrumbs={['Client Workspace', pathname === '/' ? 'Overview' : 'Detail']}
        leading={(
          <button
            type="button"
            onClick={openMobileNav}
            className="btn-icon h-10 w-10 lg:hidden"
            aria-label="Buka navigasi"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        actions={(
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              id="global-search-trigger"
              onClick={openSearch}
              className="ds-toolbar-icon-button md:hidden"
            >
              <Search className="h-4 w-4 text-text4" />
            </button>

            <button
              onClick={openSearch}
              className="ds-toolbar-control hidden min-w-[220px] justify-between md:inline-flex"
            >
              <Search className="h-4 w-4 text-text4" />
              <span className="flex-1 text-left">Cari klien atau industri...</span>
              <span className="rounded-[10px] border border-border-main bg-surface2 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-text4">Cmd K</span>
            </button>

            <label className="ds-toolbar-control relative min-w-[132px] pr-9 sm:min-w-[154px]">
              <Calendar className="h-4 w-4 text-text4" />
              <select
                value={currentPeriod}
                onChange={handlePeriodChange}
                className="w-full appearance-none border-none bg-transparent pr-4 text-sm font-medium text-text outline-none"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {PL[period] || period}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text4" />
            </label>

            <div className="ds-toolbar-avatar">
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-text">Real Advertise</div>
                <div className="text-[11px] text-text3">Workspace</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-text text-white">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      />

      {searchOpen ? (
        <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]" onClick={closeSearch}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="ds-overlay-panel relative w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border-main px-5 py-4">
              <Search className="h-4 w-4 text-text4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Cari nama klien atau industri..."
                className="flex-1 bg-transparent text-sm font-medium text-text outline-none placeholder:text-text4"
              />
              <button onClick={closeSearch} className="rounded-[12px] p-2 text-text3 transition-colors hover:bg-surface2 hover:text-text">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <button
                    key={client.key}
                    onClick={() => navigateToClient(client.key)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-transparent px-4 py-3 text-left transition-colors',
                      index === activeIdx ? 'border-accent/15 bg-accent-light' : 'hover:border-border-main hover:bg-surface2'
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-surface2 text-xs font-semibold text-text2">
                      {client.key.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text">{client.key}</div>
                      <div className="truncate text-xs text-text3">{client.ind}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text4" />
                  </button>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm text-text3">Klien tidak ditemukan.</div>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border-main bg-surface2 px-5 py-3 text-[11px] text-text3">
              <span><kbd className="rounded bg-white px-1.5 py-0.5">↑↓</kbd> navigasi</span>
              <span><kbd className="rounded bg-white px-1.5 py-0.5">↵</kbd> buka</span>
              <span><kbd className="rounded bg-white px-1.5 py-0.5">Esc</kbd> tutup</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function Header() {
  return (
    <React.Suspense fallback={<header className="sticky top-0 z-40 h-[var(--topbar-height)] border-b border-border-main bg-white" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
