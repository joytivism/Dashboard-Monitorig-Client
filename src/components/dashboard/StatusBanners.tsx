import React from 'react';
import { AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { fRp } from '@/lib/utils';

interface BannerItem {
  key: string;
  rev: number;
  growth?: number | null;
}

interface StatusBannersProps {
  risks: BannerItem[];
  opportunities: BannerItem[];
  onClientClick: (key: string) => void;
}

function InsightRow({
  item,
  tone,
  onClick,
}: {
  item: BannerItem;
  tone: 'danger' | 'success';
  onClick: (key: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(item.key)}
      className="flex w-full items-center justify-between rounded-[22px] border border-border-main bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-[11px] font-semibold ${
          tone === 'danger' ? 'bg-rr-bg text-rr-text' : 'bg-gg-bg text-gg-text'
        }`}>
          {item.key.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-text">{item.key}</div>
          <div className="text-xs text-text3">{fRp(item.rev)}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {item.growth !== undefined && item.growth !== null ? (
          <span className={`text-xs font-semibold ${tone === 'danger' ? 'text-rr-text' : 'text-gg-text'}`}>
            {item.growth >= 0 ? '+' : '-'}
            {Math.abs(item.growth).toFixed(1)}%
          </span>
        ) : null}
        <ChevronRight className="h-4 w-4 text-text4" />
      </div>
    </button>
  );
}

export default function StatusBanners({ risks, opportunities, onClientClick }: StatusBannersProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Card tone="danger" className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rr text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="ds-eyebrow text-rr-text">Attention</div>
              <h2 className="mt-1 text-h4 text-rr-text">Clients needing review</h2>
              <p className="mt-2 text-sm text-rr-text/80">Portofolio dengan tekanan performa paling tinggi di periode aktif.</p>
            </div>
          </div>
          <Badge tone="danger" style="soft">{risks.length} klien</Badge>
        </div>

        <div className="space-y-3">
          {risks.length > 0 ? (
            risks.slice(0, 3).map((item) => <InsightRow key={item.key} item={item} tone="danger" onClick={onClientClick} />)
          ) : (
            <div className="rounded-[22px] border border-dashed border-rr-border bg-white/60 px-5 py-12 text-center text-sm text-rr-text/75">
              Tidak ada alert kritis pada periode ini.
            </div>
          )}
        </div>
      </Card>

      <Card tone="success" className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gg text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="ds-eyebrow text-gg-text">Opportunity</div>
              <h2 className="mt-1 text-h4 text-gg-text">Top growth clients</h2>
              <p className="mt-2 text-sm text-gg-text/80">Akun dengan momentum pertumbuhan paling positif untuk ditindaklanjuti lebih agresif.</p>
            </div>
          </div>
          <Badge tone="success" style="soft">Top {opportunities.length}</Badge>
        </div>

        <div className="space-y-3">
          {opportunities.length > 0 ? (
            opportunities.map((item) => <InsightRow key={item.key} item={item} tone="success" onClick={onClientClick} />)
          ) : (
            <div className="rounded-[22px] border border-dashed border-gg-border bg-white/60 px-5 py-12 text-center text-sm text-gg-text/75">
              Belum ada peluang pertumbuhan yang menonjol.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
