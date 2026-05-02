'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals, pct as getPct } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
  AlertCircle, Zap, LayoutDashboard, ChevronRight,
  CalendarClock, Settings2, ArrowRight, Globe, TrendingDown,
  PieChart, DollarSign, Terminal
} from 'lucide-react';

import MetricCard from '@/components/ui/MetricCard';
import ActivityLog from '@/components/dashboard/ActivityLog';

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  rr: { bg: 'bg-rr-bg', text: 'text-rr-text', border: 'border-rr-border' },
  or: { bg: 'bg-or-bg', text: 'text-or-text', border: 'border-or-border' },
  yy: { bg: 'bg-yy-bg', text: 'text-yy-text', border: 'border-yy-border' },
  nn: { bg: 'bg-nn-bg', text: 'text-nn-text', border: 'border-nn-border' },
  gg: { bg: 'bg-gg-bg', text: 'text-gg-text', border: 'border-gg-border' },
  gd: { bg: 'bg-gd-bg', text: 'text-gd-text', border: 'border-gd-border' },
};

const STATUS_DOT: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};

const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis', or: 'Perlu Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Performa Baik', gd: 'Sangat Baik',
};

export default function AdminHubPage() {
  const { CLIENTS, DATA, PERIODS, ACTIVITY, CH_DEF } = useDashboardData();
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

    const { AI_LOGS } = useDashboardData();
    const aiStats = {
      totalRequests: AI_LOGS.length,
      totalTokens: AI_LOGS.reduce((acc, l) => acc + (l.tk || 0), 0),
      totalCost: AI_LOGS.reduce((acc, l) => acc + (l.cost || 0), 0)
    };

    return { 
      totalRev, totalSpend, totalRoas, pGrowth,
      attnCount: attn.length, 
      total: CLIENTS.length,
      updatedCount: updatedClients.length,
      progress: ingestionProgress,
      aiStats
    };
  }, [CLIENTS, DATA, PERIODS, curPeriod, useDashboardData()]);

  const QUICK_ACTIONS = [
    { href: '/admin/data', icon: Database, title: 'Data Input', badge: 'Active', color: 'text-accent', bg: 'bg-accent/10' },
    { href: '/admin/activity', icon: Activity, title: 'Live Log', badge: 'Real-time', color: 'text-or', bg: 'bg-or/10' },
    { href: '/admin/clients', icon: Users, title: 'Klien', badge: `${stats.total}`, color: 'text-text2', bg: 'bg-surface3' },
    { href: '/admin/settings', icon: Settings2, title: 'System', badge: 'AI Ready', color: 'text-gg', bg: 'bg-gg/10' },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
      
      {/* ── COMMAND HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-border-main shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none transition-transform group-hover:scale-125" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-text flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-text tracking-tight">Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-gg-bg text-gg-text text-[10px] font-bold uppercase tracking-wider border border-gg-border/30">Active Hub</span>
            </div>
            <p className="text-sm font-medium text-text3 max-w-md">Sistem pemantauan pusat untuk manajemen portofolio dan operasional AI Real Advertise.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="px-5 py-3 bg-surface2/50 rounded-2xl border border-border-main flex items-center gap-4">
             <div>
                <div className="text-[10px] font-bold text-text4 uppercase tracking-wider">Portfolio Status</div>
                <div className="text-sm font-bold text-text mt-0.5 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-gg animate-pulse" />
                   Optimized
                </div>
             </div>
             <div className="w-px h-8 bg-border-main/50" />
             <div className="text-right">
                <div className="text-[10px] font-bold text-text4 uppercase tracking-wider">Active Period</div>
                <div className="text-sm font-bold text-text mt-0.5">{curPeriod}</div>
             </div>
          </div>
        </div>
      </div>

      {/* ── BENTO GRID LAYOUT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        
        {/* Main AI Monitor (Bento Large) - REBUILT POWERFUL & INTERACTIVE */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-border-main shadow-sm overflow-hidden flex flex-col group/bento hover:shadow-2xl hover:border-accent/10 transition-all duration-500 relative">
          {/* Header Area */}
          <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-text text-white flex items-center justify-center shadow-xl shadow-text/20 group-hover/bento:rotate-[-4deg] transition-all duration-500 relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity rounded-2xl" />
                   <Zap className="w-7 h-7 fill-accent group-hover/bento:scale-110 transition-transform" />
                </div>
                <div>
                   <h2 className="text-sm font-bold text-text mb-1.5 flex items-center gap-2">
                      AI Intelligence Engine
                      <span className="w-2 h-2 rounded-full bg-gg animate-pulse" />
                   </h2>
                   <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-white border border-border-main/50 shadow-sm flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                         <span className="text-[10px] font-bold text-text uppercase tracking-wider">Nemotron-3 v1.0</span>
                      </div>
                      <span className="text-[10px] font-bold text-gg uppercase tracking-wider opacity-60">OpenRouter Active</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-2 relative z-10">
                <button className="w-10 h-10 rounded-xl bg-white border border-border-main/50 flex items-center justify-center text-text3 hover:text-accent hover:border-accent/30 hover:shadow-md transition-all active:scale-95">
                   <Activity className="w-4.5 h-4.5" />
                </button>
                <Link href="/admin/settings" className="w-10 h-10 rounded-xl bg-white border border-border-main/50 flex items-center justify-center text-text3 hover:text-accent hover:border-accent/30 hover:shadow-md transition-all active:scale-95">
                   <ArrowUpRight className="w-5 h-5" />
                </Link>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-main/50 flex-1 relative z-10">
             {/* Column 1: Live Requests */}
             <div className="p-10 flex flex-col justify-between group/col hover:bg-surface2/10 transition-colors cursor-default">
                <div>
                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mb-6 flex items-center justify-between">
                      Requests Engine
                      <div className="flex gap-1">
                         {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full bg-accent/40 animate-bounce delay-${i*200}`} />)}
                      </div>
                   </div>
                   <div className="text-3xl font-bold text-text tracking-tight mb-2 group-hover/col:translate-x-1 transition-transform">
                      {stats.aiStats.totalRequests.toLocaleString()}
                   </div>
                   <p className="text-xs font-medium text-text3 leading-relaxed">Analisis diproses dalam sesi aktif periode ini.</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                   <div className="flex -space-x-2.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-surface3 flex items-center justify-center shadow-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-text4/20" />
                        </div>
                      ))}
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">+{(Math.random()*10).toFixed(0)} Today</div>
                      <div className="text-[9px] font-medium text-text4 uppercase tracking-tight">Real-time Pulse</div>
                   </div>
                </div>
             </div>

             {/* Column 2: Data & Efficiency */}
             <div className="p-10 flex flex-col justify-between bg-surface2/5 hover:bg-surface2/20 transition-colors cursor-default group/eff">
                <div>
                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mb-6">Data Throughput</div>
                   <div className="text-3xl font-bold text-text tracking-tight mb-2 group-hover/eff:scale-105 transition-transform origin-left">
                      {(stats.aiStats.totalTokens/1000).toFixed(1)}K
                   </div>
                   <p className="text-xs font-medium text-text3 leading-relaxed">Total token yang dikonsumsi oleh model strategi.</p>
                </div>
                
                <div className="mt-8 space-y-4">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold text-text4 uppercase tracking-wider">Efficiency Status</span>
                      <span className="text-[11px] font-bold text-text tracking-tighter">82.4%</span>
                   </div>
                   <div className="w-full h-2 bg-white rounded-full border border-border-main/50 overflow-hidden p-0.5 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full w-3/4 shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)] relative overflow-hidden">
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-stripe_1s_linear_infinite]" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Column 3: Costs & Forecast */}
             <div className="p-10 flex flex-col justify-between hover:bg-surface2/10 transition-colors cursor-default group/cost">
                <div>
                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mb-6 flex items-center justify-between">
                      Burn Estimation
                      <div className="w-2 h-2 rounded-full bg-rr animate-pulse" />
                   </div>
                   <div className="text-3xl font-bold text-text tracking-tight mb-2 group-hover/cost:text-rr transition-colors">
                      ${stats.aiStats.totalCost.toFixed(4)}
                   </div>
                   <p className="text-xs font-medium text-text3 leading-relaxed">Estimasi biaya API akumulasi berjalan.</p>
                </div>
                
                <div className="mt-8 p-5 rounded-[1.5rem] bg-text text-white shadow-xl shadow-text/20 relative overflow-hidden group/forecast">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/forecast:opacity-100 transition-opacity" />
                   <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-gg" />
                      Monthly Forecast
                   </div>
                   <div className="text-xl font-bold tracking-tight">
                      ${(stats.aiStats.totalCost * 30).toFixed(2)}
                      <span className="text-xs font-medium text-white/40 ml-1.5 uppercase tracking-tighter">Est / mo</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Global Stats Vertical Stack (Bento Small) */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-8">
           <div className="bg-text rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <TrendingUp className="w-6 h-6 text-accent" />
                 </div>
                 <div className="px-3 py-1 rounded-full bg-accent text-[10px] font-bold tracking-wider uppercase">Global ROAS</div>
              </div>
              <div>
                 <div className="text-3xl font-bold text-white tracking-tight mb-2">{stats.totalRoas.toFixed(2)}x</div>
                 <p className="text-xs text-white/50 font-medium">Rata-rata performa seluruh portfolio klien aktif.</p>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] p-8 border border-border-main shadow-sm flex flex-col justify-between group hover:border-rr/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-rr-bg flex items-center justify-center text-rr border border-rr-border/30">
                    <AlertCircle className="w-6 h-6" />
                 </div>
                 {stats.attnCount > 0 && <span className="flex h-3 w-3 rounded-full bg-rr animate-ping" />}
              </div>
              <div>
                 <div className="text-3xl font-bold text-text tracking-tight mb-1">{stats.attnCount}</div>
                 <div className="text-[10px] font-bold text-rr uppercase tracking-wider">Critical Clients</div>
                 <p className="text-xs text-text4 mt-3 font-medium">Memerlukan penanganan strategi segera.</p>
              </div>
           </div>
        </div>

        {/* Quick Actions (Bento Medium) */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
           {QUICK_ACTIONS.map(action => (
             <Link key={action.href} href={action.href} className="bg-white rounded-[1.5rem] p-6 border border-border-main shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                   <action.icon className="w-7 h-7" />
                </div>
                <div>
                   <div className="text-sm font-bold text-text tracking-tight">{action.title}</div>
                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mt-0.5">{action.badge}</div>
                </div>
                <ChevronRight className="ml-auto w-4 h-4 text-text4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
             </Link>
           ))}
        </div>

        {/* Status Portfolio (Bento Wide) */}
        <div className="lg:col-span-5 bg-white rounded-[2rem] border border-border-main shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/20">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-text3">Portfolio Status</h2>
              <Link href="/admin/clients" className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline">View All</Link>
           </div>
           <div className="divide-y divide-border-main/40 overflow-y-auto max-h-[400px] no-scrollbar">
              {CLIENTS.map(cl => {
                const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                const statusStyle = STATUS_COLOR_MAP[wc] || STATUS_COLOR_MAP.nn;
                return (
                  <Link key={cl.key} href={`/client/${cl.key}`} className="p-6 hover:bg-surface2 transition-colors flex items-center gap-4 group/item">
                     <div className="w-10 h-10 rounded-xl bg-surface2 border border-border-main/50 flex items-center justify-center text-text2 text-[10px] font-bold group-hover/item:bg-accent group-hover/item:text-white transition-all">
                        {cl.key.slice(0,2).toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text truncate tracking-tight">{cl.name}</div>
                        <div className="text-[10px] font-bold text-text4 uppercase tracking-wider opacity-60 mt-0.5">{cl.ind}</div>
                     </div>
                     <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {STATUS_LABEL[wc]}
                     </div>
                  </Link>
                );
              })}
           </div>
        </div>

        {/* Activity Feed (Bento Wide) */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] border border-border-main shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/20">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-text3">Live Activity Feed</h2>
              <div className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
           </div>
           <div className="flex-1 overflow-hidden">
              <ActivityLog activities={ACTIVITY.slice(0, 8)} />
           </div>
        </div>

      </div>
    </div>
  );
}
