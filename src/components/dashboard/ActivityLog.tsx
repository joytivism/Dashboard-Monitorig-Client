import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';

interface ActivityItem {
  d: string;
  dLabel?: string;
  t: 'p' | 'e' | 'c' | 'l';
  n: string;
  c: string;
  impact?: 'up' | 'down' | 'neutral';
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

const TYPE_CONFIG = {
  p: { label: 'Promo', tone: 'success' as const, dotClass: 'bg-gd' },
  e: { label: 'Event', tone: 'neutral' as const, dotClass: 'bg-text4' },
  c: { label: 'Content', tone: 'warning' as const, dotClass: 'bg-accent' },
  l: { label: 'Launching', tone: 'danger' as const, dotClass: 'bg-rr' },
};

const TABS = [
  { id: 'all', label: 'All feed' },
  { id: 'p', label: 'Promos' },
  { id: 'c', label: 'Content' },
  { id: 'l', label: 'Launches' },
] as const;

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'p' | 'e' | 'c' | 'l'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchFilter = filter === 'all' || activity.t === filter;
      const matchSearch =
        activity.n.toLowerCase().includes(search.toLowerCase()) ||
        activity.c.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [activities, filter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-[12px] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                filter === tab.id
                  ? 'border border-border-main bg-white text-text shadow-[var(--shadow-card)]'
                  : 'text-text3 hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-xs">
          <InputField
            aria-label="Cari activity"
            placeholder="Cari activity atau klien..."
            icon={Search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border-main bg-surface2/20">
          <div className="divide-y divide-border-main/60">
            {filtered.map((activity, index) => {
              const config = TYPE_CONFIG[activity.t] || TYPE_CONFIG.e;
              const isLast = index === filtered.length - 1;

              return (
                <div
                  key={`${activity.c}-${activity.d}-${index}`}
                  className="group flex gap-4 px-5 py-4 transition-colors hover:bg-white"
                >
                  <div className="flex shrink-0 flex-col items-center pt-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
                    {!isLast ? <div className="mt-2 w-px flex-1 bg-border-main" /> : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={config.tone} style="soft">
                        {config.label}
                      </Badge>
                      <Badge tone="neutral" style="soft">
                        {activity.c}
                      </Badge>
                      <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.14em] text-text4">
                        {activity.dLabel || activity.d}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-text">{activity.n}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Tidak ada activity yang cocok"
          description="Reset filter atau pencarian untuk menampilkan kembali feed operasional."
          action={(
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
            >
              Reset filter
            </Button>
          )}
          className="py-14"
        />
      )}
    </div>
  );
};

export default ActivityLog;
