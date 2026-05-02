'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Save, Key, MessageSquare, Info, 
  CheckCircle2, AlertCircle, Bot, Sparkles, Terminal,
  Cpu, Zap, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [currentModel, setCurrentModel] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) throw error;
      
      if (data) {
        setSettings(data);
        const key = data.find(s => s.key === 'openrouter_key')?.value || '';
        const pmt = data.find(s => s.key === 'ai_prompt')?.value || '';
        const mdl = data.find(s => s.key === 'ai_model')?.value || 'Not set';
        
        setApiKey(key);
        setPrompt(pmt);
        setCurrentModel(mdl);
      }
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal memuat pengaturan.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updates = [
        { key: 'openrouter_key', value: apiKey },
        { key: 'ai_prompt', value: prompt },
        { key: 'ai_model', value: currentModel }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'key' });
        if (error) throw error;
      }

      setToast({ type: 'success', text: 'Pengaturan berhasil diperbarui!' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-surface3 mb-4 flex items-center justify-center">
          <Settings className="w-6 h-6 text-text4" />
        </div>
        <p className="text-sm font-bold text-text3">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-bold animate-fade-in ${
          toast.type === 'success' ? 'bg-white border-gg-border text-gg-text' : 'bg-white border-rr-border text-rr-text'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Cpu className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-bold text-text tracking-tight">Pengaturan Sistem</h1>
          </div>
          <p className="text-sm text-text3 max-w-md">Kelola konfigurasi API dan kecerdasan buatan dashboard untuk performa optimal.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2.5 px-8 h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all shadow-lg shadow-text/10 disabled:opacity-50 min-w-[200px]"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </div>

      {/* ── Main Configuration ── */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* API Configuration Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden group hover:border-accent/20 transition-all">
          <div className="px-8 py-5 border-b border-border-main flex items-center gap-4 bg-surface1/30">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
              <Key className="w-4.5 h-4.5" />
            </div>
            <div>
               <h2 className="text-sm font-bold text-text tracking-tight">Konfigurasi API</h2>
               <p className="text-[10px] text-text4 font-bold uppercase tracking-wider">Kunci akses layanan eksternal</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block">OpenRouter API Key</label>
              <div className="relative group/input">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full h-13 px-5 pr-14 rounded-2xl border border-border-main bg-surface2 text-sm font-mono text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-text4 group-focus-within/input:text-accent transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-surface2 border border-border-main/50">
                 <Zap className="w-3.5 h-3.5 text-or-text shrink-0 mt-0.5" />
                 <p className="text-[10px] text-text3 font-bold leading-normal">
                    Kunci ini bersifat rahasia dan digunakan untuk menghubungkan Dashboard dengan layanan LLM via OpenRouter.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Management Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden group hover:border-accent/20 transition-all">
          <div className="px-8 py-5 border-b border-border-main flex items-center justify-between bg-surface1/30">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gd-bg text-gd-text border border-gd-border flex items-center justify-center shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                 <h2 className="text-sm font-bold text-text tracking-tight">Model AI (LLM)</h2>
                 <p className="text-[10px] text-text4 font-bold uppercase tracking-wider">Otak kecerdasan buatan</p>
              </div>
            </div>
            {currentModel && (
              <button
                onClick={() => setCurrentModel('')}
                className="text-[10px] font-bold text-rr-text hover:bg-rr-bg px-4 py-2 rounded-xl border border-rr-border transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3 h-3" /> Hapus & Reset
              </button>
            )}
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-surface2 flex items-center justify-center border border-border-main shrink-0 shadow-sm">
                <Terminal className="w-7 h-7 text-text3" />
              </div>
              <div className="flex-1 w-full space-y-3">
                <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block">Model ID (OpenRouter)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentModel}
                    onChange={(e) => setCurrentModel(e.target.value)}
                    placeholder="Contoh: google/gemini-pro-1.5..."
                    className="w-full h-13 px-5 rounded-2xl border border-border-main bg-surface2 text-sm font-mono font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <span className="text-[9px] font-black bg-accent/10 text-accent px-2 py-1 rounded uppercase">Active</span>
                  </div>
                </div>
                <p className="text-[10px] text-text4 font-bold flex items-center gap-1.5 ml-1">
                  <Info className="w-3.5 h-3.5" /> Masukkan ID model resmi dari direktori OpenRouter.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Prompt Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden group hover:border-accent/20 transition-all">
          <div className="px-8 py-5 border-b border-border-main flex items-center gap-4 bg-surface1/30">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div>
               <h2 className="text-sm font-bold text-text tracking-tight">AI Strategy Prompt</h2>
               <p className="text-[10px] text-text4 font-bold uppercase tracking-wider">Instruksi analisis strategi</p>
            </div>
            <Sparkles className="w-4 h-4 text-gd-text animate-pulse ml-auto" />
          </div>
          <div className="p-8 space-y-6">
            <div className="p-5 rounded-2xl bg-surface2 border border-border-main space-y-4">
              <div className="flex items-center justify-between">
                 <p className="text-[11px] font-bold text-text3 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-accent" /> Data Placeholders
                 </p>
                 <span className="text-[9px] font-bold text-text4 px-2 py-0.5 border border-border-main rounded-full">Dapat Digunakan Dalam Prompt</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['{clientName}', '{spend}', '{revenue}', '{roas}', '{growth}', '{status}'].map(tag => (
                  <code key={tag} className="text-[10px] bg-white px-3 py-1.5 rounded-lg border border-border-main text-accent font-bold shadow-sm hover:border-accent/50 transition-all cursor-default">
                    {tag}
                  </code>
                ))}
              </div>
            </div>

            <div className="relative group/prompt">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-none opacity-40 group-focus-within/prompt:opacity-100 transition-opacity">
                 <span className="text-[9px] font-bold bg-text text-white px-2 py-1 rounded">Editor Mode</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={12}
                className="w-full p-6 pt-10 rounded-2xl border border-border-main bg-surface2 text-sm font-bold leading-relaxed text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all min-h-[300px]"
                placeholder="Tulis prompt analisis di sini..."
              />
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-rr-bg/30 border border-rr-border/50">
              <AlertCircle className="w-5 h-5 text-rr-text shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-xs text-rr-text font-bold uppercase tracking-tight">Instruksi Kritis</p>
                 <p className="text-xs text-rr-text/80 font-bold leading-relaxed">
                    Pastikan instruksi format JSON tetap ada di dalam prompt. Tanpa instruksi JSON, sistem tidak akan bisa mem-parsing jawaban AI ke dalam komponen UI Dashboard.
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
