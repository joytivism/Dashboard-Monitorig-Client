'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ORD, LM } from '@/lib/data';
import { totals, clientWorst, fRp, pct as getPct } from '@/lib/utils';
import { useDashboardData } from '@/components/DataProvider';
import {
  Users, DollarSign, TrendingUp, CreditCard,
  Search, ArrowUpRight, ArrowDownRight, AlertTriangle, Sparkles,
  ChevronRight, Activity, Calendar
} from 'lucide-react';

const STATUS_BG: Record<string, string> = {
  rr: 'bg-rr-bg text-rr-text border-rr-border',
  or: 'bg-or-bg text-or-text border-or-border',
  yy: 'bg-yy-bg text-yy-text border-yy-border',
  nn: 'bg-nn-bg text-nn-text border-nn-border',
  gg: 'bg-gg-bg text-gg-text border-gg-border',
  gd: 'bg-gd-bg text-gd-text border-gd-border',
};
const STATUS_DOT: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};

/* ── Metric card ── */
function MetricCard({
  title, value, icon: Icon, growth, lastMonth, highlight,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  growth: number | null;
  lastMonth: React.ReactNode;
  highlight?: 'up' | 'down' | false;
}) {
  const isUp = growth !== null && growth >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-border-main shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-semibold text-text3 uppercase tracking-wider">{title}</div>
        <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text3 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-bold text-text tracking-tight mb-1">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-text4">vs last: <span className="font-medium text-text3">{lastMonth}</span></div>
        {growth !== null && (
          <div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'bg-gg-bg text-gg-text' : 'bg-rr-bg text-rr-text'
          }`}>
            {isUp
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />
            }
            {Math.abs(growth).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, PL } = useDashboardData();
  const curPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const [search, setSearch] = useState('');

  let tRev = 0, tSp = 0, tOrd = 0, pRev = 0, pSp = 0;
  const prevIdx = PERIODS.indexOf(curPeriod) - 1;
  const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

  CLIENTS.forEach(cl => {
    const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
    const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
    tRev += t.rev; tSp += t.sp; tOrd += t.ord; pRev += tp.rev; pSp += tp.sp;
  });

  const aRoas   = tSp > 0 ? tRev / tSp : null;
  const paRoas  = pSp > 0 ? pRev / pSp : null;
  const revGrowth = getPct(tRev, pRev);

  const probs = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
  const wins  = CLIENTS.filter(cl => ['gg', 'gd'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));

  const sortedClients = [...CLIENTS]
    .filter(cl => !search || cl.key.toLowerCase().includes(search.toLowerCase()) || cl.ind.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, a.key, curPeriod)) - ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, b.key, curPeriod)));

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="space-y-7 animate-fade-in max-w-[1400px]">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-text3" />
            <span className="text-[10px] font-black text-text3 uppercase tracking-[0.14em]">Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Dashboard</h1>
          <p className="text-xs text-text3 mt-1">Ringkasan performa semua klien.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Calendar className="w-4 h-4 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-accent transition-colors" />
            <select
              value={curPeriod}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('period', e.target.value);
                router.push(`?${params.toString()}`);
              }}
              className="h-11 pl-10 pr-10 bg-white border border-border-main rounded-xl text-sm font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer shadow-sm min-w-[160px]"
            >
              {PERIODS.map(p => (
                <option key={p} value={p}>
                  {(() => {
                    const [y, m] = p.split('-');
                    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    return `${months[parseInt(m) - 1]} ${y}`;
                  })()}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Klien"
          value={CLIENTS.length}
          icon={Users}
          growth={null}
          lastMonth={CLIENTS.length}
        />
        <MetricCard
          title="Total Revenue"
          value={fRp(tRev)}
          icon={DollarSign}
          growth={revGrowth}
          lastMonth={fRp(pRev)}
        />
        <MetricCard
          title="Blended ROAS"
          value={aRoas ? aRoas.toFixed(2) + 'x' : '—'}
          icon={TrendingUp}
          growth={paRoas && aRoas ? ((aRoas - paRoas) / paRoas * 100) : null}
          lastMonth={paRoas ? paRoas.toFixed(2) + 'x' : '—'}
        />
        <MetricCard
          title="Total Ad Spend"
          value={fRp(tSp)}
          icon={CreditCard}
          growth={getPct(tSp, pSp)}
          lastMonth={fRp(pSp)}
        />
      </div>

      {/* ── Alert / Win banners ── */}
      {(probs.length > 0 || wins.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {probs.length > 0 && (
            <div className="bg-rr-bg border border-rr-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rr" />
                  <h2 className="text-sm font-bold text-rr-text">Attention Needed</h2>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 bg-rr/10 text-rr-text rounded-full">
                  {probs.length} klien
                </span>
              </div>
              <div className="space-y-2">
                {probs.map(cl => {
                  const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
                  const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                  const v  = getPct(t.rev, tp.rev);
                  return (
                    <button
                      key={cl.key}
                      onClick={() => router.push(`/client/${cl.key}${qs}`)}
                      className="w-full flex items-center justify-between bg-white/70 rounded-xl px-4 py-2.5 hover:bg-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-rr/10 flex items-center justify-center text-rr text-[10px] font-black">
                          {cl.key.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-rr-text">{cl.key}</div>
                          <div className="text-[10px] text-rr-text/60">{fRp(t.rev)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {v !== null && (
                          <span className="text-xs font-bold text-rr">
                            {v >= 0 ? '↑' : '↓'}{Math.abs(v).toFixed(1)}%
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-rr-text/40 group-hover:text-rr transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {wins.length > 0 && (
            <div className="bg-gg-bg border border-gg-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gg" />
                  <h2 className="text-sm font-bold text-gg-text">Growing Clients</h2>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 bg-gg/10 text-gg-text rounded-full">
                  {wins.length} klien
                </span>
              </div>
              <div className="space-y-2">
                {wins.map(cl => {
                  const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
                  const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                  const v  = getPct(t.rev, tp.rev);
                  return (
                    <button
                      key={cl.key}
                      onClick={() => router.push(`/client/${cl.key}${qs}`)}
                      className="w-full flex items-center justify-between bg-white/70 rounded-xl px-4 py-2.5 hover:bg-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gg/10 flex items-center justify-center text-gg text-[10px] font-black">
                          {cl.key.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-gg-text">{cl.key}</div>
                          <div className="text-[10px] text-gg-text/60">{fRp(t.rev)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {v !== null && (
                          <span className="text-xs font-bold text-gg">↑{Math.abs(v).toFixed(1)}%</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gg-text/40 group-hover:text-gg transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Client Table ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-border-main">
          <h2 className="text-sm font-bold text-text">Semua Klien</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari klien..."
              className="pl-9 pr-4 h-9 bg-surface2 border border-border-main rounded-xl text-xs font-medium w-48 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border-main bg-surface2/50">
                {['Klien', 'Industri', 'Status', 'Revenue', 'Spend', 'ROAS', 'CG'].map((h, i) => (
                  <th key={h} className={`py-3 text-[10px] font-black text-text4 uppercase tracking-wider ${i === 0 ? 'pl-6' : ''} ${i === 6 ? 'pr-6 text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface2">
              {sortedClients.map(cl => {
                const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
                const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
                return (
                  <tr
                    key={cl.key}
                    onClick={() => router.push(`/client/${cl.key}${qs}`)}
                    className="cursor-pointer hover:bg-surface2/70 transition-all duration-150 group"
                  >
                    <td className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-200">
                          {cl.key.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-text">{cl.key}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-sm text-text3">{cl.ind}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_BG[wc] || STATUS_BG.nn}`}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
                        {LM[wc]}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-sm font-semibold text-text">{fRp(t.rev)}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-sm text-text3">{fRp(t.sp)}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-sm font-medium text-text">{t.roas ? t.roas.toFixed(2) + 'x' : '—'}</span>
                    </td>
                    <td className="py-3.5 pr-6 text-right">
                      <span className="text-sm text-text3">{cl.cg}</span>
                    </td>
                  </tr>
                );
              })}
              {sortedClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-sm text-text3">
                    Tidak ada klien yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-text3 text-sm">Memuat data...</div>}>
      <OverviewContent />
    </React.Suspense>
  );
}
