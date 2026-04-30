'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, fRp, totals } from '@/lib/utils';
import { Database, Activity, Users, ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    return { totalRev, totalSpend, attn: attn.length, good: good.length, totalRev_roas: totalSpend > 0 ? totalRev / totalSpend : 0 };
  }, [CLIENTS, DATA, PERIODS, curPeriod]);

  const MENU = [
    {
      href: '/admin/data',
      icon: Database,
      title: 'Input Data Performa',
      desc: 'Tambah atau update data bulanan per klien per channel (spend, revenue, orders, reach, dll.)',
      badge: 'Bulanan',
      badgeColor: 'bg-blue-50 text-blue-600',
      cta: 'Buka Form Input',
    },
    {
      href: '/admin/activity',
      icon: Activity,
      title: 'Kelola Activity Log',
      desc: 'Tambah, edit, atau hapus catatan promo, event, launching, dan konten per klien.',
      badge: 'Real-time',
      badgeColor: 'bg-orange-50 text-orange-600',
      cta: 'Kelola Activity',
    },
    {
      href: '/admin/clients',
      icon: Users,
      title: 'Manajemen Klien',
      desc: 'Tambah klien baru, ubah channel yang ditrack, atur PIC dan strategist.',
      badge: 'Jarang',
      badgeColor: 'bg-surface2 text-text3',
      cta: 'Kelola Klien',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Admin Hub</h1>
        <p className="text-sm text-text3 mt-1">Kelola data dan konfigurasi Real Advertise Command Center.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Klien', value: CLIENTS.length, sub: 'Aktif' },
          { label: 'Blended ROAS', value: stats.totalRev_roas.toFixed(2) + 'x', sub: curPeriod },
          { label: 'Butuh Perhatian', value: stats.attn, sub: 'Klien', icon: AlertCircle, iconColor: 'text-red-500' },
          { label: 'Performa Baik', value: stats.good, sub: 'Klien', icon: CheckCircle2, iconColor: 'text-emerald-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border-main shadow-sm">
            <div className="text-sm font-medium text-text3 mb-2 flex items-center gap-1.5">
              {s.icon && <s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />}
              {s.label}
            </div>
            <div className="text-3xl font-bold text-text tracking-tight">{s.value}</div>
            <div className="text-xs text-text3 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MENU.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5 text-text2 group-hover:text-white transition-colors" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>{item.badge}</span>
              </div>
              <h2 className="text-base font-bold text-text mb-2">{item.title}</h2>
              <p className="text-sm text-text3 leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-accent">
              {item.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Activity Log Terbaru</h2>
          <Link href="/admin/activity" className="text-xs font-semibold text-accent hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {ACTIVITY.slice(0, 5).map((a, i) => {
            const typeMap = { p: { l: 'Promo', c: 'bg-green-50 text-green-600' }, e: { l: 'Event', c: 'bg-blue-50 text-blue-600' }, c: { l: 'Content', c: 'bg-orange-50 text-orange-600' }, l: { l: 'Launching', c: 'bg-purple-50 text-purple-600' } };
            const type = typeMap[a.t] || typeMap.e;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${type.c}`}>{type.l}</span>
                <span className="text-sm font-semibold text-text shrink-0">{a.c}</span>
                <span className="text-sm text-text3 truncate">{a.n}</span>
                <span className="text-xs text-text3 shrink-0 ml-auto font-mono">{a.d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
