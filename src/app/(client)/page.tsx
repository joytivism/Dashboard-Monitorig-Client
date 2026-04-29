'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ORD, LM } from '@/lib/data';
import { totals, clientWorst, fRp, pct as getPct } from '@/lib/utils';
import { useDashboardData } from '@/components/DataProvider';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Search,
  ListFilter,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, PL } = useDashboardData();
  const curPeriod = searchParams.get('period') || '2026-03';

  let tRev = 0, tSp = 0, tOrd = 0, pRev = 0, pSp = 0;
  CLIENTS.forEach(cl => {
    const t = totals(CLIENTS, DATA, cl.key, curPeriod);
    const tp = totals(CLIENTS, DATA, cl.key, (PERIODS.indexOf(curPeriod) > 0 ? PERIODS[PERIODS.indexOf(curPeriod) - 1] : ''));
    tRev += t.rev; tSp += t.sp; tOrd += t.ord; pRev += tp.rev; pSp += tp.sp;
  });

  const aRoas = tSp > 0 ? tRev / tSp : null;
  const prevPeriod = PERIODS.indexOf(curPeriod) > 0 ? PERIODS[PERIODS.indexOf(curPeriod) - 1] : '';
  const paRoas = pSp > 0 ? pRev / pSp : null;

  const probs = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
  const wins = CLIENTS.filter(cl => ['gg', 'gd'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));

  const sortedClients = [...CLIENTS].sort((a, b) => {
    return ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, a.key, curPeriod)) - ORD.indexOf(clientWorst(CLIENTS, DATA, PERIODS, b.key, curPeriod));
  });

  const revGrowth = getPct(tRev, pRev);

  const MetricCard = ({ title, value, icon: Icon, growth, lastMonth, growthSuffix = '%', color = 'accent' }: any) => {
    const colorClasses: Record<string, string> = {
      accent: 'bg-accent-light text-accent',
      green: 'bg-gg-bg text-gg',
      blue: 'bg-tofu-bg text-tofu',
      red: 'bg-rr-bg text-rr',
      yellow: 'bg-mofu-bg text-mofu',
    };
    return (
    <div className="bg-white rounded-[24px] p-6 shadow-main">
      <div className="flex justify-between items-start mb-6">
        <div className="text-[13px] font-semibold text-text2 uppercase tracking-wide">{title}</div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-bold text-text tracking-tight">{value}</div>
        {growth !== null && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${growth >= 0 ? 'bg-gd-bg text-gd-text border border-gd-border shadow-sm' : 'bg-rr-bg text-rr-text border border-rr-border shadow-sm'}`}>
            {growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(growth).toFixed(1)}{growthSuffix}
          </div>
        )}
      </div>
      <div className="text-[12px] font-medium text-text3">
        Bulan lalu: <span className="text-text2">{lastMonth}</span>
      </div>
    </div>
    );
  };

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-text">Overview</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Klien" 
          value={CLIENTS.length} 
          icon={Users} 
          growth={null} 
          lastMonth={CLIENTS.length} 
          color="accent"
        />
        <MetricCard 
          title="Total Revenue" 
          value={fRp(tRev)} 
          icon={DollarSign} 
          growth={revGrowth} 
          lastMonth={fRp(pRev)} 
          color="green"
        />
        <MetricCard 
          title="Blended ROAS" 
          value={aRoas ? aRoas.toFixed(2) + 'x' : '—'} 
          icon={TrendingUp} 
          growth={paRoas && aRoas ? ((aRoas - paRoas) / paRoas * 100) : null} 
          lastMonth={paRoas ? paRoas.toFixed(2) + 'x' : '—'} 
          color="red"
        />
        <MetricCard 
          title="Total Spend" 
          value={fRp(tSp)} 
          icon={CreditCard} 
          growth={getPct(tSp, pSp)} 
          lastMonth={fRp(pSp)} 
          color="blue"
        />
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {probs.length > 0 && (
          <div className="bg-white rounded-[24px] p-8 shadow-main">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rr" />
                Attention Needed
              </h2>
              <div className="px-3 py-1 rounded-full border border-border-main text-xs font-medium text-text2">
                {probs.length} Clients
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {probs.map(cl => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                const v = getPct(t.rev, tp.rev);
                return (
                  <div key={cl.key} className="flex justify-between items-end border-b border-border-main pb-3 last:border-0">
                    <div>
                      <div className="font-bold text-sm text-text">{cl.key}</div>
                      <div className="text-xs text-text3 mt-1">Rev: {fRp(t.rev)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-rr">{v !== null ? (v >= 0 ? '+' : '') + Math.round(v) + '%' : '—'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {wins.length > 0 && (
          <div className="bg-white rounded-[24px] p-8 shadow-main">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Growing Clients
              </h2>
              <div className="px-3 py-1 rounded-full border border-border-main text-xs font-medium text-text2">
                {wins.length} Clients
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {wins.map(cl => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                const v = getPct(t.rev, tp.rev);
                return (
                  <div key={cl.key} className="flex justify-between items-end border-b border-border-main pb-3 last:border-0">
                    <div>
                      <div className="font-bold text-sm text-text">{cl.key}</div>
                      <div className="text-xs text-text3 mt-1">Rev: {fRp(t.rev)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-green-500">+{Math.round(v || 0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] p-8 shadow-main">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-text">Daftar Klien Pilot</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-text3 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-9 pr-4 py-2 bg-white border border-border-main rounded-full text-sm w-48 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-surface2 transition-colors">
              <ListFilter className="w-4 h-4" />
              Sort by
              <svg className="w-4 h-4 text-text3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-xs font-semibold text-text3 uppercase tracking-wider border-b border-border-main">
                <th className="pb-4 pl-3 font-semibold">Klien</th>
                <th className="pb-4 font-semibold">Industri</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Revenue</th>
                <th className="pb-4 font-semibold">Spend</th>
                <th className="pb-4 font-semibold">ROAS</th>
                <th className="pb-4 pr-3 text-right font-semibold">CG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {sortedClients.map((cl) => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                
                return (
                  <tr key={cl.key} onClick={() => router.push(`/client/${cl.key}${qs}`)} className="cursor-pointer group hover:bg-surface2 transition-all duration-200">
                    <td className="py-4 pl-3 rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-sm text-text">{cl.key}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-text2 font-medium">{cl.ind}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-${wc}-bg text-${wc}-text border border-${wc}-border shadow-sm`}>
                        {LM[wc]}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-bold text-text">{fRp(t.rev)}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-text2">{fRp(t.sp)}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-text bg-surface2 px-2 py-1 rounded-md inline-flex border border-border-main">{t.roas ? t.roas.toFixed(2) + 'x' : '—'}</div>
                    </td>
                    <td className="py-4 text-right pr-3 rounded-r-xl">
                      <span className="text-sm font-medium text-text2 bg-surface2 px-2.5 py-1 rounded-full">{cl.cg}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-text3">Loading overview...</div>}>
      <OverviewContent />
    </React.Suspense>
  );
}
