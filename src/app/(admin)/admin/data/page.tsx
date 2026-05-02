'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { isAware } from '@/lib/utils';
import {
  CheckCircle2, AlertCircle, ChevronRight, Save,
  RotateCcw, TrendingUp, Database, ArrowRight, Info,
  LayoutGrid, CalendarClock, Building2, Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChannelRow = {
  ch: string;
  rev: string; sp: string; ord: string; vis: string;
  reach: string; impr: string; results: string;
};

const EMPTY_ROW = (): ChannelRow => ({ ch: '', rev: '', sp: '', ord: '', vis: '', reach: '', impr: '', results: '' });

const STAGE_STYLE: Record<string, { header: string; badge: string; label: string }> = {
  tofu: { header: 'bg-gd-bg/30 border-gd-border/30', badge: 'bg-gd-bg text-gd-text border border-gd-border', label: 'text-gd-text' },
  mofu: { header: 'bg-or-bg/30 border-mofu-border/30',   badge: 'bg-or-bg text-or-text border border-mofu-border',  label: 'text-or-text' },
  bofu: { header: 'bg-gg-bg/30 border-gg-border/30',     badge: 'bg-gg-bg text-gg-text border border-gg-border',    label: 'text-gg-text'  },
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

export default function DataInputPage() {
  const { CLIENTS, PERIODS, DATA } = useDashboardData();
  const router = useRouter();

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [useNewPeriod, setUseNewPeriod] = useState(false);
  const [rows, setRows] = useState<ChannelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const client = CLIENTS.find(c => c.key === selectedClient);
  const periodToUse = useNewPeriod ? newPeriod : selectedPeriod;
  const canProceed = selectedClient && periodToUse.length === 7 && /^\d{4}-\d{2}$/.test(periodToUse);
  const isUpdateMode = DATA.some(d => d.c === selectedClient && d.p === periodToUse);

  useEffect(() => {
    if (!client) { setRows([]); return; }
    const prefilled = client.chs.map(ch => {
      const existing = DATA.find(d => d.c === selectedClient && d.ch === ch && d.p === periodToUse);
      return {
        ch,
        rev: existing?.rev ? String(existing.rev) : '',
        sp: existing?.sp ? String(existing.sp) : '',
        ord: existing?.ord ? String(existing.ord) : '',
        vis: existing?.vis ? String(existing.vis) : '',
        reach: existing?.reach ? String(existing.reach) : '',
        impr: existing?.impr ? String(existing.impr) : '',
        results: existing?.results ? String(existing.results) : '',
      };
    });
    setRows(prefilled);
  }, [client, periodToUse]);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const updateRow = (i: number, field: keyof ChannelRow, val: string) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const handleSubmit = async () => {
    if (!selectedClient || !periodToUse) return;
    setLoading(true);
    try {
      if (useNewPeriod && newPeriod) {
        await supabase.from('periods').upsert({
          period_key: newPeriod,
          label: new Date(newPeriod + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        });
      }
      const upsertData = rows.map(r => ({
        client_key: selectedClient, channel_key: r.ch, period_key: periodToUse,
        revenue: r.rev ? Number(r.rev) : null,
        spend: r.sp ? Number(r.sp) : null,
        orders: r.ord ? Number(r.ord) : null,
        visitors: r.vis ? Number(r.vis) : null,
        reach: r.reach ? Number(r.reach) : null,
        impressions: r.impr ? Number(r.impr) : null,
        results: r.results ? Number(r.results) : null,
      }));
      const { error } = await supabase
        .from('channel_performance')
        .upsert(upsertData, { onConflict: 'client_key,channel_key,period_key' });
      if (error) throw error;
      setToast({ type: 'success', text: `Data ${selectedClient} · ${periodToUse} berhasil disimpan!` });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan data.' });
    } finally { setLoading(false); }
  };

  const INPUT_CLS = 'w-full h-12 px-5 rounded-2xl border border-border-main bg-surface2 text-sm font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all';

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <Toast toast={toast} />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Database className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-bold text-text tracking-tight">Input Data Performa</h1>
          </div>
          <p className="text-sm text-text3 max-w-md">Masukkan data metrik iklan harian atau bulanan ke database utama.</p>
        </div>
      </div>

      {/* ── Step 1: Configuration ── */}
      <div className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden group hover:border-accent/10 transition-all">
        <div className="px-8 py-6 border-b border-border-main flex items-center justify-between bg-surface1/30">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center text-xs font-black shadow-lg shadow-accent/20 ring-4 ring-accent/5">1</div>
             <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Pilih Klien & Periode</h2>
                <p className="text-[10px] text-text4 font-bold uppercase tracking-wider">Langkah awal konfigurasi data</p>
             </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                 <Building2 className="w-3 h-3 text-accent" /> Pilih Klien
              </label>
              <div className="relative">
                 <select
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                    className={INPUT_CLS + ' appearance-none pr-10'}
                 >
                    <option value="">— Klik untuk memilih klien —</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                 </select>
                 <ChevronRight className="w-4 h-4 text-text4 absolute right-5 top-1/2 -translate-y-1/2 rotate-90" />
              </div>
              {client && (
                <div className="px-4 py-3 rounded-xl bg-surface2 border border-border-main/50 flex items-center gap-3 animate-fade-in">
                   <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-text2 text-[10px] font-black border border-border-main shadow-sm">
                      {client.key.slice(0, 2).toUpperCase()}
                   </div>
                   <div className="text-[11px] text-text3">
                      <span className="font-bold text-text">{client.chs.length} Channel</span> aktif · <span className="font-bold text-accent">{client.ind}</span>
                   </div>
                </div>
              )}
            </div>

            {/* Period Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                 <CalendarClock className="w-3 h-3 text-accent" /> Periode Laporan
              </label>
              <div className="space-y-3">
                <div className="relative">
                   <select
                      value={useNewPeriod ? '__new__' : selectedPeriod}
                      onChange={e => {
                        if (e.target.value === '__new__') { setUseNewPeriod(true); }
                        else { setUseNewPeriod(false); setSelectedPeriod(e.target.value); }
                      }}
                      className={INPUT_CLS + ' appearance-none pr-10'}
                   >
                      <option value="">— Pilih Bulan —</option>
                      {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                      <option value="__new__">+ Tambah Periode Baru...</option>
                   </select>
                   <ChevronRight className="w-4 h-4 text-text4 absolute right-5 top-1/2 -translate-y-1/2 rotate-90" />
                </div>
                {useNewPeriod && (
                  <input
                    type="month"
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    className="w-full h-12 px-5 rounded-2xl border border-accent bg-accent-light text-sm font-black text-accent focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all animate-fade-in"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          {canProceed && (
            <div className="mt-8 pt-8 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
              <div className="flex items-center gap-3">
                {isUpdateMode ? (
                  <div className="flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-full bg-gd-bg text-gd-text border border-gd-border shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DATA DITEMUKAN: MODE UPDATE
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 shadow-sm">
                    <Layers className="w-3.5 h-3.5" /> DATA BARU: MODE INSERT
                  </div>
                )}
                <div className="hidden sm:block h-4 w-px bg-border-main" />
                <p className="text-xs font-bold text-text3">
                   {selectedClient} <span className="mx-1 text-text4">/</span> {periodToUse}
                </p>
              </div>
              <button
                onClick={() => document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2.5 px-8 h-12 bg-text text-white rounded-2xl text-sm font-bold hover:bg-accent transition-all shadow-lg shadow-text/10 min-w-[200px]"
              >
                Lanjutkan Isi Data <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 2: Channel Inputs ── */}
      {canProceed && client && rows.length > 0 && (
        <div id="step2" className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden animate-fade-in">
          <div className="px-8 py-6 border-b border-border-main flex items-center justify-between bg-surface1/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center text-xs font-black shadow-lg shadow-accent/20 ring-4 ring-accent/5">2</div>
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Input Data per Channel</h2>
                <p className="text-[10px] text-text4 font-bold uppercase tracking-wider">Masukkan metrik performa tiap channel</p>
              </div>
            </div>
            <button
              onClick={() => setRows(client.chs.map(() => EMPTY_ROW()))}
              className="flex items-center gap-2 text-[10px] font-bold text-text3 hover:text-rr-text px-4 py-2 rounded-xl border border-border-main hover:bg-rr-bg hover:border-rr-border transition-all uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Form
            </button>
          </div>

          <div className="p-8 space-y-8">
            {rows.map((row, i) => {
              const aware = isAware(row.ch);
              const chDef = CH_DEF[row.ch];
              const stage = chDef?.stage || 'bofu';
              const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
              const roasVal = !aware && row.sp && row.rev ? Number(row.rev) / Number(row.sp) : null;
              const targetRoas = client?.troas?.[row.ch] || null;
              const roasOk = roasVal && targetRoas ? roasVal >= Number(targetRoas) : null;

              return (
                <div key={row.ch} className="border border-border-main rounded-2xl overflow-hidden bg-white group/card hover:border-accent/30 transition-all shadow-sm">
                  {/* Channel Header */}
                  <div className={`flex items-center gap-4 px-6 py-4 border-b ${s.header}`}>
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg ${s.badge} shadow-sm`}>
                      {stage}
                    </span>
                    <h3 className="text-sm font-black text-text tracking-tight">{chDef?.l || row.ch}</h3>
                    <div className="ml-auto hidden sm:flex items-center gap-3">
                       <span className="text-[9px] font-bold text-text4 uppercase tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full border border-white/50">
                        {aware ? 'Awareness' : 'Performance'}
                      </span>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="p-7 grid grid-cols-2 md:grid-cols-4 gap-6 bg-surface1/20">
                    {/* Common Field: Spend */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Ad Spend (Rp)</label>
                      <input type="number" value={row.sp} onChange={e => updateRow(i, 'sp', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                    </div>

                    {!aware ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Revenue (Rp)</label>
                          <input type="number" value={row.rev} onChange={e => updateRow(i, 'rev', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Orders</label>
                          <input type="number" value={row.ord} onChange={e => updateRow(i, 'ord', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Results/Visits</label>
                           <input type="number" value={row.vis} onChange={e => updateRow(i, 'vis', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Reach</label>
                          <input type="number" value={row.reach} onChange={e => updateRow(i, 'reach', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Impressions</label>
                          <input type="number" value={row.impr} onChange={e => updateRow(i, 'impr', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Results</label>
                          <input type="number" value={row.results} onChange={e => updateRow(i, 'results', e.target.value)} placeholder="0" className={INPUT_CLS.replace('h-12', 'h-11 rounded-xl text-xs')} />
                        </div>
                      </>
                    )}

                    {/* ROAS Indicator */}
                    {!aware && roasVal !== null && (
                      <div className="col-span-full md:col-span-1 flex items-end">
                        <div className={`h-11 px-5 rounded-xl border text-sm font-black flex items-center gap-3 w-full justify-center transition-all shadow-sm ${
                          roasOk === true  ? 'bg-gg-bg border-gg-border text-gg-text' :
                          roasOk === false ? 'bg-rr-bg border-rr-border text-rr-text' :
                          'bg-accent-light border-accent-mid text-accent'
                        }`}>
                          <TrendingUp className="w-4 h-4" />
                          <span>{roasVal.toFixed(2)}x</span>
                          {targetRoas && (
                            <span className="text-[9px] opacity-60 font-bold ml-1">/ TARGET {targetRoas}x</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action Bar */}
          <div className="px-10 py-7 border-t border-border-main bg-surface1/50 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-4 max-w-lg">
              <div className="w-10 h-10 rounded-full bg-white border border-border-main flex items-center justify-center shrink-0 shadow-sm">
                 <Info className="w-5 h-5 text-text4" />
              </div>
              <p className="text-[11px] text-text3 font-bold leading-relaxed">
                DATA PERSISTENCE: <span className="text-text font-black">UPSERT MODE AKTIF.</span> Sistem akan memperbarui data jika kombinasi klien, channel, dan periode sudah ada, atau membuat entri baru jika belum tersedia.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-3 px-12 h-14 bg-text text-white rounded-2xl font-black text-sm hover:bg-accent transition-all disabled:opacity-50 shrink-0 shadow-2xl shadow-text/20 min-w-[280px]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              SIMPAN SEMUA DATA
            </button>
          </div>
        </div>
      )}

      {/* ── Empty Initial State ── */}
      {!canProceed && (
        <div className="bg-white rounded-[2rem] border border-dashed border-border-alt p-24 text-center animate-fade-in shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-surface2 flex items-center justify-center mx-auto mb-8 border border-border-main shadow-inner">
            <LayoutGrid className="w-10 h-10 text-text4" />
          </div>
          <h3 className="text-lg font-black text-text mb-3 tracking-tight">Klien & Periode Belum Ditentukan</h3>
          <p className="text-sm text-text3 max-w-sm mx-auto font-medium leading-relaxed">Pilih klien dan tentukan periode bulan di bagian atas untuk membuka form input data performa channel secara otomatis.</p>
        </div>
      )}
    </div>
  );
}
