import React, { forwardRef } from 'react';
import { cn } from '@/lib';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  success?: boolean;
  hint?: string;
}

/**
 * Input — updated to match the mobile app's clean, rounded text field style:
 *  • rounded-xl border (matches 14px radius in Flutter)
 *  • focus ring uses red-600 (#E63946) primary color
 *  • soft gray fill for the idle state (_surfaceGray #F1F5F9)
 *  • teal success, red error — aligned with mobile palette
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, className, id, required, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          required={required}
          className={cn(
            // Base
            'h-11 w-full rounded-xl border-2 px-4 py-2.5 text-sm shadow-sm transition-all duration-150',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2',
            'dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',

            // State variants
            error
              ? [
                  'border-red-300 bg-red-50 text-red-800',
                  'focus:border-red-400 focus:ring-red-100',
                  'dark:border-red-500 dark:bg-red-900/20 dark:text-red-300',
                ]
              : success
              ? [
                  'border-teal-300 bg-teal-50 text-teal-800',
                  'focus:border-teal-400 focus:ring-teal-100',
                  'dark:border-teal-500 dark:bg-teal-900/20 dark:text-teal-300',
                ]
              : [
                  'border-gray-200 bg-gray-50 text-gray-800',
                  'hover:border-gray-300',
                  'focus:border-red-300 focus:bg-white focus:ring-red-100',
                  'dark:border-gray-700 dark:bg-gray-900 dark:focus:border-red-800',
                ],

            // Disabled
            props.disabled && 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:bg-gray-800',

            className
          )}
          {...props}
        />

        {hint && (
          <p
            className={cn(
              'mt-1.5 text-xs font-medium',
              error ? 'text-red-500' : success ? 'text-teal-600' : 'text-gray-400'
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';