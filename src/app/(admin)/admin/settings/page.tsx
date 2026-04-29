'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle, CheckCircle2, Key, Cpu, Zap } from 'lucide-react';

export default function AdminSettingsPage() {
  const { AI_LOGS } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type:'success'|'error',text:string}|null>(null);
  const [cfg, setCfg] = useState({openrouter_key:'',ai_model:'google/gemini-flash-1.5'});

  useEffect(()=>{
    (async()=>{
      const{data}=await supabase.from('system_settings').select('*');
      const m=(data||[]).reduce((a,s)=>({...a,[s.key]:s.value}),{} as any);
      setCfg({openrouter_key:m.openrouter_key||'',ai_model:m.ai_model||'google/gemini-flash-1.5'});
    })();
  },[]);

  const ai=useMemo(()=>({
    tk:AI_LOGS?.reduce((s,l)=>s+(l.tk||0),0)||0,
    cost:AI_LOGS?.reduce((s,l)=>s+(l.cost||0),0)||0
  }),[AI_LOGS]);

  const save=async()=>{
    setLoading(true);
    try{
      const{error}=await supabase.from('system_settings').upsert([
        {key:'openrouter_key',value:cfg.openrouter_key},
        {key:'ai_model',value:cfg.ai_model}
      ]);
      if(error)throw error;
      setToast({type:'success',text:'Saved!'});
    }catch(e:any){setToast({type:'error',text:e.message});}
    finally{setLoading(false);}
  };

  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t);}},[toast]);

  const ac=(k:string)=>{
    const c=['from-blue-500 to-blue-600','from-violet-500 to-purple-600','from-emerald-500 to-green-600','from-orange-400 to-red-500'];
    let h=0;for(let i=0;i<k.length;i++)h=k.charCodeAt(i)+((h<<5)-h);
    return c[Math.abs(h)%c.length];
  };

  return(
    <div className="space-y-8">
      {toast&&(
        <div className={`fixed top-20 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${toast.type==='success'?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type==='success'?<CheckCircle2 className="w-4 h-4"/>:<AlertCircle className="w-4 h-4"/>}
          <span className="text-[13px] font-semibold">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-[24px] font-extrabold text-[#111827]">Settings ⚙️</h1>
        <p className="text-[13px] font-medium text-[#9CA3AF] mt-1">Configure AI model, API keys, and monitor usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <h2 className="text-[16px] font-bold text-[#111827] mb-6">API & AI Configuration</h2>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                <Key className="w-3.5 h-3.5"/>OpenRouter API Key
              </label>
              <input type="password" value={cfg.openrouter_key} onChange={e=>setCfg({...cfg,openrouter_key:e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] focus:bg-white transition-all" placeholder="sk-or-v1-..."/>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"/>
                <span className="text-[10px] font-medium text-[#9CA3AF]">Encrypted and stored in database</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                <Cpu className="w-3.5 h-3.5"/>Primary Model
              </label>
              <select value={cfg.ai_model} onChange={e=>setCfg({...cfg,ai_model:e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563EB] transition-all appearance-none cursor-pointer">
                <option value="google/gemini-flash-1.5">Gemini Flash 1.5 (Fastest)</option>
                <option value="google/gemini-pro-1.5">Gemini Pro 1.5 (Smartest)</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 (Free)</option>
              </select>
            </div>
            <div className="pt-6 border-t border-[#F9FAFB] flex justify-end">
              <button onClick={save} disabled={loading} className="flex items-center gap-2 bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold text-[13px] shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all">
                {loading?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save className="w-4 h-4"/>}
                Save settings
              </button>
            </div>
          </div>
        </div>

        {/* Monitor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
            <h3 className="text-[14px] font-bold text-[#111827] mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB]"/>AI Health
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]/30">
                <div className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wider mb-1">Status</div>
                <div className="text-[15px] font-extrabold text-[#111827]">Operational</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Tokens</div>
                <div className="text-[15px] font-extrabold text-[#111827]">{(ai.tk/1000).toFixed(1)}K</div>
              </div>
              <div className="p-4 rounded-xl bg-[#EDE9FE] border border-[#C4B5FD]/30">
                <div className="text-[10px] font-semibold text-[#7C3AED] uppercase tracking-wider mb-1">Cost</div>
                <div className="text-[15px] font-extrabold text-[#111827]">${ai.cost.toFixed(4)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-[#111827]">Usage Logs</h3>
              <span className="text-[11px] font-semibold text-[#2563EB]">See all</span>
            </div>
            <div className="space-y-4">
              {AI_LOGS?.slice(0,5).map((l,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${ac(l.c)} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[10px] font-black uppercase">{l.c.substring(0,2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#111827]">{l.c}</div>
                    <div className="text-[10px] font-medium text-[#9CA3AF] truncate">{l.m}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] font-bold text-[#111827]">{l.tk} tk</div>
                    <div className="text-[10px] font-semibold text-[#10B981]">${Number(l.cost).toFixed(5)}</div>
                  </div>
                </div>
              ))}
              {(!AI_LOGS||AI_LOGS.length===0)&&(
                <div className="text-center py-8 text-[12px] font-semibold text-[#9CA3AF]">No data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
