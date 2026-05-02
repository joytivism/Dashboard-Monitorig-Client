'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals, pct as getPct } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
  AlertCircle, CheckCircle2, Zap, BarChart3, CalendarClock,
  Settings2, ArrowRight, LayoutDashboard,
  Wallet, PieChart, Globe, ClipboardCheck, Clock, TrendingDown
} from 'lucide-react';

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  rr: { bg: 'bg-rr-bg',   text: 'text-rr-text',   border: 'border-rr-border'  },
  or: { bg: 'bg-or-bg',   text: 'text-or-text',   border: 'border-or-border'  },
  yy: { bg: 'bg-yy-bg',   text: 'text-yy-text',   border: 'border-yy-border'  },
  nn: { bg: 'bg-nn-bg',   text: 'text-nn-text',   border: 'border-nn-border'  },
  gg: { bg: 'bg-gg-bg',   text: 'text-gg-text',   border: 'border-gg-border'  },
  gd: { bg: 'bg-gd-bg',   text: 'text-gd-text',   border: 'border-gd-border'  },
};
const STATUS_DOT: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};
const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis', or: 'Perlu Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Performa Baik', gd: 'Sangat Baik',
};
const TYPE_MAP: Record<string, { l: string; color: string; dot: string }> = {
  p: { l: 'Promo',     color: 'bg-gg-bg text-gg-text border-gg-border', dot: 'bg-gg' },
  e: { l: 'Event',     color: 'bg-gd-bg text-gd-text border-gd-border', dot: 'bg-gd' },
  c: { l: 'Content',   color: 'bg-or-bg text-or-text border-or-border', dot: 'bg-or' },
  l: { l: 'Launching', color: 'bg-rr-bg text-rr-text border-rr-border', dot: 'bg-rr' },
};

export default function AdminHubPage() {
  const { CLIENTS, DATA, PERIODS, ACTIVITY } = useDashboardData();
  const curPeriod = PERIODS[PERIODS.length - 1];

  const stats = useMemo(() => {
    let totalRev = 0, totalSpend = 0, prevRev = 0;
    const prevIdx = PERIODS.indexOf(curPeriod) - 1;
    const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

    CLIENTS.forEach(cl => {
      const t = totals(CLIENTS, DATA, cl.key, curPeriod);
      totalRev += t.rev;
      totalSpend += t.sp;

      if (prevPeriod) {
        const tp = totals(CLIENTS, DATA, cl.key, prevPeriod);
        prevRev += tp.rev;
      }
    });

    const attn = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
    const totalRoas = totalSpend > 0 ? totalRev / totalSpend : 0;
    const pGrowth = getPct(totalRev, prevRev);
    
    // Ingestion Stats
    const updatedClients = CLIENTS.filter(cl => {
       const hasData = DATA.some(d => d.c === cl.key && d.p === curPeriod);
       return hasData;
    });
    const pendingClients = CLIENTS.filter(cl => !updatedClients.find(u => u.key === cl.key));
    const ingestionProgress = (updatedClients.length / CLIENTS.length) * 100;

    return { 
      totalRev, totalSpend, totalRoas, pGrowth,
      attn: attn.length, 
      total: CLIENTS.length,
      updatedCount: updatedClients.length,
      pending: pendingClients,
      progress: ingestionProgress
    };
  }, [CLIENTS, DATA, PERIODS, curPeriod]);

  const MENU = [
    {
      href: '/admin/data',
      icon: Database,
      title: 'Input Data Performa',
      desc: 'Update data bulanan per klien. Kelola spend, revenue, dan metrik iklan lainnya.',
      badge: 'Input',
      iconColor: '#1D4ED8',
      accentGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      cta: 'Buka Form Input',
    },
    {
      href: '/admin/activity',
      icon: Activity,
      title: 'Activity Log',
      desc: 'Catat promo, event, launching, dan konten harian per klien secara real-time.',
      badge: 'Real-time',
      iconColor: '#EA580C',
      accentGradient: 'linear-gradient(135deg, #FFF4EE 0%, #FFEDD5 100%)',
      cta: 'Kelola Activity',
    },
    {
      href: '/admin/clients',
      icon: Users,
      title: 'Manajemen Klien',
      desc: 'Atur portofolio klien, konfigurasi channel, PIC, dan Account Strategist.',
      badge: 'Admin',
      iconColor: '#374151',
      accentGradient: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      cta: 'Kelola Klien',
    },
    {
      href: '/admin/settings',
      icon: Settings2,
      title: 'Pengaturan Sistem',
      desc: 'Konfigurasi integrasi AI, API Key OpenRouter, dan prompt analisis strategi.',
      badge: 'Sistem',
      iconColor: 'var(--accent)',
      accentGradient: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent-mid) 100%)',
      cta: 'Buka Pengaturan',
    },
  ];

  const recentActivity = ACTIVITY.slice(0, 5);

  return (
    <div className="w-full space-y-10 animate-fade-in pb-12">

      {/* ── Top Header & Action ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
              <LayoutDashboard className="w-5 h-5" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-text tracking-tight leading-tight">Admin Hub</h1>
              <p className="text-sm font-medium text-text3 mt-0.5">Pusat kendali operasional dan manajemen ekosistem dashboard.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-border-main rounded-2xl px-5 py-2.5 shadow-sm hover:border-accent/30 transition-all group shrink-0">
          <CalendarClock className="w-4 h-4 text-text4 group-hover:text-accent transition-colors" />
          <span className="text-xs font-semibold text-text3 uppercase tracking-wider">Periode Aktif</span>
          <div className="h-4 w-px bg-border-main mx-1" />
          <span className="text-sm font-bold text-text">{curPeriod}</span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-gg-bg text-gg-text px-2 py-0.5 rounded-full border border-gg-border">LIVE</span>
        </div>
      </div>

      {/* ── Performance Highlights ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Portfolio', value: stats.total, sub: 'Klien Aktif', icon: Globe, color: 'text-text3', bg: 'bg-surface2' },
          { label: 'Blended ROAS', value: `${stats.totalRoas.toFixed(2)}x`, sub: 'Rata-rata Global', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/5' },
          { label: 'Tindakan Segera', value: stats.attn, sub: 'Klien Kritis', icon: AlertCircle, color: stats.attn > 0 ? 'text-rr-text' : 'text-text3', bg: stats.attn > 0 ? 'bg-rr-bg' : 'bg-surface2' },
          { 
            label: 'Portfolio Growth', 
            value: stats.pGrowth !== null ? `${stats.pGrowth >= 0 ? '+' : ''}${stats.pGrowth.toFixed(1)}%` : '0%', 
            sub: 'Kenaikan Revenue Total', 
            icon: stats.pGrowth && stats.pGrowth >= 0 ? TrendingUp : TrendingDown, 
            color: stats.pGrowth && stats.pGrowth >= 0 ? 'text-gd-text' : stats.pGrowth && stats.pGrowth < 0 ? 'text-rr-text' : 'text-text3', 
            bg: stats.pGrowth && stats.pGrowth >= 0 ? 'bg-gd-bg' : stats.pGrowth && stats.pGrowth < 0 ? 'bg-rr-bg' : 'bg-surface2' 
          },
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-border-main shadow-sm p-6 flex flex-col gap-5 transition-all hover:shadow-md hover:border-border-alt`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text3 uppercase tracking-wider">{card.label}</span>
              <div className={`w-8 h-8 rounded-full ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className={`text-3xl font-bold text-text tracking-tight`}>{card.value}</div>
              <div className="text-xs text-text3 mt-1 font-medium">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Data Ingestion Velocity ── */}
      <div className="bg-white rounded-3xl border border-border-main shadow-sm p-8 group hover:shadow-md transition-all overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface2 flex items-center justify-center text-accent shadow-sm border border-border-main/50">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">Data Ingestion Velocity</h3>
                <p className="text-xs text-text3 font-medium">Pelacakan kemajuan input data portfolio periode <span className="text-accent font-bold">{curPeriod}</span></p>
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                     <span className="text-3xl font-black text-text">{stats.updatedCount}</span>
                     <span className="text-sm font-bold text-text4 uppercase tracking-widest">/ {stats.total} Klien</span>
                  </div>
                  <span className="text-sm font-black text-accent">{stats.progress.toFixed(0)}% Selesai</span>
               </div>
               <div className="h-3 bg-surface2 rounded-full overflow-hidden border border-border-main/30">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,99,1,0.3)]"
                    style={{ width: `${stats.progress}%` }}
                  />
               </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] bg-surface2/50 rounded-2xl border border-border-main p-5 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-text4" />
                   <span className="text-[10px] font-black text-text3 uppercase tracking-widest">Pending Updates</span>
                </div>
                <span className="text-[10px] font-bold text-rr-text bg-rr-bg px-2 py-0.5 rounded-full border border-rr-border/50">{stats.pending.length} Klien</span>
             </div>
             
             <div className="flex flex-wrap gap-2">
                {stats.pending.length > 0 ? (
                  stats.pending.slice(0, 6).map(cl => (
                    <div key={cl.key} className="px-3 py-1.5 bg-white border border-border-main rounded-xl text-[10px] font-bold text-text shadow-sm hover:border-accent/30 transition-colors">
                       {cl.key}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-gd-text font-bold text-[11px] py-2">
                     <CheckCircle2 className="w-4 h-4" /> Portfolio is up to date!
                  </div>
                )}
                {stats.pending.length > 6 && (
                   <div className="px-3 py-1.5 bg-surface3 border border-border-main rounded-xl text-[10px] font-bold text-text4">
                      +{stats.pending.length - 6} more
                   </div>
                )}
             </div>

             <Link 
              href="/admin/data" 
              className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-text text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-sm active:scale-95"
             >
                Lanjutkan Input Data <ArrowRight className="w-3.5 h-3.5" />
             </Link>
          </div>
        </div>
      </div>

      {/* ── Operational Modules ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {MENU.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-300 flex flex-col gap-6"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110"
                style={{ background: item.accentGradient }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.iconColor }} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-surface2 text-text3 border border-border-main uppercase tracking-wider">{item.badge}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-text group-hover:text-accent transition-colors">{item.title}</h2>
              <p className="text-xs text-text3 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-accent">
              {item.cta}
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer Sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Status Klien List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-border-main flex items-center justify-between">
             <div className="flex items-center gap-2.5">
                <PieChart className="w-4 h-4 text-text3" />
                <h2 className="text-sm font-bold text-text">Status Klien</h2>
             </div>
             <Link href="/admin/clients" className="w-7 h-7 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
          <div className="divide-y divide-border-main max-h-[420px] overflow-y-auto no-scrollbar">
            {CLIENTS.map(cl => {
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
              const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
              const t = totals(CLIENTS, DATA, cl.key, curPeriod);
              const statusStyle = STATUS_COLOR_MAP[wc] || STATUS_COLOR_MAP.nn;
              return (
                <Link
                  key={cl.key}
                  href={`/client/${encodeURIComponent(cl.key)}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-surface2 transition-colors group/row"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black shrink-0 group-hover/row:bg-accent group-hover/row:text-white transition-all">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text truncate group-hover/row:text-accent transition-colors">{cl.key}</div>
                    <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mt-0.5">{cl.ind}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-text">{t.rev > 0 ? fRp(t.rev) : '—'}</div>
                    <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: dotColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{STATUS_LABEL[wc] || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text">Log Aktivitas Terbaru</h2>
            </div>
            <Link href="/admin/activity" className="text-xs font-bold text-accent hover:underline">
              LIHAT SEMUA
            </Link>
          </div>
          <div className="divide-y divide-border-main">
            {recentActivity.length === 0 ? (
              <div className="py-24 text-center">
                 <p className="text-xs font-bold text-text4 uppercase tracking-wider">Belum ada aktivitas tercatat</p>
              </div>
            ) : recentActivity.map((a, i) => {
              const type = TYPE_MAP[a.t] || TYPE_MAP.e;
              return (
                <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-surface2 transition-colors">
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full ${type.dot || type.color.split(' ')[0]}`} />
                    {i < recentActivity.length - 1 && (
                      <div className="w-px flex-1 bg-border-main mt-1 min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`chip chip-${a.t}`}>{type.l}</span>
                       <span className="text-xs font-bold text-accent">{a.c}</span>
                       <span className="ml-auto text-[10px] text-text4 font-mono font-bold">{a.d}</span>
                    </div>
                    <p className="text-sm text-text font-medium leading-relaxed line-clamp-1">{a.n}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
