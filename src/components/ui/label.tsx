import { forwardRef } from 'react';
import { cn } from '@/lib';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-error-500 ml-0.5">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
