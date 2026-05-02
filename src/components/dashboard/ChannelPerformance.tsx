import React from 'react';
import { Zap, Smartphone, ShoppingCart, Activity } from 'lucide-react';
import { CH_DEF, STAGE_LABEL, LM } from '@/lib/data';
import { gd, roas, fK, fRp, isAware, chWorstKey } from '@/lib/utils';

interface ChannelPerformanceProps {
  clientId: string;
  channels: string[];
  data: any[];
  periods: string[];
  currentPeriod: string;
}

export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({ 
  clientId, 
  channels, 
  data, 
  periods,
  currentPeriod 
}) => {
  return (
    <div className="space-y-12">
      {['tofu', 'mofu', 'bofu'].map(stage => {
        const stageChannels = channels.filter(ch => CH_DEF[ch]?.stage === stage);
        if (!stageChannels.length) return null;

        return (
          <div key={stage} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-text3 px-4 py-1.5 rounded-xl bg-surface2 border border-border-main/50">
                {STAGE_LABEL[stage as keyof typeof STAGE_LABEL]}
              </span>
              <div className="h-px bg-border-main flex-1 opacity-50" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stageChannels.map(ch => {
                const c = gd(data, clientId, ch, currentPeriod);
                const wch = chWorstKey(data, periods, clientId, ch, currentPeriod);
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
  );
};

export default ChannelPerformance;
