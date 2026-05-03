'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useDashboardData } from '@/components/DataProvider';
import ActivityLog from '@/components/dashboard/ActivityLog';
import ChannelPerformance from '@/components/dashboard/ChannelPerformance';
import FunnelAnalysis from '@/components/dashboard/FunnelAnalysis';
import PageIntro from '@/components/layout/PageIntro';
import AISummary from '@/components/AISummary';
import TrendChart from '@/components/TrendChart';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import SelectField from '@/components/ui/SelectField';
import { LM } from '@/lib/data';
import { calculateEfficiency, calculateFunnelMetrics } from '@/lib/logic/calculations';
import { chWorstKey, clientWorst, fK, fRp, gd, isAware, pct, prev } from '@/lib/utils';

function SectionHeader({
  icon: Icon,
  title,
  description,
  tone = 'neutral',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  tone?: 'neutral' | 'accent' | 'success';
}) {
  const toneClass =
    tone === 'accent'
      ? 'bg-accent-light text-accent'
      : tone === 'success'
        ? 'bg-gg-bg text-gg-text'
        : 'bg-surface2 text-text2';

  return (
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-h4">{title}</h2>
        {description ? <p className="mt-2 text-sm text-text3">{description}</p> : null}
      </div>
    </div>
  );
}

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
    <div className="mx-auto max-w-7xl space-y-7 pb-20 animate-fade-in">
      <PageIntro
        eyebrow="Client Portfolio"
        title={client.name}
        description="Ringkasan menyeluruh untuk membaca sinyal performa, funnel, AI insight, dan aktivitas terbaru dari akun klien ini."
        meta={(
          <>
            <Badge tone="neutral" style="soft">{client.cg}</Badge>
            <Badge tone="accent" style="soft">{client.ind}</Badge>
            <Badge tone={worstClass === 'rr' || worstClass === 'or' ? 'warning' : 'success'} style="soft">
              {LM[worstClass]}
            </Badge>
          </>
        )}
        actions={(
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              leadingIcon={ChevronLeft}
              onClick={() => router.push(`/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)}
            >
              Kembali ke overview
            </Button>
            <div className="min-w-[220px]">
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
              />
            </div>
          </div>
        )}
      />

      <Card className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
            <div className="text-micro">Channel group</div>
            <div className="mt-2 text-lg font-semibold text-text">{client.cg || '—'}</div>
            <div className="mt-2 text-xs text-text3">Cluster yang menangani portfolio ini.</div>
          </div>
          <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
            <div className="text-micro">Account strategist</div>
            <div className="mt-2 text-lg font-semibold text-text">{client.as || '—'}</div>
            <div className="mt-2 text-xs text-text3">Pemilik strategi harian untuk account ini.</div>
          </div>
          <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
            <div className="text-micro">PIC client</div>
            <div className="mt-2 text-lg font-semibold text-text">{client.pic || '—'}</div>
            <div className="mt-2 text-xs text-text3">Kontak utama operasional dari sisi klien.</div>
          </div>
        </div>
      </Card>

      {problemChannels.length > 0 ? (
        <Card tone="danger" className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rr text-white">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-h4 text-rr-text">{problemChannels.length} channel butuh perhatian strategis</h3>
              <p className="mt-2 text-sm text-rr-text/80">
                Signal di bawah ini menunjukkan pressure point utama yang sebaiknya dievaluasi lebih dulu pada periode aktif.
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {problemChannels.map((channel) => {
              const current = gd(DATA, id, channel, curPeriod);
              const previous = gd(DATA, id, channel, previousPeriod);
              const aware = isAware(CH_DEF, channel);
              const currentMetric = aware ? (current?.reach ?? current?.impr) : current?.rev;
              const previousMetric = aware ? (previous?.reach ?? previous?.impr) : previous?.rev;
              const growth = pct(currentMetric, previousMetric);

              return (
                <div key={channel} className="rounded-[22px] border border-rr-border bg-white/70 p-4">
                  <div className="text-sm font-semibold text-rr-text">{CH_DEF[channel]?.l}</div>
                  <div className="mt-2 text-xs text-rr-text/75">
                    {aware ? 'Reach / awareness signal' : 'Revenue / conversion signal'}
                  </div>
                  <div className="mt-3 text-sm font-medium text-rr-text">
                    {growth !== null ? `${growth >= 0 ? '+' : ''}${Math.round(growth)}%` : '—'} vs periode lalu
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Revenue" value={fRp(totalRevenue)} icon={DollarSign} trend={pct(totalRevenue, previousRevenue)} caption={`Lalu: ${fRp(previousRevenue)}`} tone="accent" />
        <MetricCard title="Total Spend" value={fRp(totalSpend)} icon={CreditCard} trend={pct(totalSpend, previousSpend)} caption={`Lalu: ${fRp(previousSpend)}`} />
        <MetricCard title="Ad ROAS (BOFU)" value={efficiency.bRoas ? `${efficiency.bRoas.toFixed(2)}x` : '—'} icon={TrendingUp} trend={pct(efficiency.bRoas || 0, previousEfficiency.bRoas || 0)} caption={`Lalu: ${previousEfficiency.bRoas ? `${previousEfficiency.bRoas.toFixed(2)}x` : '—'}`} />
        <MetricCard title="Total Orders" value={totalOrders.toLocaleString('id-ID')} icon={ShoppingCart} trend={pct(totalOrders, previousOrders)} caption={`Lalu: ${previousOrders.toLocaleString('id-ID')}`} />
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={Sparkles}
          title="Strategi dan AI insight"
          description="Ringkasan performa dan rekomendasi tindakan yang disusun untuk membantu pengambilan keputusan lebih cepat."
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
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border-main px-6 py-5">
            <SectionHeader
              icon={Activity}
              title="Trend performa"
              description="Grafik dan rasio inti untuk membaca efisiensi account pada periode aktif dan perubahan dibanding periode sebelumnya."
              tone="success"
            />
          </div>
          <div className="p-6">
            <TrendChart clientKey={id} />
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <div className="ds-eyebrow">Efficiency breakdown</div>
            <h2 className="mt-1 text-h4">KPI snapshot</h2>
          </div>
          <div className="grid gap-3">
            {efficiencyBlocks.map((metric) => {
              const positive =
                metric.growth === null
                  ? null
                  : metric.positiveDirection === 'up'
                    ? metric.growth > 0
                    : metric.growth < 0;

              return (
                <div key={metric.label} className="rounded-[22px] border border-border-main bg-surface2 p-4">
                  <div className="text-micro">{metric.label}</div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="text-xl font-semibold tracking-[-0.03em] text-text">{metric.value}</div>
                    {metric.growth !== null ? (
                      <span className={`text-xs font-semibold ${positive ? 'text-gg-text' : 'text-rr-text'}`}>
                        {metric.growth > 0 ? '+' : ''}
                        {metric.growth.toFixed(1)}%
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-xs text-text3">{metric.caption}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={Filter}
          title="Analisis funnel"
          description="Pembacaan funnel awareness, consideration, dan conversion untuk melihat bottleneck paling relevan."
        />
        <FunnelAnalysis stats={stats} roas={efficiency.bRoas} />
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={Layers}
          title="Performa per channel"
          description="Detail channel aktif dan sinyal performa granular untuk memahami kontributor utama account."
        />
        <ChannelPerformance clientId={id} channels={client.chs} data={DATA} periods={PERIODS} currentPeriod={curPeriod} />
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={Calendar}
          title="Activity log"
          description="Catatan promo, event, content, dan launching yang memengaruhi ritme performa account."
        />
        <ActivityLog activities={ACTIVITY.filter((activityItem) => activityItem.c === id)} />
      </div>
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
