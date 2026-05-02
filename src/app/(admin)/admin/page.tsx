'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
  AlertCircle, CheckCircle2, Zap, BarChart3, CalendarClock,
  ShieldCheck, Settings2, ArrowRight, LayoutDashboard,
  Wallet, PieChart, Globe
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
    let totalRev = 0, totalSpend = 0;
    CLIENTS.forEach(cl => {
      const t = totals(CLIENTS, DATA, cl.key, curPeriod);
      totalRev += t.rev;
      totalSpend += t.sp;
    });
    const attn = CLIENTS.filter(cl => ['rr', 'or'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
    const good = CLIENTS.filter(cl => ['gg', 'gd'].includes(clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod)));
    const totalRoas = totalSpend > 0 ? totalRev / totalSpend : 0;
    return { totalRev, totalSpend, attn: attn.length, good: good.length, totalRoas, total: CLIENTS.length };
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
          { label: 'Status Prima', value: stats.good, sub: 'Klien Berhasil', icon: CheckCircle2, color: stats.good > 0 ? 'text-gd-text' : 'text-text3', bg: stats.good > 0 ? 'bg-gd-bg' : 'bg-surface2' },
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

      {/* ── Financial Summary Strip ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-8 group hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text3">
                 <Wallet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text">Ringkasan Finansial Portfolio</h3>
           </div>
           <div className="text-[10px] font-bold text-text4 uppercase tracking-wider px-3 py-1 rounded-full bg-surface2 border border-border-main">{curPeriod}</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-8">
          {[
            { label: 'Total Revenue',  value: fRp(stats.totalRev), color: 'text-text' },
            { label: 'Total Ad Spend', value: fRp(stats.totalSpend), color: 'text-text' },
            { label: 'Net Difference', value: fRp(stats.totalRev - stats.totalSpend), color: 'text-text' },
            { label: 'Est. CIR Avg',      value: stats.totalRev > 0 ? (stats.totalSpend / stats.totalRev * 100).toFixed(1) + '%' : '—', color: 'text-text' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="text-xs font-semibold text-text3 uppercase tracking-wider">{item.label}</div>
              <div className={`text-xl font-bold text-text tracking-tight`}>{item.value}</div>
            </div>
          ))}
        </div>
        
        <div className="relative pt-2">
           <div className="flex justify-between text-[10px] font-bold text-text4 mb-3 uppercase tracking-wider">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Ad Spend</div>
              <div className="flex items-center gap-2">Revenue <div className="w-1.5 h-1.5 rounded-full bg-gd" /></div>
           </div>
           <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, (stats.totalRev / (stats.totalRev + stats.totalSpend)) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--color-gd))',
                }}
              />
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
