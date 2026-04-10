import { Suspense } from 'react';
import { SignInForm } from '@/components/auth';

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="absolute inset-0">
        <img
          src="/upm-drrmh-background.jpg"
          alt="UP Manila DRRM-H Background"
          className="absolute h-full w-full object-cover"
        />
        <div className="bg-brand-900/60 absolute h-full w-full" />
      </div>
      <div className="shadow-theme-md z-1 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <img
            src="/upm-logo.png"
            alt="UP Manila Logo"
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          />
          <div className="hidden h-10 w-px bg-gray-200 sm:block dark:bg-gray-700" />
          <img
            src="/upm-drrmh-logo.png"
            alt="DRRM-H Logo"
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          />
          <div className="hidden h-10 w-px bg-gray-200 sm:block dark:bg-gray-700" />
          <img
            src="/irs-favicon.png"
            alt="DRRM-H Logo"
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">DRRM-H - IRS</p>
            <p className="text-xs text-gray-500">Incident Reporting System</p>
          </div>
        </div>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
