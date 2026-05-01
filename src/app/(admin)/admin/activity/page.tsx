'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Save, CalendarDays, Activity, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_MAP = {
  p: { l: 'Promo',     cls: 'bg-gg-bg text-gg-text border-gg-border',   dot: 'bg-gg'   },
  e: { l: 'Event',     cls: 'bg-gd-bg text-gd-text border-gd-border',   dot: 'bg-gd'   },
  c: { l: 'Content',   cls: 'bg-or-bg text-or-text border-or-border',   dot: 'bg-or'   },
  l: { l: 'Launching', cls: 'bg-rr-bg text-rr-text border-rr-border',   dot: 'bg-rr'   },
} as const;

type ActivityType = keyof typeof TYPE_MAP;

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

export default function ActivityPage() {
  const { CLIENTS, ACTIVITY } = useDashboardData();
  const router = useRouter();

  const [filterClient, setFilterClient] = useState('');
  const [filterType, setFilterType] = useState<ActivityType | ''>('');
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_key: '',
    log_date: new Date().toISOString().split('T')[0],
    log_type: 'p' as ActivityType,
    note: '',
  });

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const filtered = ACTIVITY.filter(a => {
    if (filterClient && a.c !== filterClient) return false;
    if (filterType && a.t !== filterType) return false;
    return true;
  });

  const openNew = () => {
    setEditId(null);
    setForm({ client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' });
    setShowModal(true);
  };

  const openEdit = (a: any) => {
    setEditId(a.id || null);
    setForm({ client_key: a.c, log_date: a.d, log_type: a.t, note: a.n });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_key || !form.note) return;
    setLoading(true);
    try {
      if (editId) {
        const { error } = await supabase.from('activity_logs').update({
          client_key: form.client_key, log_date: form.log_date, log_type: form.log_type, note: form.note,
        }).eq('id', editId);
        if (error) throw error;
        setToast({ type: 'success', text: 'Activity berhasil diupdate.' });
      } else {
        const { error } = await supabase.from('activity_logs').insert({
          client_key: form.client_key, log_date: form.log_date, log_type: form.log_type, note: form.note,
        });
        if (error) throw error;
        setToast({ type: 'success', text: 'Activity berhasil ditambahkan.' });
      }
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus activity ini?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('activity_logs').delete().eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', text: 'Activity dihapus.' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast toast={toast} />

      {/* ── Top Actions ── */}
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 px-5 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Activity
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col gap-3">
          {/* Client Filter */}
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-black text-text4 uppercase tracking-[0.1em] shrink-0 w-12">Klien</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterClient('')}
                className={`px-4 h-8 rounded-full text-xs font-bold transition-all shrink-0 ${
                  !filterClient ? 'bg-text text-white shadow-sm' : 'bg-surface2 text-text3 hover:bg-surface3'
                }`}
              >
                Semua
              </button>
              {CLIENTS.map(cl => (
                <button
                  key={cl.key}
                  onClick={() => setFilterClient(cl.key)}
                  className={`px-4 h-8 rounded-full text-xs font-bold transition-all shrink-0 ${
                    filterClient === cl.key ? 'bg-accent text-white shadow-sm' : 'bg-surface2 text-text3 hover:bg-surface3'
                  }`}
                >
                  {cl.key}
                </button>
              ))}
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-black text-text4 uppercase tracking-[0.1em] shrink-0 w-12">Tipe</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('')}
                className={`px-4 h-8 rounded-full text-xs font-bold transition-all shrink-0 ${
                  !filterType ? 'bg-text text-white shadow-sm' : 'bg-surface2 text-text3 hover:bg-surface3'
                }`}
              >
                Semua
              </button>
              {Object.entries(TYPE_MAP).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterType(k as ActivityType)}
                  className={`px-3 h-8 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    filterType === k ? v.cls + ' shadow-sm' : 'bg-surface2 text-text3 border-transparent hover:bg-surface3'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${filterType === k ? v.dot : 'bg-text4'}`} />
                  {v.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex md:flex-col items-center justify-between md:items-end md:justify-center gap-1 border-t md:border-t-0 md:border-l border-border-main pt-3 md:pt-0 md:pl-4">
          <div className="text-[10px] font-bold text-text4 uppercase tracking-wider">Total Hasil</div>
          <div className="flex items-center gap-1.5 text-text">
            <ListFilter className="w-4 h-4 text-accent" />
            <span className="text-xl font-black">{filtered.length}</span>
          </div>
        </div>
      </div>

      {/* ── Table Activity List ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Activity className="w-12 h-12 text-border-main mb-4" />
            <div className="text-base font-bold text-text mb-1">Tidak ada activity ditemukan</div>
            <p className="text-sm text-text3 mb-4">Ubah filter atau tambahkan activity baru.</p>
            <button onClick={openNew} className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Tambahkan sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border-main bg-surface2/50">
                  <th className="py-3 text-[10px] font-black text-text4 uppercase tracking-wider pl-6 w-[250px]">Klien & Tipe</th>
                  <th className="py-3 text-[10px] font-black text-text4 uppercase tracking-wider px-4">Deskripsi / Catatan</th>
                  <th className="py-3 text-[10px] font-black text-text4 uppercase tracking-wider px-4 w-[160px]">Tanggal</th>
                  <th className="py-3 text-[10px] font-black text-text4 uppercase tracking-wider pr-6 w-[120px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface2">
                {filtered.map((a, i) => {
                  const type = TYPE_MAP[a.t as ActivityType] || TYPE_MAP.e;
                  return (
                    <tr key={i} className="hover:bg-surface2/70 transition-all duration-150 group animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent/10 flex shrink-0 items-center justify-center text-accent text-xs font-black group-hover:bg-accent group-hover:text-white transition-all duration-200">
                            {a.c.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text mb-0.5">{a.c}</div>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${type.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} />
                              {type.l}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <p className="text-sm font-medium text-text mt-1.5">{a.n}</p>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-1.5 text-xs text-text3 mt-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {a.dLabel || a.d}
                        </div>
                      </td>
                      <td className="py-3.5 pr-6 align-top text-right">
                        <div className="flex items-center justify-end gap-1 mt-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(a)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-surface2 transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {a.id && (
                            <button
                              onClick={() => handleDelete(a.id!)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-red-50 hover:text-red-600 transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh] px-5">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden animate-fade-in flex flex-col max-h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-main">
              <div>
                <h3 className="text-base font-bold text-text">{editId ? 'Edit Activity' : 'Tambah Activity Baru'}</h3>
                <p className="text-xs text-text3 mt-0.5">Catat promo, event, content, atau launching klien.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Client Selection */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Pilih Klien</label>
                  <select
                    value={form.client_key}
                    onChange={e => setForm(f => ({ ...f, client_key: e.target.value }))}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all cursor-pointer"
                  >
                    <option value="" disabled>— Klik untuk memilih klien —</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tanggal Pelaksanaan</label>
                    <div className="relative">
                      <CalendarDays className="w-4 h-4 text-text4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={form.log_date}
                        onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))}
                        required
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Type (Segmented Control) */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tipe Activity</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(TYPE_MAP).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, log_type: k as ActivityType }))}
                        className={`h-11 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                          form.log_type === k 
                            ? v.cls + ' shadow-sm ring-2 ring-accent/20' 
                            : 'bg-surface2 text-text3 border-border-main hover:bg-surface3 hover:text-text'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${form.log_type === k ? v.dot : 'bg-text4'}`} />
                        {v.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Deskripsi / Catatan</label>
                  <textarea
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    required rows={4}
                    placeholder="Contoh: Flash sale 50% koleksi hijab instan, target 10.000 orders dalam 24 jam..."
                    className="w-full px-4 py-3 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none placeholder:text-text4"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 py-4 border-t border-border-main bg-surface2/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-text2 hover:bg-surface2 hover:text-text rounded-xl px-4 py-2.5 text-xs font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 bg-text text-white rounded-xl font-bold text-sm h-12 hover:bg-accent transition-all disabled:opacity-50"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />
                  }
                  {editId ? 'Update Activity' : 'Simpan Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
