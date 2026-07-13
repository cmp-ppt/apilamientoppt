import React, { createContext, useContext } from 'react';
import { useAcopioStore } from '../hooks/useAcopioStore';

const AcopioContext = createContext(null);

export function AcopioProvider({ children }) {
  const store = useAcopioStore();
  return <AcopioContext.Provider value={store}>{children}</AcopioContext.Provider>;
}

export function useAcopio() {
  const ctx = useContext(AcopioContext);
  if (!ctx) throw new Error('useAcopio must be used within AcopioProvider');
  return ctx;
}
