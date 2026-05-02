import { ORD } from './data';
import type { DataEntry, Client } from './data';

export function gd(DATA: DataEntry[], c: string, ch: string, p: string) { 
  return DATA.find(x => x.c === c && x.ch === ch && x.p === p) || null; 
}

export function prev(PERIODS: string[], p: string) { 
  const i = PERIODS.indexOf(p); 
  return i > 0 ? PERIODS[i - 1] : null; 
}

export function isAware(CH_DEF: Record<string, any>, ch: string) { 
  return CH_DEF[ch]?.type === 'awareness'; 
}

export function roas(d: any) { 
  if (!d || !d.rev || !d.sp || d.sp === 0) return null; 
  return d.rev / d.sp; 
}

export function pct(c: number, p: number) { 
  if (!p || p === 0) return null; 
  return (c - p) / p * 100; 
}

export function popCls(v: number | null) {
  if (v === null) return 'nn';
  if (v <= -20) return 'rr'; 
  if (v <= -10) return 'or'; 
  if (v < 0) return 'yy';
  if (v === 0) return 'nn'; 
  if (v <= 20) return 'gg'; 
  return 'gd';
}

export function fRp(n: number | null | undefined) {
  if (!n && n !== 0) return '—';
  if (n >= 1e12) return 'Rp ' + (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9)  return 'Rp ' + (n / 1e9).toFixed(1) + 'M';
  if (n >= 1e6)  return 'Rp ' + (n / 1e6).toFixed(0) + 'jt';
  return 'Rp ' + (n / 1000).toFixed(0) + 'rb';
}

export function fK(n: number | null | undefined) {
  if (!n && n !== 0) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return Math.round(n).toLocaleString('id-ID');
}

export function fV(v: number | null | undefined, f: string) {
  if (v === null || v === undefined) return '—';
  if (f === 'rp') return fRp(v);
  if (f === 'x') return v.toFixed(2) + 'x';
  if (f === 'pct') return v.toFixed(1) + '%';
  if (f === 'n') return Math.round(v).toLocaleString('id-ID');
  if (f === 'k') return fK(v);
  return v.toString();
}

export function totals(CH_DEF: Record<string, any>, CLIENTS: Client[], DATA: DataEntry[], c: string, p: string) {
  const cl = CLIENTS.find(x => x.key === c);
  if (!cl) return { rev: 0, sp: 0, roas: null, ord: 0, vis: null, reach: null, impr: null };
  
  let rev = 0, sp = 0, ord = 0, vis = 0, reach = 0, impr = 0;
  cl.chs.forEach(ch => {
    const d = gd(DATA, c, ch, p); if (!d) return;
    if (isAware(CH_DEF, ch)) { 
      if (d.sp) sp += d.sp; 
      if (d.reach) reach += d.reach; 
      if (d.impr) impr += d.impr; 
    } else { 
      rev += d.rev || 0; 
      ord += d.ord || 0; 
      if (d.sp) sp += d.sp; 
      if (d.vis) vis += d.vis; 
    }
  });
  return { 
    rev, 
    sp, 
    roas: sp > 0 ? rev / sp : null, 
    ord, 
    vis: vis || null, 
    reach: reach || null, 
    impr: impr || null 
  };
}

export function chWorstKey(CH_DEF: Record<string, any>, DATA: DataEntry[], PERIODS: string[], c: string, ch: string, p: string) {
  const cur = gd(DATA, c, ch, p), prv = gd(DATA, c, ch, prev(PERIODS, p) || '');
  if (!cur || !prv) return 'nn';
  const key = isAware(CH_DEF, ch) ? (cur.reach ? 'reach' : 'impr') : 'rev';
  // @ts-ignore
  return popCls(pct(cur[key], prv[key]));
}

export function clientWorst(CH_DEF: Record<string, any>, CLIENTS: Client[], DATA: DataEntry[], PERIODS: string[], c: string, p: string) {
  let wi = 5;
  CLIENTS.find(x => x.key === c)?.chs.forEach(ch => {
    const i = ORD.indexOf(chWorstKey(CH_DEF, DATA, PERIODS, c, ch, p));
    if (i < wi) wi = i;
  });
  return ORD[wi];
}
