'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Database,
  LayoutDashboard,
  Palette,
  Settings2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import ActivityLog from '@/components/dashboard/ActivityLog';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst, pct as getPct, totals } from '@/lib/utils';

const STATUS_TONE: Record<string, 'danger' | 'warning' | 'neutral' | 'success' | 'info'> = {
  rr: 'danger',
  or: 'warning',
  yy: 'warning',
  nn: 'neutral',
  gg: 'success',
  gd: 'info',
};

const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis',
  or: 'Perlu perhatian',
  yy: 'Waspada',
  nn: 'Stabil',
  gg: 'Baik',
  gd: 'Sangat baik',
};

export default function AdminHubPage() {
  const { CLIENTS, DATA, PERIODS, ACTIVITY, CH_DEF, AI_LOGS } = useDashboardData();
  const curPeriod = PERIODS[PERIODS.length - 1];

  const stats = useMemo(() => {
    let totalRev = 0;
    let totalSpend = 0;
    let prevRev = 0;
    const prevIdx = PERIODS.indexOf(curPeriod) - 1;
    const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

    CLIENTS.forEach((client) => {
      const current = totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod);
      totalRev += current.rev;
      totalSpend += current.sp;
      if (prevPeriod) {
        const previous = totals(CH_DEF, CLIENTS, DATA, client.key, prevPeriod);
        prevRev += previous.rev;
      }
    });

    const attentionClients = CLIENTS.filter((client) => ['rr', 'or'].includes(clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, curPeriod)));
    const totalRoas = totalSpend > 0 ? totalRev / totalSpend : 0;
    const growth = getPct(totalRev, prevRev);
    const updatedClients = CLIENTS.filter((client) => DATA.some((entry) => entry.c === client.key && entry.p === curPeriod));
    const ingestionProgress = (updatedClients.length / CLIENTS.length) * 100;
    const today = new Date().toDateString();

    return {
      totalRev,
      totalSpend,
      totalRoas,
      growth,
      attentionClients,
      updatedCount: updatedClients.length,
      progress: ingestionProgress,
      aiRequestsToday: AI_LOGS.filter((log) => new Date(log.d).toDateString() === today).length,
      aiRequestsTotal: AI_LOGS.length,
      aiTokens: AI_LOGS.reduce((accumulator, log) => accumulator + (log.tk || 0), 0),
    };
  }, [AI_LOGS, CH_DEF, CLIENTS, DATA, PERIODS, curPeriod]);

  const topPerformers = useMemo(() => {
    return CLIENTS.map((client) => {
      const current = totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod);
      return { ...client, roas: current.roas || 0, revenue: current.rev };
    })
      .sort((left, right) => right.roas - left.roas)
      .slice(0, 4);
  }, [CH_DEF, CLIENTS, DATA, curPeriod]);

  const atRisk = useMemo(() => {
    return CLIENTS.map((client) => {
      const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, curPeriod);
      const current = totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod);
      return { ...client, status, roas: current.roas || 0 };
    })
      .filter((client) => ['rr', 'or'].includes(client.status))
      .slice(0, 4);
  }, [CH_DEF, CLIENTS, DATA, PERIODS, curPeriod]);

  const quickActions = [
    { href: '/admin/data', icon: Database, title: 'Data Input', description: 'Upload dan cek ingest periodik.' },
    { href: '/admin/ai', icon: Zap, title: 'AI Monitoring', description: 'Pantau request, token, dan readiness.' },
    { href: '/admin/clients', icon: Users, title: 'Client Management', description: 'Review struktur dan ownership klien.' },
    { href: '/admin/design-system', icon: Palette, title: 'Design System', description: 'Preview komponen dan state UI internal.' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-20 animate-fade-in">
      <PageIntro
        eyebrow="Admin Console"
        title="Command center"
        description="Pusat operasi untuk memantau kesehatan portofolio, progres data, dan layer AI secara terpadu."
        meta={(
          <>
            <Badge tone="success" style="soft">Period {curPeriod}</Badge>
            <Badge tone="neutral" style="soft">{stats.updatedCount}/{CLIENTS.length} updated clients</Badge>
            <Badge tone={stats.attentionClients.length > 0 ? 'warning' : 'success'} style="soft">
              {stats.attentionClients.length} attention needed
            </Badge>
          </>
        )}
        actions={(
          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <Card className="p-4">
              <div className="ds-eyebrow">Data coverage</div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="text-2xl font-semibold tracking-[-0.03em] text-text">{stats.progress.toFixed(0)}%</div>
                <div className="text-xs text-text3">{stats.updatedCount} klien aktif</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-surface3">
                <div className="h-full rounded-full bg-accent" style={{ width: `${stats.progress}%` }} />
              </div>
            </Card>
            <Card className="p-4">
              <div className="ds-eyebrow">AI traffic</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text">{stats.aiRequestsToday}</div>
              <div className="mt-1 text-xs text-text3">request hari ini dari total {stats.aiRequestsTotal}</div>
            </Card>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Revenue" value={`Rp ${(stats.totalRev / 1e9).toFixed(1)}M`} icon={TrendingUp} trend={stats.growth} caption="Performa semua klien" tone="accent" />
        <MetricCard title="Blended ROAS" value={`${stats.totalRoas.toFixed(2)}x`} icon={LayoutDashboard} caption="Gabungan revenue / spend" />
        <MetricCard title="Critical Clients" value={stats.attentionClients.length} icon={AlertCircle} caption="Butuh tindakan strategis" tone={stats.attentionClients.length > 0 ? 'danger' : 'success'} />
        <MetricCard title="AI Tokens" value={stats.aiTokens.toLocaleString('id-ID')} icon={Zap} caption="Akumulasi token seluruh request" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border-main px-6 py-5">
            <div>
              <div className="ds-eyebrow">Portfolio pulse</div>
              <h2 className="mt-1 text-h4">Top performers vs at-risk</h2>
            </div>
            <Link href="/admin/clients" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover">
              View all
            </Link>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="space-y-3 border-b border-border-main p-6 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-text">Top performers</div>
                <Badge tone="success" style="soft">ROAS leaders</Badge>
              </div>
              {topPerformers.map((client) => (
                <div key={client.key} className="flex items-center justify-between rounded-[22px] border border-border-main bg-white px-4 py-4">
                  <div>
                    <div className="text-sm font-semibold text-text">{client.name}</div>
                    <div className="text-xs text-text3">{client.ind}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-gg-text">{client.roas.toFixed(2)}x</div>
                    <div className="text-xs text-text3">ROAS</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-text">At-risk accounts</div>
                <Badge tone="danger" style="soft">Review queue</Badge>
              </div>
              {atRisk.length > 0 ? (
                atRisk.map((client) => (
                  <div key={client.key} className="flex items-center justify-between rounded-[22px] border border-border-main bg-white px-4 py-4">
                    <div>
                      <div className="text-sm font-semibold text-text">{client.name}</div>
                      <div className="text-xs text-text3">{client.ind}</div>
                    </div>
                    <div className="text-right">
                      <Badge tone={STATUS_TONE[client.status]} style="soft">{STATUS_LABEL[client.status]}</Badge>
                      <div className="mt-2 text-xs text-text3">{client.roas.toFixed(2)}x ROAS</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-gg-border bg-gg-bg/50 px-5 py-10 text-center text-sm text-gg-text">
                  Semua klien berada di kondisi aman untuk periode ini.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="ds-eyebrow">Quick actions</div>
              <h2 className="mt-1 text-h4">Operational shortcuts</h2>
              <p className="mt-2 text-sm text-text3">Akses cepat ke area admin yang paling sering dipakai tim operasi.</p>
            </div>
            <Badge tone="neutral" style="soft">4 modules</Badge>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 rounded-[22px] border border-border-main bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-light text-accent">
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-text">{action.title}</div>
                  <div className="text-xs text-text3">{action.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-text4" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border-main px-6 py-5">
            <div>
              <div className="ds-eyebrow">Portfolio status</div>
              <h2 className="mt-1 text-h4">Current client health</h2>
            </div>
            <Link href="/admin/settings" className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover">
              <Settings2 className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <div className="divide-y divide-border-main/60">
            {CLIENTS.map((client) => {
              const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, curPeriod);
              return (
                <Link
                  key={client.key}
                  href={`/client/${client.key}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface2/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface2 text-xs font-semibold text-text2">
                    {client.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-text">{client.name}</div>
                    <div className="text-xs text-text3">{client.ind}</div>
                  </div>
                  <Badge tone={STATUS_TONE[status]} style="soft">
                    {STATUS_LABEL[status]}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-0 overflow-hidden">
            <div className="border-b border-border-main px-6 py-5">
              <div className="ds-eyebrow">Live feed</div>
              <h2 className="mt-1 text-h4">Recent portfolio activity</h2>
            </div>
            <ActivityLog activities={ACTIVITY.slice(0, 8)} />
          </Card>

          <Card className="space-y-5">
            <div>
              <div className="ds-eyebrow">System updates</div>
              <h2 className="mt-1 text-h4">Admin notes</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-[22px] border border-border-main bg-surface2 px-4 py-4">
                <div className="text-sm font-semibold text-text">AI monitoring is active</div>
                <p className="mt-1 text-sm text-text3">Total request tercatat: {stats.aiRequestsTotal}. Pantau readiness model dan spend dari menu AI Monitoring.</p>
              </div>
              <div className="rounded-[22px] border border-border-main bg-surface2 px-4 py-4">
                <div className="text-sm font-semibold text-text">Design system preview tersedia</div>
                <p className="mt-1 text-sm text-text3">Route internal baru tersedia di Admin Console untuk audit komponen, tokens, dan state UI.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
