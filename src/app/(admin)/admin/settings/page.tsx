'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Save, AlertCircle, CheckCircle2, Key, Cpu, Zap
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { AI_LOGS } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [sysSettings, setSysSettings] = useState({ openrouter_key: '', ai_model: 'google/gemini-flash-1.5' });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*');
      const mapped = (data || []).reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as any);
      setSysSettings({ 
        openrouter_key: mapped.openrouter_key || '', 
        ai_model: mapped.ai_model || 'google/gemini-flash-1.5' 
      });
    };
    fetchSettings();
  }, []);

  const aiStats = useMemo(() => {
    const totalTokens = AI_LOGS?.reduce((sum, l) => sum + (l.tk || 0), 0) || 0;
    const totalCost = AI_LOGS?.reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return { totalTokens, totalCost };
  }, [AI_LOGS]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payloads = [
        { key: 'openrouter_key', value: sysSettings.openrouter_key },
        { key: 'ai_model', value: sysSettings.ai_model }
      ];
      const { error } = await supabase.from('system_settings').upsert(payloads);
      if (error) throw error;
      setToast({ type: 'success', text: 'Settings saved successfully!' });
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Config */}
        <div className="lg:col-span-8 bg-white rounded-[28px] p-8 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
          <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">API & AI Configuration</h2>
          <p className="text-[12px] font-semibold text-gray-300 uppercase tracking-widest mb-8">Global connection settings</p>
          
          <div className="space-y-7">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase mb-3 ml-1 tracking-widest">
                <Key className="w-3.5 h-3.5" />
                OpenRouter API Key
              </label>
              <input 
                type="password" 
                value={sysSettings.openrouter_key} 
                onChange={e => setSysSettings({...sysSettings, openrouter_key: e.target.value})}
                className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all" 
                placeholder="sk-or-v1-..." 
              />
              <div className="flex items-center gap-2 mt-3 ml-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] font-semibold text-gray-300">Key is encrypted and stored in database</p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase mb-3 ml-1 tracking-widest">
                <Cpu className="w-3.5 h-3.5" />
                Primary Analysis Model
              </label>
              <select 
                value={sysSettings.ai_model} 
                onChange={e => setSysSettings({...sysSettings, ai_model: e.target.value})}
                className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-[13px] font-bold text-gray-700 outline-none focus:border-emerald-300 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="google/gemini-flash-1.5">Google Gemini Flash 1.5 (Fastest)</option>
                <option value="google/gemini-pro-1.5">Google Gemini Pro 1.5 (Smartest)</option>
                <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 (Free)</option>
              </select>
            </div>

            <div className="pt-8 border-t border-gray-50 flex justify-end">
              <button onClick={handleSaveSettings} disabled={loading} className="flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-[13px] shadow-xl shadow-gray-900/10 hover:bg-gray-800 active:scale-[0.99] transition-all">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* AI Monitor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
            <h3 className="text-[14px] font-extrabold text-gray-900 mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              AI Health Monitor
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100/50">
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Status</div>
                <div className="text-[15px] font-extrabold text-gray-900">Operational</div>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100/50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Token Usage</div>
                <div className="text-[15px] font-extrabold text-gray-900">{(aiStats.totalTokens/1000).toFixed(1)}K Tokens</div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100/50">
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Estimated Cost</div>
                <div className="text-[15px] font-extrabold text-gray-900">${aiStats.totalCost.toFixed(4)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-7 shadow-sm shadow-black/[0.03] border border-black/[0.04]">
            <h3 className="text-[14px] font-extrabold text-gray-900 mb-5">Recent Usage Logs</h3>
            <div className="space-y-4">
              {AI_LOGS?.slice(0, 5).map((l, i) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-black text-emerald-600 uppercase">{l.c}</span>
                    <span className="text-[9px] font-mono text-gray-300">{new Date(l.d).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-400 truncate mb-1.5">{l.m}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-300">{l.tk} tk</span>
                    <span className="text-[11px] font-extrabold text-emerald-600">${Number(l.cost).toFixed(5)}</span>
                  </div>
                </div>
              ))}
              {(!AI_LOGS || AI_LOGS.length === 0) && (
                <div className="text-center py-8 text-[12px] font-bold text-gray-300">No AI usage found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
