'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF, LM } from '@/lib/data';
import { fRp, totals } from '@/lib/utils';
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
  Info,
  ShieldCheck
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
  }), [CLIENTS, DATA]);

  // Performance History
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
      const { error: cErr } = await supabase.from('clients').upsert({ 
        client_key: editingClient.key, 
        name: editingClient.name || editingClient.key 
      });
      if (cErr) throw cErr;

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
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Toast Notification (Aligned Style) */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-[12px] shadow-main border animate-in slide-in-from-right-full duration-300 ${toast.type === 'success' ? 'bg-gd-bg border-gd-border text-gd-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold tracking-tight">{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-black/5 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header (Sesuai Dashboard Client) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text">Data Management</h1>
          <p className="text-[12px] font-medium text-text3 mt-1 uppercase tracking-wider">Administrator Hub</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeView === 'overview' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-white text-text2 border border-border-main hover:bg-surface2'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => setActiveView('performance')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeView === 'performance' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-white text-text2 border border-border-main hover:bg-surface2'}`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* Stats Row (Sesuai Dashboard Client) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'bg-accent-light text-accent' },
          { label: 'Data Points', value: stats.totalRecords, icon: Layers, color: 'bg-tofu-bg text-tofu' },
          { label: 'Active Periods', value: stats.activePeriods, icon: TrendingUp, color: 'bg-gd-bg text-gd' },
          { label: 'System Health', value: 'Optimal', icon: ShieldCheck, color: 'bg-gg-bg text-gg' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-main">
            <div className="flex justify-between items-start mb-6">
              <div className="text-[13px] font-semibold text-text2 uppercase tracking-wide">{s.label}</div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-text tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      {activeView === 'overview' && (
        <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-base font-bold text-text">Clients Directory</h2>
              <p className="text-[12px] font-medium text-text3 mt-1">Daftar klien dan konfigurasi channel aktif.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-text3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-white border border-border-main rounded-full text-sm w-48 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all" />
              </div>
              <button 
                onClick={() => { setEditingClient({key: '', name: '', chs: []}); setShowClientModal(true); }}
                className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Client
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-xs font-semibold text-text3 uppercase tracking-wider border-b border-border-main">
                  <th className="pb-4 font-semibold">Klien</th>
                  <th className="pb-4 font-semibold">Channels</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 text-right pr-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {CLIENTS.map(cl => (
                  <tr key={cl.key} className="group hover:bg-surface2 transition-all duration-200">
                    <td className="py-5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center font-bold text-sm text-text3 border border-border-main uppercase">{cl.key.charAt(0)}</div>
                        <div>
                          <div className="font-bold text-sm text-text">{cl.key}</div>
                          <div className="text-[11px] text-text3 font-medium uppercase mt-0.5">{cl.ind || 'General'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cl.chs.map(ch => (
                          <span key={ch} className="px-2 py-0.5 rounded-md bg-surface2 border border-border-main/50 text-[10px] font-bold text-text3 uppercase">{ch}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-gg-bg text-gg-text border border-gg-border">ACTIVE</span>
                    </td>
                    <td className="py-5 text-right pr-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingClient({key: cl.key, name: cl.key, chs: cl.chs}); setShowClientModal(true); }} className="p-2 hover:bg-accent-light text-text3 hover:text-accent rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setPClient(cl.key); setActiveView('performance'); }} className="p-2 hover:bg-surface3 text-text3 hover:text-text rounded-lg transition-colors">
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

      {activeView === 'performance' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-500">
          
          <div className="xl:col-span-8 bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
            <h2 className="text-base font-bold text-text mb-2">Performance Editor</h2>
            <p className="text-[12px] font-medium text-text3 mb-8">Update metrik performa iklan bulanan.</p>
            
            <form onSubmit={handleSavePerforma}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 p-6 bg-surface2 rounded-[20px] border border-border-main">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text3 uppercase ml-1">Klien</label>
                  <select value={pClient} onChange={e => setPClient(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-bold focus:ring-2 focus:ring-accent/20 outline-none">
                    <option value="">-- Pilih --</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text3 uppercase ml-1">Periode</label>
                  <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-bold focus:ring-2 focus:ring-accent/20 outline-none">
                    {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text3 uppercase ml-1">Channel</label>
                  <select value={pChannel} onChange={e => setPChannel(e.target.value)} disabled={!pClient} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-bold focus:ring-2 focus:ring-accent/20 outline-none">
                    <option value="">-- Pilih --</option>
                    {activeChannels.map(ch => <option key={ch} value={ch}>{CH_DEF[ch]?.l || ch}</option>)}
                  </select>
                </div>
              </div>

              {pChannel ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-text uppercase border-b border-border-main pb-2 tracking-wide">Financial Metrics</h3>
                      {[
                        { key: 'sp', label: 'Ad Spend' },
                        { key: 'rev', label: 'Revenue' },
                        { key: 'ord', label: 'Orders' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[11px] font-bold text-text2 mb-1.5 ml-1">{f.label}</label>
                          <input type="number" value={(fMetrics as any)[f.key]} onChange={e => setFMetrics({...fMetrics, [f.key]: e.target.value})} className="w-full h-10 px-4 rounded-lg border border-border-main bg-white text-sm font-semibold focus:border-accent outline-none transition-all" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-text uppercase border-b border-border-main pb-2 tracking-wide">Traffic & Awareness</h3>
                      {[
                        { key: 'reach', label: 'Reach' },
                        { key: 'impr', label: 'Impressions' },
                        { key: 'vis', label: 'Visitors' },
                        { key: 'res', label: 'Results' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[11px] font-bold text-text2 mb-1.5 ml-1">{f.label}</label>
                          <input type="number" value={(fMetrics as any)[f.key]} onChange={e => setFMetrics({...fMetrics, [f.key]: e.target.value})} className="w-full h-10 px-4 rounded-lg border border-border-main bg-white text-sm font-semibold focus:border-accent outline-none transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-border-main flex justify-end">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-accent/20 transition-all">
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-border-main rounded-[20px] bg-surface2/30">
                  <p className="text-sm font-bold text-text3 italic">Silakan pilih klien & channel untuk mengedit data.</p>
                </div>
              )}
            </form>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
              <h3 className="text-sm font-bold text-text mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-accent" />
                History Preview
              </h3>
              <div className="space-y-3">
                {historyData.map((h, i) => (
                  <div key={i} className={`p-4 rounded-xl border transition-all ${h.period === pPeriod ? 'bg-accent-light border-accent/20' : 'bg-surface2 border-border-main/50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text3">{h.label}</span>
                      {h.data ? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gg-bg text-gg-text">COMPLETE</span> : <span className="text-[9px] font-bold text-text3 italic">NO DATA</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] font-bold text-text3 uppercase mb-0.5">Rev</div>
                        <div className="text-[12px] font-bold text-text">{h.data ? fRp(h.data.rev) : '—'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-text3 uppercase mb-0.5">Spend</div>
                        <div className="text-[12px] font-bold text-text">{h.data ? fRp(h.data.sp) : '—'}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {historyData.length === 0 && <p className="text-[11px] text-text3 italic text-center py-6">Pilih channel untuk melihat histori.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal (Sesuai Style Dashboard) */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-border-main flex items-center justify-between bg-surface2/30">
              <div>
                <h3 className="text-base font-bold text-text">
                  {editingClient?.key ? 'Edit Client' : 'Add New Client'}
                </h3>
              </div>
              <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-surface2 rounded-full transition-colors">
                <X className="w-5 h-5 text-text3" />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-8 space-y-6">
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase ml-1 block mb-1.5">Client Key / ID</label>
                <input type="text" value={editingClient?.key} onChange={e => setEditingClient({...editingClient!, key: e.target.value})} disabled={!!editingClient?.key && editingClient.key !== ''} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-bold focus:border-accent outline-none disabled:bg-surface2" placeholder="Contoh: brand_a" required />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-text3 uppercase ml-1 block">Active Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient?.chs.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => {
                        const current = editingClient?.chs || [];
                        const next = current.includes(ch) ? current.filter(x => x !== ch) : [...current, ch];
                        setEditingClient({...editingClient!, chs: next});
                      }} className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center gap-3 ${active ? 'border-accent bg-accent-light text-accent' : 'border-border-main bg-white text-text3 hover:border-text2'}`}>
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-accent' : 'bg-border-alt'}`} />
                        {CH_DEF[ch]?.l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 h-11 rounded-full border border-border-main font-bold text-xs text-text3 hover:bg-surface2 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 h-11 bg-accent text-white rounded-full font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Client
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
