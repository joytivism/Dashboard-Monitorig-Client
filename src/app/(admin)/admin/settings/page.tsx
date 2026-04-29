'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle, CheckCircle2, Key, Cpu, Zap, Calendar, Plus, Trash2, ShieldCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const { CLIENTS, DATA, ACTIVITY, PERIODS, AI_LOGS } = useDashboardData();
  const curPeriod = PERIODS[PERIODS.length - 1] || '';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type:'success'|'error',text:string}|null>(null);
  const [cfg, setCfg] = useState({openrouter_key:'',ai_model:'google/gemini-flash-1.5'});
  const [periods, setPeriods] = useState<{period_key:string, label:string}[]>([]);
  const [newP, setNewP] = useState({ key: '', label: '' });

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from('periods').select('*').order('period_key', { ascending: true });
      setPeriods(p || []);
    })();
  }, []);

  const addPeriod = async () => {
    if (!newP.key || !newP.label) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('periods').insert({ period_key: newP.key, label: newP.label });
      if (error) throw error;
      setPeriods([...periods, { period_key: newP.key, label: newP.label }].sort((a,b) => a.period_key.localeCompare(b.period_key)));
      setNewP({ key: '', label: '' });
      setToast({ type: 'success', text: 'Period added!' });
      router.refresh();
    } catch (e: any) { setToast({ type: 'error', text: e.message }); }
    finally { setLoading(false); }
  };

  const delPeriod = async (key: string) => {
    if (!confirm(`Delete period ${key}? This might affect data visibility.`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('periods').delete().eq('period_key', key);
      if (error) throw error;
      setPeriods(periods.filter(p => p.period_key !== key));
      setToast({ type: 'success', text: 'Period deleted!' });
      router.refresh();
    } catch (e: any) { setToast({ type: 'error', text: e.message }); }
    finally { setLoading(false); }
  };

  const ai = useMemo(() => ({
    tk: AI_LOGS?.reduce((s, l) => s + (l.tk || 0), 0) || 0,
    cost: AI_LOGS?.reduce((s, l) => s + (l.cost || 0), 0) || 0
  }), [AI_LOGS]);

  const health = useMemo(() => {
    if (!curPeriod) return [];
    return CLIENTS.map(c => {
      const perf = DATA.filter(d => d.c === c.key && d.p === curPeriod);
      const acts = ACTIVITY.filter(a => a.c === c.key && a.d.startsWith(curPeriod));
      return {
        name: c.key,
        hasPerf: perf.length > 0,
        hasActs: acts.length > 0,
        isHealthy: perf.length > 0 && acts.length > 0
      };
    });
  }, [CLIENTS, DATA, ACTIVITY, curPeriod]);

  const stats = useMemo(() => {
    const missing = health.filter(h => !h.isHealthy).length;
    return {
      total: health.length,
      missing,
      pct: health.length > 0 ? Math.round(((health.length - missing) / health.length) * 100) : 0
    };
  }, [health]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const ac = (k: string) => {
    const c = ['bg-or', 'bg-text', 'bg-tofu', 'bg-gd', 'bg-rr', 'bg-text2'];
    let h = 0;
    for (let i = 0; i < k.length; i++) h = k.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20 md:pb-0">
      {toast&&(
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-main border ${toast.type==='success'?'bg-gg-bg border-gg-border text-gg-text':'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type==='success'?<CheckCircle2 className="w-4 h-4"/>:<AlertCircle className="w-4 h-4"/>}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Settings ⚙️</h1>
        <p className="text-sm font-medium text-text3 mt-1">Configure AI model, API keys, and monitor usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[24px] border border-border-main p-6 shadow-main overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gg"/> Data Health Checker
                </h2>
                <p className="text-xs font-medium text-text3 mt-1">Scanning coverage for {curPeriod || 'latest period'}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-text">{stats.pct}%</div>
                <div className="text-[10px] font-bold text-text3 uppercase tracking-wider">Completeness</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-surface2 border border-border-main">
                <div className="text-[10px] font-bold text-text3 uppercase mb-1">Total Brands</div>
                <div className="text-xl font-bold text-text">{stats.total}</div>
              </div>
              <div className="p-4 rounded-2xl bg-rr-bg border border-rr-border">
                <div className="text-[10px] font-bold text-rr uppercase mb-1">Attention Required</div>
                <div className="text-xl font-bold text-rr">{stats.missing}</div>
              </div>
              <div className="p-4 rounded-2xl bg-gg-bg border border-gg-border">
                <div className="text-[10px] font-bold text-gg-text uppercase mb-1">Fully Healthy</div>
                <div className="text-xl font-bold text-gg-text">{stats.total - stats.missing}</div>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {health.map(h => (
                <div key={h.name} className="flex items-center justify-between p-4 rounded-xl border border-border-main hover:bg-surface2 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${h.isHealthy ? 'bg-gg' : 'bg-rr animate-pulse'}`}/>
                    <div>
                      <div className="text-sm font-bold text-text">{h.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${h.hasPerf ? 'text-gg' : 'text-rr'}`}>
                          {h.hasPerf ? <CheckCircle2 className="w-3 h-3"/> : <X className="w-3 h-3"/>} Performance
                        </span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${h.hasActs ? 'text-gg' : 'text-rr'}`}>
                          {h.hasActs ? <CheckCircle2 className="w-3 h-3"/> : <X className="w-3 h-3"/>} Activities
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => router.push(h.hasPerf ? `/admin/activities` : `/admin/performance`)} className="px-4 py-2 rounded-full bg-surface border border-border-main text-[11px] font-bold text-text3 hover:bg-text hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    Fix Data
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-border-main p-6 shadow-main">
            <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-accent"/> Period Manager</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-widest mb-4 block">Existing Periods</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {periods.map(p => (
                    <div key={p.period_key} className="flex items-center justify-between p-3 rounded-xl bg-surface2 border border-border-main group">
                      <div>
                        <div className="text-[13px] font-bold text-text">{p.label}</div>
                        <div className="text-[10px] font-medium text-text3">{p.period_key}</div>
                      </div>
                      <button onClick={() => delPeriod(p.period_key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:text-rr hover:bg-rr-bg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface2/50 p-5 rounded-2xl border border-dashed border-border-main">
                <label className="text-[11px] font-bold text-text3 uppercase tracking-widest mb-4 block">Add New Period</label>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-text2 uppercase block mb-1.5 ml-1">Key (YYYY-MM)</span>
                    <input type="text" value={newP.key} onChange={e=>setNewP({...newP, key: e.target.value})} placeholder="e.g. 2026-04" className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-[13px] font-bold text-text outline-none focus:border-accent transition-all" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text2 uppercase block mb-1.5 ml-1">Label (MMM YYYY)</span>
                    <input type="text" value={newP.label} onChange={e=>setNewP({...newP, label: e.target.value})} placeholder="e.g. Apr 2026" className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-[13px] font-bold text-text outline-none focus:border-accent transition-all" />
                  </div>
                  <button onClick={addPeriod} disabled={loading} className="w-full h-12 bg-accent text-white rounded-xl font-bold text-[13px] shadow-sm hover:shadow-main transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4"/> Add Period
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[24px] border border-border-main p-6 shadow-main">
            <h3 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-tofu"/>AI Health
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gg-bg border border-gg-border">
                <div className="text-[10px] font-bold text-gg-text uppercase tracking-wider mb-1">Status</div>
                <div className="text-base font-bold text-gg-text flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gg animate-pulse" />
                  Operational
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border-main">
                <div className="text-[10px] font-bold text-text3 uppercase tracking-wider mb-1">Tokens (Current Period)</div>
                <div className="text-base font-bold text-text">{(ai.tk / 1000).toFixed(1)}K <span className="text-[11px] font-medium text-text3 ml-1">tokens</span></div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border-main">
                <div className="text-[10px] font-bold text-text3 uppercase tracking-wider mb-1">Estimated Cost</div>
                <div className="text-base font-bold text-text">${ai.cost.toFixed(4)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] border border-border-main p-6 shadow-main">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text">Usage Logs</h3>
              <span className="text-[11px] font-bold text-text2 hover:text-text transition-colors">See all</span>
            </div>
            <div className="space-y-4">
              {AI_LOGS?.slice(0,5).map((l,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${ac(l.c)} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white text-[11px] font-black uppercase">{l.c.substring(0,2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">{l.c}</div>
                    <div className="text-[11px] font-medium text-text3 truncate">{l.m}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] font-bold text-text">{l.tk} tk</div>
                    <div className="text-[11px] font-bold text-gg">${Number(l.cost).toFixed(5)}</div>
                  </div>
                </div>
              ))}
              {(!AI_LOGS || AI_LOGS.length === 0) && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-surface2 rounded-xl flex items-center justify-center mx-auto mb-3 border border-border-main">
                    <Zap className="w-5 h-5 text-text3" />
                  </div>
                  <p className="text-sm font-bold text-text">No usage data</p>
                  <p className="text-[11px] font-medium text-text3 mt-1">AI logs will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
