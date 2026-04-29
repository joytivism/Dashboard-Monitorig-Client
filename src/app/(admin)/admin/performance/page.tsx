'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle, CheckCircle2, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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
        initial[ch] = { spend: d?.sp || '', revenue: d?.rev || '', orders: d?.ord || '', visitors: d?.vis || '' };
      });
      setBulkData(initial);
    }
  }, [pClient, pPeriod, DATA, CLIENTS]);

  const handleSaveBulk = async () => {
    if (!pClient || !pPeriod) return;
    setLoading(true);
    try {
      const payloads = Object.entries(bulkData).map(([ch, metrics]) => ({ client_key: pClient, period_key: pPeriod, channel_key: ch, ...metrics }));
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
          <h1 className="text-[28px] font-extrabold text-text tracking-tight">Performance Entry 📊</h1>
          <p className="text-[14px] font-medium text-text3 mt-1">Bulk input channel metrics for a specific period</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={pClient} onChange={e => setPClient(e.target.value)} className="h-11 px-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text appearance-none cursor-pointer">
            <option value="">Select Client</option>
            {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
          </select>
          <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="h-11 px-4 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text appearance-none cursor-pointer">
            {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
          </select>
        </div>
      </div>

      {/* Period Picker */}
      <div className="bg-surface rounded-2xl border border-border-main p-5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPPeriod(p)} className={`px-5 py-2.5 rounded-full text-[12px] font-bold transition-all shrink-0 ${pPeriod === p ? 'bg-text text-white shadow-sm' : 'text-text3 bg-surface2 hover:text-text hover:bg-border-main/30 border border-border-main/50'}`}>
              {PL[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {pClient ? (
        <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-main bg-surface2/50">
                  <th className="text-left py-4 px-6 text-[11px] font-extrabold text-text3 uppercase tracking-widest">Channel</th>
                  <th className="text-left py-4 px-6 text-[11px] font-extrabold text-text3 uppercase tracking-widest">Spend</th>
                  <th className="text-left py-4 px-6 text-[11px] font-extrabold text-text3 uppercase tracking-widest">Revenue</th>
                  <th className="text-left py-4 px-6 text-[11px] font-extrabold text-text3 uppercase tracking-widest">Orders</th>
                  <th className="text-left py-4 px-6 text-[11px] font-extrabold text-text3 uppercase tracking-widest">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {CLIENTS.find(c => c.key === pClient)?.chs.map(ch => (
                  <tr key={ch} className="border-b border-border-main hover:bg-surface2 transition-colors">
                    <td className="py-4 px-6"><span className="chip chip-nn text-text2 px-3 py-1.5 uppercase bg-surface border border-border-main">{ch}</span></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.spend} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], spend: e.target.value}})} className="w-28 h-11 px-3 rounded-lg border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.revenue} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], revenue: e.target.value}})} className="w-32 h-11 px-3 rounded-lg border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.orders} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], orders: e.target.value}})} className="w-24 h-11 px-3 rounded-lg border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.visitors} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], visitors: e.target.value}})} className="w-24 h-11 px-3 rounded-lg border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 flex justify-end border-t border-border-main bg-surface2/30">
            <button onClick={handleSaveBulk} disabled={loading} className="flex items-center gap-2 bg-text text-white px-8 py-3.5 rounded-xl font-extrabold text-[13px] shadow-main hover:bg-text2 transition-all">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save all changes
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border-main py-24 text-center shadow-sm">
          <div className="w-16 h-16 bg-surface2 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-border-main">
            <TrendingUp className="w-7 h-7 text-text3" />
          </div>
          <p className="text-[15px] font-bold text-text">Select a client to start entering data</p>
          <p className="text-[13px] font-medium text-text3 mt-1">Metrics will be saved automatically for the selected period</p>
        </div>
      )}
    </div>
  );
}
