import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const outfit = Outfit({ subsets: ['latin'] });

  title: 'UPM DRRM-H IRS',
  description: 'UP Manila Disaster Risk Reduction Management in Health Incident Reporting System',
>>>>>>> Stashed changes
=======
export const metadata: Metadata = {
  title: 'UPM DRRM-H IRS',
  description: 'UP Manila Disaster Risk Reduction Management in Health Incident Reporting System',
=======
  title: 'UPM DRRM-H IRS',
  description: 'UP Manila Disaster Risk Reduction Management in Health Incident Reporting System',
>>>>>>> Stashed changes
  icons: {
    icon: '/irs-logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
