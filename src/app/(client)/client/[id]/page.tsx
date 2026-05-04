'use client';

import React, { use } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Filter,
  Layers,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AISummary from '@/components/AISummary';
import TrendChart from '@/components/TrendChart';
import ActivityLog from '@/components/dashboard/ActivityLog';
import ChannelPerformance from '@/components/dashboard/ChannelPerformance';
import FunnelAnalysis from '@/components/dashboard/FunnelAnalysis';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectField from '@/components/ui/SelectField';
import { LM } from '@/lib/data';
import { calculateEfficiency, calculateFunnelMetrics } from '@/lib/logic/calculations';
import { chWorstKey, clientWorst, fK, fRp, gd, isAware, pct, prev } from '@/lib/utils';

function ClientDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = decodeURIComponent(rawId);
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, ACTIVITY, PERIODS, CH_DEF, PL } = useDashboardData();
  const curPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const router = useRouter();

  const client = CLIENTS.find((item) => item.key === id);
  if (!client) {
    return <div className="p-20 text-center font-bold text-text3">Klien tidak ditemukan.</div>;
  }

  const previousPeriod = prev(PERIODS, curPeriod) || '';
  const worstClass = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, id, curPeriod);
  const problemChannels = client.chs.filter((channel) => ['rr', 'or'].includes(chWorstKey(CH_DEF, DATA, PERIODS, id, channel, curPeriod)));

  const stats = calculateFunnelMetrics(CH_DEF, DATA, id, client.chs, curPeriod);
  const previousStats = calculateFunnelMetrics(CH_DEF, DATA, id, client.chs, previousPeriod);
  const efficiency = calculateEfficiency(stats);
  const previousEfficiency = calculateEfficiency(previousStats);

  const totalRevenue = stats.bofu.rev + stats.mofu.rev;
  const previousRevenue = previousStats.bofu.rev + previousStats.mofu.rev;
  const totalSpend = stats.bofu.sp + stats.tofu.sp;
  const previousSpend = previousStats.bofu.sp + previousStats.tofu.sp;
  const totalOrders = stats.bofu.ord + stats.mofu.ord;
  const previousOrders = previousStats.bofu.ord + previousStats.mofu.ord;

  const efficiencyBlocks = [
    {
      label: 'Ad ROAS',
      value: efficiency.bRoas ? `${efficiency.bRoas.toFixed(2)}x` : '—',
      caption: 'Revenue / Spend',
      growth: pct(efficiency.bRoas || 0, previousEfficiency.bRoas || 0),
      positiveDirection: 'up' as const,
    },
    {
      label: 'CIR Index',
      value: efficiency.blCir ? `${efficiency.blCir.toFixed(1)}%` : '—',
      caption: 'Spend / Revenue',
      growth: pct(efficiency.blCir || 0, previousEfficiency.blCir || 0),
      positiveDirection: 'down' as const,
    },
    {
      label: 'CPO Target',
      value: efficiency.blCpo ? fRp(efficiency.blCpo) : '—',
      caption: 'Spend / Order',
      growth: pct(efficiency.blCpo || 0, previousEfficiency.blCpo || 0),
      positiveDirection: 'down' as const,
    },
    {
      label: 'Conversion Rate',
      value: efficiency.blCr ? `${efficiency.blCr.toFixed(2)}%` : '—',
      caption: 'Order / Visitor',
      growth: pct(efficiency.blCr || 0, previousEfficiency.blCr || 0),
      positiveDirection: 'up' as const,
    },
    {
      label: 'Average Order',
      value: efficiency.blAov ? fRp(efficiency.blAov) : '—',
      caption: 'Revenue / Order',
      growth: pct(efficiency.blAov || 0, previousEfficiency.blAov || 0),
      positiveDirection: 'up' as const,
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 pb-20 animate-fade-in pt-4">
      <PageIntro
        isCard
        eyebrow={`Client Portfolio • ${client.cg}`}
        title={client.name}
        description={`Comprehensive performance deep-dive for ${client.name}. Analyzed across awareness, conversion, and strategic AI layers.`}
        meta={(
          <div className="flex items-center gap-2">
            <Badge tone="accent" style="soft" className="px-3 py-1 text-[11px] font-bold">{client.ind}</Badge>
            <Badge tone={worstClass === 'rr' || worstClass === 'or' ? 'warning' : 'success'} style="soft" className="px-3 py-1 text-[11px] font-bold uppercase">
              {LM[worstClass]}
            </Badge>
          </div>
        )}
        actions={(
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => router.push(`/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-border-main bg-white/50 backdrop-blur-sm px-4 py-2.5 text-[13px] font-bold text-text-secondary hover:text-text-primary hover:border-border-alt transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Overview
            </button>
            <div className="w-full sm:w-[240px]">
              <SelectField
                aria-label="Pilih periode"
                icon={Calendar}
                value={curPeriod}
                onChange={(event) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('period', event.target.value);
                  router.push(`?${params.toString()}`);
                }}
                options={PERIODS.map((period) => ({ value: period, label: PL[period] || period }))}
                className="bg-white/50 backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>
        )}
      />

      <Card className="space-y-5">
        <SectionHeader
          eyebrow="Client profile"
          title="Portfolio context"
          description="Informasi dasar account untuk membaca ownership dan konteks operasional sebelum masuk ke performa."
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Card tone="muted" padding="sm" className="space-y-2">
            <div className="text-micro">Channel group</div>
            <div className="text-base font-semibold text-text">{client.cg || '—'}</div>
            <div className="text-xs text-text3">Cluster yang menangani portfolio ini.</div>
          </Card>
          <Card tone="muted" padding="sm" className="space-y-2">
            <div className="text-micro">Account strategist</div>
            <div className="text-base font-semibold text-text">{client.as || '—'}</div>
            <div className="text-xs text-text3">Pemilik strategi harian untuk account ini.</div>
          </Card>
          <Card tone="muted" padding="sm" className="space-y-2">
            <div className="text-micro">PIC client</div>
            <div className="text-base font-semibold text-text">{client.pic || '—'}</div>
            <div className="text-xs text-text3">Kontak utama operasional dari sisi klien.</div>
          </Card>
        </div>
      </Card>

      {problemChannels.length > 0 ? (
        <Card className="space-y-5 border-rr-border/80">
          <SectionHeader
            eyebrow="Priority review"
            title={`${problemChannels.length} channel butuh perhatian strategis`}
            description="Signal di bawah ini menunjukkan pressure point utama yang sebaiknya dievaluasi lebih dulu pada periode aktif."
            icon={AlertCircle}
            tone="danger"
            action={<Badge tone="danger" style="soft">Critical focus</Badge>}
          />
          <div className="grid gap-3 md:grid-cols-2">
            {problemChannels.map((channel) => {
              const current = gd(DATA, id, channel, curPeriod);
              const previous = gd(DATA, id, channel, previousPeriod);
              const aware = isAware(CH_DEF, channel);
              const currentMetric = aware ? (current?.reach ?? current?.impr) : current?.rev;
              const previousMetric = aware ? (previous?.reach ?? previous?.impr) : previous?.rev;
              const growth = pct(currentMetric, previousMetric);

              return (
                <div key={channel} className="rounded-[var(--radius-md)] border border-border-main bg-surface2/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-text">{CH_DEF[channel]?.l}</div>
                    <Badge tone="danger" style="soft">
                      {aware ? 'Reach signal' : 'Revenue signal'}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-text3">
                    Fokus pada perubahan paling tajam terhadap target atau periode sebelumnya.
                  </div>
                  <div className="mt-4 text-sm font-semibold text-rr-text">
                    {growth !== null ? `${growth >= 0 ? '+' : ''}${Math.round(growth)}%` : '—'} vs periode lalu
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Revenue" value={fRp(totalRevenue)} icon={DollarSign} trend={pct(totalRevenue, previousRevenue)} caption={`Lalu: ${fRp(previousRevenue)}`} tone="accent" />
        <MetricCard title="Total Spend" value={fRp(totalSpend)} icon={CreditCard} trend={pct(totalSpend, previousSpend)} caption={`Lalu: ${fRp(previousSpend)}`} />
        <MetricCard title="Ad ROAS (BOFU)" value={efficiency.bRoas ? `${efficiency.bRoas.toFixed(2)}x` : '—'} icon={TrendingUp} trend={pct(efficiency.bRoas || 0, previousEfficiency.bRoas || 0)} caption={`Lalu: ${previousEfficiency.bRoas ? `${previousEfficiency.bRoas.toFixed(2)}x` : '—'}`} />
        <MetricCard title="Total Orders" value={totalOrders.toLocaleString('id-ID')} icon={ShoppingCart} trend={pct(totalOrders, previousOrders)} caption={`Lalu: ${previousOrders.toLocaleString('id-ID')}`} />
      </div>

      <div className="space-y-5">
        <SectionHeader
          eyebrow="Strategy layer"
          title="Strategi dan AI insight"
          description="Ringkasan performa dan rekomendasi tindakan untuk membantu pengambilan keputusan lebih cepat."
          icon={Sparkles}
          tone="accent"
        />
        <AISummary
          clientName={client.key}
          metrics={{
            reach: fK(stats.tofu.reach),
            spend: fRp(totalSpend),
            revenue: fRp(totalRevenue),
            roas: efficiency.bRoas ? efficiency.bRoas.toFixed(2) : '0',
            cvr: efficiency.blCr ? efficiency.blCr.toFixed(2) : '0',
            chk: stats.mofu.vis > 0 ? ((stats.bofu.ord / (stats.mofu.vis || 1)) * 100).toFixed(2) : '0',
            growth: pct(efficiency.bRoas || 0, previousEfficiency.bRoas || 0) || 0,
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="space-y-5">
          <SectionHeader
            eyebrow="Performance"
            title="Trend performa"
            description="Grafik dan rasio inti untuk membaca efisiensi account pada periode aktif dan perubahan dibanding periode sebelumnya."
            icon={Activity}
            tone="success"
          />
          <TrendChart clientKey={id} />
        </Card>

        <Card className="space-y-5">
          <SectionHeader
            eyebrow="Efficiency breakdown"
            title="KPI snapshot"
            description="Snapshot rasio utama untuk melihat kualitas monetisasi dan efisiensi spend."
          />
          <div className="grid gap-4">
            {efficiencyBlocks.map((metric) => {
              const positive =
                metric.growth === null
                  ? null
                  : metric.positiveDirection === 'up'
                    ? metric.growth > 0
                    : metric.growth < 0;

              return (
                <div key={metric.label} className="group flex items-center justify-between rounded-xl border border-border-main bg-white p-5 transition-all hover:border-border-alt hover:shadow-sm">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest">{metric.label}</div>
                    <div className="text-[1.25rem] font-bold text-text-primary tabular-nums group-hover:text-accent transition-colors">{metric.value}</div>
                    <div className="text-[11px] font-medium text-text-tertiary">{metric.caption}</div>
                  </div>
                  {metric.growth !== null ? (
                    <div className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold tabular-nums",
                      positive ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                    )}>
                      {metric.growth > 0 ? '↑' : '↓'}
                      {Math.abs(metric.growth).toFixed(1)}%
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <SectionHeader
          eyebrow="Funnel analysis"
          title="Analisis funnel"
          description="Pembacaan funnel awareness, consideration, dan conversion untuk melihat bottleneck paling relevan."
          icon={Filter}
        />
        <FunnelAnalysis stats={stats} roas={efficiency.bRoas} />
      </div>

      <div className="space-y-5">
        <SectionHeader
          eyebrow="Channel view"
          title="Performa per channel"
          description="Detail channel aktif dan sinyal performa granular untuk memahami kontributor utama account."
          icon={Layers}
        />
        <ChannelPerformance clientId={id} channels={client.chs} data={DATA} periods={PERIODS} currentPeriod={curPeriod} />
      </div>

      <Card className="space-y-5">
        <SectionHeader
          eyebrow="Activity feed"
          title="Activity log"
          description="Catatan promo, event, content, dan launching yang memengaruhi ritme performa account."
          icon={Calendar}
        />
        <ActivityLog activities={ACTIVITY.filter((activityItem) => activityItem.c === id)} />
      </Card>
    </div>
  );
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <React.Suspense fallback={<div className="p-8 text-text3">Loading client...</div>}>
      <ClientDetailContent params={params} />
    </React.Suspense>
  );
}
