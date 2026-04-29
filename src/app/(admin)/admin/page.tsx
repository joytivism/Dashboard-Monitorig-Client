'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { 
  AlertCircle, CheckCircle2, Users, Layers, Zap, 
  Edit3, Trash2, X, Download, Plus, TrendingUp, ShieldCheck
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
      setToast({ type: 'success', text: 'Client saved successfully!' });
      setShowClientModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDeleteClient = async (key: string) => {
    if (!confirm(`Delete client "${key}"? All performance data will be removed.`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('client_key', key);
      if (error) throw error;
      setToast({ type: 'success', text: 'Client deleted!' });
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      {/* Stat Cards - Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Total Brands</p>
          <p className="text-[42px] font-extrabold text-gray-900 leading-none tracking-tight">{CLIENTS.length}</p>
          <p className="text-[11px] font-semibold text-gray-300 mt-2">Active clients managed</p>
        </div>
        <div className="bg-white rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Data Points</p>
          <p className="text-[42px] font-extrabold text-gray-900 leading-none tracking-tight">{DATA.length}</p>
          <p className="text-[11px] font-semibold text-gray-300 mt-2">Performance entries recorded</p>
        </div>
        <div className="bg-white rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">AI Tokens Used</p>
          <p className="text-[42px] font-extrabold text-gray-900 leading-none tracking-tight">{(aiStats.totalTokens / 1000).toFixed(1)}<span className="text-[22px] text-gray-300 font-bold">K</span></p>
          <p className="text-[11px] font-semibold text-gray-300 mt-2">Across all generations</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-emerald-100/60">
          <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-3">AI Cost</p>
          <p className="text-[42px] font-extrabold text-gray-900 leading-none tracking-tight">${aiStats.totalCost.toFixed(4)}</p>
          <p className="text-[11px] font-semibold text-emerald-400 mt-2">Estimated total spend</p>
        </div>
      </div>

      {/* Clients Directory */}
      <div className="bg-white rounded-[28px] p-8 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[18px] font-extrabold text-gray-900">Clients</h2>
            <p className="text-[12px] font-semibold text-gray-300 mt-0.5">Manage brands & data completeness</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-gray-50 text-gray-500 px-5 py-2.5 rounded-2xl text-[12px] font-bold border border-gray-100 hover:bg-gray-100 transition-all">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={() => { setEditingClient({key: '', name: '', chs: [], industry: '', pic_name: '', brand_category: '', account_strategist: ''}); setShowClientModal(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[12px] font-bold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Brand</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Industry</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Data Status</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map(cl => (
                <tr key={cl.key} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-[11px] font-black text-blue-600 uppercase">{cl.key.substring(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-gray-900">{cl.key}</div>
                        <div className="text-[10px] font-semibold text-gray-300 mt-0.5">{cl.pic}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="text-[12px] font-bold text-gray-600">{cl.ind}</div>
                    <div className="text-[10px] font-semibold text-gray-300 mt-0.5">{cl.cg}</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${completeness[cl.key] === 'full' ? 'bg-emerald-400' : completeness[cl.key] === 'partial' ? 'bg-amber-400' : 'bg-red-300'}`} />
                      <span className="text-[11px] font-bold text-gray-500">
                        {completeness[cl.key] === 'full' ? 'Complete' : completeness[cl.key] === 'partial' ? 'Partial' : 'Empty'}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { 
                        setEditingClient({
                          key: cl.key, name: cl.key, chs: cl.chs, industry: cl.ind, pic_name: cl.pic, brand_category: cl.cg, account_strategist: cl.as
                        }); 
                        setShowClientModal(true); 
                      }} className="p-2.5 hover:bg-blue-50 text-gray-300 hover:text-blue-500 rounded-xl transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClient(cl.key)} className="p-2.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] shadow-2xl shadow-black/10 w-full max-w-2xl overflow-hidden border border-black/[0.04]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-extrabold text-gray-900">Client Configuration</h3>
                <p className="text-[11px] font-semibold text-gray-300 mt-0.5">Manage brand metadata & channels</p>
              </div>
              <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveClient} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Client Key</label>
                  <input type="text" value={editingClient.key} onChange={e => setEditingClient({...editingClient, key: e.target.value})} disabled={!!editingClient.key && CLIENTS.some(c => c.key === editingClient.key)} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-800 outline-none focus:border-emerald-300 focus:bg-white transition-all" placeholder="brand_key" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Industry</label>
                  <input type="text" value={editingClient.industry} onChange={e => setEditingClient({...editingClient, industry: e.target.value})} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-800 outline-none focus:border-emerald-300 focus:bg-white transition-all" placeholder="Fashion / Retail" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">PIC Name</label>
                  <input type="text" value={editingClient.pic_name} onChange={e => setEditingClient({...editingClient, pic_name: e.target.value})} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-800 outline-none focus:border-emerald-300 focus:bg-white transition-all" placeholder="Nama PIC" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Strategist</label>
                  <input type="text" value={editingClient.account_strategist} onChange={e => setEditingClient({...editingClient, account_strategist: e.target.value})} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-800 outline-none focus:border-emerald-300 focus:bg-white transition-all" placeholder="Nama Strategist" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 ml-1 tracking-wider">Active Channels</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient.chs.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => {
                        const next = active ? editingClient.chs.filter(x => x !== ch) : [...editingClient.chs, ch];
                        setEditingClient({...editingClient, chs: next});
                      }} className={`p-3.5 rounded-2xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                        {CH_DEF[ch]?.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold text-[13px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Save Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
