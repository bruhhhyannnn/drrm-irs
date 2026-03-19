import { cn } from '@/lib';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'sm', center = false, className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'border-brand-500 animate-spin rounded-full border-4 border-t-transparent',
        center ? 'mx-auto' : '',
        sizeMap[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Spinner size="md" />
    </div>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <p className="text-error-500 text-sm">{message}</p>
    </div>
  );
}
