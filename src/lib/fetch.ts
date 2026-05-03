import { createClient } from './supabase/server';
import { CH_DEF } from '@/data/constants';
import type { DashboardData, Client, DataEntry, ActivityEntry, AIUsageEntry, ChannelDef } from './data';

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const [
    { data: clients },
    { data: channels_db },
    { data: channel_configs },
    { data: periods },
    { data: performance },
    { data: activities },
    { data: aiUsage }
  ] = await Promise.all([
    supabase.from('clients').select('*'),
    supabase.from('client_channels').select('*'),
    supabase.from('channels').select('*'),
    supabase.from('periods').select('*').order('period_key', { ascending: true }),
    supabase.from('channel_performance').select('*'),
    supabase.from('activity_logs').select('*').order('log_date', { ascending: false }),
    supabase.from('ai_usage_logs').select('*').order('usage_date', { ascending: false })
  ]);

  // Construct Dynamic CH_DEF
  const CH_DEF_DYNAMIC: Record<string, ChannelDef> = { ...CH_DEF as unknown as Record<string, ChannelDef> };
  if (channel_configs && channel_configs.length > 0) {
    channel_configs.forEach(c => {
      CH_DEF_DYNAMIC[c.channel_key] = {
        l: c.label,
        stage: c.stage,
        type: c.type
      };
    });
  }

  // Transform Clients
  const CLIENTS: Client[] = (clients || []).map(c => {
    const chs = (channels_db || []).filter(ch => ch.client_key === c.client_key);
    const troas: Record<string, number> = {};
    chs.forEach(ch => {
      if (ch.target_roas) troas[ch.channel_key] = Number(ch.target_roas);
    });
    
    return {
      key: c.client_key,
      name: c.name || c.client_key,
      ind: c.industry || '—',
      cg: c.brand_category || '—',
      at: '—', // Reserved for future
      as: c.account_strategist || '—',
      pic: c.pic_name || '—',
      chs: chs.map(ch => ch.channel_key),
      troas
    };
  });

  // Transform Data
  const DATA: DataEntry[] = (performance || []).map(p => ({
    c: p.client_key,
    ch: p.channel_key,
    p: p.period_key,
    rev: Number(p.revenue),
    sp: Number(p.spend),
    ord: Number(p.orders),
    vis: Number(p.visitors),
    reach: Number(p.reach),
    impr: Number(p.impressions),
    results: Number(p.results)
  }));

  // Transform Activity
  const ACTIVITY: ActivityEntry[] = (activities || []).map(a => ({
    id: a.id,
    c: a.client_key,
    d: a.log_date,
    dLabel: new Date(a.log_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    t: a.log_type as 'p' | 'e' | 'c' | 'l',
    n: a.note
  }));

  const PERIODS = (periods || []).map(p => p.period_key);
  const PL = (periods || []).reduce((acc, p) => {
    acc[p.period_key] = p.label;
    return acc;
  }, {} as Record<string, string>);

  const AI_LOGS: AIUsageEntry[] = (aiUsage || []).map(l => ({
    id: l.id,
    c: l.client_key,
    m: l.model_name,
    d: l.usage_date,
    tk: l.tokens_used,
    cost: l.estimated_cost
  }));

  return { CLIENTS, DATA, ACTIVITY, PERIODS, PL, AI_LOGS, CH_DEF: CH_DEF_DYNAMIC };
}
