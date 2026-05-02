import React from 'react';
import { AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { fRp } from '@/lib/utils';

interface BannerItem {
  key: string;
  rev: number;
  growth?: number | null;
}

interface StatusBannersProps {
  risks: BannerItem[];
  opportunities: BannerItem[];
  onClientClick: (key: string) => void;
}

export const StatusBanners: React.FC<StatusBannersProps> = ({ risks, opportunities, onClientClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Column */}
      <div className="bg-rr-bg border border-rr-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rr text-white flex items-center justify-center shadow-lg shadow-rr/20">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-base font-bold text-rr-text">Attention Needed</h2>
               <p className="text-xs text-rr-text/60 font-semibold">High Risk Portfolio</p>
            </div>
          </div>
          {risks.length > 0 && (
            <span className="text-xs font-black px-3 py-1 bg-rr/10 text-rr-text rounded-xl border border-rr-border/40">
              {risks.length} KLIEN
            </span>
          )}
        </div>

        <div className="space-y-3">
          {risks.length > 0 ? (
            risks.slice(0, 3).map(cl => (
              <button
                key={cl.key}
                onClick={() => onClientClick(cl.key)}
                className="w-full flex items-center justify-between bg-white/70 rounded-2xl px-5 py-4 hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-rr-border/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rr/10 flex items-center justify-center text-rr text-xs font-black">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-rr-text leading-none mb-1.5">{cl.key}</div>
                    <div className="text-xs text-rr-text/60 font-bold">{fRp(cl.rev)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cl.growth !== undefined && cl.growth !== null && (
                    <span className="text-xs font-black text-rr flex items-center gap-0.5">
                      {cl.growth >= 0 ? '↑' : '↓'}{Math.abs(cl.growth).toFixed(1)}%
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-rr-text/20 group-hover:text-rr transition-colors" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center bg-white/40 rounded-2xl border border-dashed border-rr-border/40">
               <p className="text-xs font-bold text-rr-text/40 uppercase tracking-widest">No critical alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Opportunity Column */}
      <div className="bg-gg-bg border border-gg-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gg text-white flex items-center justify-center shadow-lg shadow-gg/20">
               <TrendingUp className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-base font-bold text-gg-text">Top Growth Clients</h2>
               <p className="text-xs text-gg-text/60 font-semibold">Opportunity Wins</p>
            </div>
          </div>
          {opportunities.length > 0 && (
            <span className="text-xs font-black px-3 py-1 bg-gg/10 text-gg-text rounded-xl border border-gg-border/40">
              TOP {opportunities.length}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {opportunities.length > 0 ? (
            opportunities.map(cl => (
              <button
                key={cl.key}
                onClick={() => onClientClick(cl.key)}
                className="w-full flex items-center justify-between bg-white/70 rounded-2xl px-5 py-4 hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-gg-border/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gg/10 flex items-center justify-center text-gg text-xs font-black">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gg-text leading-none mb-1.5">{cl.key}</div>
                    <div className="text-xs text-gg-text/60 font-bold">{fRp(cl.rev)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gg flex items-center gap-0.5">
                    ↑{cl.growth?.toFixed(1)}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-gg-text/20 group-hover:text-gg transition-colors" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center bg-white/40 rounded-2xl border border-dashed border-gg-border/40">
               <p className="text-xs font-bold text-gg-text/40 uppercase tracking-widest">Seeking opportunities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBanners;
