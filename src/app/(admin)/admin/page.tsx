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
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-main border ${toast.type === 'success' ? 'bg-gg-bg border-gg-border text-gg-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      {/* ═══ TOP ACTION BAR ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-1">
            <span className="w-4 h-[2px] bg-accent rounded-full"/> Admin Control Center
          </div>
          <h1 className="text-3xl font-black text-text tracking-tight">Management Overview <span className="text-accent">.</span></h1>
          <p className="text-sm font-medium text-text3">Monitor brand performance and agency operations</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-surface2/50 p-2 rounded-[20px] border border-border-main backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 h-10 bg-white rounded-full border border-border-main shadow-sm focus-within:border-accent transition-all min-w-[240px]">
            <Search className="w-4 h-4 text-text3" />
            <input type="text" placeholder="Search brands..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent text-[13px] font-semibold text-text placeholder:text-text3 outline-none flex-1" />
          </div>
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-white border border-border-main text-text3 px-4 h-10 rounded-full text-[12px] font-bold hover:text-text hover:bg-surface2 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => { setEditingClient({key: '', name: '', chs: [], industry: '', pic_name: '', brand_category: '', account_strategist: ''}); setShowClientModal(true); }} className="flex items-center gap-2 bg-text text-white px-5 h-10 rounded-full text-[12px] font-bold shadow-main hover:bg-accent transition-all">
            <Plus className="w-4 h-4" /> Add Brand
          </button>
        </div>
      </div>

      {/* ═══ BENTO STATS ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Stats - Large */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] border border-border-main p-8 shadow-main group hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-3xl bg-surface2 flex items-center justify-center border border-border-main group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-text" />
              </div>
              <div className="flex -space-x-2">
                {CLIENTS.slice(0, 3).map(c => (
                  <div key={c.key} className={`w-8 h-8 rounded-full border-2 border-white ${getAvatarColor(c.key)} flex items-center justify-center text-[10px] font-black text-white`}>
                    {c.key.substring(0, 1)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface flex items-center justify-center text-[10px] font-black text-text3">
                  +{CLIENTS.length}
                </div>
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-text tracking-tighter mb-1">{CLIENTS.length}</div>
              <p className="text-[12px] font-bold text-text3 uppercase tracking-[0.1em]">Total Brands Managed</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-border-main p-8 shadow-main group hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-3xl bg-gg-bg flex items-center justify-center border border-gg-border group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-gg" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gg-bg border border-gg-border">
                <span className="w-2 h-2 rounded-full bg-gg animate-pulse"/>
                <span className="text-[10px] font-black text-gg uppercase">Active Spend</span>
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-text tracking-tighter mb-2">{fRp(spendStats.current)}</div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-text3 uppercase tracking-[0.1em]">Monthly Budget</span>
                <span className="px-2 py-0.5 rounded-md bg-surface2 text-[10px] font-bold text-text3">Prev: {fRp(spendStats.previous)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats - Stacked */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-[32px] border border-border-main p-6 shadow-main flex items-center gap-5 group hover:bg-surface2 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-or-bg flex items-center justify-center border border-or-border shrink-0">
              <Database className="w-6 h-6 text-or" />
            </div>
            <div>
              <div className="text-2xl font-black text-text leading-tight">{DATA.length}</div>
              <p className="text-[11px] font-bold text-text3 uppercase tracking-wide">Data Points Records</p>
            </div>
          </div>

          <div className="flex-1 bg-text rounded-[32px] border border-text/10 p-6 shadow-main flex items-center gap-5 group hover:bg-text2 transition-all cursor-pointer" onClick={() => router.push('/admin/settings')}>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white leading-tight">{(aiStats.totalTokens / 1000).toFixed(1)}</span>
                <span className="text-[12px] font-bold text-white/50">K</span>
              </div>
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wide">AI Utilization</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-all"/>
          </div>
        </div>
      </div>

      {/* ═══ CLIENT DIRECTORY ═══ */}
      <div className="bg-white rounded-[32px] border border-border-main overflow-hidden shadow-main">
        <div className="p-8 border-b border-border-main bg-surface/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-text text-white flex items-center justify-center shadow-lg"><Users className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-black text-text tracking-tight">Client Directory</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-surface2 text-[10px] font-black text-text3 uppercase">{filteredClients.length} connected</span>
                  <span className="w-1 h-1 rounded-full bg-text3/30"/>
                  <span className="text-[11px] font-semibold text-text3">Manage and monitor connected brands</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              {['All Brands', 'Fashion', 'Health', 'F&B'].map((f, i) => (
                <button key={f} className={`px-4 h-9 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-text text-white shadow-md' : 'bg-surface2 text-text3 hover:bg-border-main'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface2/30">
                <th className="text-left py-5 px-8 text-[11px] font-black text-text3 uppercase tracking-[0.15em]">Brand Identity</th>
                <th className="text-left py-5 px-8 text-[11px] font-black text-text3 uppercase tracking-[0.15em]">Industry</th>
                <th className="text-left py-5 px-8 text-[11px] font-black text-text3 uppercase tracking-[0.15em]">Live Status</th>
                <th className="text-left py-5 px-8 text-[11px] font-black text-text3 uppercase tracking-[0.15em]">Coverage</th>
                <th className="py-5 px-8 text-[11px] font-black text-text3 uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {filteredClients.map(cl => (
                <tr key={cl.key} className="group hover:bg-surface/50 transition-all">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${getAvatarColor(cl.key)} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                        <span className="text-white text-[14px] font-black uppercase">{cl.key.substring(0, 1)}</span>
                      </div>
                      <div>
                        <div className="text-base font-black text-text group-hover:text-accent transition-colors">{cl.key}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-text3 uppercase tracking-wider">{cl.pic || 'No PIC'}</span>
                          <span className="w-1 h-1 rounded-full bg-border-main"/>
                          <span className="text-[11px] font-medium text-text3">Strategist: {cl.as || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="px-3 py-1.5 rounded-xl bg-surface2 border border-border-main inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text3/50"/>
                      <span className="text-[12px] font-bold text-text2">{cl.ind || 'General'}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {(() => {
                      const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
                      return (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                          wc === 'gd' || wc === 'gg' ? 'bg-gg-bg border-gg-border text-gg-text' : 
                          wc === 'nn' ? 'bg-surface2 border-border-main text-text3' :
                          'bg-rr-bg border-rr-border text-rr-text'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            wc === 'gd' || wc === 'gg' ? 'bg-gg' : 
                            wc === 'nn' ? 'bg-text3' :
                            'bg-rr animate-pulse'
                          }`}/> 
                          <span className="text-[11px] font-black uppercase tracking-tight">{STATUS_LABEL_MAP[wc] || 'Stabil'}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        {cl.chs.slice(0, 3).map(ch => (
                          <div key={ch} className="w-6 h-6 rounded-lg bg-surface2 border border-border-main flex items-center justify-center text-[8px] font-black text-text3 uppercase shadow-sm" title={CH_DEF[ch]?.l}>
                            {ch.substring(0, 2)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-text3">{cl.chs.length} channels</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-2 group-hover:translate-x-0 sm:translate-x-4 transition-all opacity-0 group-hover:opacity-100">
                      <button onClick={() => router.push(`/client/${cl.key}`)} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-border-main hover:border-accent hover:bg-accent hover:text-white text-text3 shadow-sm hover:shadow-lg transition-all" title="Launch Dashboard"><ArrowUpRight className="w-5 h-5" /></button>
                      <button onClick={() => { setEditingClient({ key: cl.key, name: cl.key, chs: cl.chs, industry: cl.ind, pic_name: cl.pic, brand_category: cl.cg, account_strategist: cl.as }); setShowClientModal(true); }} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-border-main hover:border-text hover:bg-text hover:text-white text-text3 shadow-sm hover:shadow-lg transition-all" title="Edit Properties"><Edit3 className="w-5 h-5" /></button>
                      <button onClick={() => handleDeleteClient(cl.key)} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-border-main hover:border-rr hover:bg-rr hover:text-white text-text3 shadow-sm hover:shadow-lg transition-all" title="Terminate Connection"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center">
                  <div className="w-16 h-16 bg-surface2 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-border-main border-dashed">
                    <Search className="w-8 h-8 text-text3" />
                  </div>
                  <h3 className="text-lg font-bold text-text">No brands found</h3>
                  <p className="text-sm font-medium text-text3 mt-1">Try adjusting your search or filters</p>
                </td></tr>
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
