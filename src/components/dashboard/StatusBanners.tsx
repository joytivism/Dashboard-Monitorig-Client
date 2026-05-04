import React from 'react';
import { AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
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
  const growthTone = tone === 'danger' ? 'danger' : 'success';

  return (
    <button
      onClick={() => onClick(item.key)}
      className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-main bg-white px-4 py-4 text-left transition-colors hover:border-border-alt hover:bg-surface2/45"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border text-[11px] font-semibold ${
            tone === 'danger'
              ? 'border-rr-border/70 bg-rr-bg text-rr-text'
              : 'border-gd-border/70 bg-gd-bg text-gd-text'
          }`}
        >
          {item.key.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-text">{item.key}</div>
          <div className="text-xs text-text3">{fRp(item.rev)}</div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.growth !== undefined && item.growth !== null ? (
          <Badge tone={growthTone} style="soft">
            {item.growth > 0 ? '+' : ''}
            {item.growth.toFixed(1)}%
          </Badge>
        ) : null}
        <ChevronRight className="h-4 w-4 text-text4" />
      </div>
    </button>
  );
}

export default function StatusBanners({ risks, opportunities, onClientClick }: StatusBannersProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Card className="space-y-5">
        <SectionHeader
          eyebrow="Attention"
          title="Clients needing review"
          description="Portofolio dengan tekanan performa paling tinggi di periode aktif dan perlu dicek lebih dulu."
          icon={AlertTriangle}
          tone="danger"
          action={<Badge tone="danger" style="soft">{risks.length} klien</Badge>}
        />

        <div className="space-y-3">
          {risks.length > 0 ? (
            risks.slice(0, 3).map((item) => <InsightRow key={item.key} item={item} tone="danger" onClick={onClientClick} />)
          ) : (
            <EmptyState
              tone="danger"
              title="Tidak ada alert kritis pada periode ini"
              description="Semua akun berada pada kondisi yang lebih stabil untuk periode aktif."
              className="py-10"
            />
          )}
        </div>
      </Card>

      <Card className="space-y-5">
        <SectionHeader
          eyebrow="Opportunity"
          title="Top growth clients"
          description="Akun dengan momentum pertumbuhan paling positif untuk ditindaklanjuti lebih agresif."
          icon={TrendingUp}
          tone="success"
          action={<Badge tone="success" style="soft">Top {opportunities.length}</Badge>}
        />

        <div className="space-y-3">
          {opportunities.length > 0 ? (
            opportunities.map((item) => <InsightRow key={item.key} item={item} tone="success" onClick={onClientClick} />)
          ) : (
            <EmptyState
              tone="success"
              title="Belum ada peluang pertumbuhan yang menonjol"
              description="Tidak ada akun dengan lonjakan yang cukup kuat untuk dimasukkan ke daftar prioritas."
              className="py-10"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
