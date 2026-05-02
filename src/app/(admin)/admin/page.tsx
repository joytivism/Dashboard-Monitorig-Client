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
  rr: { bg: 'var(--color-rr-bg)',   text: 'var(--color-rr-text)',   border: 'var(--color-rr-border)'  },
  or: { bg: 'var(--color-or-bg)',   text: 'var(--color-or-text)',   border: 'var(--color-or-border)'  },
  yy: { bg: 'var(--color-yy-bg)',   text: 'var(--color-yy-text)',   border: 'var(--color-yy-border)'  },
  nn: { bg: 'var(--color-nn-bg)',   text: 'var(--color-nn-text)',   border: 'var(--color-nn-border)'  },
  gg: { bg: 'var(--color-gg-bg)',   text: 'var(--color-gg-text)',   border: 'var(--color-gg-border)'  },
  gd: { bg: 'var(--color-gd-bg)',   text: 'var(--color-gd-text)',   border: 'var(--color-gd-border)'  },
};
const STATUS_DOT: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};
const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis', or: 'Perlu Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Performa Baik', gd: 'Sangat Baik',
};
const TYPE_MAP: Record<string, { l: string; color: string }> = {
  p: { l: 'Promo',     color: 'bg-gg-bg text-gg-text border-gg-border'       },
  e: { l: 'Event',     color: 'bg-gd-bg text-gd-text border-gd-border'       },
  c: { l: 'Content',   color: 'bg-or-bg text-or-text border-or-border'       },
  l: { l: 'Launching', color: 'bg-rr-bg text-rr-text border-rr-border'       },
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
    <div className="space-y-10 animate-fade-in pb-12">

      {/* ── Top Header & Action ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 ring-4 ring-accent/5">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-text tracking-tight uppercase tracking-widest">Admin Hub</h1>
           </div>
           <p className="text-sm text-text3 mt-1.5 font-medium">Pusat kendali operasional dan manajemen ekosistem dashboard.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-border-main rounded-2xl px-5 py-3 shadow-sm hover:border-accent/30 transition-all group shrink-0">
          <CalendarClock className="w-4 h-4 text-text4 group-hover:text-accent transition-colors" />
          <span className="text-[11px] font-black text-text4 uppercase tracking-widest">Periode Aktif</span>
          <div className="h-4 w-px bg-border-main mx-1" />
          <span className="text-sm font-bold text-text">{curPeriod}</span>
          <span className="ml-2 text-[9px] font-black bg-gg-bg text-gg-text px-2 py-0.5 rounded-full border border-gg-border">LIVE</span>
        </div>
      </div>

      {/* ── Performance Highlights ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Portfolio', value: stats.total, sub: 'Klien Aktif', icon: Globe, color: 'text-text3', bg: 'bg-surface2' },
          { label: 'Blended ROAS', value: `${stats.totalRoas.toFixed(2)}x`, sub: 'Rata-rata Global', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/5' },
          { label: 'Tindakan Segera', value: stats.attn, sub: 'Klien Kritis', icon: AlertCircle, color: stats.attn > 0 ? 'text-rr-text' : 'text-text4', bg: stats.attn > 0 ? 'bg-rr-bg' : 'bg-surface2' },
          { label: 'Status Prima', value: stats.good, sub: 'Klien Berhasil', icon: CheckCircle2, color: stats.good > 0 ? 'text-gd-text' : 'text-text4', bg: stats.good > 0 ? 'bg-gd-bg' : 'bg-surface2' },
        ].map((card, i) => (
          <div key={i} className={`rounded-3xl p-6 border border-border-main shadow-sm flex flex-col gap-4 transition-all hover:shadow-md bg-white hover:border-accent/10`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-text4 uppercase tracking-widest">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 shadow-inner border border-white/50`}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className={`text-3xl font-bold tracking-tight ${card.color.startsWith('text-text') ? 'text-text' : card.color}`}>{card.value}</div>
              <div className="text-[10px] font-bold text-text4 mt-1 uppercase tracking-wider">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Financial Summary Strip ── */}
      <div className="bg-white rounded-3xl border border-border-main shadow-sm p-8 group hover:border-accent/10 transition-all">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gg-bg text-gg-text flex items-center justify-center">
                 <Wallet className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-text">Ringkasan Finansial Portfolio</h3>
           </div>
           <div className="text-[10px] font-bold text-text4 uppercase tracking-widest px-3 py-1 rounded-full bg-surface2 border border-border-main">{curPeriod}</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {[
            { label: 'Total Revenue',  value: fRp(stats.totalRev), color: 'text-gg-text' },
            { label: 'Total Ad Spend', value: fRp(stats.totalSpend), color: 'text-text' },
            { label: 'Net Difference', value: fRp(stats.totalRev - stats.totalSpend), color: 'text-text' },
            { label: 'Est. CIR Avg',      value: stats.totalRev > 0 ? (stats.totalSpend / stats.totalRev * 100).toFixed(1) + '%' : '—', color: 'text-text' },
          ].map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="text-[10px] font-black text-text4 uppercase tracking-[0.15em]">{item.label}</div>
              <div className={`text-xl font-bold tracking-tight ${item.color}`}>{item.value}</div>
            </div>
          ))}
        </div>
        
        <div className="relative pt-2">
           <div className="flex justify-between text-[9px] font-black text-text4 mb-3 uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> Ad Spend</div>
              <div className="flex items-center gap-2">Revenue <div className="w-2 h-2 rounded-full bg-gd" /></div>
           </div>
           <div className="h-2 bg-surface2 rounded-full overflow-hidden shadow-inner">
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
            className="group bg-white rounded-3xl p-7 border border-border-main shadow-sm hover:shadow-xl hover:border-accent/20 transition-all duration-300 flex flex-col gap-6"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                style={{ background: item.accentGradient }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.iconColor }} />
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-surface2 text-text3 border border-border-main uppercase tracking-widest">{item.badge}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-text group-hover:text-accent transition-colors">{item.title}</h2>
              <p className="text-xs text-text3 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
              {item.cta}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer Sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Status Klien List */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-border-main shadow-sm overflow-hidden flex flex-col group hover:border-accent/10 transition-all">
          <div className="px-8 py-6 border-b border-border-main flex items-center justify-between bg-surface1/30">
             <div className="flex items-center gap-3">
                <PieChart className="w-4 h-4 text-text4" />
                <h2 className="text-sm font-bold text-text tracking-tight uppercase tracking-wider">Status Klien</h2>
             </div>
             <Link href="/admin/clients" className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-text4 hover:bg-accent/10 hover:text-accent transition-all">
                <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
          <div className="divide-y divide-border-main/30 max-h-[420px] overflow-y-auto">
            {CLIENTS.map(cl => {
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
              const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
              const t = totals(CLIENTS, DATA, cl.key, curPeriod);
              return (
                <Link
                  key={cl.key}
                  href={`/client/${encodeURIComponent(cl.key)}`}
                  className="flex items-center gap-4 px-8 py-5 hover:bg-surface1 transition-colors group/row"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-text3 text-xs font-black shrink-0 group-hover/row:bg-accent group-hover/row:text-white transition-all">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text truncate group-hover/row:text-accent transition-colors">{cl.key}</div>
                    <div className="text-[10px] text-text4 font-bold uppercase tracking-wider mt-0.5">{cl.ind}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-text">{t.rev > 0 ? fRp(t.rev) : '—'}</div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: dotColor }} />
                      <span className="text-[9px] font-bold text-text4 uppercase tracking-tighter">{STATUS_LABEL[wc] || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-border-main shadow-sm overflow-hidden flex flex-col group hover:border-accent/10 transition-all">
          <div className="px-8 py-6 border-b border-border-main flex items-center justify-between bg-surface1/30">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text tracking-tight uppercase tracking-wider">Log Aktivitas Terbaru</h2>
            </div>
            <Link href="/admin/activity" className="text-[10px] font-bold text-accent px-4 py-1.5 bg-accent/5 rounded-full border border-accent/20 hover:bg-accent hover:text-white transition-all uppercase tracking-widest">
              LIHAT SEMUA
            </Link>
          </div>
          <div className="divide-y divide-border-main/30 p-2">
            {recentActivity.length === 0 ? (
              <div className="py-24 text-center">
                 <p className="text-xs font-bold text-text4 uppercase tracking-[0.2em]">Belum ada aktivitas tercatat</p>
              </div>
            ) : recentActivity.map((a, i) => {
              const type = TYPE_MAP[a.t] || TYPE_MAP.e;
              return (
                <div key={i} className="flex items-start gap-6 px-6 py-5 hover:bg-surface1 transition-colors rounded-2xl m-1">
                  <div className="flex flex-col items-center shrink-0 mt-1.5">
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${type.color.split(' ')[0]}`} />
                    {i < recentActivity.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border-main/50 mt-2 min-h-[30px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-3">
                       <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${type.color}`}>{type.l}</span>
                       <span className="text-xs font-black text-accent tracking-tight">{a.c}</span>
                       <span className="ml-auto text-[9px] font-mono text-text4 font-bold">{a.d}</span>
                    </div>
                    <p className="text-sm text-text font-medium leading-relaxed line-clamp-2">{a.n}</p>
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
