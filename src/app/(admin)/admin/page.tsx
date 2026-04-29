'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { 
  AlertCircle, CheckCircle2, Users, Database, Zap, BarChart3,
  Edit3, Trash2, X, Download, Plus, Search, Calendar, ArrowUpRight
} from 'lucide-react';
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
  const completeness = useMemo(() => {
    const curP = PERIODS[PERIODS.length - 1];
    const result: Record<string, 'full' | 'partial' | 'empty'> = {};
    CLIENTS.forEach(cl => {
      const entries = DATA.filter(d => d.c === cl.key && d.p === curP);
      if (entries.length === 0) result[cl.key] = 'empty';
      else if (entries.length < cl.chs.length) result[cl.key] = 'partial';
      else result[cl.key] = 'full';
    });
    return result;
  }, [CLIENTS, DATA, PERIODS]);

  const completenessStats = useMemo(() => {
    const vals = Object.values(completeness);
    return {
      full: vals.filter(v => v === 'full').length,
      partial: vals.filter(v => v === 'partial').length,
      empty: vals.filter(v => v === 'empty').length,
    };
  }, [completeness]);

  const aiStats = useMemo(() => {
    const totalTokens = AI_LOGS?.reduce((sum, l) => sum + (l.tk || 0), 0) || 0;
    const totalCost = AI_LOGS?.reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return { totalTokens, totalCost, count: AI_LOGS?.length || 0 };
  }, [AI_LOGS]);

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

  // Avatar color generator
  const getAvatarColor = (key: string) => {
    const colors = [
      'from-blue-500 to-blue-600', 'from-violet-500 to-purple-600', 'from-emerald-500 to-green-600',
      'from-orange-400 to-red-500', 'from-pink-500 to-rose-600', 'from-cyan-500 to-teal-600',
      'from-amber-400 to-orange-500', 'from-indigo-500 to-blue-600'
    ];
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-semibold">{toast.text}</span>
        </div>
      )}

      {/* ═══ WELCOME BAR ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#111827]">Welcome back, Admin! 👋</h1>
          <p className="text-[13px] font-medium text-[#9CA3AF] mt-1">Here is the latest update on your clients</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl px-4 h-10 w-[200px]">
            <Search className="w-4 h-4 text-[#D1D5DB]" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent text-[13px] font-medium text-[#374151] placeholder:text-[#D1D5DB] outline-none flex-1" />
          </div>
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#F9FAFB] border border-[#F3F4F6] text-[#374151] px-4 h-10 rounded-xl text-[12px] font-semibold hover:bg-[#F3F4F6] transition-all">
            <Download className="w-3.5 h-3.5" /> Export data
          </button>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Brands */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center"><Users className="w-4 h-4 text-[#2563EB]" /></div>
              <span className="text-[13px] font-semibold text-[#6B7280]">Total brands</span>
            </div>
            <button className="text-[11px] font-semibold text-[#2563EB] hover:underline">View more</button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-extrabold text-[#111827] leading-none tracking-tight">{CLIENTS.length}</span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-[11px] font-medium text-[#9CA3AF]">
            {CLIENTS.slice(0, 3).map(c => (
              <span key={c.key} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${getAvatarColor(c.key)}`} />
                {c.key}
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: Data Completeness */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center"><BarChart3 className="w-4 h-4 text-[#10B981]" /></div>
              <span className="text-[13px] font-semibold text-[#6B7280]">Completeness</span>
            </div>
            <button className="text-[11px] font-semibold text-[#2563EB] hover:underline">View more</button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-extrabold text-[#111827] leading-none tracking-tight">
              {CLIENTS.length > 0 ? Math.round((completenessStats.full / CLIENTS.length) * 100) : 0}%
            </span>
            {completenessStats.full > 0 && <span className="text-[12px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">+{completenessStats.full}</span>}
          </div>
          {/* Mini bar */}
          <div className="flex gap-1 mt-4 h-2 rounded-full overflow-hidden bg-[#F3F4F6]">
            <div className="bg-[#10B981] rounded-full" style={{ width: `${CLIENTS.length > 0 ? (completenessStats.full / CLIENTS.length) * 100 : 0}%` }} />
            <div className="bg-[#F59E0B] rounded-full" style={{ width: `${CLIENTS.length > 0 ? (completenessStats.partial / CLIENTS.length) * 100 : 0}%` }} />
            <div className="bg-[#EF4444] rounded-full" style={{ width: `${CLIENTS.length > 0 ? (completenessStats.empty / CLIENTS.length) * 100 : 0}%` }} />
          </div>
          <div className="flex gap-4 mt-3 text-[10px] font-semibold text-[#9CA3AF]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]" /> Complete</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Partial</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Empty</span>
          </div>
        </div>

        {/* Card 3: Data Points */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center"><Database className="w-4 h-4 text-[#F59E0B]" /></div>
              <span className="text-[13px] font-semibold text-[#6B7280]">Total records</span>
            </div>
            <button className="text-[11px] font-semibold text-[#2563EB] hover:underline">View more</button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-extrabold text-[#111827] leading-none tracking-tight">{DATA.length}</span>
          </div>
          <div className="text-[11px] font-medium text-[#9CA3AF] mt-4">{PERIODS.length} periods tracked</div>
        </div>

        {/* Card 4: AI Usage */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] flex items-center justify-center"><Zap className="w-4 h-4 text-[#7C3AED]" /></div>
              <span className="text-[13px] font-semibold text-[#6B7280]">AI usage</span>
            </div>
            <button onClick={() => router.push('/admin/settings')} className="text-[11px] font-semibold text-[#2563EB] hover:underline">View more</button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-extrabold text-[#111827] leading-none tracking-tight">{(aiStats.totalTokens / 1000).toFixed(1)}</span>
            <span className="text-[18px] font-bold text-[#D1D5DB]">K tokens</span>
          </div>
          <div className="text-[11px] font-medium text-[#9CA3AF] mt-4">Est. cost: <span className="font-bold text-[#7C3AED]">${aiStats.totalCost.toFixed(4)}</span></div>
        </div>
      </div>

      {/* ═══ CLIENT TABLE ═══ */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9FAFB]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center"><Users className="w-4 h-4 text-[#6B7280]" /></div>
            <h2 className="text-[16px] font-bold text-[#111827]">Client directory</h2>
          </div>
          <button onClick={() => { setEditingClient({key: '', name: '', chs: [], industry: '', pic_name: '', brand_category: '', account_strategist: ''}); setShowClientModal(true); }} className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-[12px] font-semibold shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all">
            <Plus className="w-3.5 h-3.5" /> Add client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F9FAFB]">
                <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Industry</th>
                <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Channels</th>
                <th className="text-right py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(cl => (
                <tr key={cl.key} className="border-b border-[#FAFAFA] hover:bg-[#FAFBFC] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(cl.key)} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-[11px] font-black uppercase">{cl.key.substring(0, 2)}</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#111827]">{cl.key}</div>
                        <div className="text-[11px] font-medium text-[#9CA3AF]">{cl.pic}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#6B7280]">{cl.ind}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${completeness[cl.key] === 'full' ? 'bg-[#10B981]' : completeness[cl.key] === 'partial' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
                      <span className={`text-[12px] font-semibold ${completeness[cl.key] === 'full' ? 'text-[#10B981]' : completeness[cl.key] === 'partial' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {completeness[cl.key] === 'full' ? 'Complete' : completeness[cl.key] === 'partial' ? 'Partial' : 'Empty'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[12px] font-medium text-[#9CA3AF]">{cl.chs.length} channels</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingClient({ key: cl.key, name: cl.key, chs: cl.chs, industry: cl.ind, pic_name: cl.pic, brand_category: cl.cg, account_strategist: cl.as }); setShowClientModal(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#2563EB] transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteClient(cl.key)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FEF2F2] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {showClientModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 w-full max-w-2xl overflow-hidden border border-[#F3F4F6]">
            <div className="p-6 border-b border-[#F3F4F6] flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#111827]">Client Configuration</h3>
              <button onClick={() => setShowClientModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] text-[#9CA3AF]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveClient} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Client Key', value: editingClient.key, key: 'key', ph: 'brand_key', disabled: !!editingClient.key && CLIENTS.some(c => c.key === editingClient.key) },
                  { label: 'Industry', value: editingClient.industry, key: 'industry', ph: 'Fashion / Retail' },
                  { label: 'PIC Name', value: editingClient.pic_name, key: 'pic_name', ph: 'Nama PIC' },
                  { label: 'Strategist', value: editingClient.account_strategist, key: 'account_strategist', ph: 'Nama Strategist' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input type="text" value={f.value} disabled={f.disabled} onChange={e => setEditingClient({...editingClient, [f.key]: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all disabled:opacity-50" placeholder={f.ph} required={f.key === 'key'} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-2">Channels</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(CH_DEF).map(ch => {
                    const active = editingClient.chs.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => {
                        const next = active ? editingClient.chs.filter(x => x !== ch) : [...editingClient.chs, ch];
                        setEditingClient({...editingClient, chs: next});
                      }} className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${active ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#F3F4F6] bg-[#F9FAFB] text-[#9CA3AF]'}`}>
                        <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`} />
                        {CH_DEF[ch]?.l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-12 bg-[#2563EB] text-white rounded-xl font-semibold text-[13px] shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2">
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
