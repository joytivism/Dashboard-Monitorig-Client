'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { 
  Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, 
  Save, Users, Search, ChevronRight, Building2, User, 
  Briefcase, Tag, LayoutGrid, List, Filter, ArrowUpRight,
  TrendingUp, Globe, ShieldCheck, RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const STAGE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  tofu: { bg: 'bg-tofu-bg text-tofu border-tofu-border',   text: 'text-tofu',   dot: 'bg-tofu'   },
  mofu: { bg: 'bg-mofu-bg text-or-text border-mofu-border', text: 'text-or-text', dot: 'bg-mofu'   },
  bofu: { bg: 'bg-surface3 text-text2 border-border-main',  text: 'text-text2',  dot: 'bg-text2'  },
};

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-bold animate-fade-in ${
      toast.type === 'success' ? 'bg-white border-gg-border text-gg-text' : 'bg-white border-rr-border text-rr-text'
    }`}>
      {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {toast.text}
    </div>
  );
}

export default function ClientsAdminPage() {
  const { CLIENTS, PERIODS, DATA } = useDashboardData();
  const router = useRouter();
  const curPeriod = PERIODS[PERIODS.length - 1];

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterInd, setFilterInd] = useState('');

  const [form, setForm] = useState({
    client_key: '', industry: '', pic_name: '',
    brand_category: '', account_strategist: '',
    chs: [] as string[], troas: {} as Record<string, string>,
  });

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  // Memoized stats
  const stats = useMemo(() => {
    const industriesSet = new Set(CLIENTS.map(c => c.ind).filter(Boolean));
    const totalChannels = CLIENTS.reduce((acc, c) => acc + (c.chs?.length || 0), 0);
    return {
      total: CLIENTS.length,
      industries: industriesSet.size,
      channels: totalChannels,
      avgChannels: (totalChannels / (CLIENTS.length || 1)).toFixed(1)
    };
  }, [CLIENTS]);

  const industries = useMemo(() => {
    return Array.from(new Set(CLIENTS.map(c => c.ind))).filter(Boolean).sort();
  }, [CLIENTS]);

  const filteredClients = useMemo(() => {
    return CLIENTS.filter(cl => {
      const matchesSearch = !search || 
        cl.key.toLowerCase().includes(search.toLowerCase()) || 
        cl.ind.toLowerCase().includes(search.toLowerCase()) ||
        cl.pic.toLowerCase().includes(search.toLowerCase());
      const matchesInd = !filterInd || cl.ind === filterInd;
      return matchesSearch && matchesInd;
    });
  }, [CLIENTS, search, filterInd]);

  const openNew = () => {
    setEditKey(null);
    setForm({ client_key: '', industry: '', pic_name: '', brand_category: '', account_strategist: '', chs: [], troas: {} });
    setShowModal(true);
  };

  const openEdit = (cl: any) => {
    setEditKey(cl.key);
    const troas: Record<string, string> = {};
    Object.entries(cl.troas || {}).forEach(([k, v]) => { troas[k] = String(v); });
    setForm({ 
      client_key: cl.key, 
      industry: cl.ind === '—' ? '' : cl.ind, 
      pic_name: cl.pic === '—' ? '' : cl.pic, 
      brand_category: cl.cg === '—' ? '' : cl.cg, 
      account_strategist: cl.as === '—' ? '' : cl.as, 
      chs: cl.chs, 
      troas 
    });
    setShowModal(true);
  };

  const toggleCh = (ch: string) => {
    setForm(f => ({ ...f, chs: f.chs.includes(ch) ? f.chs.filter(x => x !== ch) : [...f.chs, ch] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_key) return;
    setLoading(true);
    try {
      const { error: err1 } = await supabase.from('clients').upsert({
        client_key: form.client_key, industry: form.industry, pic_name: form.pic_name,
        brand_category: form.brand_category, account_strategist: form.account_strategist, name: form.client_key,
      }, { onConflict: 'client_key' });
      if (err1) throw err1;

      const { error: err2 } = await supabase.from('client_channels').delete().eq('client_key', form.client_key);
      if (err2) throw err2;

      if (form.chs.length > 0) {
        const { error: err3 } = await supabase.from('client_channels').insert(
          form.chs.map(ch => ({ client_key: form.client_key, channel_key: ch, target_roas: form.troas[ch] ? Number(form.troas[ch]) : null }))
        );
        if (err3) throw err3;
      }
      setToast({ type: 'success', text: `Klien ${form.client_key} berhasil disimpan.` });
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus klien "${key}"? Semua data terkait akan dihapus.`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('client_key', key);
      if (error) throw error;
      setToast({ type: 'success', text: `Klien ${key} dihapus.` });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const FORM_FIELDS = [
    { label: 'Client Key', key: 'client_key', ph: 'NamaKlien', disabled: !!editKey, required: true, span: true },
    { label: 'Industri', key: 'industry', ph: 'Contoh: Fashion / Kecantikan' },
    { label: 'PIC', key: 'pic_name', ph: 'Contoh: Joy' },
    { label: 'Account Strategist', key: 'account_strategist', ph: 'Contoh: Fahmi' },
    { label: 'Brand Category (CG)', key: 'brand_category', ph: 'Contoh: Dica / Bara' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-7 animate-fade-in pb-12">
      <Toast toast={toast} />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-accent" />
            Manajemen Klien
          </h1>
          <p className="text-sm text-text3 mt-1">Kelola ekosistem klien dan konfigurasi performa mereka.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface2 p-1 rounded-xl border border-border-main">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-text4 hover:text-text2'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-accent' : 'text-text4 hover:text-text2'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-6 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Klien
          </button>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Klien', value: stats.total, icon: Users, color: 'text-accent', bg: 'bg-accent-light' },
          { label: 'Industri Unik', value: stats.industries, icon: Globe, color: 'text-gd-text', bg: 'bg-gd-bg' },
          { label: 'Total Channel', value: stats.channels, icon: TrendingUp, color: 'text-gg-text', bg: 'bg-gg-bg' },
          { label: 'Avg Channel/Klien', value: stats.avgChannels, icon: ShieldCheck, color: 'text-or-text', bg: 'bg-or-bg' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border-main shadow-sm flex items-center gap-4 group hover:border-accent/30 transition-all">
            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0 shadow-sm`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-text3 uppercase tracking-wider">{s.label}</div>
              <div className="text-2xl font-bold text-text tracking-tight">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-5 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama klien, industri, atau PIC..."
            className="w-full pl-10 pr-4 h-11 bg-surface2 border border-border-main rounded-xl text-sm font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={filterInd}
              onChange={e => setFilterInd(e.target.value)}
              className="pl-10 pr-8 h-11 bg-surface2 border border-border-main rounded-xl text-xs font-bold text-text2 focus:outline-none focus:border-accent transition-all appearance-none min-w-[180px]"
            >
              <option value="">Semua Industri</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="text-xs font-bold text-text3 px-4 py-2 bg-surface2 rounded-xl border border-border-main whitespace-nowrap">
            {filteredClients.length} Klien Terfilter
          </div>
        </div>
      </div>

      {/* ── Content Grid / List ── */}
      {filteredClients.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-border-alt shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface2 flex items-center justify-center mx-auto mb-4">
             <Search className="w-8 h-8 text-text4" />
          </div>
          <p className="text-sm font-bold text-text3">
            {search || filterInd ? 'Tidak ada klien yang cocok dengan filter.' : 'Belum ada klien yang terdaftar.'}
          </p>
          {(search || filterInd) && (
            <button onClick={() => { setSearch(''); setFilterInd(''); }} className="mt-4 text-xs font-bold text-accent hover:underline">
              Reset Filter
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map(cl => {
            const hasData = DATA.some(d => d.c === cl.key && d.p === curPeriod);
            return (
              <div key={cl.key} className="group bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-lg hover:border-accent/20 transition-all flex flex-col relative overflow-hidden animate-fade-in">
                
                {/* Header Card */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-sm font-bold group-hover:bg-accent group-hover:text-white transition-all duration-300 shrink-0">
                      {cl.key.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-text truncate tracking-tight pr-2" title={cl.key}>{cl.key}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-gg' : 'bg-or'}`} />
                        <span className="text-[10px] font-bold text-text4 uppercase tracking-wider">{hasData ? 'Data OK' : 'No Data'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => openEdit(cl)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-gd-bg hover:text-gd-text transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(cl.key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-rr-bg hover:text-rr-text transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-xs text-text2">
                    <div className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center shrink-0"><Building2 className="w-3.5 h-3.5 text-text4" /></div>
                    <span className="truncate font-bold">{cl.ind || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text2">
                    <div className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-text4" /></div>
                    <span className="truncate">PIC: <span className="font-bold text-text">{cl.pic || '—'}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text2">
                    <div className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center shrink-0"><Tag className="w-3.5 h-3.5 text-text4" /></div>
                    <span className="truncate">CG: <span className="font-bold text-text">{cl.cg || '—'}</span></span>
                  </div>
                </div>

                {/* Channels Footer */}
                <div className="pt-5 border-t border-border-main">
                  <div className="text-[9px] font-bold text-text4 uppercase tracking-[0.15em] mb-3 flex items-center justify-between">
                    <span>{cl.chs.length} Channels Tracked</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cl.chs.slice(0, 3).map(ch => (
                      <span key={ch} className="text-[9px] font-bold px-2 py-1 rounded bg-surface2 text-text2 border border-border-main">{CH_DEF[ch]?.l || ch}</span>
                    ))}
                    {cl.chs.length > 3 && <span className="text-[9px] font-bold px-2 py-1 rounded bg-surface3 text-text3">+{cl.chs.length - 3}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden animate-fade-in">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface2/50 border-b border-border-main">
                <th className="px-6 py-4 text-[10px] font-bold text-text4 uppercase tracking-wider">Klien</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text4 uppercase tracking-wider">Industri</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text4 uppercase tracking-wider">PIC & AS</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text4 uppercase tracking-wider">Channels</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text4 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {filteredClients.map(cl => (
                <tr key={cl.key} className="hover:bg-surface1 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">{cl.key.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="text-sm font-bold text-text">{cl.key}</div>
                        <div className="text-[10px] font-bold text-text4 uppercase tracking-wide">CG: {cl.cg || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-text2">{cl.ind || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-text">PIC: {cl.pic || '—'}</div>
                    <div className="text-[10px] font-bold text-text3">AS: {cl.as || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {cl.chs.slice(0, 3).map(ch => (
                        <div key={ch} className="w-5 h-5 rounded bg-surface2 flex items-center justify-center" title={CH_DEF[ch]?.l || ch}>
                          <span className="text-[8px] font-black uppercase text-text4">{ch.slice(0, 1)}</span>
                        </div>
                      ))}
                      {cl.chs.length > 3 && <div className="text-[9px] font-bold text-text4">+{cl.chs.length - 3}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cl)} className="p-2 rounded-lg hover:bg-gd-bg text-text3 hover:text-gd-text transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(cl.key)} className="p-2 rounded-lg hover:bg-rr-bg text-text3 hover:text-rr-text transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-start justify-center pt-[10vh]">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-border-main overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
            <div className="flex shrink-0 items-center justify-between px-7 py-6 border-b border-border-main bg-surface1/50">
              <div>
                <h3 className="text-lg font-bold text-text tracking-tight">{editKey ? `Edit Klien: ${editKey}` : 'Tambah Klien Baru'}</h3>
                <p className="text-xs text-text3 mt-0.5">Konfigurasi metadata klien dan channel iklan.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl hover:bg-surface3 flex items-center justify-center text-text3 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-7 space-y-8">
                <div className="space-y-5">
                  <div className="text-[10px] font-bold text-text4 uppercase tracking-[0.15em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Informasi Dasar
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {FORM_FIELDS.map(f => (
                      <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                        <label className="text-[11px] font-bold text-text3 uppercase tracking-wider block mb-2">{f.label}</label>
                        <input
                          type="text"
                          value={(form as any)[f.key]}
                          disabled={f.disabled}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          required={f.required}
                          placeholder={f.ph}
                          className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all disabled:opacity-40"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="text-[10px] font-bold text-text4 uppercase tracking-[0.15em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Konfigurasi Channels
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(CH_DEF).map(([ch, def]) => {
                      const active = form.chs.includes(ch);
                      const stage = def.stage || 'bofu';
                      const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
                      return (
                        <div key={ch} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleCh(ch)}
                            className={`w-full px-4 py-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                              active ? 'bg-text text-white border-text shadow-md shadow-text/10' : 'bg-surface2 text-text2 border-border-main hover:border-border-alt'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-white' : s.dot}`} />
                            <span className="flex-1 text-xs font-bold truncate">{def.l}</span>
                          </button>
                          {active && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-accent-light rounded-xl border border-accent-mid animate-fade-in">
                              <span className="text-[10px] font-bold text-accent shrink-0 uppercase">Target ROAS</span>
                              <input
                                type="number" step="0.1"
                                value={form.troas[ch] || ''}
                                onChange={e => setForm(f => ({ ...f, troas: { ...f.troas, [ch]: e.target.value } }))}
                                placeholder="4.0"
                                className="flex-1 h-7 px-2 rounded-lg border border-accent-mid bg-white text-xs font-bold text-text focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="shrink-0 px-7 py-5 border-t border-border-main bg-surface2/50 flex items-center justify-between gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 h-11 rounded-xl border border-border-main text-sm font-bold text-text2 hover:bg-surface3 transition-all">Batal</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2.5 px-10 h-11 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all shadow-lg shadow-text/10 disabled:opacity-50"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
