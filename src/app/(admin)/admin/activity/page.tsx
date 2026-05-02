'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Plus, Search, Calendar, ChevronRight, 
  Trash2, X, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_MAP: Record<string, { l: string; class: string; dot: string }> = {
  p: { l: 'Promo',     class: 'chip chip-gg', dot: 'bg-gg' },
  e: { l: 'Event',     class: 'chip chip-gd', dot: 'bg-gd' },
  c: { l: 'Content',   class: 'chip chip-or', dot: 'bg-or' },
  l: { l: 'Launching', class: 'chip chip-rr', dot: 'bg-rr' },
};

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
      toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
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
  
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');

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

  return (
    <>
      <div className="space-y-10 animate-fade-in pb-20">
        <Toast toast={toast} />

        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-text tracking-tight leading-tight">Activity Log</h1>
                <p className="text-sm font-medium text-text3 mt-0.5">Manajemen catatan promo, event, content, dan launching klien.</p>
             </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 h-11 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent-hover transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> TAMBAH ACTIVITY
          </button>
        </div>

        {/* ── Filters Bar ── */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
            <input
              type="text"
              placeholder="Cari aktivitas atau klien..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-white text-sm font-medium text-text focus:outline-none focus:border-accent transition-all shadow-sm"
            />
          </div>
          <div className="relative w-full md:w-64">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
             <select
               value={selectedClient}
               onChange={e => setSelectedClient(e.target.value)}
               className="w-full h-11 pl-11 pr-10 rounded-xl border border-border-main bg-white text-sm font-medium text-text appearance-none focus:outline-none focus:border-accent transition-all shadow-sm"
             >
               <option value="all">Semua Klien</option>
               {CLIENTS.map(cl => <option key={cl.key} value={cl.key}>{cl.key}</option>)}
             </select>
             <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* ── Activity Feed ── */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <h3 className="text-base font-bold text-text mb-2">Tidak ada aktivitas ditemukan</h3>
              <p className="text-sm text-text3 max-w-xs mx-auto">Coba ubah filter atau tambahkan activity baru.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-main">
              {filtered.map((a, i) => {
                const type = TYPE_MAP[a.t] || TYPE_MAP.e;
                const isLast = i === filtered.length - 1;
                return (
                  <div key={a.id} className="group flex items-start gap-4 px-6 py-5 hover:bg-surface2 transition-colors">
                    <div className="flex flex-col items-center shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${type.dot}`} />
                      {!isLast && <div className="w-px flex-1 bg-border-main mt-1 min-h-[32px]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                         <span className={type.class}>{type.l}</span>
                         <span className="text-xs font-bold text-accent">{a.c}</span>
                         <span className="ml-auto text-[10px] font-bold text-text4 font-mono">{a.d}</span>
                      </div>
                      <p className="text-sm font-medium text-text leading-relaxed">{a.n}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text4 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Form ── */}
      {showModal && (
        <>
          {/* Backdrop - Hitam transparan yang mencakup seluruh layar */}
          <div 
            className="fixed inset-0 bg-black/50 z-[10001]" 
            onClick={() => setShowModal(false)} 
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 pointer-events-none">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden pointer-events-auto">
              <div className="flex items-center justify-between p-5 border-b border-border-main bg-surface2/50">
                 <h3 className="text-base font-bold text-text">Tambah Activity</h3>
                 <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text3 uppercase tracking-wider block mb-2 px-1">Klien</label>
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
                    <label className="text-xs font-semibold text-text3 uppercase tracking-wider block mb-2 px-1">Tipe Aktivitas</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(TYPE_MAP).map(([k, v]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setForm({ ...form, type: k })}
                          className={`h-11 rounded-xl border text-xs font-bold transition-all ${
                            form.type === k 
                            ? 'bg-accent text-white border-accent shadow-sm' 
                            : 'bg-surface2 border-border-main text-text3 hover:bg-gray-200'
                          }`}
                        >
                          {v.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text3 uppercase tracking-wider block mb-2 px-1">Nama Aktivitas / Catatan</label>
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
                    <label className="text-xs font-semibold text-text3 uppercase tracking-wider block mb-2 px-1">Tanggal</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                   <button
                     type="button"
                     onClick={() => setShowModal(false)}
                     className="flex-1 h-11 rounded-xl bg-surface2 text-text2 font-bold text-sm hover:bg-gray-200 transition-all"
                   >
                     Batal
                   </button>
                   <button
                     type="submit"
                     disabled={loading}
                     className="flex-1 h-11 rounded-xl bg-text text-white font-bold text-sm hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                     Simpan
                   </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
