'use client';

import React, { createContext, useContext } from 'react';
import type { Client, DataEntry, ActivityEntry } from '@/lib/data';

interface DataContextType {
  CLIENTS: Client[];
  DATA: DataEntry[];
  ACTIVITY: ActivityEntry[];
  PERIODS: string[];
  PL: Record<string, string>;
  AI_LOGS: any[];
  CH_DEF: Record<string, any>;
}

const DataContext = createContext<DataContextType>({
  CLIENTS: [],
  DATA: [],
  ACTIVITY: [],
  PERIODS: [],
  PL: {},
  AI_LOGS: [],
  CH_DEF: {},
});

export const useDashboardData = () => useContext(DataContext);

export function DataProvider({ children, value }: { children: React.ReactNode, value: DataContextType }) {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
