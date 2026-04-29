'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF, LM as STATUS_LABEL_MAP } from '@/lib/data';
import { 
  AlertCircle, CheckCircle2, Users, Database, Zap,
  Edit3, Trash2, X, Download, Plus, Search, ArrowUpRight, DollarSign
} from 'lucide-react';
import { fRp, clientWorst } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminClientsPage() {
  const { CLIENTS, PERIODS, DATA, AI_LOGS } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingClient, setEditingClient] = useState({
    key: '', name: '', chs: [] as string[], industry: '', pic_name: '', brand_category: '', account_strategist: ''
  });

  // ─── Derived Data ───
  const aiStats = useMemo(() => {
    const totalTokens = AI_LOGS?.reduce((sum, l) => sum + (l.tk || 0), 0) || 0;
    const totalCost = AI_LOGS?.reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return { totalTokens, totalCost, count: AI_LOGS?.length || 0 };
  }, [AI_LOGS]);

  const curPeriod = PERIODS[PERIODS.length - 1];
  const prevPeriod = PERIODS.length > 1 ? PERIODS[PERIODS.length - 2] : null;

  const spendStats = useMemo(() => {
    if (!DATA || DATA.length === 0) return { current: 0, previous: 0 };
    const current = DATA.filter(d => d.p === curPeriod).reduce((sum, d) => sum + (d.sp || 0), 0);
    const previous = prevPeriod ? DATA.filter(d => d.p === prevPeriod).reduce((sum, d) => sum + (d.sp || 0), 0) : 0;
    return { current, previous };
  }, [DATA, curPeriod, prevPeriod]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return CLIENTS;
    return CLIENTS.filter(c => c.key.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [CLIENTS, searchTerm]);

  // ─── Actions ───
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient.key) return;
    setLoading(true);
    try {
      await supabase.from('clients').upsert({ 
        client_key: editingClient.key, name: editingClient.name || editingClient.key,
        industry: editingClient.industry, pic_name: editingClient.pic_name,
        brand_category: editingClient.brand_category, account_strategist: editingClient.account_strategist
      });
      await supabase.from('client_channels').delete().eq('client_key', editingClient.key);
      if (editingClient.chs.length > 0) {
        await supabase.from('client_channels').insert(
          editingClient.chs.map(ch => ({ client_key: editingClient.key, channel_key: ch }))
        );
      }
      setToast({ type: 'success', text: 'Client saved!' });
      setShowClientModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDeleteClient = async (key: string) => {
    if (!confirm(`Delete "${key}"? All data will be removed.`)) return;
    setLoading(true);
    try {
      await supabase.from('clients').delete().eq('client_key', key);
      setToast({ type: 'success', text: 'Deleted!' });
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
    const a = document.createElement('a'); a.href = url;
    a.download = `report_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  // Use Dashboard Palette Colors for Avatars
  const getAvatarColor = (key: string) => {
    const colors = ['bg-or', 'bg-text', 'bg-tofu', 'bg-gd', 'bg-rr', 'bg-text2'];
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20 md:pb-0">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3 rounded-xl shadow-main border ${toast.type === 'success' ? 'bg-gg-bg border-gg-border text-gg-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-xs font-bold">{toast.text}</span>
        </div>
      )}

      {/* ═══ TOP ACTION BAR (MINIMALIST) ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 px-5 h-12 bg-white rounded-full border border-border-main shadow-sm focus-within:border-accent transition-all max-w-md group">
            <Search className="w-4 h-4 text-text3 group-focus-within:text-accent transition-colors" />
            <input type="text" placeholder="Search brands, industries, or PIC..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent text-[13px] font-bold text-text placeholder:text-text3 outline-none flex-1" />
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={exportToCSV} className="hidden sm:flex items-center gap-2 px-5 h-12 rounded-full border border-border-main bg-white text-[12px] font-bold text-text3 hover:text-text hover:bg-surface2 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditingClient({key: '', name: '', chs: [], industry: '', pic_name: '', brand_category: '', account_strategist: ''}); setShowClientModal(true); }} className="flex items-center gap-2 bg-text text-white px-8 h-12 rounded-full text-[13px] font-bold shadow-main hover:bg-accent transition-all">
            <Plus className="w-4 h-4" /> Add New Brand
          </button>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-[24px] p-6 shadow-main border border-border-main">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-bb-bg flex items-center justify-center text-bb">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Total Brands</div>
            <div className="text-2xl font-bold text-text tracking-tight">{CLIENTS.length}</div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-text3 bg-surface2 px-2 py-1 rounded-md w-fit">
              {CLIENTS.slice(0, 3).map(c => (
                <span key={c.key} className={`w-1.5 h-1.5 rounded-full ${getAvatarColor(c.key)}`} />
              ))}
              <span>Active tracking</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-main border border-border-main">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-gg-bg flex items-center justify-center text-gg">
              <DollarSign className="w-5 h-5" />
            </div>
            <button onClick={exportToCSV} title="Export CSV" className="p-2 rounded-lg bg-surface2 text-text3 hover:text-text transition-all"><Download className="w-4 h-4"/></button>
          </div>
          <div>
            <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Managed Spend</div>
            <div className="text-2xl font-bold text-text tracking-tight">{fRp(spendStats.current)}</div>
            <div className="mt-3 text-[10px] font-bold text-gg bg-gg-bg px-2 py-1 rounded-md w-fit uppercase">
              Current Period
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-main border border-border-main">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-yy-bg flex items-center justify-center text-yy">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">Total Records</div>
            <div className="text-2xl font-bold text-text tracking-tight">{DATA.length}</div>
            <div className="mt-3 text-[10px] font-bold text-text3 bg-surface2 px-2 py-1 rounded-md w-fit">
              Across {PERIODS.length} periods
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-main border border-border-main">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-rr-bg flex items-center justify-center text-rr">
              <Zap className="w-5 h-5" />
            </div>
            <button onClick={() => router.push('/admin/settings')} className="p-2 rounded-lg bg-surface2 text-text3 hover:text-text transition-all"><ArrowUpRight className="w-4 h-4"/></button>
          </div>
          <div>
            <div className="text-[11px] font-bold text-text3 uppercase tracking-wider mb-1">AI Utilization</div>
            <div className="text-2xl font-bold text-text tracking-tight">{(aiStats.totalTokens / 1000).toFixed(1)}K</div>
            <div className="mt-3 text-[10px] font-bold text-text3 bg-surface2 px-2 py-1 rounded-md w-fit">
              Est. Cost: ${aiStats.totalCost.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CLIENT DIRECTORY ═══ */}
      <div className="bg-white rounded-[24px] border border-border-main overflow-hidden shadow-main">
        <div className="p-6 border-b border-border-main flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-border-main">
              <Users className="w-5 h-5 text-text2" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text tracking-tight">Client Directory</h2>
              <p className="text-xs font-medium text-text3">Manage and monitor connected brands</p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {['All', 'Fashion', 'Health', 'F&B'].map((f, i) => (
              <button key={f} className={`px-4 h-8 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-text text-white' : 'bg-surface2 text-text3 hover:bg-border-main'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-main bg-surface2/30">
                <th className="text-left py-4 px-6 text-[10px] font-bold text-text3 uppercase tracking-widest">Brand</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-text3 uppercase tracking-widest">Industry</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-text3 uppercase tracking-widest">Live Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-text3 uppercase tracking-widest">Channels</th>
                <th className="py-4 px-6 text-[10px] font-bold text-text3 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {filteredClients.map(cl => (
                <tr key={cl.key} className="group hover:bg-surface2 transition-all">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${getAvatarColor(cl.key)} flex items-center justify-center shrink-0 shadow-sm`}>
                        <span className="text-white text-[12px] font-black uppercase">{cl.key.substring(0, 1)}</span>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-text">{cl.key}</div>
                        <div className="text-[11px] font-medium text-text3">{cl.pic || 'No PIC'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-semibold text-text2">{cl.ind || 'General'}</span>
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-${wc}-bg text-${wc}-text`}>
                          {STATUS_LABEL_MAP[wc] || 'Stabil'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text3/30"/>
                      <span className="text-[11px] font-bold text-text3 uppercase">{cl.chs.length} Connected</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => router.push(`/client/${cl.key}`)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-border-main hover:border-accent hover:text-accent text-text3 transition-all" title="View Dashboard"><ArrowUpRight className="w-4 h-4" /></button>
                      <button onClick={() => { setEditingClient({ key: cl.key, name: cl.key, chs: cl.chs, industry: cl.ind, pic_name: cl.pic, brand_category: cl.cg, account_strategist: cl.as }); setShowClientModal(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-border-main hover:border-text hover:text-text text-text3 transition-all" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClient(cl.key)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-border-main hover:border-rr hover:text-rr text-text3 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center text-sm font-bold text-text3">No brands found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-text/20 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-2xl overflow-hidden border border-border-main">
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-surface2">
              <h3 className="text-lg font-bold text-text">Client Configuration</h3>
              <button onClick={() => setShowClientModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface text-text3"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveClient} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Client Key', value: editingClient.key, key: 'key', ph: 'brand_key', disabled: !!editingClient.key && CLIENTS.some(c => c.key === editingClient.key) },
                  { label: 'Industry', value: editingClient.industry, key: 'industry', ph: 'Fashion / Retail' },
                  { label: 'PIC Name', value: editingClient.pic_name, key: 'pic_name', ph: 'Nama PIC' },
                  { label: 'Strategist', value: editingClient.account_strategist, key: 'account_strategist', ph: 'Nama Strategist' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-2">{f.label}</label>
                    <input type="text" value={f.value} disabled={f.disabled} onChange={e => setEditingClient({...editingClient, [f.key]: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all disabled:opacity-50" placeholder={f.ph} required={f.key === 'key'} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-3">Data Channels</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient.chs.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => {
                        const next = active ? editingClient.chs.filter(x => x !== ch) : [...editingClient.chs, ch];
                        setEditingClient({...editingClient, chs: next});
                      }} className={`p-3.5 rounded-xl border text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${active ? 'border-text bg-text text-white' : 'border-border-main bg-surface2 text-text3 hover:border-border-alt'}`}>
                        <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-border-main'}`} />
                        {CH_DEF[ch]?.l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full h-14 bg-text text-white rounded-xl font-bold text-[14px] shadow-main hover:bg-text2 transition-all flex items-center justify-center gap-2">
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
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
