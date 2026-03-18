import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
            UPM
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">DRRM - IRS</p>
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
