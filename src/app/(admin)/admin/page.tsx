'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals, pct as getPct } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
  AlertCircle, Zap, LayoutDashboard,
  CalendarClock, Settings2, ArrowRight, Globe, TrendingDown,
  PieChart
} from 'lucide-react';

import MetricCard from '@/components/ui/MetricCard';
import IngestionVelocity from '@/components/dashboard/IngestionVelocity';
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
  const { CLIENTS, DATA, PERIODS, ACTIVITY } = useDashboardData();
  const curPeriod = PERIODS[PERIODS.length - 1];

  const stats = useMemo(() => {
    let totalRev = 0, totalSpend = 0, prevRev = 0;
    const prevIdx = PERIODS.indexOf(curPeriod) - 1;
    const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

    CLIENTS.forEach(cl => {
      const t = totals([], DATA, cl.key, curPeriod);
      totalRev += t.rev;
      totalSpend += t.sp;
      if (prevPeriod) {
        const tp = totals([], DATA, cl.key, prevPeriod);
        prevRev += tp.rev;
      }
    });

    const attn = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst([cl], DATA, PERIODS, cl.key, curPeriod)));
    const totalRoas = totalSpend > 0 ? totalRev / totalSpend : 0;
    const pGrowth = getPct(totalRev, prevRev);
    
    const updatedClients = CLIENTS.filter(cl => DATA.some(d => d.c === cl.key && d.p === curPeriod));
    const pendingClients = CLIENTS.filter(cl => !updatedClients.find(u => u.key === cl.key));
    const ingestionProgress = (updatedClients.length / CLIENTS.length) * 100;

    return { 
      totalRev, totalSpend, totalRoas, pGrowth,
      attnCount: attn.length, 
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

  return (
    <div className="w-full space-y-12 animate-fade-in pb-12 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
           <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 shrink-0">
              <LayoutDashboard className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-text tracking-tight">Admin Hub</h1>
              <p className="text-sm font-medium text-text3 mt-1">Pusat kendali operasional dan manajemen ekosistem dashboard.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-border-main rounded-2xl px-5 py-3 shadow-sm hover:border-accent/30 transition-all group shrink-0">
          <CalendarClock className="w-4 h-4 text-text4 group-hover:text-accent transition-colors" />
          <span className="text-xs font-bold text-text3 uppercase tracking-wider">Periode Aktif</span>
          <div className="h-4 w-px bg-border-main mx-2" />
          <span className="text-sm font-bold text-text">{curPeriod}</span>
          <span className="ml-2 text-[10px] font-black uppercase tracking-wider bg-gg-bg text-gg px-2.5 py-1 rounded-full border border-gg-border/30">LIVE</span>
        </div>
      </div>

      {/* Global Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Portfolio" value={stats.total} icon={Globe} growth={null} subtext="Klien Aktif" />
        <MetricCard title="Blended ROAS" value={`${stats.totalRoas.toFixed(2)}x`} icon={TrendingUp} variant="accent" growth={null} subtext="Rata-rata Global" />
        <MetricCard 
          title="Tindakan Segera" 
          value={stats.attnCount} 
          icon={AlertCircle} 
          variant={stats.attnCount > 0 ? 'rr' : 'default'}
          growth={null} 
          subtext="Klien Kritis" 
        />
        <MetricCard 
          title="Portfolio Growth" 
          value={stats.pGrowth !== null ? `${stats.pGrowth >= 0 ? '+' : ''}${stats.pGrowth.toFixed(1)}%` : '0%'} 
          icon={stats.pGrowth && stats.pGrowth >= 0 ? TrendingUp : TrendingDown} 
          variant={stats.pGrowth && stats.pGrowth >= 0 ? 'gg' : stats.pGrowth && stats.pGrowth < 0 ? 'rr' : 'default'}
          growth={null} 
          subtext="Kenaikan Revenue Total" 
        />
      </div>

      {/* Ingestion Monitor */}
      <IngestionVelocity 
        updatedCount={stats.updatedCount}
        total={stats.total}
        progress={stats.progress}
        pending={stats.pending}
        curPeriod={curPeriod}
      />

      {/* Operational Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {MENU.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-3xl p-8 border border-border-main shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col gap-6"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110"
                style={{ background: item.accentGradient }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.iconColor }} />
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-xl bg-surface2 text-text3 border border-border-main uppercase tracking-wider">{item.badge}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-text group-hover:text-accent transition-colors">{item.title}</h2>
              <p className="text-sm text-text3 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-accent">
              {item.cta}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Client Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="px-8 py-6 border-b border-border-main flex items-center justify-between">
             <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-text3" />
                <h2 className="text-base font-bold text-text">Status Portfolio Klien</h2>
             </div>
             <Link href="/admin/clients" className="w-9 h-9 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                <ArrowRight className="w-5 h-5" />
             </Link>
          </div>
          <div className="divide-y divide-border-main max-h-[480px] overflow-y-auto no-scrollbar">
            {CLIENTS.map(cl => {
              const wc = clientWorst([cl], DATA, PERIODS, cl.key, curPeriod);
              const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
              const t = totals([], DATA, cl.key, curPeriod);
              const statusStyle = STATUS_COLOR_MAP[wc] || STATUS_COLOR_MAP.nn;
              return (
                <Link
                  key={cl.key}
                  href={`/client/${encodeURIComponent(cl.key)}`}
                  className="flex items-center gap-4 px-8 py-5 hover:bg-surface2 transition-colors group/row"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black shrink-0 group-hover/row:bg-accent group-hover/row:text-white transition-all">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text truncate group-hover/row:text-accent transition-colors">{cl.key}</div>
                    <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mt-0.5">{cl.ind}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-text">{t.rev > 0 ? fRp(t.rev) : '—'}</div>
                    <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: dotColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{STATUS_LABEL[wc] || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="px-8 py-6 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-base font-bold text-text">Log Aktivitas Terbaru</h2>
            </div>
            <Link href="/admin/activity" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">
              LIHAT SEMUA
            </Link>
          </div>
          <ActivityLog activities={ACTIVITY.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
