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
        <div className={`fixed top-20 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-[13px] font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#111827]">Performance Entry 📊</h1>
          <p className="text-[13px] font-medium text-[#9CA3AF] mt-1">Bulk input channel metrics for a specific period</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={pClient} onChange={e => setPClient(e.target.value)} className="h-10 px-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] appearance-none cursor-pointer">
            <option value="">Select Client</option>
            {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
          </select>
          <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="h-10 px-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] appearance-none cursor-pointer">
            {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
          </select>
        </div>
      </div>

      {/* Period Picker */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPPeriod(p)} className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all shrink-0 ${pPeriod === p ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#9CA3AF] hover:bg-[#F3F4F6]'}`}>
              {PL[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {pClient ? (
        <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F9FAFB]">
                  <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Channel</th>
                  <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Spend</th>
                  <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Revenue</th>
                  <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Orders</th>
                  <th className="text-left py-3.5 px-6 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {CLIENTS.find(c => c.key === pClient)?.chs.map(ch => (
                  <tr key={ch} className="border-b border-[#FAFAFA] hover:bg-[#FAFBFC] transition-colors">
                    <td className="py-4 px-6"><span className="text-[12px] font-bold uppercase text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-lg">{ch}</span></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.spend} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], spend: e.target.value}})} className="w-28 h-10 px-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] text-[12px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.revenue} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], revenue: e.target.value}})} className="w-32 h-10 px-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] text-[12px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.orders} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], orders: e.target.value}})} className="w-24 h-10 px-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] text-[12px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all" /></td>
                    <td className="py-4 px-6"><input type="number" value={bulkData[ch]?.visitors} onChange={e => setBulkData({...bulkData, [ch]: {...bulkData[ch], visitors: e.target.value}})} className="w-24 h-10 px-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] text-[12px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 flex justify-end border-t border-[#F9FAFB]">
            <button onClick={handleSaveBulk} disabled={loading} className="flex items-center gap-2 bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold text-[13px] shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save all changes
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F3F4F6] py-24 text-center">
          <div className="w-14 h-14 bg-[#F9FAFB] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#F3F4F6]">
            <TrendingUp className="w-6 h-6 text-[#D1D5DB]" />
          </div>
          <p className="text-[14px] font-semibold text-[#9CA3AF]">Select a client to start entering data</p>
        </div>
      )}
    </div>
  );
}
