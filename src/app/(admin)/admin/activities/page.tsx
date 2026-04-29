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

  const typeStyle = { p: { label: 'Promo', dot: 'bg-[#10B981]', text: 'text-[#10B981]' }, e: { label: 'Event', dot: 'bg-[#2563EB]', text: 'text-[#2563EB]' }, c: { label: 'Content', dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]' }, l: { label: 'Launch', dot: 'bg-[#EF4444]', text: 'text-[#EF4444]' } };

  const getAvatarColor = (key: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-violet-500 to-purple-600', 'from-emerald-500 to-green-600', 'from-orange-400 to-red-500', 'from-pink-500 to-rose-600', 'from-cyan-500 to-teal-600'];
    let hash = 0; for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className={`fixed top-20 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#111827]">Activity Logs 📋</h1>
          <p className="text-[13px] font-medium text-[#9CA3AF] mt-1">Track promotions, events, and launches</p>
        </div>
        <button onClick={() => { setEditing({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-[12px] font-semibold shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all">
          <Plus className="w-3.5 h-3.5" /> Add log
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F9FAFB]">
              <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
              <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
              <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
              <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Note</th>
              <th className="text-right py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITIES.map((a, i) => {
              const style = typeStyle[a.t];
              return (
                <tr key={i} className="border-b border-[#FAFAFA] hover:bg-[#FAFBFC] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(a.c)} flex items-center justify-center`}>
                        <span className="text-white text-[10px] font-black uppercase">{a.c.substring(0, 2)}</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#111827]">{a.c}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-[12px] font-semibold ${style.text}`}>{style.label}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#6B7280]">{a.d}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#374151] max-w-[300px] truncate">{a.n}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing({ id: a.id || '', client_key: a.c, log_date: a.d, log_type: a.t, note: a.n }); setShowModal(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#2563EB] transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(a.id || '')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FEF2F2] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ACTIVITIES.length === 0 && <div className="py-16 text-center text-[13px] font-semibold text-[#9CA3AF]">No activity logs found</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 w-full max-w-lg overflow-hidden border border-[#F3F4F6]">
            <div className="p-6 border-b border-[#F3F4F6] flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#111827]">Log Activity</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] text-[#9CA3AF]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-1.5">Client</label>
                  <select value={editing.client_key} onChange={e => setEditing({...editing, client_key: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none" required>
                    <option value="">Choose</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-1.5">Date</label>
                  <input type="date" value={editing.log_date} onChange={e => setEditing({...editing, log_date: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-2">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['p', 'e', 'c', 'l'] as const).map(type => (
                    <button key={type} type="button" onClick={() => setEditing({...editing, log_type: type})} className={`py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${editing.log_type === type ? 'bg-[#111827] text-white' : 'bg-[#F9FAFB] text-[#9CA3AF] border border-[#F3F4F6] hover:bg-[#F3F4F6]'}`}>
                      {type === 'p' ? 'Promo' : type === 'e' ? 'Event' : type === 'c' ? 'Content' : 'Launch'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-1.5">Note</label>
                <textarea value={editing.note} onChange={e => setEditing({...editing, note: e.target.value})} className="w-full p-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-medium text-[#374151] h-28 outline-none focus:bg-white focus:border-[#2563EB] transition-all" placeholder="Describe the activity..." required />
              </div>
              <button type="submit" disabled={loading} className="w-full h-12 bg-[#2563EB] text-white rounded-xl font-semibold text-[13px] shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Save Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
