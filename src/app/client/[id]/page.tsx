'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import { CH_DEF, STAGE_COLOR, STAGE_LABEL, LM } from '@/lib/data';
import { totals, gd, isAware, prev, pct, popCls, fRp, fK, roas, clientWorst, chWorstKey } from '@/lib/utils';
import TrendChart from '@/components/TrendChart';
import { 
  ChevronLeft, 
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
  Layers
} from 'lucide-react';

function ClientDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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

  const MetricCard = ({ title, value, icon: Icon, growthNode, lastMonthStr, color = 'accent' }: any) => {
    const colorClasses: Record<string, string> = {
      accent: 'bg-accent/10 text-accent',
      green: 'bg-green-50 text-green-500',
      blue: 'bg-blue-50 text-blue-500',
      red: 'bg-red-50 text-red-500',
      yellow: 'bg-yellow-50 text-yellow-500',
    };
    return (
    <div className="bg-white rounded-[24px] p-6 shadow-main">
      <div className="flex justify-between items-start mb-6">
        <div className="text-[13px] font-semibold text-text2 uppercase tracking-wide">{title}</div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-bold text-text tracking-tight">{value}</div>
        {growthNode}
      </div>
      <div className="text-[12px] font-medium text-text3">
        Last month: <span className="text-text2">{lastMonthStr}</span>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <button 
        onClick={() => router.push(`/${searchParams.toString() ? '?' + searchParams.toString() : ''}`)}
        className="inline-flex items-center gap-2 text-sm text-text2 hover:text-accent font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Overview
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-lg font-bold">
            {id.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-3">
              {id}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-${wc}-bg text-${wc}-text`}>
                {LM[wc]}
              </span>
            </h1>
            <div className="flex items-center gap-4 text-xs text-text3 mt-1">
              <span>CG: <strong className="text-text2">{cl.cg}</strong></span>
              <span>TikTok: <strong className="text-text2">{cl.at}</strong></span>
              <span>Shopee: <strong className="text-text2">{cl.as}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {probs.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-800 text-sm">{probs.length} channel butuh perhatian</h4>
            <div className="mt-1 space-y-1">
              {probs.map(ch => {
                const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
                const aware = isAware(ch); const mk = aware ? 'reach' : 'rev';
                const v = pct((c as any)?.[mk], (p2 as any)?.[mk]);
                const r = roas(c); const tr = cl.troas[ch];
                return (
                  <div key={ch} className="text-xs text-red-700">
                    <strong>{CH_DEF[ch]?.l}</strong>: {aware ? 'reach' : 'revenue'} {v !== null ? (v >= 0 ? '+' : '') + Math.round(v) + '%' : '—'}
                    {!aware && r ? ` · ROAS ${r.toFixed(2)}x` : ''}
                    {tr && !aware ? ` (target ${tr}x)` : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Revenue" 
          value={fRp(bofu_rev + mofu_rev)} 
          icon={DollarSign} 
          growthNode={renderGrowthChip(bofu_rev + mofu_rev, pb_rev + pm_rev)}
          lastMonthStr={fRp(pb_rev + pm_rev)} 
          color="green"
        />
        <MetricCard 
          title="Total Spend" 
          value={fRp(bofu_sp + tofu_sp)} 
          icon={CreditCard} 
          growthNode={renderGrowthChip(bofu_sp + tofu_sp, pt_sp + pb_sp)}
          lastMonthStr={fRp(pt_sp + pb_sp)} 
          color="blue"
        />
        <MetricCard 
          title="ROAS (BOFU)" 
          value={bRoas ? bRoas.toFixed(2) + 'x' : '—'} 
          icon={TrendingUp} 
          growthNode={renderGrowthChip(bRoas || 0, pbRoas || 0)}
          lastMonthStr={pbRoas ? pbRoas.toFixed(2) + 'x' : '—'} 
          color="red"
        />
        <MetricCard 
          title="Total Orders" 
          value={totalOrd.toLocaleString('id-ID')} 
          icon={ShoppingCart} 
          growthNode={renderGrowthChip(totalOrd, prevTotalOrd)}
          lastMonthStr={prevTotalOrd.toLocaleString('id-ID')} 
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart Area */}
        <div className="bg-white rounded-[24px] p-8 shadow-main lg:col-span-2">
          <TrendChart clientKey={id} />
        </div>

        {/* Calculated Metrics */}
        <div className="bg-white rounded-[24px] p-8 shadow-main flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-text" />
            <h3 className="font-bold text-text">Performance Metrics</h3>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex justify-between items-end border-b border-border-main pb-4">
              <div>
                <div className="text-xs text-text3 font-medium mb-1">CIR</div>
                <div className="text-xl font-bold text-text">{blCir ? blCir.toFixed(1) + '%' : '—'}</div>
              </div>
              <div className="text-xs text-text3">spend ÷ rev</div>
            </div>
            <div className="flex justify-between items-end border-b border-border-main pb-4">
              <div>
                <div className="text-xs text-text3 font-medium mb-1">CPO</div>
                <div className="text-xl font-bold text-text">{blCpo ? fRp(blCpo) : '—'}</div>
              </div>
              <div className="text-xs text-text3">spend ÷ orders</div>
            </div>
            <div className="flex justify-between items-end border-b border-border-main pb-4">
              <div>
                <div className="text-xs text-text3 font-medium mb-1">CR</div>
                <div className="text-xl font-bold text-text">{blCr ? blCr.toFixed(2) + '%' : '—'}</div>
              </div>
              <div className="text-xs text-text3">orders ÷ visitors</div>
            </div>
            <div className="flex justify-between items-end pb-2">
              <div>
                <div className="text-xs text-text3 font-medium mb-1">AOV</div>
                <div className="text-xl font-bold text-text">{blAov ? fRp(blAov) : '—'}</div>
              </div>
              <div className="text-xs text-text3">rev ÷ orders</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-12 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-sm">
          <Filter className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-text">Funnel Performance</h2>
      </div>
      
      <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-main flex flex-col items-center max-w-4xl mx-auto relative">
        
        {/* TOFU Bar */}
        <div className="w-full relative group">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                 <Megaphone className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">TOFU • Awareness</div>
                <div className="text-3xl font-bold text-text tracking-tight">{tofu_reach > 0 ? fK(tofu_reach) : '—'} <span className="text-base font-medium text-text3 ml-1">Reach</span></div>
                <div className="flex gap-4 mt-3 text-sm font-medium text-text2">
                   <span>Ad Spend: <strong className="text-accent">{fRp(tofu_sp)}</strong></span>
                   <span>Impresi: <strong className="text-text">{fK(tofu_impr)}</strong></span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
               <div className="text-xs font-medium text-text3 uppercase mb-1">Cost per Reach</div>
               <div className="text-lg font-bold text-text">{tofu_reach > 0 && tofu_sp > 0 ? fRp(tofu_sp / tofu_reach) : '—'}</div>
            </div>
          </div>
          
          {/* Drop-off to MOFU */}
          <div className="flex flex-col items-center justify-center -my-2 relative z-0 h-16">
            <div className="w-px h-full bg-gradient-to-b from-blue-200 to-yellow-200 absolute top-0 left-1/2 -translate-x-1/2 z-0"></div>
            <div className="bg-white text-text2 text-[11px] font-bold px-4 py-1.5 rounded-full border border-border-main z-20 shadow-sm flex items-center gap-2">
              <span>Konversi ke Visit</span>
              <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md">{tofu_reach > 0 ? ((mofu_vis / (tofu_reach || 1)) * 100).toFixed(2) : 0}%</span>
            </div>
          </div>
        </div>

        {/* MOFU Bar */}
        <div className="w-11/12 md:w-[85%] relative group">
          <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white text-yellow-600 flex items-center justify-center shadow-sm border border-yellow-100">
                 <Store className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1.5">MOFU • Consideration</div>
                <div className="text-3xl font-bold text-text tracking-tight">{mofu_vis > 0 ? fK(mofu_vis) : '—'} <span className="text-base font-medium text-text3 ml-1">Visitors</span></div>
                <div className="flex gap-4 mt-3 text-sm font-medium text-text2">
                   <span>Shop Rev: <strong className="text-green-600">{fRp(mofu_rev)}</strong></span>
                   <span>Orders: <strong className="text-text">{fK(mofu_ord)}</strong></span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
               <div className="text-xs font-medium text-text3 uppercase mb-1">Conv. Rate</div>
               <div className="text-lg font-bold text-text">{mofu_vis > 0 ? ((mofu_ord / mofu_vis) * 100).toFixed(2) : 0}%</div>
            </div>
          </div>
          
          {/* Drop-off to BOFU */}
          <div className="flex flex-col items-center justify-center -my-2 relative z-0 h-16">
            <div className="w-px h-full bg-gradient-to-b from-yellow-200 to-green-200 absolute top-0 left-1/2 -translate-x-1/2 z-0"></div>
            <div className="bg-white text-text2 text-[11px] font-bold px-4 py-1.5 rounded-full border border-border-main z-20 shadow-sm flex items-center gap-2">
              <span>Checkout Rate</span>
              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{mofu_vis > 0 ? ((bofu_ord / (mofu_vis || 1)) * 100).toFixed(2) : 0}%</span>
            </div>
          </div>
        </div>

        {/* BOFU Bar */}
        <div className="w-5/6 md:w-[70%] relative group">
          <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white text-green-600 flex items-center justify-center shadow-sm border border-green-100">
                 <Target className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1.5">BOFU • Conversion</div>
                <div className="text-3xl font-bold text-text tracking-tight">{bofu_ord > 0 ? fK(bofu_ord) : '—'} <span className="text-base font-medium text-text3 ml-1">Ad Orders</span></div>
                <div className="flex gap-4 mt-3 text-sm font-medium text-text2">
                   <span>Ad Spend: <strong className="text-text">{fRp(bofu_sp)}</strong></span>
                   <span>Ad Rev: <strong className="text-green-600">{fRp(bofu_rev)}</strong></span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
               <div className="text-xs font-medium text-text3 uppercase mb-1">ROAS</div>
               <div className="text-lg font-bold text-text">{bRoas ? bRoas.toFixed(2) + 'x' : '—'}</div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-3 mt-12 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-sm">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-text">Channel Details</h2>
      </div>
      
      {['tofu', 'mofu', 'bofu'].map(stage => {
        const chs = cl.chs.filter(ch => CH_DEF[ch]?.stage === stage);
        if (!chs.length) return null;
        
        const stgColor = stage === 'tofu' ? 'text-blue-500 bg-blue-50' : stage === 'mofu' ? 'text-yellow-500 bg-yellow-50' : 'text-green-500 bg-green-50';
        
        return (
          <div key={stage} className="mb-8">
            <div className="flex items-center gap-4 mb-5">
              <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest ${stgColor} shadow-sm`}>
                {STAGE_LABEL[stage as keyof typeof STAGE_LABEL]}
              </span>
              <div className="h-px bg-border-main flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {chs.map(ch => {
                const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
                const wch = chWorstKey(DATA, PERIODS, id, ch, curPeriod);
                const aware = isAware(ch);
                
                let ChIcon = Zap;
                if (ch.includes('tt')) ChIcon = Smartphone;
                else if (ch.includes('sp')) ChIcon = ShoppingCart;
                else if (ch.includes('fb') || ch.includes('meta')) ChIcon = Activity;

                return (
                  <div key={ch} className="bg-white rounded-[24px] p-6 shadow-main flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-surface2 text-text group-hover:bg-accent group-hover:text-white transition-colors duration-300`}>
                            <ChIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-text">{CH_DEF[ch]?.l}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`w-2 h-2 rounded-full shadow-sm bg-${wch}`}></span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-text3">{LM[wch]}</span>
                            </div>
                          </div>
                        </div>
                        {cl.troas[ch] && roas(c) !== null && (() => {
                            const r = roas(c); const tr = cl.troas[ch];
                            if (tr && r) { 
                              const vp = (r - tr) / tr * 100; 
                              return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${vp >= 0 ? 'bg-gd-bg text-gd-text' : 'bg-rr-bg text-rr-text'}`}>{vp >= 0 ? '+' : ''}{vp.toFixed(0)}%</span>; 
                            }
                            return null;
                        })()}
                      </div>
                      
                      {/* Big Metric */}
                      <div className="mb-6">
                        {aware ? (
                          <>
                            <div className="text-[10px] font-bold text-text3 mb-1.5 uppercase tracking-widest">Total Reach</div>
                            <div className="text-3xl font-bold text-text tracking-tight">{c?.reach ? fK(c.reach) : '—'}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-[10px] font-bold text-text3 mb-1.5 uppercase tracking-widest">ROAS</div>
                            <div className="text-3xl font-bold text-text tracking-tight">{roas(c) ? roas(c)?.toFixed(2) + 'x' : '—'}</div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-3 bg-surface2 rounded-2xl p-4">
                      {aware ? (
                        <>
                          <div><span className="text-[10px] text-text3 font-semibold uppercase block mb-1">Spend</span><span className="font-bold text-sm text-text">{c?.sp ? fRp(c.sp) : '—'}</span></div>
                          <div><span className="text-[10px] text-text3 font-semibold uppercase block mb-1">Impresi</span><span className="font-bold text-sm text-text">{c?.impr ? fK(c.impr) : '—'}</span></div>
                        </>
                      ) : (
                        <>
                          <div><span className="text-[10px] text-text3 font-semibold uppercase block mb-1">Spend</span><span className="font-bold text-sm text-text">{c?.sp ? fRp(c.sp) : '—'}</span></div>
                          <div><span className="text-[10px] text-text3 font-semibold uppercase block mb-1">Revenue</span><span className="font-bold text-sm text-green-600">{c?.rev ? fRp(c.rev) : '—'}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <h2 className="text-lg font-bold text-text mt-8 mb-4">Activity Log</h2>
      <div className="bg-white rounded-[24px] p-8 shadow-main overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-text3 uppercase tracking-wider border-b border-border-main">
              <th className="pb-3 pl-2 w-32">Date</th>
              <th className="pb-3 w-32">Type</th>
              <th className="pb-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {ACTIVITY.filter(a => a.c === id).map((a, i) => {
              const cls = { p: 'bg-green-100 text-green-700', e: 'bg-blue-100 text-blue-700', c: 'bg-yellow-100 text-yellow-700', l: 'bg-red-100 text-red-700' }[a.t];
              const lbl = { p: 'Promo', e: 'Event', c: 'Content', l: 'Launching' }[a.t];
              return (
                <tr key={i} className="hover:bg-surface2 transition-all duration-200">
                  <td className="py-3 pl-2 text-sm text-text2 font-mono">{a.d}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${cls}`}>{lbl}</span>
                  </td>
                  <td className="py-3 text-sm text-text font-medium">{a.n}</td>
                </tr>
              );
            })}
            {ACTIVITY.filter(a => a.c === id).length === 0 && (
              <tr><td colSpan={3} className="py-4 text-center text-sm text-text3">No activity logged</td></tr>
            )}
          </tbody>
        </table>
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
