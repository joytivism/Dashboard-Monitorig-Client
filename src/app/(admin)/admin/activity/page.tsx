'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_MAP = {
  p: { l: 'Promo', color: 'bg-green-50 text-green-700 border-green-200' },
  e: { l: 'Event', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  c: { l: 'Content', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  l: { l: 'Launching', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

type ActivityType = 'p' | 'e' | 'c' | 'l';

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
          client_key: form.client_key, log_date: form.log_date, log_type: form.log_type, note: form.note
        }).eq('id', editId);
        if (error) throw error;
        setToast({ type: 'success', text: 'Activity berhasil diupdate.' });
      } else {
        const { error } = await supabase.from('activity_logs').insert({
          client_key: form.client_key, log_date: form.log_date, log_type: form.log_type, note: form.note
        });
        if (error) throw error;
        setToast({ type: 'success', text: 'Activity berhasil ditambahkan.' });
      }
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
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
            <span>Admin</span><ChevronRight className="w-3.5 h-3.5" /><span className="text-text font-semibold">Activity Log</span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Kelola Activity Log</h1>
          <p className="text-sm text-text3 mt-1">Tambah, edit, atau hapus catatan promo, event, dan launching.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Activity
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-4 flex items-center gap-3">
        <span className="text-sm font-semibold text-text2 shrink-0">Filter klien:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterClient('')}
            className={`px-3 h-8 rounded-full text-xs font-bold transition-all ${!filterClient ? 'bg-text text-white' : 'bg-surface2 text-text3 hover:bg-gray-200'}`}
          >
            Semua
          </button>
          {CLIENTS.map(cl => (
            <button
              key={cl.key}
              onClick={() => setFilterClient(cl.key)}
              className={`px-3 h-8 rounded-full text-xs font-bold transition-all ${filterClient === cl.key ? 'bg-accent text-white' : 'bg-surface2 text-text3 hover:bg-gray-200'}`}
            >
              {cl.key}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-text3 shrink-0">{filtered.length} entri</span>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-text3">Tidak ada activity. Tambahkan yang pertama.</div>
          ) : filtered.map((a, i) => {
            const type = TYPE_MAP[a.t] || TYPE_MAP.e;
            return (
              <div key={i} className="group flex items-center gap-4 px-5 py-4 hover:bg-surface2 transition-all">
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ${type.color}`}>{type.l}</span>
                <span className="shrink-0 text-sm font-bold text-accent w-20">{a.c}</span>
                <span className="text-sm text-text flex-1 min-w-0">{a.n}</span>
                <span className="shrink-0 text-xs text-text3 font-mono">{a.d}</span>
                <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 text-text3 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {a.id && (
                    <button
                      onClick={() => handleDelete(a.id!)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 text-text3 transition-all"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-border-main overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-text">{editId ? 'Edit Activity' : 'Tambah Activity'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Client */}
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Klien</label>
                <select
                  value={form.client_key}
                  onChange={e => setForm(f => ({ ...f, client_key: e.target.value }))}
                  required
                  className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                >
                  <option value="">— Pilih Klien —</option>
                  {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={form.log_date}
                    onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                {/* Type */}
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Tipe</label>
                  <select
                    value={form.log_type}
                    onChange={e => setForm(f => ({ ...f, log_type: e.target.value as ActivityType }))}
                    className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                  >
                    {Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Catatan</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  required
                  rows={3}
                  placeholder="Deskripsi singkat activity ini..."
                  className="w-full px-4 py-3 rounded-xl border border-border-main bg-surface2 text-sm font-medium text-text focus:outline-none focus:border-accent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? 'Update' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
