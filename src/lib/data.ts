import { supabase } from './supabase';
import { CH_DEF, STAGE_COLOR, STAGE_LABEL, TC, ORD, LM } from '@/data/constants';

export interface Client {
  key: string;
  ind: string;
  cg: string;
  at: string;
  as: string;
  pic: string;
  chs: string[];
  troas: Record<string, number>;
}

export interface DataEntry {
  c: string;
  ch: string;
  p: string;
  rev?: number;
  sp?: number | null;
  ord?: number;
  vis?: number | null;
  reach?: number;
  impr?: number;
  results?: number;
}

export interface ActivityEntry {
  c: string;
  d: string;
  t: 'p' | 'e' | 'c' | 'l';
  n: string;
}

export async function getDashboardData() {
  const [
    { data: clients },
    { data: channels },
    { data: periods },
    { data: performance },
    { data: activities }
  ] = await Promise.all([
    supabase.from('clients').select('*'),
    supabase.from('client_channels').select('*'),
    supabase.from('periods').select('*').order('period_key', { ascending: true }),
    supabase.from('channel_performance').select('*'),
    supabase.from('activity_logs').select('*').order('log_date', { ascending: false })
  ]);

  // Transform Clients
  const CLIENTS: Client[] = (clients || []).map(c => {
    const chs = (channels || []).filter(ch => ch.client_key === c.client_key);
    const troas: Record<string, number> = {};
    chs.forEach(ch => {
      if (ch.target_roas) troas[ch.channel_key] = Number(ch.target_roas);
    });
    
    return {
      key: c.client_key,
      ind: '—', // Placeholder as it wasn't in schema
      cg: '—',
      at: '—',
      as: '—',
      pic: '—',
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
    c: a.client_key,
    d: new Date(a.log_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    t: a.log_type as 'p' | 'e' | 'c' | 'l',
    n: a.note
  }));

  const PERIODS = (periods || []).map(p => p.period_key);
  const PL = (periods || []).reduce((acc, p) => {
    acc[p.period_key] = p.label;
    return acc;
  }, {} as Record<string, string>);

  return { CLIENTS, DATA, ACTIVITY, PERIODS, PL };
}

// Re-export constants
export { CH_DEF, STAGE_COLOR, STAGE_LABEL, TC, ORD, LM };
