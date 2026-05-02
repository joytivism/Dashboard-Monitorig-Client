'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Save, Trash2, CheckCircle2, AlertCircle, 
  Settings2, Hash, Type, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChannelSettingsPage() {
  const { CH_DEF } = useDashboardData();
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const list = Object.entries(CH_DEF).map(([key, val]) => ({
      key,
      label: val.l,
      stage: val.stage,
      type: val.type
    }));
    setChannels(list);
  }, [CH_DEF]);

  const handleAdd = () => {
    setChannels([...channels, { key: '', label: '', stage: 'tofu', type: 'awareness', isNew: true }]);
  };

  const handleRemove = async (key: string, isNew?: boolean) => {
    if (isNew) {
      setChannels(channels.filter(c => c.key !== key || !c.isNew));
      return;
    }
    if (!confirm('Hapus channel ini? Data performa yang sudah ada mungkin tidak terbaca di dashboard.')) return;
    
    setLoading(true);
    const { error } = await supabase.from('channels').delete().eq('channel_key', key);
    if (error) {
      setToast({ type: 'error', text: error.message });
    } else {
      setToast({ type: 'success', text: 'Channel berhasil dihapus.' });
      router.refresh();
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const invalid = channels.find(c => !c.key || !c.label);
    if (invalid) {
      setToast({ type: 'error', text: 'Semua kolom ID dan Nama harus diisi.' });
      return;
    }

    setLoading(true);
    const payload = channels.map(c => ({
      channel_key: c.key,
      label: c.label,
      stage: c.stage,
      type: c.type
    }));

    const { error } = await supabase.from('channels').upsert(payload);
    if (error) {
      setToast({ type: 'error', text: error.message });
    } else {
      setToast({ type: 'success', text: 'Konfigurasi channel berhasil disimpan!' });
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fade-in">
      {toast && (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-slide-in ${
          toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm">{toast.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Pengaturan Channel</h1>
          <p className="text-sm font-medium text-text3 mt-1.5">Kelola definisi, kategori, dan tahap funnel untuk setiap saluran iklan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 h-11 bg-surface2 text-text rounded-xl text-sm font-bold hover:bg-surface3 transition-all border border-border-main">
            <Plus className="w-4 h-4" /> Tambah Channel
          </button>
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-8 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-50">
            {loading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface2/50 border-b border-border-main">
              <th className="py-5 px-6 text-[10px] font-black text-text4 uppercase tracking-widest w-1/4">ID Channel (Unique)</th>
              <th className="py-5 px-6 text-[10px] font-black text-text4 uppercase tracking-widest w-1/4">Nama Tampilan</th>
              <th className="py-5 px-6 text-[10px] font-black text-text4 uppercase tracking-widest w-1/6">Stage</th>
              <th className="py-5 px-6 text-[10px] font-black text-text4 uppercase tracking-widest w-1/6">Type</th>
              <th className="py-5 px-6 text-[10px] font-black text-text4 uppercase tracking-widest w-[80px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/40">
            {channels.map((ch, i) => (
              <tr key={ch.key || i} className="hover:bg-surface2/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-text4 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      disabled={!ch.isNew}
                      value={ch.key} 
                      onChange={e => setChannels(channels.map((c, idx) => idx === i ? { ...c, key: e.target.value } : c))}
                      placeholder="e.g. twitter_ads"
                      className="w-full h-10 pl-9 pr-4 bg-surface2 border border-border-main rounded-xl text-sm font-bold text-text focus:border-accent outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="relative">
                    <Type className="w-3.5 h-3.5 text-text4 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      value={ch.label} 
                      onChange={e => setChannels(channels.map((c, idx) => idx === i ? { ...c, label: e.target.value } : c))}
                      placeholder="e.g. X (Twitter) Ads"
                      className="w-full h-10 pl-9 pr-4 bg-white border border-border-main rounded-xl text-sm font-bold text-text focus:border-accent outline-none transition-all"
                    />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <select 
                    value={ch.stage} 
                    onChange={e => setChannels(channels.map((c, idx) => idx === i ? { ...c, stage: e.target.value } : c))}
                    className="w-full h-10 px-3 bg-white border border-border-main rounded-xl text-sm font-bold text-text focus:border-accent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="tofu">TOFU (Awareness)</option>
                    <option value="mofu">MOFU (Consideration)</option>
                    <option value="bofu">BOFU (Conversion)</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <select 
                    value={ch.type} 
                    onChange={e => setChannels(channels.map((c, idx) => idx === i ? { ...c, type: e.target.value } : c))}
                    className="w-full h-10 px-3 bg-white border border-border-main rounded-xl text-sm font-bold text-text focus:border-accent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="revenue">Performance/Revenue</option>
                    <option value="assist">Assisted/Conversion</option>
                    <option value="awareness">Awareness/Reach</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => handleRemove(ch.key, ch.isNew)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-rr bg-rr-bg border border-rr-border/30 hover:bg-rr hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {channels.length === 0 && (
          <div className="py-20 text-center">
            <Settings2 className="w-12 h-12 text-text4 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-medium text-text3">Belum ada channel yang dikonfigurasi.</p>
          </div>
        )}
      </div>

      <div className="bg-surface2/50 rounded-2xl p-8 border border-border-main/50 flex gap-6 items-start">
        <div className="w-12 h-12 rounded-2xl bg-white border border-border-main flex items-center justify-center text-accent shadow-sm shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-text">Panduan Konfigurasi</h3>
          <p className="text-sm text-text3 leading-relaxed font-medium">
            Tipe <strong className="text-text">Performance/Revenue</strong> akan dihitung ke dalam ROAS global. Tipe <strong className="text-text">Awareness</strong> hanya akan dihitung Spend dan Reach-nya. Pastikan ID Channel unik dan sesuai dengan data yang diunggah.
          </p>
        </div>
      </div>
    </div>
  );
}
