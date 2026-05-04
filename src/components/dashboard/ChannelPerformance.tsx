import React from 'react';
import { Activity, ShoppingCart, Smartphone, Zap } from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { STAGE_LABEL, LM, type DataEntry } from '@/lib/data';
import { gd, roas, fK, fRp, isAware, chWorstKey } from '@/lib/utils';

interface ChannelPerformanceProps {
  clientId: string;
  channels: string[];
  data: DataEntry[];
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
  const { CH_DEF } = useDashboardData();
  const stageConfig = {
    tofu: { tone: 'neutral' as const, description: 'Awareness channels dan sinyal jangkauan teratas.' },
    mofu: { tone: 'accent' as const, description: 'Consideration channels yang mendorong traffic dan intent.' },
    bofu: { tone: 'info' as const, description: 'Conversion channels untuk revenue dan order performance.' },
  };
  const statusToneMap = {
    rr: 'danger',
    or: 'warning',
    yy: 'warning',
    nn: 'neutral',
    gg: 'success',
    gd: 'info',
  } as const;

  return (
    <div className="space-y-8">
      {(['tofu', 'mofu', 'bofu'] as const).map((stage) => {
        const stageChannels = channels.filter((ch) => CH_DEF[ch]?.stage === stage);
        if (!stageChannels.length) return null;

        return (
          <div key={stage} className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge tone={stageConfig[stage].tone} style="soft">
                {STAGE_LABEL[stage as keyof typeof STAGE_LABEL]}
                </Badge>
                <p className="text-sm text-text3">{stageConfig[stage].description}</p>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text4">
                {stageChannels.length} channel
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stageChannels.map((ch) => {
                const c = gd(data, clientId, ch, currentPeriod);
                const wch = chWorstKey(CH_DEF, data, periods, clientId, ch, currentPeriod) as keyof typeof statusToneMap;
                const aware = isAware(CH_DEF, ch);
                const roasValue = roas(c);
                
                let ChIcon = Zap;
                if (ch.includes('tt')) ChIcon = Smartphone;
                else if (ch.includes('sp')) ChIcon = ShoppingCart;
                else if (ch.includes('fb') || ch.includes('meta')) ChIcon = Activity;

                return (
                  <Card key={ch} className="flex h-full flex-col justify-between gap-5">
                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-text2">
                            <ChIcon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-text">{CH_DEF[ch]?.l || ch}</h4>
                            <div className="mt-1 text-xs text-text3">
                              {aware ? 'Awareness metric' : 'Conversion metric'}
                            </div>
                          </div>
                        </div>
                        <Badge tone={statusToneMap[wch]} style="soft">
                          {LM[wch]}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="ds-eyebrow">{aware ? 'Reach' : 'ROAS'}</div>
                        <div className="text-h2 tabular-nums">
                          {aware ? (c?.reach ? fK(c.reach) : '—') : (roasValue ? `${roasValue.toFixed(2)}x` : '—')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-3.5">
                          <span className="type-overline block mb-1">Spend</span>
                          <span className="text-sm font-semibold text-text tabular-nums">{c?.sp ? fRp(c.sp) : '—'}</span>
                        </div>
                        <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-3.5">
                          <span className="type-overline block mb-1">{aware ? 'Impresi' : 'Revenue'}</span>
                          <span className="text-sm font-semibold text-text tabular-nums">
                            {aware ? (c?.impr ? fK(c.impr) : '—') : (c?.rev ? fRp(c.rev) : '—')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
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
