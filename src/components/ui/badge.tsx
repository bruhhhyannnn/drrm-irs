import React from 'react';
import { cn } from '@/lib';

type BadgeVariant = 'light' | 'solid';
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Color map updated to align with the mobile app palette:
 *   primary  → accentBlue  (#457B9D)
 *   success  → teal/green  (#2A9D8F)  — used for "training" category & "active" status
 *   warning  → amber       (#E9C46A)  — used for "drill" category & "upcoming" status
 *   error    → primaryRed  (#E63946)
 *   info     → infoCyan    (#4CC9F0)
 */
const colorMap = {
  light: {
    primary: 'bg-blue-50   text-blue-700   border border-blue-100   dark:bg-blue-500/10  dark:text-blue-400',
    success: 'bg-teal-50   text-teal-700   border border-teal-100   dark:bg-teal-500/10  dark:text-teal-400',
    error:   'bg-red-50    text-red-700    border border-red-100    dark:bg-red-500/10   dark:text-red-400',
    warning: 'bg-amber-50  text-amber-700  border border-amber-100  dark:bg-amber-500/10 dark:text-amber-400',
    info:    'bg-cyan-50   text-cyan-700   border border-cyan-100   dark:bg-cyan-500/10  dark:text-cyan-400',
    light:   'bg-gray-100  text-gray-600   border border-gray-200   dark:bg-white/5      dark:text-white/70',
    dark:    'bg-gray-800  text-white      border border-gray-700',
  },
  solid: {
    primary: 'bg-blue-600   text-white',
    success: 'bg-teal-600   text-white',
    error:   'bg-red-600    text-white',
    warning: 'bg-amber-400  text-white',
    info:    'bg-cyan-500   text-white',
    light:   'bg-gray-400   text-white',
    dark:    'bg-gray-700   text-white',
  },
};

export function Badge({
  variant = 'light',
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorMap[variant][color],
        className
      )}
    >
      {startIcon}
      {children}
      {endIcon}
    </span>
  );
}