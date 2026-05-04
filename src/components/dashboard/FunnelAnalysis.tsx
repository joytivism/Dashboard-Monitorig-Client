import React from 'react';
import { Megaphone, Store, Target } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { fRp, fK } from '@/lib/utils';

interface FunnelStats {
  tofu: { sp: number; reach: number; impr: number; res: number };
  mofu: { vis: number; ord: number; rev: number };
  bofu: { sp: number; ord: number; rev: number };
}

interface FunnelAnalysisProps {
  stats: FunnelStats;
  roas: number | null;
}

export const FunnelAnalysis: React.FC<FunnelAnalysisProps> = ({ stats, roas }) => {
  const stages = [
    {
      key: 'tofu',
      title: 'Tofu',
      subtitle: 'Awareness',
      icon: Megaphone,
      tone: 'neutral' as const,
      highlightLabel: 'Total Reach',
      highlightValue: stats.tofu.reach > 0 ? fK(stats.tofu.reach) : '—',
      details: [
        { label: 'Impresi', value: stats.tofu.impr > 0 ? fK(stats.tofu.impr) : '0' },
        { label: 'Cost / Reach', value: stats.tofu.reach > 0 && stats.tofu.sp > 0 ? fRp(stats.tofu.sp / stats.tofu.reach) : '—' },
      ],
      footerLabel: 'Ad Spend',
      footerValue: stats.tofu.sp > 0 ? fRp(stats.tofu.sp) : 'Rp 0',
    },
    {
      key: 'mofu',
      title: 'Mofu',
      subtitle: 'Consideration',
      icon: Store,
      tone: 'accent' as const,
      highlightLabel: 'Total Visitors',
      highlightValue: stats.mofu.vis > 0 ? fK(stats.mofu.vis) : '—',
      details: [
        { label: 'Orders', value: stats.mofu.ord > 0 ? fK(stats.mofu.ord) : '0' },
        { label: 'Shop Rev.', value: stats.mofu.rev > 0 ? fK(stats.mofu.rev) : '0' },
      ],
      footerLabel: 'Conversion',
      footerValue: `${stats.mofu.vis > 0 ? ((stats.mofu.ord / stats.mofu.vis) * 100).toFixed(2) : 0}%`,
    },
    {
      key: 'bofu',
      title: 'Bofu',
      subtitle: 'Conversion',
      icon: Target,
      tone: 'info' as const,
      highlightLabel: 'Total Ad Orders',
      highlightValue: stats.bofu.ord > 0 ? fK(stats.bofu.ord) : '—',
      details: [
        { label: 'ROAS', value: roas ? `${roas.toFixed(2)}x` : '—' },
        { label: 'CHK Rate', value: `${stats.mofu.vis > 0 ? ((stats.bofu.ord / stats.mofu.vis) * 100).toFixed(2) : 0}%` },
      ],
      footerLabel: 'Ad Revenue',
      footerValue: stats.bofu.rev > 0 ? fRp(stats.bofu.rev) : 'Rp 0',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {stages.map((stage) => {
        const Icon = stage.icon;
        return (
          <Card key={stage.key} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-text2">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <Badge tone={stage.tone} style="soft">
                  {stage.title}
                </Badge>
                <div className="text-sm text-text3">{stage.subtitle}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="ds-eyebrow">{stage.highlightLabel}</div>
              <div className="text-h2 tabular-nums">{stage.highlightValue}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stage.details.map((detail) => (
                <div key={detail.label} className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-3.5">
                  <span className="type-overline block mb-1">{detail.label}</span>
                  <span className="text-sm font-semibold text-text tabular-nums">{detail.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border-main bg-white px-4 py-3.5">
              <span className="text-sm text-text3">{stage.footerLabel}</span>
              <span className="text-sm font-semibold text-text tabular-nums">{stage.footerValue}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FunnelAnalysis;
