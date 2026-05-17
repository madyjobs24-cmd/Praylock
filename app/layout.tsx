import type { Metadata } from 'next';
import './globals.css';
import { MobileShell } from '@/components/layout/MobileShell';
import { Providers } from '@/context/Providers';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

import type { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'PrayLock',
  description: 'Ne laisse plus jamais l\'heure de prière passer',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrayLock',
  },
};

export const viewport: Viewport = {
  themeColor: '#d4af37',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ServiceWorkerRegister />
          <MobileShell>
            {children}
          </MobileShell>
        </Providers>
      </body>
    </html>
  );
}
