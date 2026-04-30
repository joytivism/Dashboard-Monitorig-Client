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

  const MetricCard = ({ title, value, icon: Icon, growth, lastMonth, growthSuffix = '%' }: any) => {
    return (
    <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="text-sm font-semibold text-text2">{title}</div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface2 text-text">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-4xl font-bold text-text tracking-tight">{value}</div>
        {growth !== null && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${growth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}{growthSuffix}
          </div>
        )}
      </div>
      <div className="text-xs text-text3">
        Last month: {lastMonth}
      </div>
    </div>
    );
  };

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-text tracking-tight">Dashboard Overview</h1>
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
        />
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {probs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Attention Needed</h2>
              <div className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                {probs.length} Clients
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {probs.map(cl => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                const v = getPct(t.rev, tp.rev);
                return (
                  <div key={cl.key} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <div className="font-semibold text-sm text-text">{cl.key}</div>
                      <div className="text-xs text-text3 mt-0.5">Rev: {fRp(t.rev)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{v !== null ? (v >= 0 ? '↑ ' : '↓ ') + Math.abs(v).toFixed(1) + '%' : '—'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {wins.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Growing Clients</h2>
              <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                {wins.length} Clients
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {wins.map(cl => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
                const v = getPct(t.rev, tp.rev);
                return (
                  <div key={cl.key} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <div className="font-semibold text-sm text-text">{cl.key}</div>
                      <div className="text-xs text-text3 mt-0.5">Rev: {fRp(t.rev)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ {Math.abs(v || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-text">Recent Clients</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-text3 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm w-48 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-surface2 transition-colors">
              <ListFilter className="w-4 h-4" />
              Sort by
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[13px] font-medium text-text3 border-b border-gray-100">
                <th className="pb-3 pl-2">Klien</th>
                <th className="pb-3">Industri</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Spend</th>
                <th className="pb-3">ROAS</th>
                <th className="pb-3 pr-2 text-right">CG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedClients.map((cl) => {
                const t = totals(CLIENTS, DATA, cl.key, curPeriod);
                const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                
                return (
                  <tr key={cl.key} onClick={() => router.push(`/client/${cl.key}${qs}`)} className="cursor-pointer group hover:bg-surface2 transition-all duration-200">
                    <td className="py-4 pl-2">
                      <div className="font-semibold text-sm text-text">{cl.key}</div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-text2">{cl.ind}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        wc === 'rr' ? 'bg-red-50 text-red-600' : 
                        wc === 'gg' || wc === 'gd' ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {LM[wc]}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-text">{fRp(t.rev)}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-text2">{fRp(t.sp)}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-text">{t.roas ? t.roas.toFixed(2) + 'x' : '—'}</div>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <span className="text-sm text-text2">{cl.cg}</span>
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
