import React from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
