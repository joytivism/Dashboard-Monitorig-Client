'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { ChevronRight, Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Save, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientsAdminPage() {
  const { CLIENTS, PERIODS, DATA } = useDashboardData();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_key: '',
    industry: '',
    pic_name: '',
    brand_category: '',
    account_strategist: '',
    chs: [] as string[],
    troas: {} as Record<string, string>,
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
    setForm(f => {
      const next = f.chs.includes(ch) ? f.chs.filter(x => x !== ch) : [...f.chs, ch];
      return { ...f, chs: next };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_key) return;
    setLoading(true);
    try {
      await supabase.from('clients').upsert({
        client_key: form.client_key, industry: form.industry, pic_name: form.pic_name,
        brand_category: form.brand_category, account_strategist: form.account_strategist,
        name: form.client_key
      });

      // Update channels
      await supabase.from('client_channels').delete().eq('client_key', form.client_key);
      if (form.chs.length > 0) {
        await supabase.from('client_channels').insert(
          form.chs.map(ch => ({
            client_key: form.client_key,
            channel_key: ch,
            target_roas: form.troas[ch] ? Number(form.troas[ch]) : null
          }))
        );
      }

      setToast({ type: 'success', text: `Klien ${form.client_key} berhasil disimpan.` });
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus klien "${key}"? Semua data terkait akan dihapus.`)) return;
    setLoading(true);
    try {
      await supabase.from('clients').delete().eq('client_key', key);
      setToast({ type: 'success', text: `Klien ${key} dihapus.` });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold ${
          toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text3 mb-2">
            <span>Admin</span><ChevronRight className="w-3.5 h-3.5" /><span className="text-text font-semibold">Manajemen Klien</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Manajemen Klien</h1>
          <p className="text-sm text-text3 mt-1">Tambah atau ubah konfigurasi klien dan channel yang ditrack.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shrink-0">
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center">
            <Users className="w-4 h-4 text-text2" />
          </div>
          <h2 className="text-base font-semibold text-text">{CLIENTS.length} Klien Aktif</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {CLIENTS.map(cl => {
            const curPeriod = PERIODS[PERIODS.length - 1];
            const dataCount = DATA.filter(d => d.c === cl.key && d.p === curPeriod).length;
            return (
              <div key={cl.key} className="group flex items-center gap-4 px-5 py-4 hover:bg-surface2 transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-sm font-black shrink-0">
                  {cl.key.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-text">{cl.key}</div>
                  <div className="text-xs text-text3 mt-0.5">
                    {cl.ind} · {cl.chs.length} channel · PIC: {cl.pic}
                    {dataCount > 0 && <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">Data {curPeriod} ✓</span>}
                    {dataCount === 0 && <span className="ml-2 px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">Belum ada data {curPeriod}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {cl.chs.slice(0, 3).map(ch => (
                    <span key={ch} className="px-2 py-0.5 bg-surface2 rounded text-[10px] font-medium text-text3">
                      {CH_DEF[ch]?.l || ch}
                    </span>
                  ))}
                  {cl.chs.length > 3 && <span className="text-[10px] text-text3">+{cl.chs.length - 3}</span>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openEdit(cl)} className="w-8 h-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-text3 flex items-center justify-center transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cl.key)} className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 text-text3 flex items-center justify-center transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-border-main overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-text">{editKey ? `Edit: ${editKey}` : 'Tambah Klien Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Client Key', key: 'client_key', ph: 'NamaKlien', disabled: !!editKey, required: true },
                  { label: 'Industri', key: 'industry', ph: 'Fashion / Kecantikan' },
                  { label: 'PIC', key: 'pic_name', ph: 'Nama PIC' },
                  { label: 'Account Strategist', key: 'account_strategist', ph: 'Nama Strategist' },
                  { label: 'Brand Category (CG)', key: 'brand_category', ph: 'Dica / Bara' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'client_key' ? 'col-span-2' : ''}>
                    <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      value={(form as any)[f.key]}
                      disabled={f.disabled}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      required={f.required}
                      placeholder={f.ph}
                      className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>

              {/* Channels */}
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-3">Channel yang Ditrack</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CH_DEF).map(([ch, def]) => {
                    const active = form.chs.includes(ch);
                    return (
                      <div key={ch}>
                        <button
                          type="button"
                          onClick={() => toggleCh(ch)}
                          className={`w-full px-3 py-2 rounded-xl border text-left text-sm font-semibold transition-all flex items-center gap-2 ${
                            active ? 'bg-text text-white border-text' : 'bg-surface2 text-text2 border-border-main hover:border-border-alt'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-border-alt'}`} />
                          <span className="flex-1">{def.l}</span>
                          <span className={`text-[9px] font-bold uppercase ${active ? 'text-white/60' : 'text-text3'}`}>{def.stage}</span>
                        </button>
                        {active && (
                          <div className="mt-1 flex items-center gap-2 px-1">
                            <span className="text-[10px] text-text3 shrink-0">Target ROAS:</span>
                            <input
                              type="number"
                              step="0.1"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Klien
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
