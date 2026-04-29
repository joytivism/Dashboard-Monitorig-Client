'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Save, AlertCircle, CheckCircle2, TrendingUp
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
        client_key: pClient, period_key: pPeriod, channel_key: ch, ...metrics
      }));
      const { error } = await supabase.from('channel_performance').upsert(payloads, { onConflict: 'client_key, channel_key, period_key' });
      if (error) throw error;
      setToast({ type: 'success', text: `${payloads.length} channels updated!` });
      router.refresh();
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[28px] p-8 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[18px] font-extrabold text-gray-900">Batch Performance Entry</h2>
            <p className="text-[12px] font-semibold text-gray-300 mt-0.5">Input multiple channel metrics at once</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={pClient} onChange={e => setPClient(e.target.value)} className="h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none focus:border-emerald-300 appearance-none cursor-pointer">
              <option value="">Select Client</option>
              {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select>
            <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none focus:border-emerald-300 appearance-none cursor-pointer">
              {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
            </select>
          </div>
        </div>

        {pClient ? (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Channel</th>
                    <th className="pb-4 px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Spend</th>
                    <th className="pb-4 px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Revenue</th>
                    <th className="pb-4 px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Orders</th>
                    <th className="pb-4 px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {CLIENTS.find(c => c.key === pClient)?.chs.map(ch => (
                    <tr key={ch} className="border-b border-gray-50">
                      <td className="py-5 px-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">{ch}</span>
                      </td>
                      <td className="py-5 px-3"><input type="number" value={bulkData[ch]?.spend} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], spend: e.target.value}})} className="w-28 h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-[12px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all" /></td>
                      <td className="py-5 px-3"><input type="number" value={bulkData[ch]?.revenue} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], revenue: e.target.value}})} className="w-32 h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-[12px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all" /></td>
                      <td className="py-5 px-3"><input type="number" value={bulkData[ch]?.orders} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], orders: e.target.value}})} className="w-24 h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-[12px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all" /></td>
                      <td className="py-5 px-3"><input type="number" value={bulkData[ch]?.visitors} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], visitors: e.target.value}})} className="w-24 h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-[12px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={handleSaveBulk} disabled={loading} className="flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-[13px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 active:scale-[0.99] transition-all">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save All
              </button>
            </div>
          </div>
        ) : (
          <div className="py-28 text-center rounded-[24px] bg-gray-50/50 border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-50">
              <TrendingUp className="w-7 h-7 text-gray-200" />
            </div>
            <p className="text-[13px] font-bold text-gray-300">Select a client to start entering performance data</p>
          </div>
        )}
      </div>
    </div>
  );
}
