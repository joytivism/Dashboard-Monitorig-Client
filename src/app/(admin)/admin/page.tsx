'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { 
  AlertCircle, CheckCircle2, Plus, Users, Layers, Zap, ShieldCheck, 
  Search, Edit3, Trash2, X, Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminClientsPage() {
  const { CLIENTS, PERIODS, DATA, AI_LOGS } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  
  const [editingClient, setEditingClient] = useState({
    key: '', name: '', chs: [] as string[], industry: '', pic_name: '', brand_category: '', account_strategist: ''
  });

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
  }), [CLIENTS, DATA]);

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

      setToast({ type: 'success', text: 'Data klien berhasil disimpan!' });
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

  const exportToCSV = () => {
    const headers = ['Client', 'Period', 'Channel', 'Spend', 'Revenue', 'Orders'];
    const rows = DATA.map(d => [d.c, d.p, d.ch, d.sp, d.rev, d.ord]);
    const content = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-[12px] shadow-main border animate-in slide-in-from-right-full ${toast.type === 'success' ? 'bg-gd-bg border-gd-border text-gd-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Active Brands', value: stats.totalClients, color: 'bg-accent-light text-accent', icon: Users },
          { label: 'Total Records', value: stats.totalRecords, color: 'bg-tofu-bg text-tofu', icon: Layers },
          { label: 'AI Total Tokens', value: (aiStats.totalTokens/1000).toFixed(1) + 'K', color: 'bg-gd-bg text-gd', icon: Zap },
          { label: 'AI Est. Cost', value: '$' + aiStats.totalCost.toFixed(4), color: 'bg-gg-bg text-gg', icon: ShieldCheckIcon },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-main border border-border-main/50 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[11px] font-bold text-text3 uppercase tracking-widest">{s.label}</div>
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
            </div>
            <div className="text-2xl font-bold text-text">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-base font-bold text-text">Clients Directory</h2>
          <div className="flex items-center gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-surface2 text-text2 px-4 py-2 rounded-full text-xs font-bold border border-border-main hover:bg-surface3 transition-all">
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>
            <button onClick={() => { setEditingClient({key: '', name: '', chs: [], industry: '', pic_name: '', brand_category: '', account_strategist: ''}); setShowClientModal(true); }} className="bg-accent text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-accent/20">Add Client</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-text3 uppercase tracking-[0.2em] border-b border-border-main/50">
                <th className="pb-4 px-4">Brand</th>
                <th className="pb-4 px-4">Metadata</th>
                <th className="pb-4 px-4">Data Status</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/10">
              {CLIENTS.map(cl => (
                <tr key={cl.key} className="hover:bg-surface2 transition-all">
                  <td className="py-5 px-4">
                    <div className="font-bold text-sm text-text">{cl.key}</div>
                    <div className="text-[10px] text-accent font-bold mt-0.5">{cl.pic}</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="text-xs font-bold text-text2">{cl.ind}</div>
                    <div className="text-[10px] text-text3 font-medium uppercase mt-0.5">{cl.cg}</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${completeness[cl.key] === 'full' ? 'bg-gg' : completeness[cl.key] === 'partial' ? 'bg-mofu' : 'bg-rr'} animate-pulse`} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-text2">
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
                      }} className="p-2 hover:bg-accent-light text-text3 hover:text-accent rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClient(cl.key)} className="p-2 hover:bg-rr-bg text-text3 hover:text-rr rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CLIENT */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-2xl overflow-hidden">
            <div className="p-8 border-b border-border-main bg-surface2/30 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text">Client Configuration</h3>
                <p className="text-[10px] text-text3 font-bold uppercase tracking-widest mt-1">Manage brand & channels</p>
              </div>
              <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-surface3 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveClient} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Client Key</label>
                  <input type="text" value={editingClient.key} onChange={e => setEditingClient({...editingClient, key: e.target.value})} disabled={!!editingClient.key && CLIENTS.some(c => c.key === editingClient.key)} className="w-full h-11 px-4 rounded-xl border border-border-main text-sm font-bold bg-surface2 focus:bg-white transition-all outline-none" placeholder="brand_id" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Industry</label>
                  <input type="text" value={editingClient.industry} onChange={e => setEditingClient({...editingClient, industry: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 focus:bg-white transition-all text-sm font-bold outline-none" placeholder="Retail / Fashion" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">PIC Name</label>
                  <input type="text" value={editingClient.pic_name} onChange={e => setEditingClient({...editingClient, pic_name: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 focus:bg-white transition-all text-sm font-bold outline-none" placeholder="Nama PIC" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Strategist</label>
                  <input type="text" value={editingClient.account_strategist} onChange={e => setEditingClient({...editingClient, account_strategist: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 focus:bg-white transition-all text-sm font-bold outline-none" placeholder="Nama Strategist" />
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

              <button type="submit" disabled={loading} className="w-full h-14 bg-text text-white rounded-full font-bold text-sm shadow-xl shadow-black/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                {loading && <Zap className="w-4 h-4 animate-spin" />}
                Save Client Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const ShieldCheckIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
