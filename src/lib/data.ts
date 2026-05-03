import { STAGE_COLOR, STAGE_LABEL, TC, ORD, LM } from '@/data/constants';

export const STATUS_BG: Record<string, string> = {
  rr: 'bg-rr-bg text-rr-text border-rr-border',
  or: 'bg-or-bg text-or-text border-or-border',
  yy: 'bg-yy-bg text-yy-text border-yy-border',
  nn: 'bg-nn-bg text-nn-text border-nn-border',
  gg: 'bg-gg-bg text-gg-text border-gg-border',
  gd: 'bg-gd-bg text-gd-text border-gd-border',
};

export const STATUS_DOT: Record<string, string> = {
  rr: '#DC2626', or: '#EA580C', yy: '#D97706', nn: '#9CA3AF', gg: '#059669', gd: '#0284C7',
};

export const STATUS_LABEL: Record<string, string> = {
  rr: 'Kritis', or: 'Perlu Perhatian', yy: 'Waspada', nn: 'Tidak ada data', gg: 'Performa Baik', gd: 'Sangat Baik',
};

export interface Client {
  key: string;
  name: string;
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
  id?: string;
  c: string;
  d: string;
  dLabel?: string;
  t: 'p' | 'e' | 'c' | 'l';
  n: string;
}

export interface AIUsageEntry {
  id: string;
  c: string;
  m: string;
  d: string;
  tk: number;
  cost: number;
}

export interface ChannelDef {
  l: string;
  stage: 'tofu' | 'mofu' | 'bofu';
  type: 'revenue' | 'assist' | 'awareness';
}

export interface DashboardData {
  CLIENTS: Client[];
  DATA: DataEntry[];
  ACTIVITY: ActivityEntry[];
  PERIODS: string[];
  PL: Record<string, string>;
  AI_LOGS: AIUsageEntry[];
  CH_DEF: Record<string, ChannelDef>;
}

// Re-export constants
export { STAGE_COLOR, STAGE_LABEL, TC, ORD, LM };
