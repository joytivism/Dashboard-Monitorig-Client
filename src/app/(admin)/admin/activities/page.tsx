'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminActivitiesPage() {
  const { CLIENTS, ACTIVITY: ACTIVITIES } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p' as 'p' | 'e' | 'c' | 'l', note: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.client_key) return;
    setLoading(true);
    try {
      const payload = { client_key: editing.client_key, log_date: editing.log_date, log_type: editing.log_type, note: editing.note };
      const { error } = editing.id ? await supabase.from('activity_logs').update(payload).eq('id', editing.id) : await supabase.from('activity_logs').insert(payload);
      if (error) throw error;
      setToast({ type: 'success', text: 'Saved!' }); setShowModal(false); router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this log?')) return;
    try { await supabase.from('activity_logs').delete().eq('id', id); setToast({ type: 'success', text: 'Deleted!' }); router.refresh(); }
    catch (err: any) { setToast({ type: 'error', text: err.message }); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const typeStyle = { 
    p: { label: 'Promo', badge: 'badge-gg' }, 
    e: { label: 'Event', badge: 'badge-or' }, 
    c: { label: 'Content', badge: 'badge-nn' }, 
    l: { label: 'Launch', badge: 'badge-rr' } 
  };

  const getAvatarColor = (key: string) => {
    const colors = ['bg-or', 'bg-text', 'bg-tofu', 'bg-gd', 'bg-rr', 'bg-text2'];
    let hash = 0; for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-main border ${toast.type === 'success' ? 'bg-gg-bg border-gg-border text-gg-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Activity Logs 📋</h1>
          <p className="text-sm font-medium text-text3 mt-1">Track promotions, events, and launches</p>
        </div>
        <button onClick={() => { setEditing({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-text text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-main hover:bg-text2 transition-all">
          <Plus className="w-4 h-4" /> Add log
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-border-main overflow-hidden shadow-main">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-main bg-surface2/50">
                <th className="text-left py-4 px-6 text-[11px] font-semibold text-text3 uppercase tracking-wide">Client</th>
                <th className="text-left py-4 px-6 text-[11px] font-semibold text-text3 uppercase tracking-wide">Type</th>
                <th className="text-left py-4 px-6 text-[11px] font-semibold text-text3 uppercase tracking-wide">Date</th>
                <th className="text-left py-4 px-6 text-[11px] font-semibold text-text3 uppercase tracking-wide">Note</th>
                <th className="text-right py-4 px-6 text-[11px] font-semibold text-text3 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITIES.map((a, i) => {
                const style = typeStyle[a.t];
                return (
                  <tr key={i} className="border-b border-border-main hover:bg-surface2 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl ${getAvatarColor(a.c)} flex items-center justify-center shadow-sm shrink-0`}>
                          <span className="text-white text-[11px] font-black uppercase">{a.c.substring(0, 2)}</span>
                        </div>
                        <span className="text-[14px] font-bold text-text">{a.c}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${style.badge}`}>{style.label}</span>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-text2">{a.d}</td>
                    <td className="py-4 px-6 text-[13px] font-medium text-text max-w-[300px] truncate">{a.n}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditing({ id: a.id || '', client_key: a.c, log_date: a.d, log_type: a.t, note: a.n }); setShowModal(true); }} className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface border border-border-main hover:border-text text-text3 hover:text-text transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(a.id || '')} className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface border border-border-main hover:border-rr hover:bg-rr-bg text-text3 hover:text-rr transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {ACTIVITIES.length === 0 && <div className="py-16 text-center text-[13px] font-bold text-text3">No activity logs found</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-text/20 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-lg overflow-hidden border border-border-main">
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-surface2">
              <h3 className="text-lg font-bold text-text">Log Activity</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface text-text3"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-2">Client</label>
                  <select value={editing.client_key} onChange={e => setEditing({...editing, client_key: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" required>
                    <option value="">Choose</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-2">Date</label>
                  <input type="date" value={editing.log_date} onChange={e => setEditing({...editing, log_date: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-3">Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['p', 'e', 'c', 'l'] as const).map(type => (
                    <button key={type} type="button" onClick={() => setEditing({...editing, log_type: type})} className={`py-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${editing.log_type === type ? 'bg-text text-white shadow-sm' : 'bg-surface2 text-text3 border border-border-main hover:border-border-alt'}`}>
                      {type === 'p' ? 'Promo' : type === 'e' ? 'Event' : type === 'c' ? 'Content' : 'Launch'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text3 uppercase tracking-wide block mb-2">Note</label>
                <textarea value={editing.note} onChange={e => setEditing({...editing, note: e.target.value})} className="w-full p-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text h-28 outline-none focus:bg-surface focus:border-text transition-all" placeholder="Describe the activity..." required />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full h-14 bg-text text-white rounded-xl font-bold text-[14px] shadow-main hover:bg-text2 transition-all flex items-center justify-center gap-2">
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
