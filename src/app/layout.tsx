import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UPM DRRM - IRS',
  description: 'UP Manila Disaster Risk Reduction Management - Incident Reporting System',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
