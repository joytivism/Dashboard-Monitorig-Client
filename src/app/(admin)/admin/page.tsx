'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals } from '@/lib/utils';
import {
  Database,
  Activity,
  Users,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  BarChart3,
  CalendarClock,
  ShieldCheck,
  Settings2,
} from 'lucide-react';

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
      desc: 'Tambah atau update data bulanan per klien dan channel. Termasuk spend, revenue, orders, reach, dll.',
      badge: 'Bulanan',
      badgeClass: 'bg-blue-50 text-blue-600',
      cta: 'Buka Form Input',
      accentColor: 'from-blue-500/10 to-blue-500/5',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverIcon: 'group-hover:bg-blue-500 group-hover:text-white',
    },
    {
      href: '/admin/activity',
      icon: Activity,
      title: 'Kelola Activity Log',
      desc: 'Tambah, edit, atau hapus catatan promo, event, launching, dan konten per klien secara real-time.',
      badge: 'Real-time',
      badgeClass: 'bg-or-bg text-or-text',
      cta: 'Kelola Activity',
      accentColor: 'from-accent/10 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      hoverIcon: 'group-hover:bg-accent group-hover:text-white',
    },
    {
      href: '/admin/clients',
      icon: Users,
      title: 'Manajemen Klien',
      desc: 'Tambah klien baru, ubah channel yang ditrack, atur PIC dan account strategist per klien.',
      badge: 'Konfigurasi',
      badgeClass: 'bg-surface2 text-text3',
      cta: 'Kelola Klien',
      accentColor: 'from-gray-100 to-gray-50',
      iconBg: 'bg-surface2',
      iconColor: 'text-text2',
      hoverIcon: 'group-hover:bg-text group-hover:text-white',
    },
  ];

  const TYPE_MAP: Record<string, { l: string; cls: string }> = {
    p: { l: 'Promo', cls: 'bg-gg-bg text-gg-text' },
    e: { l: 'Event', cls: 'bg-tofu-bg text-tofu' },
    c: { l: 'Content', cls: 'bg-mofu-bg text-mofu' },
    l: { l: 'Launching', cls: 'bg-rr-bg text-rr-text' },
  };

  const recentActivity = ACTIVITY.slice(0, 6);

  return (
    <div className="space-y-8 max-w-6xl">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-text3 uppercase tracking-widest">Admin Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Command Center</h1>
          <p className="text-sm text-text3 mt-1">Kelola data dan konfigurasi Real Advertise — semua dalam satu tempat.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border-main rounded-xl px-4 py-2.5 shadow-sm">
          <CalendarClock className="w-4 h-4 text-text3" />
          <span className="text-sm font-bold text-text">{curPeriod}</span>
          <span className="text-[10px] bg-surface2 text-text3 px-2 py-0.5 rounded-full font-medium ml-1">Aktif</span>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Klien */}
        <div className="bg-white rounded-2xl p-5 border border-border-main shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text3">Total Klien</span>
            <div className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center">
              <Users className="w-4 h-4 text-text2" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text tracking-tight">{stats.total}</div>
            <div className="text-xs text-text3 mt-1">Klien aktif periode ini</div>
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-white rounded-2xl p-5 border border-border-main shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text3">Blended ROAS</span>
            <div className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-text2" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text tracking-tight">{stats.totalRoas.toFixed(2)}x</div>
            <div className="text-xs text-text3 mt-1">Semua klien · {curPeriod}</div>
          </div>
        </div>

        {/* Butuh Perhatian */}
        <div className={`rounded-2xl p-5 border shadow-sm flex flex-col gap-4 transition-all ${
          stats.attn > 0 ? 'bg-rr-bg border-rr-border' : 'bg-white border-border-main'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${stats.attn > 0 ? 'text-rr-text' : 'text-text3'}`}>Butuh Perhatian</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stats.attn > 0 ? 'bg-rr/20' : 'bg-surface2'}`}>
              <AlertCircle className={`w-4 h-4 ${stats.attn > 0 ? 'text-rr' : 'text-text2'}`} />
            </div>
          </div>
          <div>
            <div className={`text-3xl font-bold tracking-tight ${stats.attn > 0 ? 'text-rr-text' : 'text-text'}`}>{stats.attn}</div>
            <div className={`text-xs mt-1 ${stats.attn > 0 ? 'text-rr-text/70' : 'text-text3'}`}>
              {stats.attn > 0 ? 'Klien perlu tindakan segera' : 'Semua klien aman'}
            </div>
          </div>
        </div>

        {/* Performa Baik */}
        <div className={`rounded-2xl p-5 border shadow-sm flex flex-col gap-4 transition-all ${
          stats.good > 0 ? 'bg-gg-bg border-gg-border' : 'bg-white border-border-main'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${stats.good > 0 ? 'text-gg-text' : 'text-text3'}`}>Performa Baik</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stats.good > 0 ? 'bg-gg/20' : 'bg-surface2'}`}>
              <CheckCircle2 className={`w-4 h-4 ${stats.good > 0 ? 'text-gg' : 'text-text2'}`} />
            </div>
          </div>
          <div>
            <div className={`text-3xl font-bold tracking-tight ${stats.good > 0 ? 'text-gg-text' : 'text-text'}`}>{stats.good}</div>
            <div className={`text-xs mt-1 ${stats.good > 0 ? 'text-gg-text/70' : 'text-text3'}`}>
              {stats.good > 0 ? 'Klien dalam kondisi prima' : 'Data belum cukup'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Strip ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-text3" />
          <span className="text-sm font-semibold text-text2">Ringkasan Finansial · {curPeriod}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-text3 font-medium mb-1 uppercase tracking-wider">Total Revenue</div>
            <div className="text-xl font-bold text-gg-text">{fRp(stats.totalRev)}</div>
          </div>
          <div>
            <div className="text-xs text-text3 font-medium mb-1 uppercase tracking-wider">Total Ad Spend</div>
            <div className="text-xl font-bold text-text">{fRp(stats.totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-text3 font-medium mb-1 uppercase tracking-wider">Net Profit (Est.)</div>
            <div className="text-xl font-bold text-text">{fRp(stats.totalRev - stats.totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-text3 font-medium mb-1 uppercase tracking-wider">CIR (Avg)</div>
            <div className="text-xl font-bold text-text">
              {stats.totalRev > 0 ? (stats.totalSpend / stats.totalRev * 100).toFixed(1) + '%' : '—'}
            </div>
          </div>
        </div>
        {/* Progress bar: spend vs revenue */}
        {stats.totalRev > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-semibold text-text3 mb-1.5 uppercase tracking-wider">
              <span>Ad Spend</span>
              <span>Revenue</span>
            </div>
            <div className="h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-gg transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.totalRev / (stats.totalRev + stats.totalSpend)) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-4 h-4 text-text3" />
          <span className="text-sm font-semibold text-text2">Modul Admin</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MENU.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 flex flex-col justify-between gap-6 overflow-hidden"
            >
              {/* Subtle gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${item.iconBg} ${item.hoverIcon}`}>
                    <item.icon className="w-5 h-5 transition-colors duration-300" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-base font-bold text-text mb-2 group-hover:text-accent transition-colors duration-200">
                  {item.title}
                </h2>
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

      {/* ── Bottom: Client Status + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Client Status List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Status Klien</h2>
            <Link href="/admin/clients" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
              Kelola <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
            {CLIENTS.map(cl => {
              const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
              const statusDot: Record<string, string> = {
                rr: 'bg-rr', or: 'bg-or', yy: 'bg-yy', nn: 'bg-nn', gg: 'bg-gg', gd: 'bg-gd',
              };
              const statusLabel: Record<string, string> = {
                rr: 'Kritis', or: 'Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Baik', gd: 'Sangat Baik',
              };
              const t = totals(CLIENTS, DATA, cl.key, curPeriod);
              return (
                <Link
                  key={cl.key}
                  href={`/client/${encodeURIComponent(cl.key)}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface2 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-black shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text truncate">{cl.key}</div>
                    <div className="text-xs text-text3 mt-0.5">{cl.ind}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-text">{t.rev > 0 ? fRp(t.rev) : '—'}</div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[wc] || 'bg-nn'}`} />
                      <span className="text-[10px] text-text3">{statusLabel[wc] || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text">Activity Log Terbaru</h2>
            </div>
            <Link href="/admin/activity" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
              Lihat semua <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="py-16 text-center text-sm text-text3">
                Belum ada activity. <Link href="/admin/activity" className="text-accent font-semibold">Tambahkan sekarang →</Link>
              </div>
            ) : recentActivity.map((a, i) => {
              const type = TYPE_MAP[a.t] || TYPE_MAP.e;
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface2 transition-colors group">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${type.cls.split(' ')[0].replace('bg-', 'bg-').replace('-bg', '')}`} />
                    {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-border-main mt-1 min-h-[24px]" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${type.cls}`}>{type.l}</span>
                      <span className="text-sm font-bold text-accent shrink-0">{a.c}</span>
                    </div>
                    <p className="text-sm text-text mt-1 leading-snug truncate pr-4">{a.n}</p>
                  </div>
                  <span className="text-[10px] text-text3 font-mono shrink-0 pt-1">{a.d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
