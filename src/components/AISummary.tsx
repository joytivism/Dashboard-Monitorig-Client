'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Minus, RefreshCw, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { generateAISummary } from '@/app/actions/ai';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

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

const aiCache: Record<string, { data: AIResponse; timestamp: number }> = {};

const statusConfig = {
  positive: { icon: TrendingUp, label: 'Performa naik', tone: 'success' as const },
  negative: { icon: TrendingDown, label: 'Perlu perhatian', tone: 'danger' as const },
  neutral: { icon: Minus, label: 'Stabil', tone: 'neutral' as const },
  warning: { icon: AlertCircle, label: 'Perhatian', tone: 'warning' as const },
};

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${clientName}-${metrics.roas}-${metrics.revenue}-${metrics.growth}`;

  const fetchSummary = useCallback(async (force = false) => {
    if (!force && aiCache[cacheKey]) {
      setData(aiCache[cacheKey].data);
      return;
    }

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
      aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
      sessionStorage.setItem(`ai_cache_${cacheKey}`, JSON.stringify(parsed));
      setData(parsed);
    } catch {
      setError('Gagal memuat insight AI.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, clientName, metrics]);

  useEffect(() => {
    let cancelled = false;

    async function syncSummary() {
      const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
      if (aiCache[cacheKey] || stored) {
        await fetchSummary();
      } else if (!cancelled) {
        setData(null);
      }
    }

    void syncSummary();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, fetchSummary]);

  const config = data ? statusConfig[data.status] || statusConfig.neutral : statusConfig.neutral;
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border-main px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-text text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="ds-eyebrow">AI Strategy Layer</div>
              <h3 className="mt-1 text-h4">AI strategy insights</h3>
              <p className="mt-2 text-sm text-text3">Ringkasan performa, konteks strategis, dan rekomendasi tindakan dari data periode aktif.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data && !loading ? (
              <Badge tone={config.tone} style="soft">
                <StatusIcon className="h-3.5 w-3.5" />
                {config.label}
              </Badge>
            ) : null}
            {data ? (
              <button
                onClick={() => fetchSummary(true)}
                disabled={loading}
                className="btn-icon disabled:opacity-50"
                title="Re-analyze Data"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="ds-skeleton h-4 w-full" />
              <div className="ds-skeleton h-4 w-[78%]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="ds-skeleton h-24" />
              <div className="ds-skeleton h-24" />
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-4 rounded-[22px] border border-rr-border bg-rr-bg/70 p-4 text-sm font-medium text-rr-text">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <Button variant="danger" size="sm" className="ml-auto" onClick={() => fetchSummary(true)}>
              Coba lagi
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="ds-eyebrow mb-3">Summary</div>
              <p className="text-base font-medium leading-relaxed text-text">{data.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {data.actions.map((action, index) => (
                <div key={index} className="rounded-[24px] border border-border-main bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-micro">Action recommendation</div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-text">{action}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-accent-light text-accent">
              <Sparkles className="h-8 w-8" />
            </div>
            <h4 className="text-h4 mb-2">Buka wawasan strategis</h4>
            <p className="mb-8 max-w-md text-body">
              Jalankan analisis AI untuk mendapatkan ringkasan performa otomatis dan daftar tindakan prioritas.
            </p>
            <Button variant="primary" size="lg" leadingIcon={Zap} onClick={() => fetchSummary()}>
              Mulai analisis AI
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
