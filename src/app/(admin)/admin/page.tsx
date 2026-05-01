'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals } from '@/lib/utils';
import {
  Database, Activity, Users, ArrowUpRight, TrendingUp,
  AlertCircle, CheckCircle2, Zap, BarChart3, CalendarClock,
  ShieldCheck, Settings2, ArrowRight,
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
  p: { l: 'Promo',     color: 'bg-gg-bg text-gg-text'       },
  e: { l: 'Event',     color: 'bg-gd-bg text-gd-text'       },
  c: { l: 'Content',   color: 'bg-or-bg text-or-text'       },
  l: { l: 'Launching', color: 'bg-rr-bg text-rr-text'       },
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
      desc: 'Tambah atau update data bulanan per klien dan channel. Termasuk spend, revenue, orders, dan lebih.',
      badge: 'Bulanan',
      badgeColor: '#EFF6FF',
      badgeText: '#1E40AF',
      iconBg: '#EFF6FF',
      iconColor: '#1D4ED8',
      accentGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      cta: 'Buka Form Input',
    },
    {
      href: '/admin/activity',
      icon: Activity,
      title: 'Kelola Activity Log',
      desc: 'Tambah, edit, atau hapus catatan promo, event, launching, dan konten per klien.',
      badge: 'Real-time',
      badgeColor: '#FFF4EE',
      badgeText: '#9A3412',
      iconBg: '#FFF4EE',
      iconColor: '#EA580C',
      accentGradient: 'linear-gradient(135deg, #FFF4EE 0%, #FFEDD5 100%)',
      cta: 'Kelola Activity',
    },
    {
      href: '/admin/clients',
      icon: Users,
      title: 'Manajemen Klien',
      desc: 'Tambah klien baru, ubah channel yang ditrack, dan atur PIC serta account strategist.',
      badge: 'Konfigurasi',
      badgeColor: '#F9FAFB',
      badgeText: '#374151',
      iconBg: '#F3F4F6',
      iconColor: '#374151',
      accentGradient: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      cta: 'Kelola Klien',
    },
  ];

  const recentActivity = ACTIVITY.slice(0, 7);

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <span className="text-[10px] font-black text-text3 uppercase tracking-[0.14em]">Admin Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Command Center</h1>
          <p className="text-sm text-text3 mt-1">Kelola data dan konfigurasi Real Advertise — semua dalam satu tempat.</p>
        </div>

        {/* Active period badge */}
        <div className="flex items-center gap-2 bg-white border border-border-main rounded-xl px-4 py-2.5 shadow-sm shrink-0 self-start">
          <CalendarClock className="w-4 h-4 text-text3" />
          <span className="text-sm font-bold text-text">{curPeriod}</span>
          <span className="text-[10px] bg-gg-bg text-gg-text px-2 py-0.5 rounded-full font-bold">Aktif</span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Klien',
            value: stats.total,
            sub: 'klien aktif periode ini',
            icon: Users,
            iconBg: '#F3F4F6',
            iconColor: '#374151',
            accent: false,
          },
          {
            label: 'Blended ROAS',
            value: `${stats.totalRoas.toFixed(2)}x`,
            sub: `Semua klien · ${curPeriod}`,
            icon: TrendingUp,
            iconBg: '#EFF6FF',
            iconColor: '#1D4ED8',
            accent: false,
          },
          {
            label: 'Butuh Perhatian',
            value: stats.attn,
            sub: stats.attn > 0 ? 'klien perlu tindakan segera' : 'Semua klien aman',
            icon: AlertCircle,
            iconBg: stats.attn > 0 ? 'var(--color-rr-bg)' : '#F3F4F6',
            iconColor: stats.attn > 0 ? 'var(--color-rr)' : '#9CA3AF',
            accent: stats.attn > 0 ? 'rr' : false,
          },
          {
            label: 'Performa Baik',
            value: stats.good,
            sub: stats.good > 0 ? 'klien dalam kondisi prima' : 'Data belum cukup',
            icon: CheckCircle2,
            iconBg: stats.good > 0 ? 'var(--color-gg-bg)' : '#F3F4F6',
            iconColor: stats.good > 0 ? 'var(--color-gg)' : '#9CA3AF',
            accent: stats.good > 0 ? 'gg' : false,
          },
        ].map((card, i) => {
          const sc = card.accent ? STATUS_COLOR_MAP[card.accent as string] : null;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md"
              style={{ borderColor: sc ? sc.border : 'var(--border)', background: sc ? sc.bg : '#fff' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: sc ? sc.text : 'var(--text3)' }}>{card.label}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: card.iconBg }}>
                  <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight" style={{ color: sc ? sc.text : 'var(--text)' }}>{card.value}</div>
                <div className="text-xs mt-1" style={{ color: sc ? sc.text + '99' : 'var(--text3)' }}>{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Revenue Strip ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-text3" />
          <span className="text-sm font-semibold text-text2">Ringkasan Finansial · <span className="text-text">{curPeriod}</span></span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Total Revenue',  value: fRp(stats.totalRev),                                                 color: 'var(--color-gg-text)'  },
            { label: 'Total Ad Spend', value: fRp(stats.totalSpend),                                               color: 'var(--text)'           },
            { label: 'Net Profit (Est.)', value: fRp(stats.totalRev - stats.totalSpend),                           color: 'var(--text)'           },
            { label: 'CIR (Avg)',      value: stats.totalRev > 0 ? (stats.totalSpend / stats.totalRev * 100).toFixed(1) + '%' : '—', color: 'var(--text)' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-[10px] font-bold text-text4 uppercase tracking-wider mb-1.5">{item.label}</div>
              <div className="text-xl font-bold" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        {stats.totalRev > 0 && (
          <div className="mt-5">
            <div className="flex justify-between text-[10px] font-semibold text-text4 mb-1.5 uppercase tracking-wider">
              <span>Ad Spend</span><span>Revenue</span>
            </div>
            <div className="h-1.5 bg-surface3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (stats.totalRev / (stats.totalRev + stats.totalSpend)) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--color-gg))',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Module Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-4 h-4 text-text3" />
          <span className="text-sm font-semibold text-text2">Modul Admin</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MENU.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-300 flex flex-col justify-between gap-6 overflow-hidden"
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: item.accentGradient }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ background: item.iconBg }}
                  >
                    <item.icon className="w-5 h-5 transition-colors" style={{ color: item.iconColor }} />
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: item.badgeColor, color: item.badgeText }}
                  >
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-base font-bold text-text mb-2 group-hover:text-accent transition-colors duration-200">{item.title}</h2>
                <p className="text-sm text-text3 leading-relaxed">{item.desc}</p>
              </div>

              <div className="relative flex items-center gap-1.5 text-sm font-semibold text-accent">
                {item.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom: Client Status + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Client Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-main flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Status Klien</h2>
            <Link href="/admin/clients" className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-surface2 max-h-[380px] overflow-y-auto">
            {CLIENTS.map(cl => {
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
              const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
              const t = totals(CLIENTS, DATA, cl.key, curPeriod);
              return (
                <Link
                  key={cl.key}
                  href={`/client/${encodeURIComponent(cl.key)}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface2 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-black shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-200">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text truncate">{cl.key}</div>
                    <div className="text-xs text-text3 truncate mt-0.5">{cl.ind}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-text">{t.rev > 0 ? fRp(t.rev) : '—'}</div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
                      <span className="text-[10px] text-text3">{STATUS_LABEL[wc] || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text">Activity Log Terbaru</h2>
            </div>
            <Link href="/admin/activity" className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-surface2">
            {recentActivity.length === 0 ? (
              <div className="py-14 text-center text-sm text-text3">
                Belum ada activity.{' '}
                <Link href="/admin/activity" className="text-accent font-semibold">Tambahkan sekarang →</Link>
              </div>
            ) : recentActivity.map((a, i) => {
              const type = TYPE_MAP[a.t] || TYPE_MAP.e;
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface2 transition-colors">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full ${type.color.split(' ')[0]}`} />
                    {i < recentActivity.length - 1 && (
                      <div className="w-px flex-1 bg-border-main mt-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${type.color}`}>{type.l}</span>
                      <span className="text-xs font-bold text-accent shrink-0">{a.c}</span>
                    </div>
                    <p className="text-sm text-text mt-1 leading-snug line-clamp-1">{a.n}</p>
                  </div>
                  <span className="text-[10px] text-text3 font-mono shrink-0 mt-1">{a.d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
