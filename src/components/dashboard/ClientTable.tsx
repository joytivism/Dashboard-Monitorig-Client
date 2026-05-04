import React from 'react';
import { Search } from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import TableShell from '@/components/ui/TableShell';
import { STATUS_DOT, STATUS_LABEL, type Client, type DataEntry } from '@/lib/data';
import { clientWorst, cn, fRp, totals } from '@/lib/utils';

interface ClientTableProps {
  clients: Client[];
  data: DataEntry[];
  periods: string[];
  currentPeriod: string;
  onClientClick: (clientKey: string) => void;
  search: string;
  setSearch: (value: string) => void;
  filters: {
    cg: string;
    ind: string;
    pic: string;
  };
  setFilter: (key: string, value: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
  metadata: {
    industries: string[];
    pics: string[];
    channelGroups: string[];
  };
}

const statusToneMap: Record<string, 'danger' | 'warning' | 'neutral' | 'success' | 'info'> = {
  rr: 'danger',
  or: 'warning',
  yy: 'warning',
  nn: 'neutral',
  gg: 'success',
  gd: 'info',
};

export default function ClientTable({
  clients,
  data,
  periods,
  currentPeriod,
  onClientClick,
  search,
  setSearch,
  filters,
  setFilter,
  sortConfig,
  onSort,
  metadata,
}: ClientTableProps) {
  const { CH_DEF } = useDashboardData();

  return (
    <TableShell
      eyebrow="Client table"
      title="Semua klien"
      description="Cari, filter, dan bandingkan performa portofolio aktif pada satu tabel yang ringkas."
      action={<Badge tone="neutral" style="soft">Total {clients.length} klien</Badge>}
      toolbar={(
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.7fr)_180px_220px_220px]">
          <InputField
            aria-label="Cari klien"
            placeholder="Cari klien atau industri..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={Search}
          />
          <SelectField
            aria-label="Filter channel group"
            value={filters.cg}
            onChange={(event) => setFilter('cg', event.target.value)}
            options={[
              { label: 'Semua CG', value: '' },
              ...metadata.channelGroups.map((cg) => ({ label: cg, value: cg })),
            ]}
          />
          <SelectField
            aria-label="Filter industri"
            value={filters.ind}
            onChange={(event) => setFilter('ind', event.target.value)}
            options={[
              { label: 'Semua industri', value: '' },
              ...metadata.industries.map((industry) => ({ label: industry, value: industry })),
            ]}
          />
          <SelectField
            aria-label="Filter PIC"
            value={filters.pic}
            onChange={(event) => setFilter('pic', event.target.value)}
            options={[
              { label: 'Semua PIC', value: '' },
              ...metadata.pics.map((pic) => ({ label: pic, value: pic })),
            ]}
          />
        </div>
      )}
      bodyClassName="overflow-x-auto"
    >
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface2/70">
              {[
                { label: 'Klien', key: 'key' },
                { label: 'Industri', key: 'ind' },
                { label: 'Status', key: 'status' },
                { label: 'Revenue', key: 'rev' },
                { label: 'Spend', key: 'sp' },
                { label: 'ROAS', key: 'roas' },
                { label: 'Channel', key: 'cg' },
              ].map((header, index) => (
                <th
                  key={header.key}
                  onClick={() => onSort(header.key)}
                  className={cn(
                    'cursor-pointer px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3 transition-colors hover:text-accent',
                    index === 0 && 'pl-6',
                    index === 6 && 'pr-6 text-right',
                    sortConfig.key === header.key && 'text-accent'
                  )}
                >
                  <div className={cn('flex items-center gap-1.5', index === 6 ? 'justify-end' : 'justify-start')}>
                    {header.label}
                    {sortConfig.key === header.key ? (
                      <span className="text-[10px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/60">
            {clients.length > 0 ? (
              clients.map((client) => {
                const total = totals(CH_DEF, clients, data, client.key, currentPeriod);
                const status = clientWorst(CH_DEF, clients, data, periods, client.key, currentPeriod);
                const dotColor = STATUS_DOT[status] || STATUS_DOT.nn;

                return (
                  <tr
                    key={client.key}
                    onClick={() => onClientClick(client.key)}
                    className="cursor-pointer bg-white transition-colors hover:bg-surface2/55"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-xs font-semibold text-text2">
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text">{client.name}</div>
                          <div className="text-xs text-text3">PIC {client.as}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text2">{client.ind}</td>
                    <td className="px-4 py-4">
                      <Badge tone={statusToneMap[status] || 'neutral'} style="soft">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
                        {STATUS_LABEL[status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-text tabular-nums">{fRp(total.rev)}</td>
                    <td className="px-4 py-4 text-sm font-medium text-text3 tabular-nums">{fRp(total.sp)}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-text tabular-nums">{total.roas ? `${total.roas.toFixed(2)}x` : '—'}</td>
                    <td className="py-4 pl-4 pr-6 text-right">
                      <Badge tone="neutral" style="soft">
                        {client.cg}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <EmptyState
                    title="Tidak ada klien yang cocok dengan filter aktif"
                    description="Ubah pencarian atau filter untuk menampilkan kembali daftar portofolio."
                    className="mx-auto max-w-md"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
    </TableShell>
  );
}
