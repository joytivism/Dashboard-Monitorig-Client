'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Save, ChevronRight, CalendarDays, Tag } from 'lucide-react';
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

  const filtered = filterClient ? ACTIVITY.filter(a => a.c === filterClient) : ACTIVITY;

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
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <Toast toast={toast} />

      {/* ── Top Actions ── */}
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Activity
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm px-5 py-4 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-bold text-text3 uppercase tracking-wide shrink-0">Filter klien:</span>
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setFilterClient('')}
            className={`px-3.5 h-8 rounded-full text-xs font-bold transition-all ${
              !filterClient ? 'bg-text text-white shadow-sm' : 'bg-surface2 text-text3 hover:bg-surface3'
            }`}
          >
            Semua
          </button>
          {CLIENTS.map(cl => (
            <button
              key={cl.key}
              onClick={() => setFilterClient(cl.key)}
              className={`px-3.5 h-8 rounded-full text-xs font-bold transition-all ${
                filterClient === cl.key ? 'bg-accent text-white shadow-sm' : 'bg-surface2 text-text3 hover:bg-surface3'
              }`}
            >
              {cl.key}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-text3 shrink-0 bg-surface2 px-3 py-1.5 rounded-lg">
          {filtered.length} entri
        </span>
      </div>

      {/* ── Activity List ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        {/* Legend */}
        <div className="px-6 py-3.5 border-b border-border-main flex items-center gap-4 flex-wrap">
          <span className="text-[10px] font-black text-text4 uppercase tracking-[0.12em]">Tipe:</span>
          {Object.entries(TYPE_MAP).map(([k, v]) => (
            <span key={k} className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${v.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              {v.l}
            </span>
          ))}
        </div>

        <div className="divide-y divide-surface2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-sm text-text3 mb-2">Tidak ada activity{filterClient ? ` untuk ${filterClient}` : ''}.</div>
              <button
                onClick={openNew}
                className="text-xs font-semibold text-accent hover:underline"
              >
                + Tambahkan yang pertama
              </button>
            </div>
          ) : filtered.map((a, i) => {
            const type = TYPE_MAP[a.t as ActivityType] || TYPE_MAP.e;
            return (
              <div key={i} className="group flex items-center gap-4 px-6 py-4 hover:bg-surface2/60 transition-all">
                {/* Type badge */}
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${type.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} />
                  {type.l}
                </span>

                {/* Client */}
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black shrink-0">
                  {a.c.slice(0, 2).toUpperCase()}
                </div>

                {/* Note */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-accent mb-0.5">{a.c}</div>
                  <p className="text-sm text-text leading-snug truncate">{a.n}</p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 shrink-0 text-xs text-text3 font-mono">
                  <CalendarDays className="w-3.5 h-3.5 text-text4" />
                  {a.d}
                </div>

                {/* Actions (hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-gd-bg hover:text-gd-text transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {a.id && (
                    <button
                      onClick={() => handleDelete(a.id!)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-rr-bg hover:text-rr-text transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-5 bg-black/25 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-border-main overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-main">
              <div>
                <h3 className="text-base font-bold text-text">{editId ? 'Edit Activity' : 'Tambah Activity Baru'}</h3>
                <p className="text-xs text-text3 mt-0.5">Catat promo, event, content, atau launching klien.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Client */}
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Klien</label>
                <select
                  value={form.client_key}
                  onChange={e => setForm(f => ({ ...f, client_key: e.target.value }))}
                  required
                  className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                >
                  <option value="">— Pilih Klien —</option>
                  {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tanggal</label>
                  <div className="relative">
                    <CalendarDays className="w-3.5 h-3.5 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={form.log_date}
                      onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))}
                      required
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tipe</label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={form.log_type}
                      onChange={e => setForm(f => ({ ...f, log_type: e.target.value as ActivityType }))}
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none"
                    >
                      {Object.entries(TYPE_MAP).map(([k, v]) => (
                        <option key={k} value={k}>{v.l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Type preview */}
              {form.log_type && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${TYPE_MAP[form.log_type].cls}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_MAP[form.log_type].dot}`} />
                  <span className="text-xs font-semibold">{TYPE_MAP[form.log_type].l}</span>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Catatan</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  required rows={3}
                  placeholder="Deskripsi singkat activity ini..."
                  className="w-full px-4 py-3 rounded-xl border border-border-main bg-surface2 text-sm font-medium text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 pt-1">
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
                  {editId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
