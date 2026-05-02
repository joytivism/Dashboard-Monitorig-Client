'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { generateAISummary } from '@/app/actions/ai';

interface AISummaryProps {
  clientName: string;
  metrics: {
    reach: string;
    spend: string;
    revenue: string;
    roas: string;
    cvr: string;
    chk: string;
    growth: number;
  };
}

interface AIResponse {
  status: 'positive' | 'negative' | 'neutral' | 'warning';
  summary: string;
  actions: string[];
}

// Simple in-memory cache to prevent re-fetching when navigating
const aiCache: Record<string, { data: AIResponse, timestamp: number }> = {};

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unique key for this specific client and metrics combination
  const cacheKey = `${clientName}-${metrics.roas}-${metrics.revenue}-${metrics.growth}`;

  const fetchSummary = async (force = false) => {
    // 1. Cek Memory Cache
    if (!force && aiCache[cacheKey]) {
      setData(aiCache[cacheKey].data);
      return;
    }

    // 2. Cek Session Storage (Persistent on Refresh)
    if (!force) {
      const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateAISummary(clientName, metrics);
      const parsed: AIResponse = JSON.parse(result);
      
      // Save to Memory & Session Storage
      aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
      sessionStorage.setItem(`ai_cache_${cacheKey}`, JSON.stringify(parsed));
      
      setData(parsed);
    } catch (err) {
      setError("Gagal memuat insight AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hanya auto-fetch jika SUDAH ada di cache (memory atau session)
    const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
    if (aiCache[cacheKey] || stored) {
      fetchSummary();
    } else {
      setData(null); // Reset jika ganti klien dan belum dianalisa
    }
  }, [clientName, cacheKey]);

  const statusConfig = {
    positive: { icon: TrendingUp, label: 'Performa Naik', badgeClass: 'bg-gg-bg text-gg' },
    negative: { icon: TrendingDown, label: 'Perlu Perhatian', badgeClass: 'bg-rr-bg text-rr' },
    neutral: { icon: Minus, label: 'Stabil', badgeClass: 'bg-surface2 text-text2' },
    warning: { icon: AlertCircle, label: 'Perhatian', badgeClass: 'bg-mofu-bg text-mofu' },
  };

  const config = data ? statusConfig[data.status] || statusConfig.neutral : statusConfig.neutral;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-[24px] shadow-main overflow-hidden mb-8 border border-border-main/50">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text tracking-tight">AI Strategy Insights</h3>
              <p className="text-[10px] font-bold text-text4 tracking-[0.2em]">Powered by Advanced Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && !loading && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${config.badgeClass}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </span>
            )}
            {data && (
              <button 
                onClick={() => fetchSummary(true)} 
                disabled={loading}
                className="p-2 hover:bg-surface2 rounded-xl transition-all duration-200 disabled:opacity-50 text-text3"
                title="Re-analyze Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <div className="h-4 bg-surface2 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-surface2 rounded-lg w-[85%] animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="h-16 bg-surface2 rounded-2xl animate-pulse"></div>
              <div className="h-16 bg-surface2 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rr-bg/50 text-rr text-sm font-medium border border-rr-border/50">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
            <button onClick={() => fetchSummary(true)} className="ml-auto underline text-xs">Coba Lagi</button>
          </div>
        ) : data ? (
          <div className="space-y-5">
            <p className="text-[14px] leading-[1.85] text-text/85 font-medium italic">
              "{data.summary}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-surface2/60 border border-border-main hover:bg-surface2 transition-all duration-200 group">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4 text-accent group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-text3 uppercase tracking-widest mb-1">
                      Action Recommendation
                    </div>
                    <p className="text-[13px] text-text font-semibold leading-snug">
                      {action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-surface2 rounded-full flex items-center justify-center mb-6 relative">
              <Sparkles className="w-10 h-10 text-accent/20" />
              <div className="absolute inset-0 bg-accent/5 rounded-full animate-ping opacity-20"></div>
            </div>
            <h4 className="text-base font-bold text-text mb-2">Siap untuk dianalisis?</h4>
            <p className="text-sm text-text3 max-w-[300px] mb-8 font-medium">
              Gunakan AI untuk mendapatkan ringkasan performa dan rekomendasi tindakan strategis.
            </p>
            <button 
              onClick={() => fetchSummary()}
              className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-current" />
              Mulai Analisis AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
