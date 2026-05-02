'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, totals, pct as getPct } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
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
        
        {/* Main AI Monitor (Bento Large) — POWERFUL COMMAND CENTER OVERHAUL */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-border-main shadow-sm overflow-hidden flex flex-col group/engine transition-all duration-700 relative">
           
           {/* ── Header Area: Advanced Meta ── */}
           <div className="p-8 border-b border-border-main bg-surface2/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-text shadow-2xl flex items-center justify-center shrink-0 relative group/icon cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-accent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                    <Zap className="w-8 h-8 text-white relative z-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] opacity-50" />
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <h2 className="text-xl font-black text-text tracking-tighter">AI Intelligence Engine</h2>
                       <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gg/10 border border-gg/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-gg animate-pulse shadow-[0_0_8px_#10b981]" />
                          <span className="text-[9px] font-black text-gg-text uppercase tracking-widest">System Optimal</span>
                       </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-text4 uppercase tracking-widest">Model:</span>
                          <div className="px-2.5 py-1 rounded-lg bg-white border border-border-main shadow-sm flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-or" />
                             <span className="text-[10px] font-black text-text uppercase tracking-tight">Nemotron-3 V1.0</span>
                          </div>
                       </div>
                       <div className="h-4 w-px bg-border-main" />
                       <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-accent" />
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Latency: 24ms</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 relative z-10">
                 <div className="flex flex-col items-end mr-2">
                    <span className="text-[9px] font-black text-text4 uppercase tracking-widest">Uptime</span>
                    <span className="text-xs font-bold text-text tracking-tight">99.98%</span>
                 </div>
                 <button className="w-12 h-12 rounded-2xl bg-white border border-border-main flex items-center justify-center text-text3 hover:text-accent hover:border-accent transition-all shadow-sm">
                    <Settings2 className="w-5 h-5" />
                 </button>
                 <button className="w-12 h-12 rounded-2xl bg-text text-white flex items-center justify-center hover:bg-accent transition-all shadow-xl shadow-text/10">
                    <ArrowUpRight className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* ── Main Engine Modules Grid ── */}
           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-main/50 relative">
              
              {/* Module 1: Requests Matrix */}
              <div className="p-10 flex flex-col hover:bg-surface2/30 transition-all duration-500 group/mod cursor-default">
                 <div className="flex-1 mb-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">Requests Engine</span>
                          <span className="text-[8px] font-bold text-accent/60 uppercase tracking-widest mt-0.5">Live Processing</span>
                       </div>
                       <div className="flex gap-1.5 p-1.5 rounded-lg bg-surface2 border border-border-main/50">
                          {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-border-main group-hover/mod:bg-accent transition-all duration-300" />)}
                       </div>
                    </div>
                    <div className="relative">
                       <div className="text-6xl font-black text-text tracking-tighter mb-4 group-hover/mod:scale-[1.02] transition-transform origin-left">
                          {stats.aiStats.totalRequests}
                       </div>
                       <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/5 rounded-full blur-xl opacity-0 group-hover/mod:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs font-semibold text-text3 leading-relaxed max-w-[200px]">Total analisis yang telah dioptimasi oleh mesin kecerdasan buatan.</p>
                 </div>
                 
                 <div className="bg-white border border-border-main/80 p-5 rounded-[2rem] shadow-sm relative overflow-hidden group/pulse">
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover/pulse:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                       <div className="grid grid-cols-4 gap-1.5">
                          {[...Array(12)].map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i < (stats.aiStats.todayRequests % 12) ? 'bg-accent scale-110' : 'bg-surface2 border border-border-main'}`} />
                          ))}
                       </div>
                       <div className="text-right">
                          <div className="text-lg font-black text-accent tracking-tighter leading-none">+{stats.aiStats.todayRequests}</div>
                          <div className="text-[9px] font-black text-text4 uppercase tracking-widest mt-1">Today</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Module 2: Data Throughput & Flow */}
              <div className="p-10 flex flex-col hover:bg-surface2/30 transition-all duration-500 group/mod border-x border-border-main/50 cursor-default">
                 <div className="flex-1 mb-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">Data Throughput</span>
                          <span className="text-[8px] font-bold text-accent/60 uppercase tracking-widest mt-0.5">Token Optimization</span>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-surface2 border border-border-main/50 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-accent group-hover/mod:scale-125 transition-transform" />
                       </div>
                    </div>
                    <div className="text-6xl font-black text-text tracking-tighter mb-4 transition-transform group-hover/mod:translate-x-1">
                       {(stats.aiStats.totalTokens/1000).toFixed(1)}K
                    </div>
                    <p className="text-xs font-semibold text-text3 leading-relaxed max-w-[200px]">Volume data mentah yang telah diproses dan dikonversi menjadi insight strategis.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-text4 uppercase tracking-[0.2em]">Load Status</span>
                          <span className="text-[11px] font-black text-text uppercase tracking-tight">Optimal Performance</span>
                       </div>
                       <span className="text-sm font-black text-accent tracking-tighter">82.4%</span>
                    </div>
                    <div className="h-2 w-full bg-surface2 rounded-full overflow-hidden border border-border-main/40 relative">
                       <div className="h-full bg-gradient-to-r from-accent via-or to-accent bg-[length:200%_100%] animate-[move-stripe_3s_linear_infinite] w-[82.4%] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" />
                    </div>
                 </div>
              </div>

              {/* Module 3: Burn & Financial Forecast */}
              <div className="p-10 flex flex-col hover:bg-surface2/30 transition-all duration-500 group/mod cursor-default bg-surface2/10">
                 <div className="flex-1 mb-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">Burn Estimation</span>
                          <span className="text-[8px] font-bold text-rr uppercase tracking-widest mt-0.5">Live Billing</span>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rr/10 border border-rr/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-rr animate-pulse" />
                          <span className="text-[10px] font-black text-rr-text tracking-tighter">$USD</span>
                       </div>
                    </div>
                    <div className="text-6xl font-black text-text tracking-tighter mb-4 transition-transform group-hover/mod:-translate-y-1">
                       ${stats.aiStats.totalCost.toFixed(4)}
                    </div>
                    <p className="text-xs font-semibold text-text3 leading-relaxed max-w-[200px]">Akumulasi biaya operasional API untuk periode berjalan saat ini.</p>
                 </div>

                 <div className="bg-text p-7 rounded-[2.5rem] shadow-2xl shadow-text/20 relative overflow-hidden group/forecast">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/forecast:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 p-5 opacity-10 group-hover/forecast:opacity-20 transition-all duration-500 group-hover/forecast:rotate-12">
                       <Activity className="w-12 h-12 text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                       <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Monthly Forecast</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white tracking-tighter">
                             ${(stats.aiStats.totalCost * 30).toFixed(2)}
                          </span>
                          <span className="text-[10px] font-black text-white/25 uppercase tracking-widest">Est / Period</span>
                        </div>
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
