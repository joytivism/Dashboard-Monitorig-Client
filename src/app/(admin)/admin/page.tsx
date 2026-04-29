'use client';

import React, { useState, useEffect, use } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { Save, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { CLIENTS, PERIODS, DATA, PL } = useDashboardData();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'performa' | 'klien'>('performa');

  // Form State: Performa
  const [pClient, setPClient] = useState(CLIENTS[0]?.key || '');
  const [pPeriod, setPPeriod] = useState(PERIODS[PERIODS.length - 1] || '');
  const [pChannel, setPChannel] = useState('');
  
  const [fSp, setFSp] = useState('');
  const [fRev, setFRev] = useState('');
  const [fOrd, setFOrd] = useState('');
  const [fVis, setFVis] = useState('');
  const [fReach, setFReach] = useState('');
  const [fImpr, setFImpr] = useState('');
  const [fRes, setFRes] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form State: Klien
  const [cKey, setCKey] = useState('');
  const [cChannels, setCChannels] = useState<string[]>([]);
  const [cLoading, setCLoading] = useState(false);
  const [cMsg, setCMsg] = useState({ type: '', text: '' });

  const handleLoadClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) { setCKey(''); setCChannels([]); return; }
    const c = CLIENTS.find(x => x.key === val);
    if (c) { setCKey(c.key); setCChannels(c.chs || []); }
  };

  const toggleChannel = (ch: string) => {
    setCChannels(prev => prev.includes(ch) ? prev.filter(x => x !== ch) : [...prev, ch]);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cKey) return;
    setCLoading(true); setCMsg({ type: '', text: '' });
    try {
      const { error: cErr } = await supabase.from('clients').upsert({ 
        client_key: cKey,
        name: cKey // Mengisi kolom name yang required di database
      });
      if (cErr) throw cErr;

      await supabase.from('client_channels').delete().eq('client_key', cKey);

      if (cChannels.length > 0) {
        const { error: chErr } = await supabase.from('client_channels').insert(
          cChannels.map(ch => ({ client_key: cKey, channel_key: ch, target_roas: null }))
        );
        if (chErr) throw chErr;
      }
      setCMsg({ type: 'success', text: 'Klien & channel berhasil disimpan!' });
      router.refresh();
    } catch (err: any) {
      setCMsg({ type: 'error', text: err.message || 'Gagal menyimpan klien.' });
    } finally {
      setCLoading(false);
    }
  };

  // Update channels list based on client
  const activeClient = CLIENTS.find(c => c.key === pClient);
  const availableChannels = activeClient?.chs || [];

  // Set default channel when client changes
  useEffect(() => {
    if (availableChannels.length > 0 && !availableChannels.includes(pChannel)) {
      setPChannel(availableChannels[0]);
    }
  }, [pClient, availableChannels, pChannel]);

  // Pre-fill data when selection changes
  useEffect(() => {
    if (pClient && pPeriod && pChannel) {
      const existing = DATA.find(d => d.c === pClient && d.p === pPeriod && d.ch === pChannel);
      if (existing) {
        setFSp(existing.sp ? existing.sp.toString() : '');
        setFRev(existing.rev ? existing.rev.toString() : '');
        setFOrd(existing.ord ? existing.ord.toString() : '');
        setFVis(existing.vis ? existing.vis.toString() : '');
        setFReach(existing.reach ? existing.reach.toString() : '');
        setFImpr(existing.impr ? existing.impr.toString() : '');
        setFRes(existing.results ? existing.results.toString() : '');
      } else {
        setFSp(''); setFRev(''); setFOrd(''); setFVis(''); setFReach(''); setFImpr(''); setFRes('');
      }
    }
  }, [pClient, pPeriod, pChannel, DATA]);

  const handleSavePerforma = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const { error } = await supabase.from('channel_performance').upsert({
        client_key: pClient,
        period_key: pPeriod,
        channel_key: pChannel,
        spend: fSp ? Number(fSp) : null,
        revenue: fRev ? Number(fRev) : null,
        orders: fOrd ? Number(fOrd) : null,
        visitors: fVis ? Number(fVis) : null,
        reach: fReach ? Number(fReach) : null,
        impressions: fImpr ? Number(fImpr) : null,
        results: fRes ? Number(fRes) : null,
      }, { onConflict: 'client_key, channel_key, period_key' });

      if (error) throw error;
      
      setMsg({ type: 'success', text: 'Data performa berhasil disimpan!' });
      router.refresh(); // Refresh server component data
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Gagal menyimpan data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-2">Data Management</h1>
        <p className="text-sm text-text3">Kelola data klien, channel, dan performa secara real-time.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-main pb-px">
        <button 
          onClick={() => setActiveTab('performa')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'performa' ? 'border-accent text-accent' : 'border-transparent text-text3 hover:text-text'}`}
        >
          Input Performa
        </button>
        <button 
          onClick={() => setActiveTab('klien')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'klien' ? 'border-accent text-accent' : 'border-transparent text-text3 hover:text-text'}`}
        >
          Kelola Klien & Channel (WIP)
        </button>
      </div>

      {/* Performa Tab */}
      {activeTab === 'performa' && (
        <div className="bg-white rounded-[24px] p-8 shadow-main">
          <form onSubmit={handleSavePerforma}>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-6 bg-surface2 rounded-2xl border border-border-main">
              <div>
                <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-2">Klien</label>
                <select value={pClient} onChange={e => setPClient(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold focus:ring-2 focus:ring-accent/50 outline-none">
                  {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-2">Periode</label>
                <select value={pPeriod} onChange={e => setPPeriod(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold focus:ring-2 focus:ring-accent/50 outline-none">
                  {PERIODS.map(p => <option key={p} value={p}>{PL[p]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-2">Channel</label>
                <select value={pChannel} onChange={e => setPChannel(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold focus:ring-2 focus:ring-accent/50 outline-none">
                  {availableChannels.map(ch => <option key={ch} value={ch}>{CH_DEF[ch]?.l || ch}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text mb-4 border-b border-border-main pb-2">Metrik Keuangan & Penjualan</h3>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Spend (Pengeluaran)</label>
                  <input type="number" value={fSp} onChange={e => setFSp(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Revenue (Pendapatan)</label>
                  <input type="number" value={fRev} onChange={e => setFRev(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Orders (Konversi)</label>
                  <input type="number" value={fOrd} onChange={e => setFOrd(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text mb-4 border-b border-border-main pb-2">Metrik Trafik & Awareness</h3>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Visitors (Trafik/Klik)</label>
                  <input type="number" value={fVis} onChange={e => setFVis(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Reach</label>
                  <input type="number" value={fReach} onChange={e => setFReach(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Impressions</label>
                  <input type="number" value={fImpr} onChange={e => setFImpr(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text2 mb-1.5">Results (Leads/Add to Cart)</label>
                  <input type="number" value={fRes} onChange={e => setFRes(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-sm focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
              </div>
            </div>

            {msg.text && (
              <div className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                {msg.text}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Performa
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'klien' && (
        <div className="bg-white rounded-[24px] p-8 shadow-main">
          <form onSubmit={handleSaveClient}>
            <div className="mb-6 pb-6 border-b border-border-main flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-2">Edit Klien yang Ada</label>
                <select onChange={handleLoadClient} className="w-64 h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold focus:ring-2 focus:ring-accent/50 outline-none">
                  <option value="">-- Pilih Klien untuk Edit --</option>
                  {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                </select>
              </div>
              <div className="text-sm font-medium text-text3 italic">atau isi form di bawah untuk klien baru</div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-2">Nama Klien (Key)</label>
              <input type="text" value={cKey} onChange={e => setCKey(e.target.value)} placeholder="Contoh: Kalisha" required className="w-full sm:w-1/2 h-11 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold focus:ring-2 focus:ring-accent/50 outline-none" />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-text3 uppercase tracking-wider mb-4">Pilih Channel Aktif</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(CH_DEF).map(ch => {
                  const isActive = cChannels.includes(ch);
                  return (
                    <label key={ch} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isActive ? 'border-accent bg-accent/5' : 'border-border-main hover:border-accent/50'}`}>
                      <input type="checkbox" checked={isActive} onChange={() => toggleChannel(ch)} className="w-4 h-4 rounded border-border-alt text-accent focus:ring-accent/30" />
                      <div>
                        <div className="text-sm font-bold text-text">{CH_DEF[ch]?.l}</div>
                        <div className="text-[10px] text-text3 font-medium uppercase tracking-wider mt-0.5">{CH_DEF[ch]?.stage}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {cMsg.text && (
              <div className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm font-medium ${cMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {cMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                {cMsg.text}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={cLoading || !cKey}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors disabled:opacity-50"
              >
                {cLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Klien
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
