import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageBreadcrumbProps {
  pageTitle: string;
}

export function PageBreadcrumb({ pageTitle }: PageBreadcrumbProps) {
  return (
    <div className="mb-2 flex flex-col flex-wrap justify-between gap-2">
      {/* Title */}
      <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white/90">
        {pageTitle}
      </h2>

      {/* Breadcrumb trail */}
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Home size={11} />
              Home
            </Link>
          </li>
          <li className="text-gray-300 dark:text-white/20">
            <ChevronRight size={12} />
          </li>
          <li>
            <span className="px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
              {pageTitle}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
}