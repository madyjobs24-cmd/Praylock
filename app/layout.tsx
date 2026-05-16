import type { Metadata } from 'next';
import './globals.css';
import { MobileShell } from '@/components/layout/MobileShell';
import { Providers } from '@/context/Providers';

export const metadata: Metadata = {
  title: 'PrayLock',
  description: 'Ne laisse plus jamais l\'heure de prière passer',
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
          <MobileShell>
            {children}
          </MobileShell>
        </Providers>
      </body>
    </html>
  );
}
