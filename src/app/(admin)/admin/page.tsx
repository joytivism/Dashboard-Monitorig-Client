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
        
        {/* ── Client Health Leaderboard (Operational) ── */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-border-main shadow-sm overflow-hidden flex flex-col group/leaderboard transition-all duration-500">
           
           {/* Header: Operational Status */}
           <div className="p-8 border-b border-border-main bg-surface2/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-text flex items-center justify-center shadow-xl shadow-text/10 group-hover/leaderboard:bg-accent transition-colors duration-500">
                    <Activity className="w-6 h-6 text-white" />
                 </div>
                 <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                       <h2 className="text-base font-black text-text tracking-tight">Client Health Leaderboard</h2>
                       <div className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                          <span className="text-[9px] font-black text-accent uppercase tracking-widest">Real-time Radar</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-text4 uppercase tracking-widest opacity-60">Monitoring performa & budget pacing aktif</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2 mr-4">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface3 flex items-center justify-center text-[10px] font-bold text-text3">
                          {String.fromCharCode(64 + i)}
                       </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                       +{CLIENTS.length - 3}
                    </div>
                 </div>
                 <Link href="/admin/clients" className="w-10 h-10 rounded-xl bg-white border border-border-main flex items-center justify-center text-text3 hover:text-accent hover:border-accent transition-all shadow-sm">
                    <Users className="w-4 h-4" />
                 </Link>
              </div>
           </div>

           {/* Metrics Grid: Performance Split */}
           <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-main/50 flex-1">
              
              {/* Column 1: Top Gainers */}
              <div className="p-8 flex flex-col hover:bg-gg/5 transition-colors group/gainers">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">Top Performers</span>
                       <span className="text-[8px] font-bold text-gg uppercase tracking-widest mt-0.5">Highest Growth</span>
                    </div>
                    <TrendingUp className="w-4 h-4 text-gg" />
                 </div>
                 
                 <div className="space-y-4 flex-1">
                    {CLIENTS.slice(0, 3).map((cl, i) => {
                       const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
                       return (
                          <div key={cl.key} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border-main hover:border-gg/30 hover:shadow-md transition-all cursor-pointer group/item">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gg/10 text-gg flex items-center justify-center text-[10px] font-black group-hover/item:bg-gg group-hover/item:text-white transition-colors">
                                   {cl.key.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                   <div className="text-xs font-bold text-text">{cl.name}</div>
                                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider">{cl.ind}</div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-sm font-black text-gg tracking-tighter">{t.roas?.toFixed(2) || '0.00'}x</div>
                                <div className="text-[9px] font-bold text-gg-text opacity-60">ROAS Peak</div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* Column 2: At-Risk */}
              <div className="p-8 flex flex-col hover:bg-rr/5 transition-colors group/risk">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-text4 uppercase tracking-[0.2em]">At-Risk Clients</span>
                       <span className="text-[8px] font-bold text-rr uppercase tracking-widest mt-0.5">Urgent Attention</span>
                    </div>
                    <AlertCircle className="w-4 h-4 text-rr animate-pulse" />
                 </div>

                 <div className="space-y-4 flex-1">
                    {CLIENTS.filter(c => clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, c.key, curPeriod) === 'rr' || clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, c.key, curPeriod) === 'or').slice(0, 3).map((cl, i) => {
                       const t = totals(CH_DEF, CLIENTS, DATA, cl.key, curPeriod);
                       const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                       return (
                          <div key={cl.key} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border-main hover:border-rr/30 hover:shadow-md transition-all cursor-pointer group/item">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rr/10 text-rr flex items-center justify-center text-[10px] font-black group-hover/item:bg-rr group-hover/item:text-white transition-colors">
                                   {cl.key.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                   <div className="text-xs font-bold text-text">{cl.name}</div>
                                   <div className="text-[10px] font-bold text-text4 uppercase tracking-wider">{status === 'rr' ? 'Kritis' : 'Waspada'}</div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-sm font-black text-rr tracking-tighter">{t.roas?.toFixed(2) || '0.00'}x</div>
                                <div className="text-[9px] font-bold text-rr-text opacity-60">ROAS Low</div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>

           {/* Footer: Budget Pacing Summary */}
           <div className="p-8 bg-surface2/5 border-t border-border-main">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-text3" />
                    <span className="text-[10px] font-black text-text3 uppercase tracking-[0.2em]">Agency Budget Pacing</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-text tracking-tighter">74.2%</span>
                    <span className="text-[9px] font-black text-text4 uppercase tracking-widest">Deployed</span>
                 </div>
              </div>
              <div className="h-2 w-full bg-surface2 rounded-full overflow-hidden border border-border-main/50 relative">
                 <div className="h-full bg-gradient-to-r from-accent to-or w-[74.2%] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-[move-stripe_2s_linear_infinite]" 
                         style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.1) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                 </div>
              </div>
           </div>
        </div>


        {/* Global Stats Vertical Stack (The Power Stack) */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-8">
           <div className="bg-text rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group/stat cursor-pointer">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner group-hover/stat:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-accent" />
                 </div>
                 <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-[9px] font-black tracking-widest uppercase text-accent">Agency Pulse</div>
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-black text-white tracking-tighter group-hover/stat:translate-x-1 transition-transform inline-block">
                       {stats.totalRoas.toFixed(2)}x
                    </span>
                    <div className="w-2 h-2 rounded-full bg-gg shadow-[0_0_8px_#10b981]" />
                 </div>
                 <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">Global Avg. ROAS</h3>
                 <p className="text-[11px] text-white/40 font-semibold leading-relaxed max-w-[200px]">Rata-rata performa seluruh portfolio klien aktif periode ini.</p>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-border-main shadow-sm flex flex-col justify-between group/critical cursor-pointer hover:border-rr/30 transition-all duration-500 overflow-hidden relative">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-rr/5 rounded-full blur-3xl opacity-0 group-hover/critical:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-rr-bg flex items-center justify-center text-rr border border-rr-border/30 group-hover/critical:rotate-[-6deg] transition-all">
                    <AlertCircle className="w-7 h-7" />
                 </div>
                 {stats.attnCount > 0 && (
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rr/10 border border-rr/20">
                      <span className="flex h-2 w-2 rounded-full bg-rr animate-ping" />
                      <span className="text-[9px] font-black text-rr uppercase tracking-widest">Action Required</span>
                   </div>
                 )}
              </div>
              
              <div className="relative z-10">
                 <div className="text-5xl font-black text-text tracking-tighter mb-2 group-hover/critical:scale-105 transition-transform origin-left">
                    {stats.attnCount}
                 </div>
                 <h3 className="text-xs font-bold text-rr uppercase tracking-[0.2em] mb-4">Critical At-Risk</h3>
                 <p className="text-[11px] text-text3 font-semibold leading-relaxed max-w-[200px]">Klien yang memerlukan optimasi strategi segera hari ini.</p>
              </div>
           </div>
        </div>

        {/* Quick Actions (The Interaction Bar) */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
           {QUICK_ACTIONS.map(action => (
             <Link key={action.href} href={action.href} className="group relative bg-white rounded-[2rem] p-6 border border-border-main shadow-sm hover:shadow-2xl hover:border-accent/20 transition-all duration-500 overflow-hidden flex items-center gap-6">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-16 h-16 rounded-[1.25rem] ${action.bg} ${action.color} flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                   <action.icon className="w-8 h-8" />
                </div>
                
                <div className="relative z-10 flex-1 min-w-0">
                   <div className="text-[10px] font-black text-text4 uppercase tracking-widest mb-1 opacity-60">{action.badge}</div>
                   <div className="text-sm font-black text-text tracking-tight group-hover:text-accent transition-colors">{action.title}</div>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                   <ChevronRight className="w-4 h-4 text-accent" />
                </div>
             </Link>
           ))}
        </div>

        {/* Status Portfolio (Bento Wide) */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-border-main shadow-sm flex flex-col overflow-hidden group/port transition-all duration-500">
           <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/10">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-accent rounded-full" />
                 <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">Portfolio Status</h2>
              </div>
              <Link href="/admin/clients" className="px-4 py-1.5 rounded-xl bg-white border border-border-main text-[10px] font-black text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-sm">
                 View All
              </Link>
           </div>
           <div className="divide-y divide-border-main/40 overflow-y-auto max-h-[440px] no-scrollbar">
              {CLIENTS.map(cl => {
                const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                const statusStyle = STATUS_COLOR_MAP[wc] || STATUS_COLOR_MAP.nn;
                return (
                  <Link key={cl.key} href={`/client/${cl.key}`} className="p-6 hover:bg-surface2/70 transition-all flex items-center gap-5 group/item border-l-4 border-l-transparent hover:border-l-accent">
                     <div className="w-11 h-11 rounded-2xl bg-surface2 border border-border-main/50 flex items-center justify-center text-text2 text-xs font-black group-hover/item:bg-accent group-hover/item:text-white group-hover/item:rotate-3 transition-all duration-300">
                        {cl.key.slice(0,2).toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-text truncate tracking-tight mb-0.5">{cl.name}</div>
                        <div className="text-[10px] font-bold text-text4 uppercase tracking-[0.1em] opacity-60">{cl.ind}</div>
                     </div>
                     <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {STATUS_LABEL[wc]}
                     </div>
                  </Link>
                );
              })}
           </div>
        </div>

        {/* Activity Feed (Bento Wide) */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-border-main shadow-sm flex flex-col overflow-hidden group/activity transition-all duration-500">
           <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/10">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-rr rounded-full animate-pulse" />
                 <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">Live Activity Feed</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gg/10 border border-gg/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-gg animate-pulse" />
                 <span className="text-[9px] font-black text-gg-text uppercase tracking-widest">Streaming</span>
              </div>
           </div>
           <div className="flex-1 overflow-hidden p-2">
              <ActivityLog activities={ACTIVITY.slice(0, 8)} />
           </div>
        </div>

      </div>
    </div>
  );
}
