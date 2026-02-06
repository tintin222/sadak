'use client';

import { createContext, useContext } from 'react';

export interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  tierName: string;
  currency: string;
}

// This UUID will be inserted into the users table via seed SQL
const DEMO_USER: DemoUser = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  firstName: 'Efe',
  lastName: 'Yilmaz',
  email: 'efe@demo.sadak.app',
  phone: '+905551234567',
  companyName: 'Denizbank',
  tierName: 'Gold',
  currency: 'EUR',
};

const DemoUserContext = createContext<DemoUser>(DEMO_USER);

export function DemoUserProvider({ children }: { children: React.ReactNode }) {
  return (
    <DemoUserContext.Provider value={DEMO_USER}>
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  return useContext(DemoUserContext);
}
