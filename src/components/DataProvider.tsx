'use client';

import React, { createContext, useContext } from 'react';
import type { DashboardData } from '@/lib/data';

const DataContext = createContext<DashboardData>({
  CLIENTS: [],
  DATA: [],
  ACTIVITY: [],
  PERIODS: [],
  PL: {},
  AI_LOGS: [],
  CH_DEF: {},
});

export const useDashboardData = () => useContext(DataContext);

export function DataProvider({ children, value }: { children: React.ReactNode, value: DashboardData }) {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
