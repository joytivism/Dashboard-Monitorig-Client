'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF, LM } from '@/lib/data';
import { fRp, totals } from '@/lib/utils';
import { 
  Save, AlertCircle, CheckCircle2, RefreshCw, Plus, Users, TrendingUp, Settings2, 
  Search, Edit3, Trash2, Zap, Layers, ChevronRight, History, X, ArrowRightLeft, 
  Info, ShieldCheck, Calendar, Download, ListTodo, Activity, Key, Cpu
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { CLIENTS, PERIODS, DATA, PL, ACTIVITY: ACTIVITIES, AI_LOGS } = useDashboardData();
  const router = useRouter();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'activities' | 'system'>('overview');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  // Form States
  const [pClient, setPClient] = useState('');
  const [pPeriod, setPPeriod] = useState(PERIODS[PERIODS.length - 1] || '');
  const [bulkData, setBulkData] = useState<Record<string, any>>({});
  
  const [editingClient, setEditingClient] = useState({
    key: '', name: '', chs: [] as string[], industry: '', pic_name: '', brand_category: '', account_strategist: ''
  });

  const [editingActivity, setEditingActivity] = useState({
    id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p' as any, note: ''
  });

  const [newPeriod, setNewPeriod] = useState({ key: '', label: '' });

  // System Settings State
  const [sysSettings, setSysSettings] = useState({ openrouter_key: '', ai_model: 'google/gemini-flash-1.5' });

  // Load Settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*');
      const mapped = (data || []).reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as any);
      setSysSettings({ 
        openrouter_key: mapped.openrouter_key || '', 
        ai_model: mapped.ai_model || 'google/gemini-flash-1.5' 
      });
    };
    if (activeTab === 'system') fetchSettings();
  }, [activeTab]);

  // --- DERIVED DATA ---
  const completeness = useMemo(() => {
    const curP = PERIODS[PERIODS.length - 1];
    const stats: Record<string, 'full' | 'partial' | 'empty'> = {};
    CLIENTS.forEach(cl => {
      const entries = DATA.filter(d => d.c === cl.key && d.p === curP);
      if (entries.length === 0) stats[cl.key] = 'empty';
      else if (entries.length < cl.chs.length) stats[cl.key] = 'partial';
      else stats[cl.key] = 'full';
    });
    return stats;
  }, [CLIENTS, DATA, PERIODS]);

  const aiStats = useMemo(() => {
    const totalTokens = AI_LOGS?.reduce((sum, l) => sum + (l.tk || 0), 0) || 0;
    const totalCost = AI_LOGS?.reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return { totalTokens, totalCost };
  }, [AI_LOGS]);

  const stats = useMemo(() => ({
    totalClients: CLIENTS.length,
    totalRecords: DATA.length,
    activePeriods: PERIODS.length,
  }), [CLIENTS, DATA, PERIODS]);

  // --- ACTIONS ---
  const handleSaveBulk = async () => {
    if (!pClient || !pPeriod) return;
    setLoading(true);
    try {
      const payloads = Object.entries(bulkData).map(([ch, metrics]) => ({
        client_key: pClient,
        period_key: pPeriod,
        channel_key: ch,
        ...metrics
      }));

      const { error } = await supabase.from('channel_performance').upsert(payloads, { onConflict: 'client_key, channel_key, period_key' });
      if (error) throw error;
      setToast({ type: 'success', text: `Berhasil update ${payloads.length} channel!` });
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient.key) return;
    setLoading(true);
    try {
      const { error: cErr } = await supabase.from('clients').upsert({ 
        client_key: editingClient.key, 
        name: editingClient.name || editingClient.key,
        industry: editingClient.industry,
        pic_name: editingClient.pic_name,
        brand_category: editingClient.brand_category,
        account_strategist: editingClient.account_strategist
      });
      if (cErr) throw cErr;

      await supabase.from('client_channels').delete().eq('client_key', editingClient.key);
      if (editingClient.chs.length > 0) {
        const { error: chErr } = await supabase.from('client_channels').insert(
          editingClient.chs.map(ch => ({ client_key: editingClient.key, channel_key: ch }))
        );
        if (chErr) throw chErr;
      }

      setToast({ type: 'success', text: 'Data klien & metadata berhasil disimpan!' });
      setShowClientModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDeleteClient = async (key: string) => {
    if (!confirm(`Hapus klien ${key}? Semua data performa & channel akan ikut terhapus.`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('client_key', key);
      if (error) throw error;
      setToast({ type: 'success', text: 'Klien berhasil dihapus!' });
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payloads = [
        { key: 'openrouter_key', value: sysSettings.openrouter_key },
        { key: 'ai_model', value: sysSettings.ai_model }
      ];
      const { error } = await supabase.from('system_settings').upsert(payloads);
      if (error) throw error;
      setToast({ type: 'success', text: 'Sistem berhasil diupdate!' });
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        client_key: editingActivity.client_key,
        log_date: editingActivity.log_date,
        log_type: editingActivity.log_type,
        note: editingActivity.note
      };
      const { error } = editingActivity.id 
        ? await supabase.from('activity_logs').update(payload).eq('id', editingActivity.id)
        : await supabase.from('activity_logs').insert(payload);
      
      if (error) throw error;
      setToast({ type: 'success', text: 'Activity log saved!' });
      setShowActivityModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const exportToCSV = () => {
    const headers = ['Client', 'Period', 'Channel', 'Spend', 'Revenue', 'Orders', 'ROAS'];
    const rows = DATA.map(d => [d.c, d.p, d.ch, d.sp, d.rev, d.ord, d.sp ? (d.rev || 0)/d.sp : 0]);
    const content = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Sync Bulk Form
  useEffect(() => {
    if (pClient && pPeriod) {
      const initial: any = {};
      CLIENTS.find(c => c.key === pClient)?.chs.forEach(ch => {
        const d = DATA.find(x => x.c === pClient && x.ch === ch && x.p === pPeriod);
        initial[ch] = { 
          spend: d?.sp || '', revenue: d?.rev || '', orders: d?.ord || '', 
          visitors: d?.vis || '', reach: d?.reach || '', impressions: d?.impr || '', results: d?.results || '' 
        };
      });
      setBulkData(initial);
    }
  }, [pClient, pPeriod, DATA, CLIENTS]);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 px-4 pb-20">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-[12px] shadow-main border animate-in slide-in-from-right-full ${toast.type === 'success' ? 'bg-gd-bg border-gd-border text-gd-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Command Center</h1>
          <p className="text-[12px] font-medium text-text3 uppercase tracking-wider mt-1">SaaS Administrative Hub</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full shadow-main border border-border-main/50">
          {[
            { id: 'overview', label: 'Clients', icon: Users },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'activities', label: 'Activities', icon: Activity },
            { id: 'system', label: 'System', icon: Settings2 },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text3 hover:bg-surface2'}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Active Brands', value: stats.totalClients, color: 'bg-accent-light text-accent', icon: Users },
              { label: 'Data Points', value: stats.totalRecords, color: 'bg-tofu-bg text-tofu', icon: Layers },
              { label: 'AI Total Tokens', value: (aiStats.totalTokens/1000).toFixed(1) + 'K', color: 'bg-gd-bg text-gd', icon: Zap },
              { label: 'AI Est. Cost', value: '$' + aiStats.totalCost.toFixed(4), color: 'bg-gg-bg text-gg', icon: ShieldCheck },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-main border border-border-main/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[11px] font-bold text-text3 uppercase tracking-widest">{s.label}</div>
                  <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-text">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50 animate-in fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-bold text-text">Clients Directory & Completeness</h2>
              <div className="flex items-center gap-3">
                <button onClick={exportToCSV} className="flex items-center gap-2 bg-surface2 text-text2 px-4 py-2 rounded-full text-xs font-bold border border-border-main hover:bg-surface3 transition-all">
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
                <button onClick={() => setShowClientModal(true)} className="bg-accent text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-accent/20">Add Client</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-text3 uppercase tracking-[0.2em] border-b border-border-main/50">
                    <th className="pb-4 px-4">Brand</th>
                    <th className="pb-4 px-4">Metadata</th>
                    <th className="pb-4 px-4">Data Status (Bulan Ini)</th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/10">
                  {CLIENTS.map(cl => (
                    <tr key={cl.key} className="hover:bg-surface2 transition-all">
                      <td className="py-5 px-4">
                        <div className="font-bold text-sm">{cl.key}</div>
                        <div className="text-[10px] text-accent font-bold mt-0.5">{cl.pic}</div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="text-xs font-bold text-text2">{cl.ind}</div>
                        <div className="text-[10px] text-text3 font-medium uppercase mt-0.5">{cl.cg}</div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${completeness[cl.key] === 'full' ? 'bg-gg' : completeness[cl.key] === 'partial' ? 'bg-mofu' : 'bg-rr'} animate-pulse`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {completeness[cl.key] === 'full' ? 'Lengkap' : completeness[cl.key] === 'partial' ? 'Sebagian' : 'Belum Diisi'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { 
                            setEditingClient({
                              key: cl.key, name: cl.key, chs: cl.chs, industry: cl.ind, pic_name: cl.pic, brand_category: cl.cg, account_strategist: cl.as
                            }); 
                            setShowClientModal(true); 
                          }} className="p-2 hover:bg-accent-light text-text3 hover:text-accent rounded-lg"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteClient(cl.key)} className="p-2 hover:bg-rr-bg text-text3 hover:text-rr rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: BATCH PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50 animate-in fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-bold text-text">Batch Performance Entry</h2>
            </div>
            <div className="flex items-center gap-4">
              <select value={pClient} onChange={e => setPClient(e.target.value)} className="h-10 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none">
                <option value="">-- Pilih Klien --</option>
                {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
              </select>
              <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="h-10 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none">
                {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
              </select>
            </div>
          </div>

          {pClient ? (
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-text3 uppercase tracking-wider border-b border-border-main">
                      <th className="pb-4 px-2">Channel</th>
                      <th className="pb-4 px-2">Spend</th>
                      <th className="pb-4 px-2">Revenue</th>
                      <th className="pb-4 px-2">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENTS.find(c => c.key === pClient)?.chs.map(ch => (
                      <tr key={ch} className="border-b border-border-main/20">
                        <td className="py-4 px-2 font-bold text-xs uppercase text-accent">{ch}</td>
                        <td className="py-4 px-2"><input type="number" value={bulkData[ch]?.spend} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], spend: e.target.value}})} className="w-24 h-9 px-3 rounded-lg border border-border-main text-xs font-bold" /></td>
                        <td className="py-4 px-2"><input type="number" value={bulkData[ch]?.revenue} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], revenue: e.target.value}})} className="w-28 h-9 px-3 rounded-lg border border-border-main text-xs font-bold" /></td>
                        <td className="py-4 px-2"><input type="number" value={bulkData[ch]?.orders} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], orders: e.target.value}})} className="w-20 h-9 px-3 rounded-lg border border-border-main text-xs font-bold" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pt-6">
                <button onClick={handleSaveBulk} disabled={loading} className="flex items-center gap-2 bg-text text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-black/10">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Performance
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center bg-surface2/30 rounded-[20px] border-2 border-dashed border-border-main">
              <p className="text-sm font-bold text-text3 italic">Pilih klien untuk memunculkan tabel input batch.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: SYSTEM SETTINGS */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          <div className="lg:col-span-8 bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
            <h2 className="text-base font-bold text-text mb-2">API Configuration</h2>
            <p className="text-[12px] font-medium text-text3 mb-8">Kelola kunci API dan pemilihan model AI sistem.</p>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-text3 uppercase mb-2 ml-1">
                  <Key className="w-3.5 h-3.5" />
                  OpenRouter API Key
                </label>
                <input 
                  type="password" 
                  value={sysSettings.openrouter_key} 
                  onChange={e => setSysSettings({...sysSettings, openrouter_key: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-medium focus:border-accent outline-none" 
                  placeholder="sk-or-v1-..." 
                />
                <p className="text-[10px] text-text3 mt-2 ml-1 italic">Kunci ini digunakan untuk generate insight AI secara global.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-text3 uppercase mb-2 ml-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Default AI Model
                </label>
                <select 
                  value={sysSettings.ai_model} 
                  onChange={e => setSysSettings({...sysSettings, ai_model: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold focus:border-accent outline-none"
                >
                  <option value="google/gemini-flash-1.5">Google Gemini Flash 1.5 (Recommended)</option>
                  <option value="google/gemini-pro-1.5">Google Gemini Pro 1.5</option>
                  <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                  <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 (Free)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-border-main flex justify-end">
                <button onClick={handleSaveSettings} disabled={loading} className="flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-accent/20">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save System Config
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
            <h3 className="text-sm font-bold text-text mb-6">AI Health Check</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gd-bg/30 border border-gd-border/50">
                <div className="text-[10px] font-bold text-gd uppercase mb-1">Status</div>
                <div className="text-sm font-bold text-text">Operational</div>
              </div>
              <div className="p-4 rounded-xl bg-surface2 border border-border-main">
                <div className="text-[10px] font-bold text-text3 uppercase mb-1">Total Token Usage</div>
                <div className="text-sm font-bold text-text">{(aiStats.totalTokens/1000).toFixed(1)}K Tokens</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-text mb-4">Recent AI Usage</h3>
              <div className="space-y-3">
                {AI_LOGS?.slice(0, 10).map((l, i) => (
                  <div key={i} className="p-3 rounded-xl border border-border-main/50 bg-white hover:bg-surface2 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[11px] font-bold text-accent uppercase">{l.c || 'Unknown'}</div>
                      <div className="text-[9px] font-mono text-text3">{new Date(l.d).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-[10px] font-medium text-text2 truncate mb-1">{l.m}</div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text3">{l.tk} tokens</span>
                      <span className="font-bold text-gg">${Number(l.cost).toFixed(5)}</span>
                    </div>
                  </div>
                ))}
                {(!AI_LOGS || AI_LOGS.length === 0) && (
                  <div className="text-center py-10 text-[11px] text-text3 italic">Belum ada aktivitas AI.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50 animate-in fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-bold text-text">Marketing Activity Logs</h2>
            <button onClick={() => { setEditingActivity({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' }); setShowActivityModal(true); }} className="bg-accent text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-accent/20">Add Log</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-text3 uppercase tracking-wider border-b border-border-main">
                  <th className="pb-4 px-2">Date</th>
                  <th className="pb-4 px-2">Client</th>
                  <th className="pb-4 px-2">Type</th>
                  <th className="pb-4 px-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.map((a, i) => {
                   const cls = { p: 'bg-gg-bg text-gg', e: 'bg-tofu-bg text-tofu', c: 'bg-mofu-bg text-mofu', l: 'bg-rr-bg text-rr' }[a.t];
                   return (
                    <tr key={i} className="border-b border-border-main/10 hover:bg-surface2 transition-colors">
                      <td className="py-4 px-2 text-xs font-mono">{a.d}</td>
                      <td className="py-4 px-2 text-xs font-bold">{a.c}</td>
                      <td className="py-4 px-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cls}`}>{a.t}</span></td>
                      <td className="py-4 px-2 text-xs font-medium text-text2">{a.n}</td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ACTIVITY */}
      {showActivityModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-lg overflow-hidden">
            <div className="p-8 border-b border-border-main bg-surface2/30 flex items-center justify-between">
              <h3 className="text-base font-bold text-text">Log New Activity</h3>
              <button onClick={() => setShowActivityModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveActivity} className="p-8 space-y-4">
              <select value={editingActivity.client_key} onChange={e => setEditingActivity({...editingActivity, client_key: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold" required>
                <option value="">-- Pilih Klien --</option>
                {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
              </select>
              <input type="date" value={editingActivity.log_date} onChange={e => setEditingActivity({...editingActivity, log_date: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold" required />
              <select value={editingActivity.log_type} onChange={e => setEditingActivity({...editingActivity, log_type: e.target.value as any})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold">
                <option value="p">Promo</option>
                <option value="e">Event</option>
                <option value="c">Content</option>
                <option value="l">Launching</option>
              </select>
              <textarea value={editingActivity.note} onChange={e => setEditingActivity({...editingActivity, note: e.target.value})} className="w-full p-4 rounded-xl border border-border-main bg-surface2 text-sm font-medium h-32" placeholder="Catatan aktivitas..." required />
              <button type="submit" disabled={loading} className="w-full h-12 bg-accent text-white rounded-full font-bold text-sm">Save Log</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLIENT */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-2xl overflow-hidden">
            <div className="p-8 border-b border-border-main bg-surface2/30 flex items-center justify-between">
              <h3 className="text-base font-bold text-text">Client Metadata Configuration</h3>
              <button onClick={() => setShowClientModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveClient} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Client Key</label>
                  <input type="text" value={editingClient.key} onChange={e => setEditingClient({...editingClient, key: e.target.value})} disabled={!!editingClient.key && CLIENTS.some(c => c.key === editingClient.key)} className="w-full h-11 px-4 rounded-xl border border-border-main text-sm font-bold" placeholder="brand_id" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Industry</label>
                  <input type="text" value={editingClient.industry} onChange={e => setEditingClient({...editingClient, industry: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main text-sm font-bold" placeholder="Retail / Fashion" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">PIC Name</label>
                  <input type="text" value={editingClient.pic_name} onChange={e => setEditingClient({...editingClient, pic_name: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main text-sm font-bold" placeholder="Nama PIC" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Strategist</label>
                  <input type="text" value={editingClient.account_strategist} onChange={e => setEditingClient({...editingClient, account_strategist: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main text-sm font-bold" placeholder="Nama Strategist" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-text3 uppercase ml-1 block">Active Channels</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient.chs.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => {
                        const next = active ? editingClient.chs.filter(x => x !== ch) : [...editingClient.chs, ch];
                        setEditingClient({...editingClient, chs: next});
                      }} className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${active ? 'border-accent bg-accent-light text-accent' : 'border-border-main bg-white text-text3'}`}>
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-accent' : 'bg-border-alt'}`} />
                        {CH_DEF[ch]?.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-12 bg-accent text-white rounded-full font-bold text-sm shadow-lg shadow-accent/20">Save Client Config</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

