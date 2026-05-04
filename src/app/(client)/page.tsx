'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import StatusBanners from '@/components/dashboard/StatusBanners';
import ClientTable from '@/components/dashboard/ClientTable';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import MetricCard from '@/components/ui/MetricCard';
import SelectField from '@/components/ui/SelectField';
import { clientWorst, fRp, pct as getPct, totals } from '@/lib/utils';

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, CH_DEF, PL } = useDashboardData();
  const curPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cg: '', ind: '', pic: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'status', direction: 'asc' });

  const prevIdx = PERIODS.indexOf(curPeriod) - 1;
  const prevPeriod = prevIdx >= 0 ? PERIODS[prevIdx] : '';

  const metadata = useMemo(
    () => ({
      industries: Array.from(new Set(CLIENTS.map((client) => client.ind))).filter((item) => item !== '—').sort(),
      pics: Array.from(new Set(CLIENTS.map((client) => client.as))).filter((item) => item !== '—').sort(),
      channelGroups: Array.from(new Set(CLIENTS.map((client) => client.cg))).filter((item) => item && item !== '—').sort(),
    }),
    [CLIENTS]
  );

  const { tRev, tSp, pRev, pSp } = useMemo(() => {
    let totalRevenue = 0;
    let totalSpend = 0;
    let previousRevenue = 0;
    let previousSpend = 0;

    CLIENTS.forEach((client) => {
      const current = totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod);
      const previous = totals(CH_DEF, CLIENTS, DATA, client.key, prevPeriod);
      totalRevenue += current.rev;
      totalSpend += current.sp;
      previousRevenue += previous.rev;
      previousSpend += previous.sp;
    });

    return { tRev: totalRevenue, tSp: totalSpend, pRev: previousRevenue, pSp: previousSpend };
  }, [CH_DEF, CLIENTS, DATA, curPeriod, prevPeriod]);

  const aRoas = tSp > 0 ? tRev / tSp : null;
  const paRoas = pSp > 0 ? pRev / pSp : null;

  const risks = useMemo(
    () =>
      CLIENTS.filter((client) => ['rr', 'or'].includes(clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, curPeriod))).map((client) => ({
        key: client.key,
        rev: totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod).rev,
        growth: getPct(
          totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod).rev,
          totals(CH_DEF, CLIENTS, DATA, client.key, prevPeriod).rev
        ),
      })),
    [CH_DEF, CLIENTS, DATA, PERIODS, curPeriod, prevPeriod]
  );

  const topGrowth = useMemo(
    () =>
      CLIENTS.map((client) => {
        const current = totals(CH_DEF, CLIENTS, DATA, client.key, curPeriod);
        const previous = totals(CH_DEF, CLIENTS, DATA, client.key, prevPeriod);
        return { key: client.key, rev: current.rev, growth: getPct(current.rev, previous.rev) || 0 };
      })
        .filter((client) => client.growth > 0)
        .sort((left, right) => right.growth - left.growth)
        .slice(0, 3),
    [CH_DEF, CLIENTS, DATA, curPeriod, prevPeriod]
  );

  const filteredClients = useMemo(() => {
    return [...CLIENTS]
      .filter((client) => {
        const matchesSearch = !search || client.key.toLowerCase().includes(search.toLowerCase()) || client.ind.toLowerCase().includes(search.toLowerCase());
        const matchesIndustry = !filters.ind || client.ind === filters.ind;
        const matchesPIC = !filters.pic || client.as === filters.pic;
        const matchesCG = !filters.cg || client.cg === filters.cg;
        return matchesSearch && matchesIndustry && matchesPIC && matchesCG;
      })
      .sort((left, right) => {
        const { key, direction } = sortConfig;
        let valueA: string | number = '';
        let valueB: string | number = '';

        if (key === 'status') {
          const order = ['rr', 'or', 'yy', 'nn', 'gg', 'gd'];
          valueA = order.indexOf(clientWorst(CH_DEF, [left], DATA, PERIODS, left.key, curPeriod));
          valueB = order.indexOf(clientWorst(CH_DEF, [right], DATA, PERIODS, right.key, curPeriod));
        } else if (key === 'rev' || key === 'sp' || key === 'roas') {
          const totalA = totals(CH_DEF, CLIENTS, DATA, left.key, curPeriod);
          const totalB = totals(CH_DEF, CLIENTS, DATA, right.key, curPeriod);
          valueA = totalA[key as 'rev' | 'sp' | 'roas'] || 0;
          valueB = totalB[key as 'rev' | 'sp' | 'roas'] || 0;
        } else {
          valueA = (left as unknown as Record<string, string | number>)[key] || '';
          valueB = (right as unknown as Record<string, string | number>)[key] || '';
        }

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [CH_DEF, CLIENTS, DATA, PERIODS, curPeriod, filters, search, sortConfig]);

  const onClientClick = (key: string) => {
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    router.push(`/client/${key}${qs}`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 pb-20 animate-fade-in pt-4">
      <PageIntro
        isCard
        eyebrow="Portfolio Analytics"
        title="Portfolio performance overview"
        description="Monitor revenue trends, advertising efficiency, and account health across your entire portfolio in one unified workspace."
        meta={(
          <div className="flex items-center gap-2">
            <Badge tone="success" style="soft" className="px-3 py-1 text-[11px] font-bold">Live</Badge>
            <span className="text-[11px] font-bold text-text-quaternary uppercase tracking-widest ml-2">System Status: Stable</span>
          </div>
        )}
        actions={(
          <div className="w-full sm:w-[240px]">
            <SelectField
              aria-label="Pilih periode"
              icon={Calendar}
              options={PERIODS.map((period) => ({ value: period, label: PL[period] || period }))}
              value={curPeriod}
              onChange={(event) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('period', event.target.value);
                router.push(`?${params.toString()}`);
              }}
              className="bg-white/50 backdrop-blur-sm shadow-sm"
            />
          </div>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-text-tertiary uppercase tracking-widest">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Active Clients" value={CLIENTS.length} icon={Users} caption={`Current active portfolio`} />
          <MetricCard title="Total Revenue" value={fRp(tRev)} icon={DollarSign} trend={getPct(tRev, pRev)} caption={`vs last period (${fRp(pRev)})`} tone="accent" />
          <MetricCard title="Blended ROAS" value={aRoas ? `${aRoas.toFixed(2)}x` : '—'} icon={TrendingUp} trend={paRoas && aRoas ? ((aRoas - paRoas) / paRoas) * 100 : null} caption={`Portfolio efficiency`} tone="success" />
          <MetricCard title="Total Ad Spend" value={fRp(tSp)} icon={CreditCard} trend={getPct(tSp, pSp)} caption={`Marketing investment`} />
        </div>
      </div>

      <StatusBanners risks={risks} opportunities={topGrowth} onClientClick={onClientClick} />

      <ClientTable
        clients={filteredClients}
        data={DATA}
        periods={PERIODS}
        currentPeriod={curPeriod}
        onClientClick={onClientClick}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilter={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))}
        sortConfig={sortConfig}
        onSort={(key) =>
          setSortConfig((previous) => ({
            key,
            direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc',
          }))
        }
        metadata={metadata}
      />
    </div>
  );
}

export default function OverviewPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-sm font-medium text-text3">Memuat data dashboard...</div>}>
      <OverviewContent />
    </React.Suspense>
  );
}
