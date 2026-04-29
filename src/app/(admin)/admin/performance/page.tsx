'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Save, RefreshCw, AlertCircle, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPerformancePage() {
  const { CLIENTS, PERIODS, DATA, PL } = useDashboardData();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [pClient, setPClient] = useState('');
  const [pPeriod, setPPeriod] = useState(PERIODS[PERIODS.length - 1] || '');
  const [bulkData, setBulkData] = useState<Record<string, any>>({});

  // Sync Bulk Form
  useEffect(() => {
    if (pClient && pPeriod) {
      const initial: any = {};
      CLIENTS.find(c => c.key === pClient)?.chs.forEach(ch => {
        const d = DATA.find(x => x.c === pClient && x.ch === ch && x.p === pPeriod);
        initial[ch] = { 
          spend: d?.sp || '', revenue: d?.rev || '', orders: d?.ord || '', 
          visitors: d?.vis || '', reach: d?.reach || '', impressions: d?.impr || '', results: d?.results || '' 
        };
      });
      setBulkData(initial);
    }
  }, [pClient, pPeriod, DATA, CLIENTS]);

  const handleSaveBulk = async () => {
    if (!pClient || !pPeriod) return;
    setLoading(true);
    try {
      const payloads = Object.entries(bulkData).map(([ch, metrics]) => ({
        client_key: pClient,
        period_key: pPeriod,
        channel_key: ch,
        ...metrics
      }));

      const { error } = await supabase.from('channel_performance').upsert(payloads, { onConflict: 'client_key, channel_key, period_key' });
      if (error) throw error;
      setToast({ type: 'success', text: `Berhasil update ${payloads.length} channel!` });
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Batch Performance Entry
              </h2>
              <p className="text-[11px] text-text3 font-medium mt-1 uppercase tracking-widest">Input data multiple channels simultaneously</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={pClient} onChange={e => setPClient(e.target.value)} className="h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none focus:bg-white transition-all">
                <option value="">-- Select Client --</option>
                {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
              </select>
              <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-bold outline-none focus:bg-white transition-all">
                {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
              </select>
            </div>
          </div>

          {pClient ? (
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-text3 uppercase tracking-widest border-b border-border-main">
                      <th className="pb-4 px-2">Channel</th>
                      <th className="pb-4 px-2">Spend</th>
                      <th className="pb-4 px-2">Revenue</th>
                      <th className="pb-4 px-2">Orders</th>
                      <th className="pb-4 px-2">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENTS.find(c => c.key === pClient)?.chs.map(ch => (
                      <tr key={ch} className="border-b border-border-main/10 hover:bg-surface2/50 transition-colors">
                        <td className="py-5 px-2 font-black text-[11px] uppercase text-accent">{ch}</td>
                        <td className="py-5 px-2"><input type="number" value={bulkData[ch]?.spend} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], spend: e.target.value}})} className="w-24 h-10 px-3 rounded-lg border border-border-main bg-white text-xs font-bold outline-none focus:border-accent" /></td>
                        <td className="py-5 px-2"><input type="number" value={bulkData[ch]?.revenue} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], revenue: e.target.value}})} className="w-28 h-10 px-3 rounded-lg border border-border-main bg-white text-xs font-bold outline-none focus:border-accent" /></td>
                        <td className="py-5 px-2"><input type="number" value={bulkData[ch]?.orders} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], orders: e.target.value}})} className="w-20 h-10 px-3 rounded-lg border border-border-main bg-white text-xs font-bold outline-none focus:border-accent" /></td>
                        <td className="py-5 px-2"><input type="number" value={bulkData[ch]?.visitors} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], visitors: e.target.value}})} className="w-20 h-10 px-3 rounded-lg border border-border-main bg-white text-xs font-bold outline-none focus:border-accent" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pt-6">
                <button onClick={handleSaveBulk} disabled={loading} className="flex items-center gap-3 bg-text text-white px-10 py-4 rounded-full font-bold text-sm shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Performance
                </button>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center bg-surface2/30 rounded-[32px] border-2 border-dashed border-border-main/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <TrendingUp className="w-8 h-8 text-text3/30" />
              </div>
              <p className="text-sm font-bold text-text3 italic">Please select a client to reveal the batch input table.</p>
            </div>
          )}
        </div>
    </div>
  );
}
