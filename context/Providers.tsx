'use client';

import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { PrayerProvider } from './PrayerContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <PrayerProvider>
        {children}
      </PrayerProvider>
    </UserProvider>
  );
}
