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
      eyebrow="Portfolio Data"
      title="Client Performance"
      description="Detailed performance metrics and health status for all active clients in your portfolio."
      action={<div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Total {clients.length} Records</div>}
      toolbar={(
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <InputField
            aria-label="Cari klien"
            placeholder="Search by client or industry..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={Search}
            className="h-10 text-[13px]"
          />
          <SelectField
            aria-label="Filter channel group"
            value={filters.cg}
            onChange={(event) => setFilter('cg', event.target.value)}
            options={[
              { label: 'All Channels', value: '' },
              ...metadata.channelGroups.map((cg) => ({ label: cg, value: cg })),
            ]}
            className="h-10 text-[13px]"
          />
          <SelectField
            aria-label="Filter industri"
            value={filters.ind}
            onChange={(event) => setFilter('ind', event.target.value)}
            options={[
              { label: 'All Industries', value: '' },
              ...metadata.industries.map((industry) => ({ label: industry, value: industry })),
            ]}
            className="h-10 text-[13px]"
          />
          <SelectField
            aria-label="Filter PIC"
            value={filters.pic}
            onChange={(event) => setFilter('pic', event.target.value)}
            options={[
              { label: 'All PICs', value: '' },
              ...metadata.pics.map((pic) => ({ label: pic, value: pic })),
            ]}
            className="h-10 text-[13px]"
          />
        </div>
      )}
      bodyClassName="overflow-x-auto no-scrollbar"
    >
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-main bg-panel-muted/50">
              {[
                { label: 'Client', key: 'key' },
                { label: 'Industry', key: 'ind' },
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
                    'cursor-pointer px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary',
                    index === 0 && 'pl-6',
                    index === 6 && 'pr-6 text-right',
                    sortConfig.key === header.key && 'text-text-primary'
                  )}
                >
                  <div className={cn('flex items-center gap-1.5', index === 6 ? 'justify-end' : 'justify-start')}>
                    {header.label}
                    {sortConfig.key === header.key ? (
                      <span className="text-[10px]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/40">
            {clients.length > 0 ? (
              clients.map((client) => {
                const total = totals(CH_DEF, clients, data, client.key, currentPeriod);
                const status = clientWorst(CH_DEF, clients, data, periods, client.key, currentPeriod);
                const dotColor = STATUS_DOT[status] || STATUS_DOT.nn;

                return (
                  <tr
                    key={client.key}
                    onClick={() => onClientClick(client.key)}
                    className="group cursor-pointer bg-white transition-all hover:bg-panel-subtle/40"
                  >
                    <td className="py-3 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-main bg-panel-muted text-[10px] font-bold text-text-tertiary group-hover:border-accent group-hover:text-accent transition-colors">
                          {client.key.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors">{client.name}</div>
                          <div className="text-[11px] font-medium text-text-quaternary uppercase tracking-tight">PIC: {client.as}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-medium text-text-secondary">{client.ind}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2 rounded-md border border-border-main bg-white px-2 py-1 shadow-sm">
                        <span className="h-2 w-2 rounded-full" style={{ background: dotColor }} />
                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">{STATUS_LABEL[status]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-text-primary tabular-nums">{fRp(total.rev)}</td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-tertiary tabular-nums">{fRp(total.sp)}</td>
                    <td className="px-4 py-3">
                      <div className={cn(
                        "text-[13px] font-bold tabular-nums",
                        total.roas && total.roas > 2 ? "text-success" : total.roas && total.roas < 1 ? "text-danger" : "text-text-primary"
                      )}>
                        {total.roas ? `${total.roas.toFixed(2)}x` : '—'}
                      </div>
                    </td>
                    <td className="py-3 pl-4 pr-6 text-right">
                      <span className="inline-flex rounded-md bg-panel-subtle px-2 py-1 text-[11px] font-bold text-text-tertiary uppercase">
                        {client.cg}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <EmptyState
                    title="No results found"
                    description="Adjust your search or filters to see more results."
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
