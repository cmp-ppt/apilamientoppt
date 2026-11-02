import React, { createContext, useContext } from 'react';
import { useAcopioStore } from '../hooks/useAcopioStore';

const AcopioContext = createContext(null);

export function AcopioProvider({ children, accessToken, userEmail, userName }) {
  const store = useAcopioStore(accessToken, userEmail, userName);
  return <AcopioContext.Provider value={store}>{children}</AcopioContext.Provider>;
}

export function useAcopio() {
  const ctx = useContext(AcopioContext);
  if (!ctx) throw new Error('useAcopio must be used within AcopioProvider');
  return ctx;
}
