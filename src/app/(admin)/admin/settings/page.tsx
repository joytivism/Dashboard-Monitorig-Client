'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Save, Key, MessageSquare, Info, 
  CheckCircle2, AlertCircle, Bot, Sparkles, Terminal 
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
        <p className="text-sm font-semibold text-text3">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
          toast.type === 'success' ? 'bg-white border-gg-border text-gg-text' : 'bg-white border-rr-border text-rr-text'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-accent" />
            Pengaturan Sistem
          </h1>
          <p className="text-sm text-text3 mt-1">Kelola konfigurasi API dan kecerdasan buatan dashboard.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 h-11 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all shadow-sm disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* API Configuration Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-main flex items-center gap-3 bg-surface1/50">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Key className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-text">Konfigurasi API</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[11px] font-bold text-text3 uppercase tracking-wider block mb-2">OpenRouter API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-border-main bg-surface2 text-sm font-mono text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text4">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-text4 flex items-center gap-1.5">
                <Info className="w-3 h-3" /> API Key ini digunakan untuk mengakses model AI via OpenRouter.
              </p>
            </div>
          </div>
        </div>

        {/* AI Model Management Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-surface1/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gd-bg text-gd-text border border-gd-border flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-text">Model AI (LLM)</h2>
            </div>
            {currentModel && (
              <button
                onClick={() => setCurrentModel('')}
                className="text-[10px] font-bold text-rr-text hover:bg-rr-bg px-3 py-1.5 rounded-lg transition-all"
              >
                Hapus & Ganti Baru
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-surface2 flex items-center justify-center border border-border-main shrink-0">
                <Terminal className="w-6 h-6 text-text3" />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-text3 uppercase tracking-wider block mb-2">Model ID (OpenRouter)</label>
                <input
                  type="text"
                  value={currentModel}
                  onChange={(e) => setCurrentModel(e.target.value)}
                  placeholder="Contoh: google/gemini-pro-1.5 atau nvidia/nemotron-3..."
                  className="w-full h-12 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-mono font-bold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface2 border border-border-main text-[10px] text-text3 font-medium">
              <Info className="w-3.5 h-3.5" />
              Masukkan Model ID lengkap dari OpenRouter untuk menggunakan model AI yang berbeda.
            </div>
          </div>
        </div>

        {/* AI Prompt Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-main flex items-center gap-3 bg-surface1/50">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-text">AI Strategy Prompt</h2>
            <Sparkles className="w-3.5 h-3.5 text-gd-text animate-pulse ml-auto" />
          </div>
          <div className="p-6">
            <div className="mb-4 p-4 rounded-xl bg-surface2 border border-border-main">
              <p className="text-[11px] font-bold text-text3 uppercase mb-2 flex items-center gap-2">
                <Info className="w-3 h-3" /> Panduan Placeholder
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['{clientName}', '{spend}', '{revenue}', '{roas}', '{growth}', '{status}'].map(tag => (
                  <code key={tag} className="text-[10px] bg-white px-2 py-1 rounded border border-border-main text-accent font-bold">
                    {tag}
                  </code>
                ))}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={12}
              className="w-full p-5 rounded-2xl border border-border-main bg-surface2 text-sm font-medium leading-relaxed text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
              placeholder="Tulis prompt analisis di sini..."
            />
            
            <div className="mt-3 flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
              <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-accent font-semibold leading-normal">
                PENTING: Pastikan instruksi format JSON tetap ada di dalam prompt agar sistem dapat mengolah data dengan benar. Kesalahan format dapat menyebabkan summary tidak muncul.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
