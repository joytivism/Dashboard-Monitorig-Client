'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import { totals, clientWorst, fRp, pct as getPct } from '@/lib/utils';
import { 
  Users, DollarSign, TrendingUp, CreditCard,
  ChevronRight, Activity, Calendar 
} from 'lucide-react';

import MetricCard from '@/components/ui/MetricCard';
import ClientTable from '@/components/dashboard/ClientTable';
import StatusBanners from '@/components/dashboard/StatusBanners';

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, CH_DEF } = useDashboardData();
  const curPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cg: '', ind: '', pic: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'status', direction: 'asc' });

  const prevIdx = PERIODS.indexOf(curPeriod) - 1;
  const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

  // Metadata for filters
  const metadata = useMemo(() => ({
    industries: Array.from(new Set(CLIENTS.map(c => c.ind))).filter(i => i !== '—').sort(),
    pics: Array.from(new Set(CLIENTS.map(c => c.as))).filter(i => i !== '—').sort(),
    channelGroups: Array.from(new Set(CLIENTS.map(c => c.cg))).filter(i => i && i !== '—').sort()
  }), [CLIENTS]);

  // Global Metrics
  const { tRev, tSp, pRev, pSp } = useMemo(() => {
    let tr = 0, ts = 0, pr = 0, ps = 0;
    CLIENTS.forEach(cl => {
      const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
      const tp = totals(CH_DEF, CLIENTS, DATA, cl.key, prevPeriod);
      tr += t.rev; ts += t.sp; pr += tp.rev; ps += tp.sp;
    });
    return { tRev: tr, tSp: ts, pRev: pr, pSp: ps };
  }, [CLIENTS, DATA, curPeriod, prevPeriod, CH_DEF]);

  const aRoas = tSp > 0 ? tRev / tSp : null;
  const paRoas = pSp > 0 ? pRev / pSp : null;

  // Analysis Data for Banners
  const risks = useMemo(() => 
    CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod)))
      .map(cl => ({
        key: cl.key,
        rev: totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod).rev,
        growth: getPct(totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod).rev, totals(CH_DEF, CLIENTS, DATA, cl.key, prevPeriod).rev)
      })), [CLIENTS, DATA, PERIODS, curPeriod, prevPeriod, CH_DEF]);

  const topGrowth = useMemo(() => 
    CLIENTS.map(cl => {
      const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
      const tp = totals(CH_DEF, CLIENTS, DATA, cl.key, prevPeriod);
      return { key: cl.key, rev: t.rev, growth: getPct(t.rev, tp.rev) || 0 };
    }).filter(cl => cl.growth > 0).sort((a, b) => b.growth - a.growth).slice(0, 3), [CLIENTS, DATA, curPeriod, prevPeriod, CH_DEF]);

  const filteredClients = useMemo(() => {
    return [...CLIENTS].filter(cl => {
      const matchesSearch = !search || cl.key.toLowerCase().includes(search.toLowerCase()) || cl.ind.toLowerCase().includes(search.toLowerCase());
      const matchesInd = !filters.ind || cl.ind === filters.ind;
      const matchesPIC = !filters.pic || cl.as === filters.pic;
      const matchesCG = !filters.cg || cl.cg === filters.cg;
      return matchesSearch && matchesInd && matchesPIC && matchesCG;
    }).sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA: any, valB: any;
      if (key === 'status') {
        const ORD = ['rr', 'or', 'yy', 'nn', 'gg', 'gd'];
        valA = ORD.indexOf(clientWorst(CH_DEF, [a], DATA, PERIODS, a.key, curPeriod));
        valB = ORD.indexOf(clientWorst(CH_DEF, [b], DATA, PERIODS, b.key, curPeriod));
      } else if (key === 'rev' || key === 'sp' || key === 'roas') {
        const tA = totals(CH_DEF, CLIENTS, DATA, a.key, curPeriod);
        const tB = totals(CH_DEF, CLIENTS, DATA, b.key, curPeriod);
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
  }, [CLIENTS, search, filters, sortConfig, DATA, curPeriod, PERIODS]);

  const onClientClick = (key: string) => {
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.push(`/client/${key}${qs}`);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold text-text3 tracking-tight">Overview Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Performa Portofolio</h1>
          <p className="text-sm text-text3 mt-1.5 font-medium">Ringkasan performa seluruh klien aktif.</p>
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 text-text4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={curPeriod}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('period', e.target.value);
              router.push(`?${params.toString()}`);
            }}
            className="h-12 pl-11 pr-12 bg-white border border-border-main rounded-2xl text-sm font-bold text-text focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer shadow-sm min-w-[200px]"
          >
            {PERIODS.map(p => {
              const [y, m] = p.split('-');
              const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
              return <option key={p} value={p}>{months[parseInt(m) - 1]} {y}</option>;
            })}
          </select>
          <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text4 rotate-90" />
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Klien" value={CLIENTS.length} icon={Users} growth={null} subtext={`Aktif: ${CLIENTS.length}`} />
        <MetricCard title="Total Revenue" value={fRp(tRev)} icon={DollarSign} growth={getPct(tRev, pRev)} subtext={`Lalu: ${fRp(pRev)}`} />
        <MetricCard title="Blended ROAS" value={aRoas ? aRoas.toFixed(2) + 'x' : '—'} icon={TrendingUp} growth={paRoas && aRoas ? ((aRoas - paRoas) / paRoas * 100) : null} subtext={`Lalu: ${paRoas ? paRoas.toFixed(2) + 'x' : '—'}`} />
        <MetricCard title="Total Ad Spend" value={fRp(tSp)} icon={CreditCard} growth={getPct(tSp, pSp)} subtext={`Lalu: ${fRp(pSp)}`} />
      </div>

      {/* Risk & Opportunity Section */}
      <StatusBanners risks={risks} opportunities={topGrowth} onClientClick={onClientClick} />

      {/* Main Client Table */}
      <ClientTable 
        clients={filteredClients}
        data={DATA}
        periods={PERIODS}
        currentPeriod={curPeriod}
        onClientClick={onClientClick}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilter={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        sortConfig={sortConfig}
        onSort={(key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }))}
        metadata={metadata}
      />
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
