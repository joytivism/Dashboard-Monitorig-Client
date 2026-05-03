'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, totals, pct as getPct } from '@/lib/utils';
import {
  Database, Activity, Users, TrendingUp,
  Zap, LayoutDashboard, Settings2, AlertCircle, ChevronRight
} from 'lucide-react';

import ActivityLog from '@/components/dashboard/ActivityLog';

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  rr: { bg: 'bg-rr-bg', text: 'text-rr-text', border: 'border-rr-border' },
  or: { bg: 'bg-or-bg', text: 'text-or-text', border: 'border-or-border' },
  yy: { bg: 'bg-yy-bg', text: 'text-yy-text', border: 'border-yy-border' },
  nn: { bg: 'bg-nn-bg', text: 'text-nn-text', border: 'border-nn-border' },
  gg: { bg: 'bg-gg-bg', text: 'text-gg-text', border: 'border-gg-border' },
  gd: { bg: 'bg-gd-bg', text: 'text-gd-text', border: 'border-gd-border' },
};

const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis', or: 'Perlu Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Performa Baik', gd: 'Sangat Baik',
};

export default function AdminHubPage() {
  const { CLIENTS, DATA, PERIODS, ACTIVITY, CH_DEF, AI_LOGS } = useDashboardData();
  const curPeriod = PERIODS[PERIODS.length - 1];

  const stats = useMemo(() => {
    let totalRev = 0, totalSpend = 0, prevRev = 0;
    const prevIdx = PERIODS.indexOf(curPeriod) - 1;
    const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

    CLIENTS.forEach(cl => {
      const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
      totalRev += t.rev;
      totalSpend += t.sp;
      if (prevPeriod) {
        const tp = totals(CH_DEF, CLIENTS, DATA, cl.key, prevPeriod);
        prevRev += tp.rev;
      }
    });

    const attn = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
    const totalRoas = totalSpend > 0 ? totalRev / totalSpend : 0;
    const pGrowth = getPct(totalRev, prevRev);
    
    const updatedClients = CLIENTS.filter(cl => DATA.some(d => d.c === cl.key && d.p === curPeriod));
    const ingestionProgress = (updatedClients.length / CLIENTS.length) * 100;

    const today = new Date().toDateString();
    const aiStats = {
      totalRequests: AI_LOGS.length,
      todayRequests: AI_LOGS.filter(l => new Date(l.d).toDateString() === today).length,
      totalTokens: AI_LOGS.reduce((acc, l) => acc + (l.tk || 0), 0),
      totalCost: AI_LOGS.reduce((acc, l) => acc + (Number(l.cost) || 0), 0)
    };

    return { 
      totalRev, totalSpend, totalRoas, pGrowth,
      attnCount: attn.length, 
      total: CLIENTS.length,
      updatedCount: updatedClients.length,
      progress: ingestionProgress,
      aiStats
    };
  }, [CLIENTS, DATA, PERIODS, curPeriod, AI_LOGS, CH_DEF]);

  const QUICK_ACTIONS = [
    { href: '/admin/data', icon: Database, title: 'Data Input', badge: 'Active', color: 'text-accent', bg: 'bg-accent/10' },
    { href: '/admin/ai', icon: Zap, title: 'AI Monitoring', badge: 'System', color: 'text-accent', bg: 'bg-accent/10' },
    { href: '/admin/activity', icon: Activity, title: 'Live Log', badge: 'Real-time', color: 'text-or', bg: 'bg-or/10' },
    { href: '/admin/clients', icon: Users, title: 'Klien', badge: `${stats.total}`, color: 'text-text2', bg: 'bg-surface3' },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto px-6 py-7">
      
      {/* ── COMMAND HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-border-main shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none transition-transform group-hover:scale-110" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-text flex items-center justify-center text-white shadow-md transition-transform duration-500">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-h2">Command Center</h1>
              <span className="badge badge-gg">Active Hub</span>
            </div>
            <p className="text-body max-w-md">Sistem pemantauan pusat untuk manajemen portofolio dan operasional AI Real Advertise.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="px-5 py-3 bg-surface2 rounded-xl border border-border-main flex items-center gap-4">
              <div>
                <div className="type-overline">Portfolio Status</div>
                <div className="text-sm font-bold text-text mt-1 flex items-center gap-2">
                   <span className="dot dot-gg animate-pulse" />
                   Optimized
                </div>
             </div>
             <div className="w-px h-8 bg-border-main" />
             <div className="text-right">
                <div className="type-overline">Active Period</div>
                <div className="text-sm font-bold text-text mt-1">{curPeriod}</div>
             </div>
          </div>
        </div>
      </div>

      {/* ── BENTO GRID LAYOUT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        
        {/* ── Client Health Leaderboard ── */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col group/leaderboard transition-all duration-300">
           
           {/* Header */}
           <div className="p-6 border-b border-border-main bg-surface2/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-text flex items-center justify-center text-white shadow-sm">
                    <Activity className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-h4">Client Health Leaderboard</h2>
                    <p className="text-micro">Monitoring performa & budget pacing aktif</p>
                 </div>
              </div>
              <Link href="/admin/clients" className="btn-icon">
                 <Users className="w-4 h-4" />
              </Link>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-main">
              
              {/* Column 1: Top Gainers */}
               <div className="p-6 flex flex-col hover:bg-surface2 transition-colors group/gainers">
                 <div className="flex items-center justify-between mb-6">
                    <span className="type-overline">Top Performers</span>
                    <TrendingUp className="w-4 h-4 text-gg" />
                 </div>
                 
                 <div className="space-y-3 flex-1">
                    {CLIENTS.slice(0, 3).map((cl) => {
                       const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
                       return (
                          <div key={cl.key} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border-main hover:shadow-sm transition-all group/item">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gg/10 text-gg flex items-center justify-center text-[10px] font-black group-hover/item:bg-gg group-hover/item:text-white transition-all">
                                   {cl.key.slice(0, 2).toUpperCase()}
                                </div>
                                 <div>
                                    <div className="text-body font-bold !text-text">{cl.name}</div>
                                    <div className="text-micro">{cl.ind}</div>
                                 </div>
                             </div>
                              <div className="text-right">
                                <div className="text-xl font-black text-gg tabular-nums tracking-tighter">{t.roas?.toFixed(2) || '0.00'}x</div>
                                <div className="type-overline !text-[9px]">ROAS</div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* Column 2: At-Risk */}
              <div className="p-6 flex flex-col hover:bg-surface2 transition-colors group/risk">
                 <div className="flex items-center justify-between mb-6">
                    <span className="type-overline">At-Risk Clients</span>
                    <AlertCircle className="w-4 h-4 text-rr" />
                 </div>

                 <div className="space-y-3 flex-1">
                    {CLIENTS.filter(c => ['rr', 'or'].includes(clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, c.key, curPeriod))).slice(0, 3).map((cl) => {
                       const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
                       const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                       return (
                          <div key={cl.key} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border-main hover:shadow-sm transition-all group/item">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-rr/10 text-rr flex items-center justify-center text-[10px] font-black group-hover/item:bg-rr group-hover/item:text-white transition-all">
                                   {cl.key.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                   <div className="text-sm font-semibold text-text">{cl.name}</div>
                                   <div className="text-xs text-text3">{status === 'rr' ? 'Kritis' : 'Waspada'}</div>
                                </div>
                             </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-rr tabular-nums tracking-tight">{t.roas?.toFixed(2) || '0.00'}x</div>
                                <div className="type-overline !text-[10px]">ROAS</div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>

           {/* Footer: Budget Pacing Summary */}
           <div className="p-6 bg-surface2 border-t border-border-main">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-text3" />
                    <span className="type-overline">Agency Budget Pacing</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text">74.2%</span>
                    <span className="text-xs text-text3 font-medium tracking-tight">Deployed</span>
                 </div>
              </div>
              <div className="h-1.5 w-full bg-surface3 rounded-full overflow-hidden">
                 <div className="h-full bg-accent w-[74.2%] transition-all duration-500" />
              </div>
           </div>
        </div>

        {/* Global Stats Vertical Stack */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-8">
           <div className="bg-text rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden group/stat cursor-pointer hover:bg-accent transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <TrendingUp className="w-5 h-5 text-white" />
                 </div>
                 <span className="type-overline !text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 !text-white">Global Avg</span>
              </div>
              
              <div className="relative z-10">
                 <div className="text-display !text-white mb-1">
                    {stats.totalRoas.toFixed(2)}<span className="text-xl font-medium opacity-50 ml-1">x</span>
                 </div>
                 <h3 className="type-overline !text-white/50">Average ROAS</h3>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group/critical cursor-pointer hover:border-rr-border transition-all duration-300">
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-rr/10 flex items-center justify-center text-rr border border-rr-border/20">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 {stats.attnCount > 0 && <span className="dot dot-rr animate-pulse" />}
              </div>
              
              <div className="relative z-10">
                 <div className="text-3xl font-bold text-text tracking-tight mb-1">
                    {stats.attnCount}
                 </div>
                 <h3 className="type-overline">Critical Clients</h3>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
           {QUICK_ACTIONS.map(action => (
             <Link key={action.href} href={action.href} className="group bg-white rounded-2xl p-5 border border-border-main shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                   <action.icon className="w-6 h-6" />
                </div>
                 <div>
                    <div className="text-h4 tracking-tight">{action.title}</div>
                    <div className="type-overline !text-[9px] mt-1 opacity-60">{action.badge}</div>
                 </div>
                <ChevronRight className="ml-auto w-4 h-4 text-text4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
             </Link>
           ))}
        </div>

        {/* Status Portfolio (Bento Wide) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border-main shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-border-main flex items-center justify-between bg-surface2/50">
              <h2 className="type-overline">Portfolio Status</h2>
              <Link href="/admin/clients" className="type-overline !text-accent hover:underline">View All</Link>
           </div>
           <div className="divide-y divide-border-main overflow-y-auto max-h-[400px] no-scrollbar">
              {CLIENTS.map(cl => {
                const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                const statusStyle = STATUS_COLOR_MAP[wc] || STATUS_COLOR_MAP.nn;
                return (
                  <Link key={cl.key} href={`/client/${cl.key}`} className="p-5 hover:bg-surface2 transition-colors flex items-center gap-4 group/item">
                     <div className="w-9 h-9 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-xs font-black group-hover/item:bg-accent group-hover/item:text-white transition-all">
                        {cl.key.slice(0,2).toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text truncate">{cl.name}</div>
                        <div className="text-xs text-text3 truncate">{cl.ind}</div>
                     </div>
                     <div className={`chip ${statusStyle.bg.replace('bg-','chip-').replace('-bg','')}`}>
                        {STATUS_LABEL[wc]}
                     </div>
                  </Link>
                );
              })}
           </div>
        </div>

        {/* Activity Feed (Bento Wide) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-border-main shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-border-main flex items-center justify-between bg-surface2/50">
              <h2 className="type-overline">Live Activity Feed</h2>
              <span className="dot dot-accent animate-pulse" />
           </div>
           <div className="flex-1 overflow-hidden">
              <ActivityLog activities={ACTIVITY.slice(0, 8)} />
           </div>
        </div>

      </div>
    </div>
  );
}
