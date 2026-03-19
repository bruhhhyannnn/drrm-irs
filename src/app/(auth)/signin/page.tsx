import { Suspense } from 'react';
import { SignInForm } from '@/components/auth';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="shadow-theme-md w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white">
            UPM
          </div>
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
