import React from 'react';
import { cn } from '@/lib';

/**
 * Table — styled to match the mobile app's clean card surfaces:
 *  • rounded-2xl container with soft border & shadow
 *  • warm gray header (matches _surfaceGray #F1F5F9)
 *  • red-tinted hover rows (matches mobile list-item hover feel)
 *  • generous padding & clear typographic hierarchy
 */

export function Table({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <table className={cn('w-full border-collapse', className)}>{children}</table>
      </div>
    </div>
  );
}

export function TableHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={cn(
        'border-b-2 border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/3',
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tbody className={cn('divide-y divide-gray-50 dark:divide-white/5', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        'transition-colors duration-150 hover:bg-red-50/40 dark:hover:bg-white/2',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'px-5 py-4 text-sm text-gray-600 dark:text-gray-300',
        className
      )}
    >
      {children}
    </td>
  );
}