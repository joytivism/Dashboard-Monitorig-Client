'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF, LM, totals } from '@/lib/data';
import { fRp } from '@/lib/utils';
import { 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  Users, 
  TrendingUp, 
  Settings2, 
  Search,
  Edit3,
  Trash2,
  Zap,
  Layers,
  ChevronRight,
  History,
  X,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { CLIENTS, PERIODS, DATA, PL } = useDashboardData();
  const router = useRouter();

  // Navigation & UI State
  const [activeView, setActiveView] = useState<'overview' | 'performance'>('overview');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  
  // Form State: Performance
  const [pClient, setPClient] = useState('');
  const [pPeriod, setPPeriod] = useState(PERIODS[PERIODS.length - 1] || '');
  const [pChannel, setPChannel] = useState('');
  const [fMetrics, setFMetrics] = useState({
    sp: '', rev: '', ord: '', vis: '', reach: '', impr: '', res: ''
  });

  // Form State: Client Management
  const [editingClient, setEditingClient] = useState<{key: string, name: string, chs: string[]} | null>(null);

  // Show toast then hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Derived Stats
  const stats = useMemo(() => ({
    totalClients: CLIENTS.length,
    totalRecords: DATA.length,
    activePeriods: PERIODS.length,
    latestUpdate: DATA.length > 0 ? 'Just now' : 'No data'
  }), [CLIENTS, DATA]);

  // Performance History for selected client/channel
  const historyData = useMemo(() => {
    if (!pClient || !pChannel) return [];
    return PERIODS.slice(-4).reverse().map(p => {
      const entry = DATA.find(d => d.c === pClient && d.ch === pChannel && d.p === p);
      return { period: p, label: PL[p], data: entry };
    });
  }, [pClient, pChannel, DATA, PERIODS, PL]);

  // Actions
  const handleSavePerforma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pClient || !pPeriod || !pChannel) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('channel_performance').upsert({
        client_key: pClient,
        period_key: pPeriod,
        channel_key: pChannel,
        spend: fMetrics.sp ? Number(fMetrics.sp) : null,
        revenue: fMetrics.rev ? Number(fMetrics.rev) : null,
        orders: fMetrics.ord ? Number(fMetrics.ord) : null,
        visitors: fMetrics.vis ? Number(fMetrics.vis) : null,
        reach: fMetrics.reach ? Number(fMetrics.reach) : null,
        impressions: fMetrics.impr ? Number(fMetrics.impr) : null,
        results: fMetrics.res ? Number(fMetrics.res) : null,
      }, { onConflict: 'client_key, channel_key, period_key' });

      if (error) throw error;
      setToast({ type: 'success', text: 'Performa berhasil diperbarui!' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.key) return;
    setLoading(true);
    try {
      // 1. Upsert Client
      const { error: cErr } = await supabase.from('clients').upsert({ 
        client_key: editingClient.key, 
        name: editingClient.name || editingClient.key 
      });
      if (cErr) throw cErr;

      // 2. Sync Channels
      await supabase.from('client_channels').delete().eq('client_key', editingClient.key);
      if (editingClient.chs.length > 0) {
        const { error: chErr } = await supabase.from('client_channels').insert(
          editingClient.chs.map(ch => ({ client_key: editingClient.key, channel_key: ch }))
        );
        if (chErr) throw chErr;
      }

      setToast({ type: 'success', text: 'Data klien berhasil disimpan!' });
      setShowClientModal(false);
      setEditingClient(null);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Sync Form when selection changes
  useEffect(() => {
    if (pClient && pPeriod && pChannel) {
      const existing = DATA.find(d => d.c === pClient && d.p === pPeriod && d.ch === pChannel);
      setFMetrics({
        sp: existing?.sp?.toString() || '',
        rev: existing?.rev?.toString() || '',
        ord: existing?.ord?.toString() || '',
        vis: existing?.vis?.toString() || '',
        reach: existing?.reach?.toString() || '',
        impr: existing?.impr?.toString() || '',
        res: existing?.results?.toString() || ''
      });
    }
  }, [pClient, pPeriod, pChannel, DATA]);

  const activeChannels = CLIENTS.find(c => c.key === pClient)?.chs || [];

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 sm:px-6">
      
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold">{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-surface2 rounded-full">
            <X className="w-4 h-4 text-text3" />
          </button>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3 fill-current" />
            System Administrator
          </div>
          <h1 className="text-4xl font-black text-text tracking-tighter mb-2">Management Hub</h1>
          <p className="text-sm text-text3 font-medium">Powering the Real Advertise Command Center</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] shadow-sm border border-border-main/50">
          <button 
            onClick={() => setActiveView('overview')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'overview' ? 'bg-text text-white shadow-lg' : 'text-text3 hover:bg-surface2'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => setActiveView('performance')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'performance' ? 'bg-text text-white shadow-lg' : 'text-text3 hover:bg-surface2'}`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'accent' },
          { label: 'Data Points', value: stats.totalRecords, icon: Layers, color: 'blue-500' },
          { label: 'Active Periods', value: stats.activePeriods, icon: TrendingUp, color: 'gg' },
          { label: 'System Status', value: 'Healthy', icon: ShieldCheck, color: 'green-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-border-main/50 shadow-sm group hover:border-accent/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${s.color}/10 text-${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-4 h-4 text-text3 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="text-[11px] font-bold text-text3 uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-2xl font-black text-text tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      {/* --- VIEW: DIRECTORY --- */}
      {activeView === 'overview' && (
        <div className="bg-white rounded-[40px] shadow-main border border-border-main/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-10 border-b border-border-main/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface2/20">
            <div>
              <h2 className="text-xl font-black text-text">Clients Directory</h2>
              <p className="text-sm text-text3 font-medium">Manajemen database klien dan konfigurasi channel.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="w-4 h-4 text-text3 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                <input type="text" placeholder="Search..." className="pl-11 pr-5 py-3 bg-surface2 border border-border-main rounded-2xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all" />
              </div>
              <button 
                onClick={() => { setEditingClient({key: '', name: '', chs: []}); setShowClientModal(true); }}
                className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Client
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-text3 uppercase tracking-[0.2em] bg-surface2/50 border-b border-border-main/50">
                  <th className="px-10 py-5">Brand Name</th>
                  <th className="px-8 py-5">Active Channels</th>
                  <th className="px-8 py-5">Health Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/30">
                {CLIENTS.map(cl => (
                  <tr key={cl.key} className="hover:bg-surface2/40 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface3 flex items-center justify-center text-lg font-black text-text2 uppercase border border-border-main/50">
                          {cl.key.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-base text-text leading-tight">{cl.key}</div>
                          <div className="text-[10px] text-text3 font-bold uppercase tracking-widest mt-1">{cl.ind || 'General Business'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {cl.chs.map(ch => (
                          <span key={ch} className="px-2 py-1 rounded-lg bg-surface2 border border-border-main/50 text-[9px] font-bold text-text2 uppercase">
                            {CH_DEF[ch]?.l || ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gg animate-pulse" />
                        <span className="text-xs font-bold text-text leading-none uppercase tracking-wide">Connected</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingClient({key: cl.key, name: cl.key, chs: cl.chs}); setShowClientModal(true); }}
                          className="p-3 hover:bg-accent/10 text-text3 hover:text-accent rounded-xl transition-all"
                          title="Edit Client Info"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setPClient(cl.key); setActiveView('performance'); }}
                          className="p-3 hover:bg-surface2 text-text3 hover:text-text rounded-xl transition-all"
                          title="Input Performance"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- VIEW: PERFORMANCE EDITOR --- */}
      {activeView === 'performance' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Editor Form */}
          <div className="xl:col-span-7 bg-white rounded-[40px] shadow-main border border-border-main/50 overflow-hidden">
            <div className="p-10 border-b border-border-main/50 bg-surface2/20">
              <h2 className="text-xl font-black text-text">Performance Editor</h2>
              <p className="text-sm text-text3 font-medium">Input atau update metrik iklan per channel.</p>
            </div>
            
            <form onSubmit={handleSavePerforma} className="p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text3 uppercase tracking-widest ml-1">Klien Target</label>
                  <select value={pClient} onChange={e => setPClient(e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border-main bg-surface2/50 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all appearance-none cursor-pointer">
                    <option value="">-- Pilih Klien --</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text3 uppercase tracking-widest ml-1">Periode Laporan</label>
                  <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border-main bg-surface2/50 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all cursor-pointer">
                    {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-text3 uppercase tracking-widest ml-1">Marketing Channel</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeChannels.map(ch => (
                      <button 
                        key={ch}
                        type="button"
                        onClick={() => setPChannel(ch)}
                        className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${pChannel === ch ? 'border-accent bg-accent/5 text-accent shadow-inner' : 'border-border-main hover:border-text2 text-text3 bg-white'}`}
                      >
                        {CH_DEF[ch]?.l || ch}
                      </button>
                    ))}
                  </div>
                  {!pClient && <p className="text-[10px] text-text3 italic mt-2">Pilih klien terlebih dahulu untuk memunculkan channel.</p>}
                </div>
              </div>

              {pChannel ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Financials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-text uppercase tracking-tight">Core Financial Metrics</h3>
                    </div>
                    {[
                      { key: 'sp', label: 'Advertising Spend', icon: '💸' },
                      { key: 'rev', label: 'Conversion Revenue', icon: '💰' },
                      { key: 'ord', label: 'Total Orders', icon: '🛒' },
                    ].map(f => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-xs font-bold text-text2 ml-1">{f.label}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{f.icon}</span>
                          <input 
                            type="number" 
                            value={(fMetrics as any)[f.key]} 
                            onChange={e => setFMetrics({...fMetrics, [f.key]: e.target.value})} 
                            className="w-full h-14 pl-12 pr-5 rounded-2xl border border-border-main bg-white text-base font-black focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all" 
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reach */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border-main/50">
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-text uppercase tracking-tight">Awareness & Traffic</h3>
                    </div>
                    {[
                      { key: 'reach', label: 'Unique Reach' },
                      { key: 'impr', label: 'Impressions' },
                      { key: 'vis', label: 'Total Visitors' },
                      { key: 'res', label: 'Results (ATC/Leads)' },
                    ].map(f => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-xs font-bold text-text2 ml-1">{f.label}</label>
                        <input 
                          type="number" 
                          value={(fMetrics as any)[f.key]} 
                          onChange={e => setFMetrics({...fMetrics, [f.key]: e.target.value})} 
                          className="w-full h-14 px-5 rounded-2xl border border-border-main bg-white text-base font-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" 
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-10">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-16 bg-text text-white rounded-[24px] font-black text-lg shadow-2xl shadow-black/10 hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Push Performance Data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-border-main rounded-[32px] bg-surface2/30">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ArrowRightLeft className="w-8 h-8 text-text3" />
                  </div>
                  <h4 className="font-bold text-text">Pilih Channel untuk Mulai</h4>
                  <p className="text-xs text-text3 font-medium mt-1">Metrik pengisian akan muncul setelah channel dipilih.</p>
                </div>
              )}
            </form>
          </div>

          {/* History Sidebar */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-text rounded-[40px] p-10 text-white shadow-2xl shadow-black/20 relative overflow-hidden">
              <div className="relative z-10">
                <History className="w-8 h-8 mb-6 text-accent" />
                <h3 className="text-xl font-black mb-2 tracking-tight">Performance History</h3>
                <p className="text-white/60 text-sm font-medium mb-8">Bandingkan data yang diinput dengan bulan-bulan sebelumnya.</p>
                
                <div className="space-y-4">
                  {historyData.map((h, i) => (
                    <div key={i} className={`p-5 rounded-3xl border transition-all ${h.period === pPeriod ? 'bg-white/10 border-accent shadow-lg' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">{h.label}</span>
                        {h.data ? (
                          <div className="text-[10px] font-black px-2 py-0.5 rounded bg-gg text-white uppercase leading-none">Complete</div>
                        ) : (
                          <div className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-white/40 uppercase leading-none">No Data</div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Revenue</div>
                          <div className="text-sm font-black">{h.data ? fRp(h.data.rev || 0) : '—'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Spend</div>
                          <div className="text-sm font-black">{h.data ? fRp(h.data.sp || 0) : '—'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {historyData.length === 0 && <p className="text-xs text-white/30 italic text-center py-10">Silakan pilih klien & channel untuk memuat histori.</p>}
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-border-main/50 shadow-main">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-accent" />
                <h4 className="text-sm font-black text-text uppercase">Data Policy</h4>
              </div>
              <p className="text-xs text-text3 leading-relaxed font-medium">
                Setiap data yang diinput akan disimpan secara permanen di database Supabase. Jika terjadi kesalahan input, silakan timpa data dengan periode dan channel yang sama.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- CLIENT MODAL --- */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-text/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-border-main/50 flex items-center justify-between bg-surface2/30">
              <div>
                <h3 className="text-2xl font-black text-text tracking-tighter">
                  {editingClient?.key ? 'Edit Client Config' : 'Register New Client'}
                </h3>
                <p className="text-xs text-text3 font-medium mt-1">Konfigurasi metadata dan channel aktif klien.</p>
              </div>
              <button onClick={() => setShowClientModal(false)} className="p-3 hover:bg-surface2 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-text3" />
              </button>
            </div>
            
            <form onSubmit={handleSaveClient} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text3 uppercase tracking-widest ml-1">Client Key / ID</label>
                <input 
                  type="text" 
                  value={editingClient?.key} 
                  onChange={e => setEditingClient({...editingClient!, key: e.target.value})}
                  disabled={!!editingClient?.key && editingClient.key !== ''}
                  className="w-full h-14 px-5 rounded-2xl border border-border-main bg-white text-base font-black focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all disabled:bg-surface2" 
                  placeholder="Contoh: kalisha"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-text3 uppercase tracking-widest ml-1">Active Marketing Channels</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient?.chs.includes(ch);
                    return (
                      <button 
                        key={ch}
                        type="button"
                        onClick={() => {
                          const current = editingClient?.chs || [];
                          const next = current.includes(ch) ? current.filter(x => x !== ch) : [...current, ch];
                          setEditingClient({...editingClient!, chs: next});
                        }}
                        className={`p-4 rounded-2xl border-2 text-[9px] font-black uppercase tracking-wider transition-all text-left flex flex-col gap-1 ${active ? 'border-accent bg-accent/5 text-accent' : 'border-border-main bg-white text-text3 hover:border-text2'}`}
                      >
                        <span className="text-text leading-none">{CH_DEF[ch]?.l}</span>
                        <span className="opacity-60 text-[7px]">{CH_DEF[ch]?.stage}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 h-14 border border-border-main rounded-2xl font-bold text-sm text-text3 hover:bg-surface2 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-14 bg-accent text-white rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Minimal placeholder for missing icons
const ShieldCheck = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
