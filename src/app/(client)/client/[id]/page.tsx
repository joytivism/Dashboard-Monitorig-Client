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
    <div className="space-y-6 max-w-7xl mx-auto">
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

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Calendar className="w-4 h-4 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-accent transition-colors" />
            <select
              value={curPeriod}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('period', e.target.value);
                router.push(`?${params.toString()}`);
              }}
              className="h-11 pl-10 pr-10 bg-white border border-border-main rounded-xl text-sm font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer shadow-sm min-w-[160px]"
            >
              {PERIODS.map(p => (
                <option key={p} value={p}>
                  {(() => {
                    const [y, m] = p.split('-');
                    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    return `${months[parseInt(m) - 1]} ${y}`;
                  })()}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {probs.length > 0 && (
        <div className="bg-rr-bg rounded-2xl p-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-rr shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rr-text text-sm">{probs.length} channel butuh perhatian</h4>
            <div className="mt-1 space-y-1">
              {probs.map(ch => {
                const c = gd(DATA, id, ch, curPeriod), p2 = gd(DATA, id, ch, prv);
                const aware = isAware(ch); const mk = aware ? 'reach' : 'rev';
                const v = pct((c as any)?.[mk], (p2 as any)?.[mk]);
                const r = roas(c); const tr = cl.troas[ch];
                return (
                  <div key={ch} className="text-xs text-rr-text">
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

      {/* AI Summary Section */}
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

      <div className="grid grid-cols-1 gap-6">
        {/* Performance Vectors (Trend Chart) */}
        <div className="bg-white rounded-3xl p-8 border border-border-main shadow-sm animate-fade-in">
          <TrendChart clientKey={id} />
        </div>
      </div>

      {/* Strategic Efficiency Matrix — Power Rebuild (Typography Corrected) */}
      <div className="relative group overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-gg/10 to-accent/10 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
        
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-border-main p-8 shadow-sm transition-all duration-500 hover:shadow-md">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gg text-white flex items-center justify-center shadow-lg shadow-gg/10">
                 <Zap className="w-6 h-6 fill-white/20" />
              </div>
              <div>
                 <h3 className="text-sm font-bold text-text tracking-tight">Command Center Intelligence</h3>
                 <p className="text-[10px] font-bold text-text4 tracking-[0.2em]">Automated Intelligence Output</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface2 rounded-xl border border-border-main/50">
               <div className="w-2 h-2 rounded-full bg-gg animate-pulse" />
               <span className="text-[9px] font-bold text-text3 uppercase tracking-widest">Real-time Data Sync</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {[
              { l: 'Ad ROAS', v: bRoas ? bRoas.toFixed(2) + 'x' : '—', sub: 'Revenue / Spend', c: bRoas, p: pbRoas, i: TrendingUp },
              { l: 'CIR Index', v: blCir ? blCir.toFixed(1) + '%' : '—', sub: 'Spend / Revenue', c: blCir, p: (pb_sp > 0 && pb_rev > 0 ? pb_sp / pb_rev * 100 : 0), i: Activity },
              { l: 'CPO Target', v: blCpo ? fRp(blCpo) : '—', sub: 'Spend / Orders', c: blCpo, p: (pb_sp > 0 && pb_ord > 0 ? pb_sp / pb_ord : 0), i: Target },
              { l: 'Conv. Rate', v: blCr ? blCr.toFixed(2) + '%' : '—', sub: 'Orders / Visitors', c: blCr, p: (pm_vis > 0 && pm_ord > 0 ? pm_ord / pm_vis * 100 : 0), i: Layers },
              { l: 'Avg. Order', v: blAov ? fRp(blAov) : '—', sub: 'Revenue / Orders', c: blAov, p: (pb_rev > 0 && pb_ord > 0 ? pb_rev / pb_ord : 0), i: ShoppingCart },
            ].map((m, i) => {
              const g = m.c && m.p ? ((m.c - m.p) / m.p * 100) : null;
              const isGood = m.l === 'CIR Index' || m.l === 'CPO Target' ? (g !== null && g < 0) : (g !== null && g > 0);
              return (
                <div key={i} className="group/item">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-bold text-text4 uppercase tracking-[0.16em] group-hover/item:text-accent transition-colors">{m.l}</div>
                    <m.i className="w-3.5 h-3.5 text-text4 opacity-30 group-hover/item:opacity-100 group-hover/item:text-accent transition-all" />
                  </div>
                  <div className="text-3xl font-bold text-text tracking-tight mb-2 group-hover/item:scale-105 transition-transform origin-left">{m.v}</div>
                  <div className="flex items-center gap-2">
                    {g !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isGood ? 'bg-gg-bg text-gg-text' : 'bg-rr-bg text-rr-text'}`}>
                        {g > 0 ? '+' : ''}{g.toFixed(1)}%
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-text3/40 uppercase tracking-widest">{m.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-12 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-sm">
          <Filter className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-text">Funnel Performance</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* TOFU Bar */}
        <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm transition-transform duration-300 hover:-translate-y-1 relative group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-tofu-bg text-tofu flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.04)]">
               <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-tofu uppercase tracking-widest">TOFU</div>
              <div className="text-sm font-semibold text-text3">Awareness</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Total Reach</div>
              <div className="text-3xl font-bold text-text tracking-tight">{tofu_reach > 0 ? fK(tofu_reach) : '—'}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-border-main/50">
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">Impresi</span><span className="font-semibold text-sm text-text">{tofu_impr > 0 ? fK(tofu_impr) : '0'}</span></div>
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">Cost/Reach</span><span className="font-semibold text-sm text-text">{tofu_reach > 0 && tofu_sp > 0 ? fRp(tofu_sp / tofu_reach) : '—'}</span></div>
            </div>
            
            <div className="flex justify-between items-center bg-surface2 rounded-xl p-4 mt-4">
              <span className="text-xs font-semibold text-text2">Ad Spend</span>
              <span className="font-bold text-tofu">{tofu_sp > 0 ? fRp(tofu_sp) : 'Rp 0'}</span>
            </div>
          </div>
        </div>

        {/* MOFU Bar */}
        <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm transition-transform duration-300 hover:-translate-y-1 relative group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-mofu-bg text-mofu flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.04)]">
               <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-mofu uppercase tracking-widest">MOFU</div>
              <div className="text-sm font-semibold text-text3">Consideration</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Total Visitors</div>
              <div className="text-3xl font-bold text-text tracking-tight flex items-baseline gap-2">
                {mofu_vis > 0 ? fK(mofu_vis) : '—'}
                <span className="text-[11px] font-bold text-mofu bg-mofu-bg px-2 py-0.5 rounded-md relative -top-1">CVR: {tofu_reach > 0 ? ((mofu_vis / (tofu_reach || 1)) * 100).toFixed(2) : 0}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-border-main/50">
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">Orders</span><span className="font-semibold text-sm text-text">{mofu_ord > 0 ? fK(mofu_ord) : '0'}</span></div>
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">Conv. Rate</span><span className="font-semibold text-sm text-text">{mofu_vis > 0 ? ((mofu_ord / mofu_vis) * 100).toFixed(2) : 0}%</span></div>
            </div>
            
            <div className="flex justify-between items-center bg-surface2 rounded-xl p-4 mt-4">
              <span className="text-xs font-semibold text-text2">Shop Revenue</span>
              <span className="font-bold text-gg">{mofu_rev > 0 ? fRp(mofu_rev) : 'Rp 0'}</span>
            </div>
          </div>
        </div>

        {/* BOFU Bar */}
        <div className="bg-white rounded-2xl p-6 border border-border-main shadow-sm transition-transform duration-300 hover:-translate-y-1 relative group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-bofu-bg text-bofu flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.04)] border border-border-main/50">
               <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-bofu uppercase tracking-widest">BOFU</div>
              <div className="text-sm font-semibold text-text3">Conversion</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Total Ad Orders</div>
              <div className="text-3xl font-bold text-text tracking-tight flex items-baseline gap-2">
                {bofu_ord > 0 ? fK(bofu_ord) : '—'}
                <span className="text-[11px] font-bold text-bofu bg-bofu-bg border border-border-main/50 px-2 py-0.5 rounded-md relative -top-1">CHK: {mofu_vis > 0 ? ((bofu_ord / (mofu_vis || 1)) * 100).toFixed(2) : 0}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-border-main/50">
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">Ad Spend</span><span className="font-semibold text-sm text-text">{bofu_sp > 0 ? fRp(bofu_sp) : 'Rp 0'}</span></div>
              <div><span className="text-[10px] font-bold text-text3 block mb-1 uppercase tracking-wider">ROAS</span><span className="font-semibold text-sm text-text">{bRoas ? bRoas.toFixed(2) + 'x' : '—'}</span></div>
            </div>
            
            <div className="flex justify-between items-center bg-surface2 rounded-xl p-4 mt-4">
              <span className="text-xs font-semibold text-text2">Ad Revenue</span>
              <span className="font-bold text-gg">{bofu_rev > 0 ? fRp(bofu_rev) : 'Rp 0'}</span>
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
                  <div key={ch} className="bg-white rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
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
                          <div><span className="text-[10px] text-text3 font-semibold uppercase block mb-1">Revenue</span><span className="font-bold text-sm text-tofu">{c?.rev ? fRp(c.rev) : '—'}</span></div>
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
              const cls = { p: 'bg-gg-bg text-gg-text', e: 'bg-tofu-bg text-tofu', c: 'bg-mofu-bg text-mofu', l: 'bg-rr-bg text-rr-text' }[a.t];
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
