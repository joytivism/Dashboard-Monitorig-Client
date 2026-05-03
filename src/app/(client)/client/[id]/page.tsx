'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import { LM } from '@/lib/data';
import { gd, prev, pct, fRp, fK, clientWorst, chWorstKey, isAware } from '@/lib/utils';
import { calculateFunnelMetrics, calculateEfficiency } from '@/lib/logic/calculations';

import TrendChart from '@/components/TrendChart';
import AISummary from '@/components/AISummary';
import MetricCard from '@/components/ui/MetricCard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import FunnelAnalysis from '@/components/dashboard/FunnelAnalysis';
import ChannelPerformance from '@/components/dashboard/ChannelPerformance';

import { 
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Activity,
  Filter,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

function ClientDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = decodeURIComponent(rawId);
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, ACTIVITY, PERIODS, CH_DEF } = useDashboardData();
  const curPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const router = useRouter();

  const cl = CLIENTS.find(x => x.key === id);
  if (!cl) return <div className="p-20 text-center font-bold text-text3">Klien tidak ditemukan.</div>;

  const prv = prev(PERIODS, curPeriod) || '';
  const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, id, curPeriod);
  const probs = cl.chs.filter(ch => ['rr', 'or'].includes(chWorstKey(CH_DEF, DATA, PERIODS, id, ch, curPeriod)));

  // Centralized Logic
  const stats = calculateFunnelMetrics(CH_DEF, DATA, id, cl.chs, curPeriod);
  const pStats = calculateFunnelMetrics(CH_DEF, DATA, id, cl.chs, prv);
  const eff = calculateEfficiency(stats);
  const pEff = calculateEfficiency(pStats);

  const totalRev = stats.bofu.rev + stats.mofu.rev;
  const pTotalRev = pStats.bofu.rev + pStats.mofu.rev;
  const totalSp = stats.bofu.sp + stats.tofu.sp;
  const pTotalSp = pStats.bofu.sp + pStats.tofu.sp;
  const totalOrd = stats.bofu.ord + stats.mofu.ord;
  const pTotalOrd = pStats.bofu.ord + pStats.mofu.ord;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Navigation & Header */}
      <div className="space-y-6">
        <button 
          onClick={() => router.push(`/${searchParams.toString() ? '?' + searchParams.toString() : ''}`)}
          className="inline-flex items-center gap-2 text-label !text-text3 hover:!text-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent text-xl font-bold border border-accent/10 shadow-sm">
              {cl.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-h1 flex items-center gap-4">
                {cl.name}
                <span className={`chip ${wc === 'nn' ? 'chip-nn' : `bg-${wc}-bg text-${wc}-text border border-${wc}-border/30`}`}>
                  {LM[wc]}
                </span>
              </h1>
              <div className="flex items-center gap-6 text-label mt-2">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text4/30" /> CG: <strong className="text-text2">{cl.cg}</strong></span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text4/30" /> TikTok: <strong className="text-text2">{cl.at}</strong></span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text4/30" /> Shopee: <strong className="text-text2">{cl.as}</strong></span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 text-text4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={curPeriod}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('period', e.target.value);
                router.push(`?${params.toString()}`);
              }}
              className="h-12 pl-11 pr-12 bg-white border border-border-main rounded-2xl text-sm font-bold text-text focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer shadow-sm min-w-[200px]"
            >
              {PERIODS.map(p => {
                const [y, m] = p.split('-');
                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                return <option key={p} value={p}>{months[parseInt(m) - 1]} {y}</option>;
              })}
            </select>
            <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text4 rotate-90" />
          </div>
        </div>
      </div>

      {probs.length > 0 && (
        <div className="bg-rr-bg/30 rounded-3xl p-6 flex gap-4 items-start border border-rr-border/20">
          <div className="w-10 h-10 rounded-2xl bg-rr text-white flex items-center justify-center shadow-lg shadow-rr/20 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-h4 !text-rr-text">{probs.length} Channel butuh perhatian strategis</h4>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {probs.map(ch => {
                const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
                const aware = isAware(CH_DEF, ch); const mk = aware ? 'reach' : 'rev';
                const v = pct((c as any)?.[mk], (p2 as any)?.[mk]);
                return (
                  <div key={ch} className="text-sm text-rr-text/80 font-medium">
                    <strong className="text-rr-text">{CH_DEF[ch]?.l}</strong>: {aware ? 'Reach' : 'Revenue'} {v !== null ? (v >= 0 ? '+' : '') + Math.round(v) + '%' : '—'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value={fRp(totalRev)} icon={DollarSign} growth={pct(totalRev, pTotalRev)} subtext={`Lalu: ${fRp(pTotalRev)}`} />
        <MetricCard title="Total Spend" value={fRp(totalSp)} icon={CreditCard} growth={pct(totalSp, pTotalSp)} subtext={`Lalu: ${fRp(pTotalSp)}`} />
        <MetricCard title="Ad ROAS (Bofu)" value={eff.bRoas ? eff.bRoas.toFixed(2) + 'x' : '—'} icon={TrendingUp} growth={pct(eff.bRoas || 0, pEff.bRoas || 0)} subtext={`Lalu: ${pEff.bRoas ? pEff.bRoas.toFixed(2) + 'x' : '—'}`} />
        <MetricCard title="Total Orders" value={totalOrd.toLocaleString('id-ID')} icon={ShoppingCart} growth={pct(totalOrd, pTotalOrd)} subtext={`Lalu: ${pTotalOrd.toLocaleString('id-ID')}`} />
      </div>

      {/* Strategy Insights Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-h3">Strategi & Analisis Insight</h2>
        </div>
        <AISummary 
          clientName={cl.key}
          metrics={{
            reach: fK(stats.tofu.reach),
            spend: fRp(totalSp),
            revenue: fRp(totalRev),
            roas: eff.bRoas ? eff.bRoas.toFixed(2) : '0',
            cvr: eff.blCr ? eff.blCr.toFixed(2) : '0',
            chk: stats.mofu.vis > 0 ? ((stats.bofu.ord / (stats.mofu.vis || 1)) * 100).toFixed(2) : '0',
            growth: pct(eff.bRoas || 0, pEff.bRoas || 0) || 0
          }}
        />
      </div>

      {/* Performance & Trend Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gg text-white flex items-center justify-center shadow-lg shadow-gg/20">
            <Activity className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-h3">Tren Performa & Efisiensi</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm">
            <TrendChart clientKey={id} />
          </div>

          <div className="bg-white rounded-3xl border border-border-main p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
              {[
                { l: 'Ad ROAS', v: eff.bRoas ? eff.bRoas.toFixed(2) + 'x' : '—', sub: 'Revenue / Spend', c: eff.bRoas, p: pEff.bRoas },
                { l: 'CIR Index', v: eff.blCir ? eff.blCir.toFixed(1) + '%' : '—', sub: 'Spend / Revenue', c: eff.blCir, p: pEff.blCir },
                { l: 'CPO Target', v: eff.blCpo ? fRp(eff.blCpo) : '—', sub: 'Spend / Order', c: eff.blCpo, p: pEff.blCpo },
                { l: 'Conversion Rate', v: eff.blCr ? eff.blCr.toFixed(2) + '%' : '—', sub: 'Order / Visitor', c: eff.blCr, p: pEff.blCr },
                { l: 'Average Order', v: eff.blAov ? fRp(eff.blAov) : '—', sub: 'Revenue / Order', c: eff.blAov, p: pEff.blAov },
              ].map((m, i) => {
                const g = m.c && m.p ? ((m.c - m.p) / m.p * 100) : null;
                const isGood = m.l.includes('CIR') || m.l.includes('CPO') ? (g !== null && g < 0) : (g !== null && g > 0);
                return (
                  <div key={i}>
                    <div className="text-label !text-text3 mb-3">{m.l}</div>
                    <div className="text-h2 mb-2">{m.v}</div>
                    <div className="flex items-center gap-2">
                      {g !== null && (
                        <span className={`text-xs font-bold ${isGood ? 'text-gg' : 'text-rr'}`}>
                          {g > 0 ? '+' : ''}{g.toFixed(1)}%
                        </span>
                      )}
                      <span className="text-xs font-medium text-text4/60">{m.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Performance Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-text flex items-center justify-center border border-border-main shadow-sm">
            <Filter className="w-6 h-6" />
          </div>
          <h2 className="text-h3">Analisis Corong Pemasaran</h2>
        </div>
        <FunnelAnalysis stats={stats} roas={eff.bRoas} />
      </div>

      {/* Channel Performance Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-text flex items-center justify-center border border-border-main shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-h3">Performa Channel Detail</h2>
        </div>
        <ChannelPerformance clientId={id} channels={cl.chs} data={DATA} periods={PERIODS} currentPeriod={curPeriod} />
      </div>

      {/* Activity Log Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-text flex items-center justify-center border border-border-main shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-h3">Log Aktivitas & Event</h2>
        </div>
        <ActivityLog activities={ACTIVITY.filter(a => a.c === id)} />
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
