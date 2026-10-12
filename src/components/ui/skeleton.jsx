import { cn } from '../../lib/utils.js';

export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function Loading({ rows = 3 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-5" style={{ width: `${88 - i * 14}%`, animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 2 }) {
  return (
    <div className="grid gap-8 md:grid-cols-2" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-glass p-6 shadow-glass">
          <Skeleton className="h-[96px] w-[160px] rounded-2xl" />
          <Skeleton className="mt-6 h-4 w-20" />
          <Skeleton className="mt-3 h-9 w-56" />
          <Skeleton className="mt-4 h-4 w-3/4" />
          <div className="mt-6 flex gap-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
