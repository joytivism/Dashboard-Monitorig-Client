'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import { CH_DEF, STAGE_COLOR, STAGE_LABEL, LM } from '@/lib/data';
import { totals, gd, isAware, prev, pct, popCls, fRp, fK, roas, clientWorst, chWorstKey } from '@/lib/utils';
import TrendChart from '@/components/TrendChart';
import { 
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Activity,
  Megaphone,
  Target,
  Store,
  Zap,
  Smartphone,
  Filter,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';
import AISummary from '@/components/AISummary';

function ClientDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = decodeURIComponent(rawId);
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, ACTIVITY, PERIODS, PL } = useDashboardData();
  const curPeriod = searchParams.get('period') || '2026-03';
  const router = useRouter();

  const cl = CLIENTS.find(x => x.key === id);
  if (!cl) return <div>Klien tidak ditemukan.</div>;

  const prv = prev(PERIODS, curPeriod) || '';
  const wc = clientWorst(CLIENTS, DATA, PERIODS, id, curPeriod);
  const probs = cl.chs.filter(ch => ['rr', 'or'].includes(chWorstKey(DATA, PERIODS, id, ch, curPeriod)));

  let tofu_sp = 0, tofu_reach = 0, tofu_impr = 0, tofu_res = 0;
  let pt_sp = 0, pt_reach = 0, pt_impr = 0, pt_res = 0;
  let mofu_vis = 0, mofu_ord = 0, mofu_rev = 0, pm_vis = 0, pm_ord = 0, pm_rev = 0;
  let bofu_rev = 0, bofu_sp = 0, bofu_ord = 0, pb_rev = 0, pb_sp = 0, pb_ord = 0;

  cl.chs.forEach(ch => {
    const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
    const stage = CH_DEF[ch]?.stage;
    if (stage === 'tofu' && c) { tofu_sp += c.sp || 0; tofu_reach += c.reach || 0; tofu_impr += c.impr || 0; tofu_res += c.results || 0; }
    if (stage === 'tofu' && p2) { pt_sp += p2.sp || 0; pt_reach += p2.reach || 0; pt_impr += p2.impr || 0; pt_res += p2.results || 0; }
    if (stage === 'mofu' && c) { mofu_vis += c.vis || 0; mofu_ord += c.ord || 0; mofu_rev += c.rev || 0; }
    if (stage === 'mofu' && p2) { pm_vis += p2.vis || 0; pm_ord += p2.ord || 0; pm_rev += p2.rev || 0; }
    if (stage === 'bofu' && c) { bofu_rev += c.rev || 0; bofu_sp += c.sp || 0; bofu_ord += c.ord || 0; }
    if (stage === 'bofu' && p2) { pb_rev += p2.rev || 0; pb_sp += p2.sp || 0; pb_ord += p2.ord || 0; }
  });

  const bRoas = bofu_sp > 0 ? bofu_rev / bofu_sp : null;
  const pbRoas = pb_sp > 0 ? pb_rev / pb_sp : null;
  const blCir = bofu_sp > 0 && bofu_rev > 0 ? bofu_sp / bofu_rev * 100 : null;
  const blCpo = bofu_sp > 0 && bofu_ord > 0 ? bofu_sp / bofu_ord : null;
  const blCr = mofu_vis > 0 && mofu_ord > 0 ? mofu_ord / mofu_vis * 100 : null;
  const blAov = bofu_rev > 0 && bofu_ord > 0 ? bofu_rev / bofu_ord : null;

  const totalOrd = bofu_ord + mofu_ord;
  const prevTotalOrd = pb_ord + pm_ord;

  function renderGrowthChip(c: number, p: number) {
    const v = pct(c, p);
    if (v === null) return null;
    const isUp = v >= 0;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${isUp ? 'bg-gd-bg text-gd-text border border-gd-border shadow-sm' : 'bg-rr-bg text-rr-text border border-rr-border shadow-sm'}`}>
        {isUp ? '↑' : '↓'} {Math.abs(v).toFixed(1)}%
      </span>
    );
  }

  const MetricCard = ({ title, value, icon: Icon, growthNode, lastMonthStr }: any) => {
    return (
    <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="text-sm font-semibold text-text2">{title}</div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface2 text-text">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-4xl font-bold text-text tracking-tight">{value}</div>
        {growthNode}
      </div>
      <div className="text-xs text-text3">
        Last month: {lastMonthStr}
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Navigation & Header */}
      <div className="space-y-6">
        <button 
          onClick={() => router.push(`/${searchParams.toString() ? '?' + searchParams.toString() : ''}`)}
          className="inline-flex items-center gap-2 text-sm text-text3 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent text-xl font-bold border border-accent/10 shadow-sm">
              {id.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text flex items-center gap-4">
                {id}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-${wc}-bg text-${wc}-text border border-${wc}-border/30`}>
                  {LM[wc]}
                </span>
              </h1>
              <div className="flex items-center gap-6 text-sm text-text3 mt-1.5 font-medium">
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
            <h4 className="font-bold text-rr-text text-base">{probs.length} Channel butuh perhatian strategis</h4>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {probs.map(ch => {
                const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
                const aware = isAware(ch); const mk = aware ? 'reach' : 'rev';
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
        <MetricCard title="Total Revenue" value={fRp(bofu_rev + mofu_rev)} icon={DollarSign} growthNode={renderGrowthChip(bofu_rev + mofu_rev, pb_rev + pm_rev)} lastMonthStr={fRp(pb_rev + pm_rev)} />
        <MetricCard title="Total Spend" value={fRp(bofu_sp + tofu_sp)} icon={CreditCard} growthNode={renderGrowthChip(bofu_sp + tofu_sp, pt_sp + pb_sp)} lastMonthStr={fRp(pt_sp + pb_sp)} />
        <MetricCard title="Ad ROAS (Bofu)" value={bRoas ? bRoas.toFixed(2) + 'x' : '—'} icon={TrendingUp} growthNode={renderGrowthChip(bRoas || 0, pbRoas || 0)} lastMonthStr={pbRoas ? pbRoas.toFixed(2) + 'x' : '—'} />
        <MetricCard title="Total Orders" value={totalOrd.toLocaleString('id-ID')} icon={ShoppingCart} growthNode={renderGrowthChip(totalOrd, prevTotalOrd)} lastMonthStr={prevTotalOrd.toLocaleString('id-ID')} />
      </div>

      {/* Strategy Insights Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">Strategi & Analisis Insight</h2>
        </div>
        <AISummary 
          clientName={cl.key}
          metrics={{
            reach: fK(tofu_reach),
            spend: fRp(bofu_sp + tofu_sp),
            revenue: fRp(bofu_rev + mofu_rev),
            roas: bRoas ? bRoas.toFixed(2) : '0',
            cvr: blCr ? blCr.toFixed(2) : '0',
            chk: mofu_vis > 0 ? ((bofu_ord / (mofu_vis || 1)) * 100).toFixed(2) : '0',
            growth: pct(bRoas || 0, pbRoas || 0) || 0
          }}
        />
      </div>

      {/* Performance & Trend Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gg text-white flex items-center justify-center shadow-lg shadow-gg/20">
            <Activity className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">Tren Performa & Efisiensi</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm">
            <TrendChart clientKey={id} />
          </div>

          <div className="bg-white rounded-3xl border border-border-main p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
              {[
                { l: 'Ad ROAS', v: bRoas ? bRoas.toFixed(2) + 'x' : '—', sub: 'Revenue / Spend', c: bRoas, p: pbRoas },
                { l: 'CIR Index', v: blCir ? blCir.toFixed(1) + '%' : '—', sub: 'Spend / Revenue', c: blCir, p: (pb_sp > 0 && pb_rev > 0 ? pb_sp / pb_rev * 100 : 0) },
                { l: 'CPO Target', v: blCpo ? fRp(blCpo) : '—', sub: 'Spend / Order', c: blCpo, p: (pb_sp > 0 && pb_ord > 0 ? pb_sp / pb_ord : 0) },
                { l: 'Conversion Rate', v: blCr ? blCr.toFixed(2) + '%' : '—', sub: 'Order / Visitor', c: blCr, p: (pm_vis > 0 && pm_ord > 0 ? pm_ord / pm_vis * 100 : 0) },
                { l: 'Average Order', v: blAov ? fRp(blAov) : '—', sub: 'Revenue / Order', c: blAov, p: (pb_rev > 0 && pb_ord > 0 ? pb_rev / pb_ord : 0) },
              ].map((m, i) => {
                const g = m.c && m.p ? ((m.c - m.p) / m.p * 100) : null;
                const isGood = m.l.includes('CIR') || m.l.includes('CPO') ? (g !== null && g < 0) : (g !== null && g > 0);
                return (
                  <div key={i}>
                    <div className="text-xs font-bold text-text3 mb-2">{m.l}</div>
                    <div className="text-2xl font-bold text-text tracking-tight mb-2">{m.v}</div>
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
          <h2 className="text-xl font-bold text-text tracking-tight">Analisis Corong Pemasaran</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TOFU */}
          <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-tofu-bg text-tofu flex items-center justify-center shadow-sm">
                 <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-tofu">Tofu</div>
                <div className="text-xs font-semibold text-text3">Awareness</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-text3 mb-1">Total Reach</div>
              <div className="text-3xl font-bold text-text tracking-tight">{tofu_reach > 0 ? fK(tofu_reach) : '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
              <div><span className="text-xs font-bold text-text3 block mb-0.5">Impresi</span><span className="font-bold text-text">{tofu_impr > 0 ? fK(tofu_impr) : '0'}</span></div>
              <div><span className="text-xs font-bold text-text3 block mb-0.5">Cost/Reach</span><span className="font-bold text-text">{tofu_reach > 0 && tofu_sp > 0 ? fRp(tofu_sp / tofu_reach) : '—'}</span></div>
            </div>
            <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
              <span className="text-sm font-bold text-text2">Ad Spend</span>
              <span className="font-bold text-tofu">{tofu_sp > 0 ? fRp(tofu_sp) : 'Rp 0'}</span>
            </div>
          </div>

          {/* MOFU */}
          <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-mofu-bg text-mofu flex items-center justify-center shadow-sm">
                 <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-mofu">Mofu</div>
                <div className="text-xs font-semibold text-text3">Consideration</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-text3 mb-1">Total Visitors</div>
              <div className="text-3xl font-bold text-text tracking-tight">{mofu_vis > 0 ? fK(mofu_vis) : '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
              <div><span className="text-xs font-bold text-text3 block mb-0.5">Orders</span><span className="font-bold text-text">{mofu_ord > 0 ? fK(mofu_ord) : '0'}</span></div>
              <div><span className="text-xs font-bold text-text3 block mb-0.5">Shop Rev.</span><span className="font-bold text-gg">{mofu_rev > 0 ? fK(mofu_rev) : '0'}</span></div>
            </div>
            <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
              <span className="text-sm font-bold text-text2">Conversion</span>
              <span className="font-bold text-mofu">{mofu_vis > 0 ? ((mofu_ord / mofu_vis) * 100).toFixed(2) : 0}%</span>
            </div>
          </div>

          {/* BOFU */}
          <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-bofu-bg text-bofu flex items-center justify-center shadow-sm border border-border-main/50">
                 <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-bofu">Bofu</div>
                <div className="text-xs font-semibold text-text3">Conversion</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-text3 mb-1">Total Ad Orders</div>
              <div className="text-3xl font-bold text-text tracking-tight">{bofu_ord > 0 ? fK(bofu_ord) : '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
              <div><span className="text-xs font-bold text-text3 block mb-0.5">ROAS</span><span className="font-bold text-text">{bRoas ? bRoas.toFixed(2) + 'x' : '—'}</span></div>
              <div><span className="text-xs font-bold text-text3 block mb-0.5">CHK Rate</span><span className="font-bold text-text">{mofu_vis > 0 ? ((bofu_ord / mofu_vis) * 100).toFixed(2) : 0}%</span></div>
            </div>
            <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
              <span className="text-sm font-bold text-text2">Ad Revenue</span>
              <span className="font-bold text-gg">{bofu_rev > 0 ? fRp(bofu_rev) : 'Rp 0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-text flex items-center justify-center border border-border-main shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">Performa Channel Detail</h2>
        </div>
        
        {['tofu', 'mofu', 'bofu'].map(stage => {
          const chs = cl.chs.filter(ch => CH_DEF[ch]?.stage === stage);
          if (!chs.length) return null;
          return (
            <div key={stage} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-text3 px-4 py-1.5 rounded-xl bg-surface2 border border-border-main/50">
                  {STAGE_LABEL[stage as keyof typeof STAGE_LABEL]}
                </span>
                <div className="h-px bg-border-main flex-1 opacity-50" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chs.map(ch => {
                  const c = gd(DATA, id, ch, curPeriod);
                  const wch = chWorstKey(DATA, PERIODS, id, ch, curPeriod);
                  const aware = isAware(ch);
                  let ChIcon = Zap;
                  if (ch.includes('tt')) ChIcon = Smartphone;
                  else if (ch.includes('sp')) ChIcon = ShoppingCart;
                  else if (ch.includes('fb') || ch.includes('meta')) ChIcon = Activity;

                  return (
                    <div key={ch} className="bg-white rounded-3xl p-6 border border-border-main shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-surface2 text-text group-hover:bg-accent group-hover:text-white transition-colors">
                              <ChIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-text">{CH_DEF[ch]?.l}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full bg-${wch}`} />
                                <span className="text-xs font-bold text-text4/60">{LM[wch]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-bold text-text4/60 mb-1">{aware ? 'Reach' : 'ROAS'}</div>
                          <div className="text-2xl font-bold text-text tracking-tight">
                            {aware ? (c?.reach ? fK(c.reach) : '—') : (roas(c) ? roas(c)?.toFixed(2) + 'x' : '—')}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-surface2 rounded-2xl p-4 border border-border-main/20">
                          <div><span className="text-xs font-bold text-text4/40 block mb-0.5">Spend</span><span className="font-bold text-sm text-text">{c?.sp ? fRp(c.sp) : '—'}</span></div>
                          <div><span className="text-xs font-bold text-text4/40 block mb-0.5">{aware ? 'Impresi' : 'Revenue'}</span><span className="font-bold text-sm text-text">{aware ? (c?.impr ? fK(c.impr) : '—') : (c?.rev ? fRp(c.rev) : '—')}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Log Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface2 text-text flex items-center justify-center border border-border-main shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">Log Aktivitas & Event</h2>
        </div>
        <div className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface2/50 border-b border-border-main">
                <th className="py-4 px-6 text-xs font-bold text-text3">Tanggal</th>
                <th className="py-4 px-6 text-xs font-bold text-text3">Kategori</th>
                <th className="py-4 px-6 text-xs font-bold text-text3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/30">
              {ACTIVITY.filter(a => a.c === id).map((a, i) => {
                const cls = { p: 'bg-gg-bg text-gg', e: 'bg-tofu-bg text-tofu', c: 'bg-mofu-bg text-mofu', l: 'bg-rr-bg text-rr' }[a.t];
                const lbl = { p: 'Promo', e: 'Event', c: 'Konten', l: 'Launching' }[a.t];
                return (
                  <tr key={i} className="hover:bg-surface2/30 transition-colors">
                    <td className="py-4 px-6 text-sm text-text2 font-medium">{a.d}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cls} border border-current/10`}>{lbl}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-text font-medium">{a.n}</td>
                  </tr>
                );
              })}
              {ACTIVITY.filter(a => a.c === id).length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-sm text-text3 font-medium">Belum ada aktivitas yang dicatat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      <div className="h-10"></div>
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
