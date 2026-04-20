import Image from 'next/image';

export function AuthHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0">
        <Image
          src="/upm-drrmh-background.jpg"
          alt="UP Manila DRRM-H Background"
          fill
          className="object-cover"
          priority
        />
        <div className="bg-brand-900/60 absolute inset-0" />
      </div>
      <div className="shadow-theme-md z-1 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Image
            src="/up-logo.png"
            alt="UP Manila Logo"
            width={64}
            height={64}
            className="object-contain sm:h-16 sm:w-16"
          />
          <div className="hidden h-10 w-px bg-gray-200 sm:block dark:bg-gray-700" />
          <Image
            src="/upm-drrmh-logo.png"
            alt="DRRM-H Logo"
            width={64}
            height={64}
            sizes="64px"
            className="object-contain"
          />
          <div className="hidden h-10 w-px bg-gray-200 sm:block dark:bg-gray-700" />
          <Image
            src="/irs-favicon.png"
            alt="IRS Logo"
            width={64}
            height={64}
            sizes="64px"
            className="object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">DRRM-H - IRS</p>
            <p className="text-xs text-gray-500">Incident Reporting System</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
