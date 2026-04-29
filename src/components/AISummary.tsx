'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAISummary(clientName, metrics);
      setSummary(result);
    } catch (err) {
      setError("Gagal memuat insight AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Kita panggil saat pertama kali load atau metrics berubah drastis
    fetchSummary();
  }, [clientName]);

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-main border-transparent mb-8 group relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50 group-hover:bg-tofu/10 transition-all duration-500"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <h3 className="text-sm font-bold text-text uppercase tracking-wider">AI Strategy Insights</h3>
        </div>
        
        <button 
          onClick={fetchSummary}
          disabled={loading}
          className="p-2 hover:bg-surface2 rounded-full transition-colors disabled:opacity-50"
          title="Refresh AI Insights"
        >
          <RefreshCw className={`w-4 h-4 text-text3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-surface2 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-surface2 rounded-md w-[90%] animate-pulse delay-75"></div>
            <div className="h-4 bg-surface2 rounded-md w-[75%] animate-pulse delay-150"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        ) : (
          <p className="text-[14px] leading-relaxed text-text font-medium italic">
            "{summary}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-main/50 flex items-center gap-4 relative z-10">
        <div className="text-[11px] font-bold text-text3 uppercase tracking-widest">
          Recommended Action:
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-tofu-bg text-tofu text-[10px] font-bold rounded-md uppercase">Scale Budget</span>
          <span className="px-2 py-0.5 bg-mofu-bg text-mofu text-[10px] font-bold rounded-md uppercase">Optimize Content</span>
        </div>
      </div>
    </div>
  );
}
