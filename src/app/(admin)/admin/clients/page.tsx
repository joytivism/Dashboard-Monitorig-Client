'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import {
  Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle,
  Save, Users, Search, ChevronRight, Building2, User, Briefcase, Tag
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
    <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
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

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    client_key: '', industry: '', pic_name: '',
    brand_category: '', account_strategist: '',
    chs: [] as string[], troas: {} as Record<string, string>,
  });

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const openNew = () => {
    setEditKey(null);
    setForm({ client_key: '', industry: '', pic_name: '', brand_category: '', account_strategist: '', chs: [], troas: {} });
    setShowModal(true);
  };

  const openEdit = (cl: any) => {
    setEditKey(cl.key);
    const troas: Record<string, string> = {};
    Object.entries(cl.troas || {}).forEach(([k, v]) => { troas[k] = String(v); });
    setForm({ client_key: cl.key, industry: cl.ind === '—' ? '' : cl.ind, pic_name: cl.pic === '—' ? '' : cl.pic, brand_category: cl.cg === '—' ? '' : cl.cg, account_strategist: cl.as === '—' ? '' : cl.as, chs: cl.chs, troas });
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

  const filteredClients = CLIENTS.filter(cl =>
    !search || cl.key.toLowerCase().includes(search.toLowerCase()) || cl.ind.toLowerCase().includes(search.toLowerCase())
  );

  const FORM_FIELDS = [
    { label: 'Client Key', key: 'client_key', ph: 'NamaKlien', disabled: !!editKey, required: true, span: true },
    { label: 'Industri', key: 'industry', ph: 'Fashion / Kecantikan' },
    { label: 'PIC', key: 'pic_name', ph: 'Nama PIC' },
    { label: 'Account Strategist', key: 'account_strategist', ph: 'Nama Strategist' },
    { label: 'Brand Category (CG)', key: 'brand_category', ph: 'Dica / Bara' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast toast={toast} />

      {/* ── Top Actions ── */}
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-sm font-bold text-text">{CLIENTS.length} Klien Aktif</div>
            <div className="text-xs text-text3">Periode: <span className="font-semibold text-text">{curPeriod}</span></div>
          </div>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <Search className="w-3.5 h-3.5 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari klien..."
            className="w-full md:w-64 pl-9 pr-4 h-10 bg-surface2 border border-border-main rounded-xl text-sm font-medium focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>
      </div>

      {/* ── Client Grid ── */}
      {filteredClients.length === 0 ? (
        <div className="py-16 text-center text-sm text-text3 bg-white rounded-2xl border border-border-main shadow-sm">
          {search ? 'Tidak ada klien yang cocok dengan pencarian.' : 'Belum ada klien yang terdaftar.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map(cl => {
            const dataCount = DATA.filter(d => d.c === cl.key && d.p === curPeriod).length;
            const hasData = dataCount > 0;
            return (
              <div key={cl.key} className="group bg-white rounded-2xl p-5 border border-border-main shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden">
                
                {/* Top: Avatar & Actions */}
                <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-lg font-black group-hover:bg-accent group-hover:text-white transition-all duration-200 shrink-0">
                      {cl.key.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-text truncate pr-2" title={cl.key}>{cl.key}</h3>
                      <span className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasData ? 'bg-gg-bg text-gg-text border border-gg-border/50' : 'bg-or-bg text-or-text border border-or-border/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-gg' : 'bg-or'}`} />
                        {hasData ? `Data ${curPeriod}` : 'No Data'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(cl)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-gd-bg hover:text-gd-text transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cl.key)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-rr-bg hover:text-rr-text transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 mb-5 flex-1">
                  <div className="flex items-center gap-2.5 text-xs text-text3">
                    <Building2 className="w-3.5 h-3.5 text-text4 shrink-0" />
                    <span className="truncate">{cl.ind && cl.ind !== '—' ? cl.ind : 'Industri belum diatur'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text3">
                    <Tag className="w-3.5 h-3.5 text-text4 shrink-0" />
                    <span className="truncate">CG: <span className="font-medium text-text2">{cl.cg && cl.cg !== '—' ? cl.cg : '-'}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text3">
                    <User className="w-3.5 h-3.5 text-text4 shrink-0" />
                    <span className="truncate">PIC: <span className="font-medium text-text2">{cl.pic && cl.pic !== '—' ? cl.pic : '-'}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text3">
                    <Briefcase className="w-3.5 h-3.5 text-text4 shrink-0" />
                    <span className="truncate">AS: <span className="font-medium text-text2">{cl.as && cl.as !== '—' ? cl.as : '-'}</span></span>
                  </div>
                </div>

                {/* Channels */}
                <div className="pt-4 border-t border-border-main">
                  <div className="text-[10px] font-black text-text4 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Channels</span>
                    <span className="bg-surface2 text-text3 px-1.5 py-0.5 rounded-md">{cl.chs.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cl.chs.slice(0, 4).map(ch => {
                      const stage = CH_DEF[ch]?.stage || 'bofu';
                      const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
                      return (
                        <span key={ch} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${s.bg} flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {CH_DEF[ch]?.l || ch}
                        </span>
                      );
                    })}
                    {cl.chs.length > 4 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface3 text-text3 border border-border-main">
                        +{cl.chs.length - 4} lagi
                      </span>
                    )}
                    {cl.chs.length === 0 && (
                      <span className="text-xs text-text4 italic">Belum ada channel</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-start justify-center pt-[10vh] pb-[10vh] px-5">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-border-main overflow-hidden animate-fade-in flex flex-col max-h-full">
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between px-6 py-5 border-b border-border-main">
              <div>
                <h3 className="text-base font-bold text-text">
                  {editKey ? `Edit Klien: ${editKey}` : 'Tambah Klien Baru'}
                </h3>
                <p className="text-xs text-text3 mt-0.5">
                  {editKey ? 'Ubah konfigurasi klien dan channel.' : 'Daftarkan klien baru ke dalam sistem.'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                {/* Basic info */}
                <div className="p-6 space-y-4 border-b border-border-main">
                  <div className="text-[10px] font-black text-text4 uppercase tracking-[0.12em]">Informasi Dasar</div>
                  <div className="grid grid-cols-2 gap-4">
                    {FORM_FIELDS.map(f => (
                      <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                        <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">{f.label}</label>
                        <input
                          type="text"
                          value={(form as any)[f.key]}
                          disabled={f.disabled}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          required={f.required}
                          placeholder={f.ph}
                          className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div className="p-6 space-y-3">
                  <div className="text-[10px] font-black text-text4 uppercase tracking-[0.12em]">Channel yang Ditrack</div>
                  <div className="grid grid-cols-2 gap-2 items-start">
                    {Object.entries(CH_DEF).map(([ch, def]) => {
                      const active = form.chs.includes(ch);
                      const stage = def.stage || 'bofu';
                      const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
                      return (
                        <div key={ch} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => toggleCh(ch)}
                            className={`w-full px-4 py-2.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center gap-2.5 ${
                              active ? 'bg-text text-white border-text shadow-sm' : 'bg-surface2 text-text2 border-border-main hover:border-border-alt'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-white/80' : s.dot}`} />
                            <span className="flex-1 truncate">{def.l}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'text-white/50' : 'text-text4'}`}>
                              {def.stage}
                            </span>
                          </button>
                          {active && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-surface2 rounded-lg">
                              <span className="text-[10px] text-text3 shrink-0">Target ROAS:</span>
                              <input
                                type="number" step="0.1"
                                value={form.troas[ch] || ''}
                                onChange={e => setForm(f => ({ ...f, troas: { ...f.troas, [ch]: e.target.value } }))}
                                placeholder="misal: 4"
                                className="flex-1 h-7 px-2 rounded-lg border border-border-main bg-white text-xs font-semibold text-text focus:outline-none focus:border-accent transition-all"
                              />
                              <span className="text-[10px] text-text3">x</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 px-6 py-4 border-t border-border-main bg-surface2/40 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 h-10 rounded-xl border border-border-main text-sm font-semibold text-text2 hover:bg-surface2 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 h-10 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all disabled:opacity-50"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />
                  }
                  Simpan Klien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
