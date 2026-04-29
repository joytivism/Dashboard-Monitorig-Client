'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Plus, Search, Edit3, Trash2, X, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminActivitiesPage() {
  const { CLIENTS, ACTIVITY: ACTIVITIES } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const [editingActivity, setEditingActivity] = useState({
    id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p' as any, note: ''
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
      setToast({ type: 'success', text: 'Activity log saved successfully!' });
      setShowActivityModal(false);
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Hapus log aktivitas ini?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('activity_logs').delete().eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', text: 'Log berhasil dihapus!' });
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  return (
    <div className="space-y-6 animate-in fade-in">
       {/* Toast */}
       {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-[12px] shadow-main border animate-in slide-in-from-right-full ${toast.type === 'success' ? 'bg-gd-bg border-gd-border text-gd-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Marketing Activity Logs
              </h2>
              <p className="text-[11px] text-text3 font-medium mt-1 uppercase tracking-widest">Historical timeline of promo, events, and launches</p>
            </div>
            <button onClick={() => { setEditingActivity({ id: '', client_key: '', log_date: new Date().toISOString().split('T')[0], log_type: 'p', note: '' }); setShowActivityModal(true); }} className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all">Add New Log</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-text3 uppercase tracking-[0.2em] border-b border-border-main/50">
                  <th className="pb-4 px-2">Date</th>
                  <th className="pb-4 px-2">Client</th>
                  <th className="pb-4 px-2">Type</th>
                  <th className="pb-4 px-2">Note</th>
                  <th className="pb-4 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/10">
                {ACTIVITIES.map((a, i) => {
                   const cls = { p: 'bg-gg-bg text-gg', e: 'bg-tofu-bg text-tofu', c: 'bg-mofu-bg text-mofu', l: 'bg-rr-bg text-rr' }[a.t];
                   const lbl = { p: 'Promo', e: 'Event', c: 'Content', l: 'Launch' }[a.t];
                   return (
                    <tr key={i} className="hover:bg-surface2 transition-colors">
                      <td className="py-4 px-2 text-xs font-mono font-bold text-text2">{a.d}</td>
                      <td className="py-4 px-2 text-xs font-black uppercase text-accent">{a.c}</td>
                      <td className="py-4 px-2"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${cls}`}>{lbl}</span></td>
                      <td className="py-4 px-2 text-xs font-medium text-text">{a.n}</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { setEditingActivity({ id: a.id || '', client_key: a.c, log_date: a.d, log_type: a.t, note: a.n }); setShowActivityModal(true); }} className="p-2 hover:bg-accent-light text-text3 hover:text-accent rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteActivity(a.id || '')} className="p-2 hover:bg-rr-bg text-text3 hover:text-rr rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: ACTIVITY */}
        {showActivityModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] shadow-main w-full max-w-lg overflow-hidden">
            <div className="p-8 border-b border-border-main bg-surface2/30 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text">Log Activity</h3>
                <p className="text-[10px] text-text3 font-bold uppercase tracking-widest mt-1">Record marketing events</p>
              </div>
              <button onClick={() => setShowActivityModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveActivity} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Select Client</label>
                  <select value={editingActivity.client_key} onChange={e => setEditingActivity({...editingActivity, client_key: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none" required>
                    <option value="">-- Choose --</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Event Date</label>
                  <input type="date" value={editingActivity.log_date} onChange={e => setEditingActivity({...editingActivity, log_date: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none" required />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Log Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['p', 'e', 'c', 'l'] as const).map(type => (
                    <button key={type} type="button" onClick={() => setEditingActivity({...editingActivity, log_type: type})} className={`py-2 rounded-lg border text-[10px] font-black uppercase transition-all ${editingActivity.log_type === type ? 'bg-accent text-white border-accent' : 'bg-surface2 text-text3 border-border-main'}`}>
                      {type === 'p' ? 'Promo' : type === 'e' ? 'Event' : type === 'c' ? 'Content' : 'Launch'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-text3 uppercase block mb-1.5 ml-1">Activity Note</label>
                <textarea value={editingActivity.note} onChange={e => setEditingActivity({...editingActivity, note: e.target.value})} className="w-full p-4 rounded-xl border border-border-main bg-surface2 text-sm font-medium h-32 focus:bg-white transition-all outline-none" placeholder="e.g. Diskon 50% Ramadhan, Event Launching Brand..." required />
              </div>
              
              <button type="submit" disabled={loading} className="w-full h-14 bg-text text-white rounded-full font-bold text-sm shadow-xl shadow-black/10 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all">
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Save Activity Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
