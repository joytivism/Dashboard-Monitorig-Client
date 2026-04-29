'use client';

import React, { createContext, useContext } from 'react';
import type { Client, DataEntry, ActivityEntry } from '@/lib/data';

interface DataContextType {
  CLIENTS: Client[];
  DATA: DataEntry[];
  ACTIVITY: ActivityEntry[];
  PERIODS: string[];
  PL: Record<string, string>;
}

const DataContext = createContext<DataContextType>({
  CLIENTS: [],
  DATA: [],
  ACTIVITY: [],
  PERIODS: [],
  PL: {},
});

export const useDashboardData = () => useContext(DataContext);

export function DataProvider({ children, value }: { children: React.ReactNode, value: DataContextType }) {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
