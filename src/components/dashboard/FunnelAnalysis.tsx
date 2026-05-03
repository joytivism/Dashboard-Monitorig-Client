import React from 'react';
import { Megaphone, Store, Target } from 'lucide-react';
import { fRp, fK } from '@/lib/utils';

interface FunnelStats {
  tofu: { sp: number; reach: number; impr: number; res: number };
  mofu: { vis: number; ord: number; rev: number };
  bofu: { sp: number; ord: number; rev: number };
}

interface FunnelAnalysisProps {
  stats: FunnelStats;
  roas: number | null;
}

export const FunnelAnalysis: React.FC<FunnelAnalysisProps> = ({ stats, roas }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* TOFU */}
      <div className="bg-white rounded-2xl p-8 border border-border-main shadow-sm space-y-6">
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
          <div className="type-overline mb-1">Total Reach</div>
          <div className="text-3xl font-bold text-text tracking-tight tabular-nums">{stats.tofu.reach > 0 ? fK(stats.tofu.reach) : '—'}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
          <div><span className="type-overline block mb-0.5">Impresi</span><span className="font-bold text-text tabular-nums">{stats.tofu.impr > 0 ? fK(stats.tofu.impr) : '0'}</span></div>
          <div><span className="type-overline block mb-0.5">Cost/Reach</span><span className="font-bold text-text tabular-nums">{stats.tofu.reach > 0 && stats.tofu.sp > 0 ? fRp(stats.tofu.sp / stats.tofu.reach) : '—'}</span></div>
        </div>
        <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
          <span className="text-sm font-bold text-text2">Ad Spend</span>
          <span className="font-bold text-tofu tabular-nums">{stats.tofu.sp > 0 ? fRp(stats.tofu.sp) : 'Rp 0'}</span>
        </div>
      </div>

      {/* MOFU */}
      <div className="bg-white rounded-2xl p-8 border border-border-main shadow-sm space-y-6">
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
          <div className="type-overline mb-1">Total Visitors</div>
          <div className="text-3xl font-bold text-text tracking-tight tabular-nums">{stats.mofu.vis > 0 ? fK(stats.mofu.vis) : '—'}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
          <div><span className="type-overline block mb-0.5">Orders</span><span className="font-bold text-text tabular-nums">{stats.mofu.ord > 0 ? fK(stats.mofu.ord) : '0'}</span></div>
          <div><span className="type-overline block mb-0.5">Shop Rev.</span><span className="font-bold text-gg tabular-nums">{stats.mofu.rev > 0 ? fK(stats.mofu.rev) : '0'}</span></div>
        </div>
        <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
          <span className="text-sm font-bold text-text2">Conversion</span>
          <span className="font-bold text-mofu tabular-nums">{stats.mofu.vis > 0 ? ((stats.mofu.ord / stats.mofu.vis) * 100).toFixed(2) : 0}%</span>
        </div>
      </div>

      {/* BOFU */}
      <div className="bg-white rounded-2xl p-8 border border-border-main shadow-sm space-y-6">
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
          <div className="type-overline mb-1">Total Ad Orders</div>
          <div className="text-3xl font-bold text-text tracking-tight tabular-nums">{stats.bofu.ord > 0 ? fK(stats.bofu.ord) : '—'}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-main/50">
          <div><span className="type-overline block mb-0.5">ROAS</span><span className="font-bold text-text tabular-nums">{roas ? roas.toFixed(2) + 'x' : '—'}</span></div>
          <div><span className="type-overline block mb-0.5">CHK Rate</span><span className="font-bold text-text tabular-nums">{stats.mofu.vis > 0 ? ((stats.bofu.ord / stats.mofu.vis) * 100).toFixed(2) : 0}%</span></div>
        </div>
        <div className="flex justify-between items-center bg-surface2 rounded-2xl p-4">
          <span className="text-sm font-bold text-text2">Ad Revenue</span>
          <span className="font-bold text-gg tabular-nums">{stats.bofu.rev > 0 ? fRp(stats.bofu.rev) : 'Rp 0'}</span>
        </div>
      </div>
    </div>
  );
};

export default FunnelAnalysis;
