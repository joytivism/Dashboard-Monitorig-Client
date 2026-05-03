import { gd, pct } from '../utils';
import { type DataEntry, type ChannelDef } from '../data';

export interface FunnelData {
  tofu: { sp: number; reach: number; impr: number; res: number };
  mofu: { vis: number; ord: number; rev: number };
  bofu: { sp: number; ord: number; rev: number };
}

export const calculateFunnelMetrics = (CH_DEF: Record<string, ChannelDef>, data: DataEntry[], clientId: string, chs: string[], period: string) => {
  const stats = {
    tofu: { sp: 0, reach: 0, impr: 0, res: 0 },
    mofu: { vis: 0, ord: 0, rev: 0 },
    bofu: { sp: 0, ord: 0, rev: 0 }
  };

  chs.forEach(ch => {
    const c = gd(data, clientId, ch, period);
    const stage = CH_DEF[ch]?.stage;
    
    if (c) {
      if (stage === 'tofu') {
        stats.tofu.sp += c.sp || 0;
        stats.tofu.reach += c.reach || 0;
        stats.tofu.impr += c.impr || 0;
        stats.tofu.res += c.results || 0;
      } else if (stage === 'mofu') {
        stats.mofu.vis += c.vis || 0;
        stats.mofu.ord += c.ord || 0;
        stats.mofu.rev += c.rev || 0;
      } else if (stage === 'bofu') {
        stats.bofu.sp += c.sp || 0;
        stats.bofu.ord += c.ord || 0;
        stats.bofu.rev += c.rev || 0;
      }
    }
  });

  return stats;
};

export const getGrowth = (current: number, previous: number) => {
  return pct(current, previous);
};

export const calculateEfficiency = (funnel: FunnelData) => {
  const bRoas = funnel.bofu.sp > 0 ? funnel.bofu.rev / funnel.bofu.sp : null;
  const blCir = funnel.bofu.sp > 0 && funnel.bofu.rev > 0 ? (funnel.bofu.sp / funnel.bofu.rev) * 100 : null;
  const blCpo = funnel.bofu.sp > 0 && funnel.bofu.ord > 0 ? funnel.bofu.sp / funnel.bofu.ord : null;
  const blCr = funnel.mofu.vis > 0 && funnel.mofu.ord > 0 ? (funnel.mofu.ord / funnel.mofu.vis) * 100 : null;
  const blAov = (funnel.bofu.rev + funnel.mofu.rev) > 0 && (funnel.bofu.ord + funnel.mofu.ord) > 0 
    ? (funnel.bofu.rev + funnel.mofu.rev) / (funnel.bofu.ord + funnel.mofu.ord) 
    : null;

  return { bRoas, blCir, blCpo, blCr, blAov };
};
