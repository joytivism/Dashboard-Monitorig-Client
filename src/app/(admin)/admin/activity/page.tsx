'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Save, 
  CalendarDays, Activity, ListFilter, Search, Tag, 
  TrendingUp, Megaphone, Calendar, Rocket, Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_MAP = {
  p: { l: 'Promo',     icon: Megaphone, cls: 'badge-gg', dot: 'bg-gg' },
  e: { l: 'Event',     icon: Calendar,  cls: 'badge-gd', dot: 'bg-gd' },
  c: { l: 'Content',   icon: TrendingUp, cls: 'badge-or', dot: 'bg-or' },
  l: { l: 'Launching', icon: Rocket,     cls: 'badge-rr', dot: 'bg-rr' },
} as const;

type ActivityType = keyof typeof TYPE_MAP;

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
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

  const [search, setSearch] = useState('');
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

  const filtered = useMemo(() => {
    return ACTIVITY.filter(a => {
      const matchesSearch = search === '' || 
        a.c.toLowerCase().includes(search.toLowerCase()) || 
        a.n.toLowerCase().includes(search.toLowerCase());
      const matchesClient = filterClient === '' || a.c === filterClient;
      const matchesType = filterType === '' || a.t === filterType;
      return matchesSearch && matchesClient && matchesType;
    });
  }, [ACTIVITY, search, filterClient, filterType]);

  const stats = useMemo(() => {
    const counts = { p: 0, e: 0, c: 0, l: 0 };
    filtered.forEach(a => {
      if (a.t in counts) counts[a.t as ActivityType]++;
    });
    return counts;
  }, [filtered]);

  const groupedData = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    filtered.forEach(a => {
      let label = a.dLabel || a.d;
      if (a.d === today) label = 'Hari Ini';
      else if (a.d === yesterday) label = 'Kemarin';
      else {
        const date = new Date(a.d);
        label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(a);
    });
    return groups;
  }, [filtered]);

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
    <>
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
        <Toast toast={toast} />

        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Activity className="w-6 h-6" />
               </div>
               <h1 className="text-2xl font-bold text-text tracking-tight uppercase tracking-widest">Activity Log</h1>
            </div>
            <p className="text-sm text-text3 max-w-md">Manajemen catatan promo, event, content, dan launching klien harian.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2.5 px-8 h-12 bg-accent text-white rounded-2xl text-sm font-black hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 min-w-[200px]"
          >
            <Plus className="w-5 h-5" /> TAMBAH ACTIVITY
          </button>
        </div>

        {/* ── Stats Overview ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(TYPE_MAP).map(([key, config]) => {
            const Icon = config.icon;
            const count = stats[key as ActivityType];
            return (
              <div key={key} className="bg-white rounded-2xl border border-border-main p-5 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text3 uppercase tracking-wider">{config.l}</span>
                  <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text4 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-text tracking-tight">{count}</div>
              </div>
            );
          })}
        </div>

        {/* ── Interactive Filters ── */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-text4 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari klien atau catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-surface2 border border-border-main rounded-xl text-xs font-medium focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-text3 shrink-0">
              <Activity className="w-4 h-4 text-accent" />
              <span>Menampilkan {filtered.length} entri</span>
            </div>
          </div>

          <div className="px-5 py-4 bg-surface2/50 border-t border-border-main flex flex-wrap gap-2">
            <button
              onClick={() => setFilterClient('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                !filterClient ? 'bg-text text-white border-text shadow-sm' : 'bg-white text-text2 border-border-main hover:bg-surface2'
              }`}
            >
              Semua Klien
            </button>
            {CLIENTS.map(cl => (
              <button
                key={cl.key}
                onClick={() => setFilterClient(cl.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  filterClient === cl.key ? 'bg-accent text-white border-accent shadow-sm' : 'bg-white text-text2 border-border-main hover:bg-surface2'
                }`}
              >
                {cl.key}
              </button>
            ))}
          </div>
        </div>

        {/* ── Activity Stream ── */}
        <div className="space-y-10 relative">
          {/* Continuous timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border-main hidden md:block" />

          {Object.keys(groupedData).length === 0 ? (
            <div className="bg-white rounded-2xl border border-border-main p-20 text-center flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-text4" />
              </div>
              <h3 className="text-sm font-bold text-text">Data tidak ditemukan</h3>
              <p className="text-xs text-text3 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            </div>
          ) : Object.entries(groupedData).map(([label, items]) => (
            <div key={label} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-border-main shadow-sm flex items-center justify-center shrink-0 z-10 hidden md:flex">
                  <CalendarDays className="w-5 h-5 text-text3" />
                </div>
                <h2 className="text-[9px] font-black text-text4 uppercase tracking-[0.15em]">{label}</h2>
                <div className="flex-1 h-px bg-border-main" />
              </div>

              <div className="grid grid-cols-1 gap-4 pl-0 md:pl-14">
                {items.map((a, i) => {
                  const config = TYPE_MAP[a.t as ActivityType] || TYPE_MAP.e;
                  const Icon = config.icon;
                  return (
                    <div key={i} className="group relative bg-white rounded-2xl border border-border-main p-5 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-200">
                            <span className="text-xs font-bold">{a.c.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-bold text-text tracking-tight">{a.c}</span>
                              <span className={`badge ${config.cls}`}>{config.l}</span>
                            </div>
                            <p className="text-sm font-medium text-text2 leading-relaxed max-w-2xl">{a.n}</p>
                            <div className="flex items-center gap-4 mt-3">
                               <div className="flex items-center gap-1.5 text-xs text-text3">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  {a.dLabel || a.d}
                               </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => openEdit(a)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-surface2 hover:text-text transition-all"
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-start justify-center pt-[14vh] px-5">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setShowModal(false)} />
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
                            ? `bg-accent text-white ring-2 ring-accent/20 border-accent/20 shadow-sm` 
                            : 'bg-surface2 text-text3 border-border-main hover:bg-surface3 hover:text-text'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${form.log_type === k ? 'bg-white' : 'bg-text4'}`} />
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
                  className="bg-text text-white rounded-xl font-bold text-sm px-6 h-12 hover:bg-accent transition-all flex items-center gap-2 shadow-sm"
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
    </>
  );
}
