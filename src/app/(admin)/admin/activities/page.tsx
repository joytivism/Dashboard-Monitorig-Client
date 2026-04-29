'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminActivitiesPage() {
  const { CLIENTS, ACTIVITY: ACTIVITIES } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const [editingActivity, setEditingActivity] = useState({
    id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p' as 'p' | 'e' | 'c' | 'l', note: ''
  });

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity.client_key) return;
    setLoading(true);
    try {
      const payload = {
        client_key: editingActivity.client_key,
        log_date: editingActivity.log_date,
        log_type: editingActivity.log_type,
        note: editingActivity.note
      };
      const { error } = editingActivity.id 
        ? await supabase.from('activity_logs').update(payload).eq('id', editingActivity.id)
        : await supabase.from('activity_logs').insert(payload);
      if (error) throw error;
      setToast({ type: 'success', text: 'Activity log saved!' });
      setShowActivityModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Delete this activity log?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('activity_logs').delete().eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', text: 'Log deleted!' });
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const typeMap = { p: { label: 'Promo', color: 'bg-emerald-50 text-emerald-700' }, e: { label: 'Event', color: 'bg-blue-50 text-blue-700' }, c: { label: 'Content', color: 'bg-amber-50 text-amber-700' }, l: { label: 'Launch', color: 'bg-rose-50 text-rose-600' } };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[28px] p-8 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[18px] font-extrabold text-gray-900">Activity Logs</h2>
            <p className="text-[12px] font-semibold text-gray-300 mt-0.5">Timeline of promotions, events, and launches</p>
          </div>
          <button onClick={() => { setEditingActivity({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' }); setShowActivityModal(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[12px] font-bold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Log
          </button>
        </div>

        <div className="space-y-3">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50">
                  <span className="text-[10px] font-black uppercase text-blue-500">{a.c.substring(0, 2)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-extrabold text-gray-900 uppercase">{a.c}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${typeMap[a.t]?.color}`}>{typeMap[a.t]?.label}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-gray-400 mt-1">{a.n}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono font-bold text-gray-300">{a.d}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingActivity({ id: a.id || '', client_key: a.c, log_date: a.d, log_type: a.t, note: a.n }); setShowActivityModal(true); }} className="p-2 hover:bg-blue-50 text-gray-300 hover:text-blue-500 rounded-xl transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteActivity(a.id || '')} className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {ACTIVITIES.length === 0 && (
            <div className="text-center py-20 text-[13px] font-bold text-gray-300">No activity logs found</div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] shadow-2xl shadow-black/10 w-full max-w-lg overflow-hidden border border-black/[0.04]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-extrabold text-gray-900">Log Activity</h3>
                <p className="text-[11px] font-semibold text-gray-300 mt-0.5">Record a marketing event</p>
              </div>
              <button onClick={() => setShowActivityModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveActivity} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Client</label>
                  <select value={editingActivity.client_key} onChange={e => setEditingActivity({...editingActivity, client_key: e.target.value})} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none" required>
                    <option value="">Choose</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Date</label>
                  <input type="date" value={editingActivity.log_date} onChange={e => setEditingActivity({...editingActivity, log_date: e.target.value})} className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none" required />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['p', 'e', 'c', 'l'] as const).map(type => (
                    <button key={type} type="button" onClick={() => setEditingActivity({...editingActivity, log_type: type})} className={`py-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${editingActivity.log_type === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                      {type === 'p' ? 'Promo' : type === 'e' ? 'Event' : type === 'c' ? 'Content' : 'Launch'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 ml-1 tracking-wider">Note</label>
                <textarea value={editingActivity.note} onChange={e => setEditingActivity({...editingActivity, note: e.target.value})} className="w-full p-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-medium text-gray-700 h-32 outline-none focus:bg-white focus:border-emerald-300 transition-all" placeholder="Describe the activity..." required />
              </div>
              
              <button type="submit" disabled={loading} className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold text-[13px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
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
