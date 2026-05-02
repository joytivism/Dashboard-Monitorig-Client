'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ORD, LM } from '@/lib/data';
import { totals, clientWorst, fRp, pct as getPct } from '@/lib/utils';
import { useDashboardData } from '@/components/DataProvider';
import {
  Users, DollarSign, TrendingUp, CreditCard,
  Search, ArrowUpRight, ArrowDownRight, AlertTriangle, Sparkles,
  ChevronRight, Activity, Calendar, Filter, Zap
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

/* ── Sparkline component ── */
function Sparkline({ data, color }: { data: number[], color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 16;
  const padding = 2;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((v - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

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
  const [filterInd, setFilterInd] = useState('');
  const [filterPIC, setFilterPIC] = useState('');
  const [filterCG, setFilterCG] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'status', direction: 'asc' });

  const prevIdx = PERIODS.indexOf(curPeriod) - 1;
  const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

  const industries = useMemo(() => Array.from(new Set(CLIENTS.map(c => c.ind))).filter(i => i !== '—').sort(), [CLIENTS]);
  const pics = useMemo(() => Array.from(new Set(CLIENTS.map(c => c.as))).filter(i => i !== '—').sort(), [CLIENTS]);
  const channelGroups = useMemo(() => Array.from(new Set(CLIENTS.map(c => c.cg))).filter(i => i && i !== '—').sort(), [CLIENTS]);

  const { tRev, tSp, pRev, pSp } = useMemo(() => {
    let tr = 0, ts = 0, pr = 0, ps = 0;
    CLIENTS.forEach(cl => {
      const t = totals(CLIENTS, DATA, cl.key, curPeriod);
      const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
      tr += t.rev; ts += t.sp; pr += tp.rev; ps += tp.sp;
    });
    return { tRev: tr, tSp: ts, pRev: pr, pSp: ps };
  }, [CLIENTS, DATA, curPeriod, prevPeriod]);

  const aRoas   = tSp > 0 ? tRev / tSp : null;
  const paRoas  = pSp > 0 ? pRev / pSp : null;
  const revGrowth = getPct(tRev, pRev);

  // Analysis Data
  const probs = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
  
  const topGrowth = useMemo(() => {
    return CLIENTS
      .map(cl => {
        const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
        const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
        const g  = getPct(t.rev, tp.rev) || 0;
        return { ...cl, growth: g, rev: t.rev };
      })
      .filter(cl => cl.growth > 0)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 3);
  }, [CLIENTS, DATA, curPeriod, prevPeriod]);

  const sortedClients = useMemo(() => {
    return [...CLIENTS]
      .filter(cl => {
        const matchesSearch = !search || cl.key.toLowerCase().includes(search.toLowerCase()) || cl.ind.toLowerCase().includes(search.toLowerCase());
        const matchesInd = !filterInd || cl.ind === filterInd;
        const matchesPIC = !filterPIC || cl.as === filterPIC;
        const matchesCG = !filterCG || cl.cg === filterCG;
        return matchesSearch && matchesInd && matchesPIC && matchesCG;
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig;
        let valA: any, valB: any;

        if (key === 'status') {
          valA = ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, a.key, curPeriod));
          valB = ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, b.key, curPeriod));
        } else if (key === 'rev' || key === 'sp' || key === 'roas') {
          const tA = totals(CLIENTS, DATA, a.key, curPeriod);
          const tB = totals(CLIENTS, DATA, b.key, curPeriod);
          valA = tA[key as 'rev' | 'sp' | 'roas'] || 0;
          valB = tB[key as 'rev' | 'sp' | 'roas'] || 0;
        } else {
          valA = (a as any)[key] || '';
          valB = (b as any)[key] || '';
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [CLIENTS, search, filterInd, filterPIC, filterCG, sortConfig, DATA, curPeriod, PERIODS]);

  const toggleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

      {/* ── Top Banners: Risk vs Opportunity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Column */}
        <div className="bg-rr-bg border border-rr-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rr/10 flex items-center justify-center">
                 <AlertTriangle className="w-4 h-4 text-rr" />
              </div>
              <div>
                 <h2 className="text-sm font-bold text-rr-text">Attention Needed</h2>
                 <p className="text-[10px] text-rr-text/60 font-medium uppercase tracking-wider">High Risk Portfolio</p>
              </div>
            </div>
            {probs.length > 0 && (
              <span className="text-[10px] font-black px-2.5 py-1 bg-rr/10 text-rr-text rounded-lg border border-rr-border/40">
                {probs.length} KLIEN
              </span>
            )}
          </div>

          <div className="space-y-2">
            {probs.length > 0 ? (
              probs.slice(0, 3).map(cl => {
                const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
                const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                const v  = getPct(t.rev, tp.rev);
                return (
                  <button
                    key={cl.key}
                    onClick={() => router.push(`/client/${cl.key}${qs}`)}
                    className="w-full flex items-center justify-between bg-white/70 rounded-xl px-4 py-3 hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-rr-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rr/10 flex items-center justify-center text-rr text-[10px] font-black">
                        {cl.key.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-rr-text leading-none mb-1">{cl.key}</div>
                        <div className="text-[10px] text-rr-text/60 font-bold">{fRp(t.rev)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {v !== null && (
                        <span className="text-xs font-black text-rr flex items-center gap-0.5">
                          {v >= 0 ? '↑' : '↓'}{Math.abs(v).toFixed(1)}%
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-rr-text/20 group-hover:text-rr transition-colors" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center bg-white/40 rounded-xl border border-dashed border-rr-border/40">
                 <p className="text-[10px] font-black text-rr-text/40 uppercase tracking-widest">No critical alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Opportunity Column */}
        <div className="bg-gg-bg border border-gg-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gg/10 flex items-center justify-center">
                 <TrendingUp className="w-4 h-4 text-gg" />
              </div>
              <div>
                 <h2 className="text-sm font-bold text-gg-text">Top Growth Clients</h2>
                 <p className="text-[10px] text-gg-text/60 font-medium uppercase tracking-wider">Opportunity Wins</p>
              </div>
            </div>
            {topGrowth.length > 0 && (
              <span className="text-[10px] font-black px-2.5 py-1 bg-gg/10 text-gg-text rounded-lg border border-gg-border/40">
                TOP {topGrowth.length}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {topGrowth.length > 0 ? (
              topGrowth.map(cl => {
                return (
                  <button
                    key={cl.key}
                    onClick={() => router.push(`/client/${cl.key}${qs}`)}
                    className="w-full flex items-center justify-between bg-white/70 rounded-xl px-4 py-3 hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-gg-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gg/10 flex items-center justify-center text-gg text-[10px] font-black">
                        {cl.key.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-gg-text leading-none mb-1">{cl.key}</div>
                        <div className="text-[10px] text-gg-text/60 font-bold">{fRp(cl.rev)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-gg flex items-center gap-0.5">
                        ↑{cl.growth.toFixed(1)}%
                      </span>
                      <ChevronRight className="w-4 h-4 text-gg-text/20 group-hover:text-gg transition-colors" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center bg-white/40 rounded-xl border border-dashed border-gg-border/40">
                 <p className="text-[10px] font-black text-gg-text/40 uppercase tracking-widest">Seeking opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Client Table ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-6 py-5 border-b border-border-main bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-base font-bold text-text shrink-0">Semua Klien</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative group">
                <Search className="w-4 h-4 text-text4 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari klien..."
                  className="pl-9 pr-4 h-9 bg-surface2 border border-border-main rounded-xl text-xs font-semibold w-48 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                />
              </div>

              <div className="h-4 w-px bg-border-main hidden md:block mx-1" />

              {/* CG Filter */}
              <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text4 pointer-events-none">
                    <Filter className="w-3 h-3" />
                 </div>
                 <select
                  value={filterCG}
                  onChange={e => setFilterCG(e.target.value)}
                  className="h-9 pl-8 pr-8 bg-surface2 border border-border-main rounded-xl text-[11px] font-bold text-text3 focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-surface3 transition-all min-w-[110px]"
                >
                  <option value="">Semua CG</option>
                  {channelGroups.map((cg: string) => <option key={cg} value={cg}>{cg}</option>)}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4">
                   <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <select
                  value={filterInd}
                  onChange={e => setFilterInd(e.target.value)}
                  className="h-9 pl-4 pr-8 bg-surface2 border border-border-main rounded-xl text-[11px] font-bold text-text3 focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-surface3 transition-all min-w-[130px]"
                >
                  <option value="">Semua Industri</option>
                  {industries.map((ind: string) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4">
                   <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              {/* PIC Filter */}
              <div className="relative">
                <select
                  value={filterPIC}
                  onChange={e => setFilterPIC(e.target.value)}
                  className="h-9 pl-4 pr-8 bg-surface2 border border-border-main rounded-xl text-[11px] font-bold text-text3 focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-surface3 transition-all min-w-[110px]"
                >
                  <option value="">Semua PIC</option>
                  {pics.map((pic: string) => <option key={pic} value={pic}>{pic}</option>)}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4">
                   <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] font-black text-text4 uppercase tracking-widest bg-surface2 px-3 py-1.5 rounded-lg border border-border-main/50">
            Total {sortedClients.length} Klien
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border-main bg-surface2/30">
                {[
                  { label: 'Klien', key: 'key' },
                  { label: 'Industri', key: 'ind' },
                  { label: 'Status', key: 'status' },
                  { label: 'Revenue', key: 'rev' },
                  { label: 'Spend', key: 'sp' },
                  { label: 'ROAS', key: 'roas' },
                  { label: 'Channel', key: 'cg' }
                ].map((h, i) => (
                  <th 
                    key={h.key} 
                    onClick={() => toggleSort(h.key)}
                    className={`py-4 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-accent transition-colors ${i === 0 ? 'pl-6' : ''} ${i === 6 ? 'pr-6 text-right' : ''} ${sortConfig.key === h.key ? 'text-accent' : 'text-text4'}`}
                  >
                    <div className={`flex items-center gap-1.5 ${i === 6 ? 'justify-end' : 'justify-start'}`}>
                      {h.label}
                      {sortConfig.key === h.key && (
                        <span className="text-[8px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface2">
              {sortedClients.map((cl: any) => {
                const t  = totals(CLIENTS, DATA, cl.key, curPeriod);
                const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
                return (
                  <tr
                    key={cl.key}
                    onClick={() => router.push(`/client/${cl.key}${qs}`)}
                    className="cursor-pointer hover:bg-surface2/70 transition-all duration-150 group"
                  >
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-200">
                          {cl.key.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-text">{cl.key}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium text-text3 bg-surface2 px-2 py-1 rounded-md">{cl.ind}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_BG[wc] || STATUS_BG.nn}`}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
                        {LM[wc]}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-text">{fRp(t.rev)}</span>
                        <Sparkline 
                          data={PERIODS.map(p => totals(CLIENTS, DATA, cl.key, p).rev)} 
                          color={wc === 'rr' || wc === 'or' ? '#DC2626' : wc === 'gg' || wc === 'gd' ? '#059669' : '#9CA3AF'} 
                        />
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-text3">{fRp(t.sp)}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-text">{t.roas ? t.roas.toFixed(2) + 'x' : '—'}</span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-text2 bg-surface3 px-2.5 py-1 rounded-lg border border-border-main/50 uppercase tracking-tighter">
                         {cl.cg}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {sortedClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Filter className="w-8 h-8 text-text4 opacity-20" />
                       <p className="text-sm font-bold text-text4 uppercase tracking-widest">No clients found</p>
                    </div>
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
    <React.Suspense fallback={<div className="p-8 text-text3 text-sm font-medium">Memuat data dashboard...</div>}>
      <OverviewContent />
    </React.Suspense>
  );
}
