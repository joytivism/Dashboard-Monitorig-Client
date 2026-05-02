'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Plus, Search, Calendar, ChevronRight, 
  Trash2, X, Filter, CheckCircle2, AlertCircle, Trash,
  Edit2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_MAP: Record<string, { l: string; color: string; dot: string }> = {
  p: { l: 'Promo',     color: 'bg-gg-bg text-gg-text border-gg-border', dot: 'bg-gg' },
  e: { l: 'Event',     color: 'bg-gd-bg text-gd-text border-gd-border', dot: 'bg-gd' },
  c: { l: 'Content',   color: 'bg-or-bg text-or-text border-or-border', dot: 'bg-or' },
  l: { l: 'Launching', color: 'bg-rr-bg text-rr-text border-rr-border', dot: 'bg-rr' },
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

export default function ActivityPage() {
  const { CLIENTS, ACTIVITY } = useDashboardData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');

  // Form State
  const [form, setForm] = useState({
    client_key: '',
    type: 'e',
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = ACTIVITY.filter(a => {
    const mSearch = !search || a.n.toLowerCase().includes(search.toLowerCase()) || a.c.toLowerCase().includes(search.toLowerCase());
    const mClient = selectedClient === 'all' || a.c === selectedClient;
    return mSearch && mClient;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_key || !form.name || !form.date) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('activity_logs').insert({
        client_key: form.client_key,
        log_type: form.type,
        note: form.name,
        log_date: form.date
      });
      if (error) throw error;
      setToast({ type: 'success', text: 'Activity berhasil ditambahkan!' });
      setShowModal(false);
      setForm({ client_key: '', type: 'e', name: '', date: new Date().toISOString().split('T')[0] });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menambahkan activity.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return;
    if (!confirm('Hapus activity ini?')) return;
    try {
      const { error } = await supabase.from('activity_logs').delete().eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', text: 'Activity berhasil dihapus.' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menghapus.' });
    }
  };

  const openNew = () => {
    setForm({ client_key: '', type: 'e', name: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
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
            <p className="text-sm text-text3 max-w-md font-medium">Manajemen catatan promo, event, content, dan launching klien harian.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2.5 px-8 h-12 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 min-w-[200px]"
          >
            <Plus className="w-5 h-5" /> TAMBAH ACTIVITY
          </button>
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl border border-border-main p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
            <input
              type="text"
              placeholder="Cari aktivitas atau klien..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
               <select
                 value={selectedClient}
                 onChange={e => setSelectedClient(e.target.value)}
                 className="w-full h-11 pl-11 pr-10 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text appearance-none focus:outline-none focus:border-accent transition-all"
               >
                 <option value="all">Semua Klien</option>
                 {CLIENTS.map(cl => <option key={cl.key} value={cl.key}>{cl.key}</option>)}
               </select>
               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Activity Feed ── */}
        <div className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-3xl bg-surface2 flex items-center justify-center mx-auto mb-6 border border-border-main shadow-inner">
                 <Calendar className="w-8 h-8 text-text4" />
              </div>
              <h3 className="text-base font-bold text-text mb-2">Tidak ada aktivitas ditemukan</h3>
              <p className="text-sm text-text3 max-w-xs mx-auto">Coba ubah filter atau tambahkan activity baru untuk melihat data di sini.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-main/30">
              {filtered.map((a, i) => {
                const type = TYPE_MAP[a.t] || TYPE_MAP.e;
                const isLast = i === filtered.length - 1;
                return (
                  <div key={a.id} className="group flex items-start gap-6 px-8 py-6 hover:bg-surface1 transition-colors relative overflow-hidden">
                    {/* Status Strip on Hover */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity ${type.dot}`} />
                    
                    {/* Timeline visualization */}
                    <div className="flex flex-col items-center shrink-0 mt-1.5">
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ring-white ${type.dot}`} />
                      {!isLast && <div className="w-0.5 flex-1 bg-border-main/50 mt-2 min-h-[40px]" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                         <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${type.color}`}>{type.l}</span>
                         <span className="text-sm font-black text-accent tracking-tight">{a.c}</span>
                         <div className="ml-auto flex items-center gap-4">
                            <span className="text-[11px] font-mono font-bold text-text4 flex items-center gap-1.5">
                               <Calendar className="w-3.5 h-3.5" /> {a.d}
                            </span>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-text4 hover:bg-rr-bg hover:text-rr-text transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                      <p className="text-sm font-medium text-text leading-relaxed">{a.n}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Form ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
          {/* Overlay - Solid dark no blur per user latest rule */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-border-main overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border-main bg-surface1/30">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                     <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-text tracking-tight uppercase tracking-wider">Tambah Activity</h3>
               </div>
               <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block mb-2 px-1">Klien</label>
                  <div className="relative">
                     <select
                       value={form.client_key}
                       onChange={e => setForm({ ...form, client_key: e.target.value })}
                       className="w-full h-11 px-4 pr-10 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text appearance-none focus:outline-none focus:border-accent transition-all"
                       required
                     >
                       <option value="">— Pilih Klien —</option>
                       {CLIENTS.map(cl => <option key={cl.key} value={cl.key}>{cl.key}</option>)}
                     </select>
                     <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block mb-2 px-1">Tipe Aktivitas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TYPE_MAP).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setForm({ ...form, type: k })}
                        className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-xs font-bold transition-all ${
                          form.type === k 
                          ? `${v.color} shadow-sm ring-2 ring-offset-2 ring-accent/10` 
                          : 'bg-surface2 border-border-main text-text3 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
                        {v.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block mb-2 px-1">Nama Aktivitas / Catatan</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Launching Promo Buy 1 Get 1"
                    className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block mb-2 px-1">Tanggal</label>
                  <div className="relative">
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
                     <input
                       type="date"
                       value={form.date}
                       onChange={e => setForm({ ...form, date: e.target.value })}
                       className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                       required
                     />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button
                   type="button"
                   onClick={() => setShowModal(false)}
                   className="flex-1 h-12 rounded-xl bg-surface2 text-text2 font-bold text-sm hover:bg-gray-200 transition-all border border-border-main"
                 >
                   Batal
                 </button>
                 <button
                   type="submit"
                   disabled={loading}
                   className="flex-[2] h-12 rounded-xl bg-text text-white font-bold text-sm hover:bg-accent transition-all shadow-lg shadow-text/10 disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                   SIMPAN AKTIVITAS
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
