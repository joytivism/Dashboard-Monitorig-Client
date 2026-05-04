'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Minus, RefreshCw, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { generateAISummary } from '@/app/actions/ai';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
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
        <SectionHeader
          eyebrow="AI strategy layer"
          title="AI strategy insights"
          description="Ringkasan performa, konteks strategis, dan rekomendasi tindakan dari data periode aktif."
          icon={Sparkles}
          tone="neutral"
          action={
            <>
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
                  className="btn-icon h-9 w-9 disabled:opacity-50"
                  title="Re-analyze data"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                </button>
              ) : null}
            </>
          }
        />
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingState
            title="Menjalankan analisis AI"
            description="Sistem sedang membaca metrik periode aktif dan menyusun ringkasan strategis."
            className="py-10"
          />
        ) : error ? (
          <ErrorState
            title="Analisis AI gagal dimuat"
            description={error}
            action={(
              <Button variant="danger" size="sm" onClick={() => fetchSummary(true)}>
                Coba lagi
              </Button>
            )}
            className="py-6"
          />
        ) : data ? (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-5">
              <div className="ds-eyebrow mb-3">Summary</div>
              <p className="text-base font-medium leading-relaxed text-text">{data.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {data.actions.map((action, index) => (
                <div key={index} className="rounded-[var(--radius-md)] border border-border-main bg-white p-5 transition-colors hover:border-border-alt hover:bg-surface2/30">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-accent/15 bg-accent-light text-accent">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-micro">Action recommendation</div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-text">{action}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Buka wawasan strategis"
            description="Jalankan analisis AI untuk mendapatkan ringkasan performa otomatis dan daftar tindakan prioritas."
            action={(
              <Button variant="primary" size="lg" leadingIcon={Zap} onClick={() => fetchSummary()}>
                Mulai analisis AI
              </Button>
            )}
            tone="accent"
            className="py-10 animate-fade-in"
          />
        )}
      </div>
    </Card>
  );
}
