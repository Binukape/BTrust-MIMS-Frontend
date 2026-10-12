import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return <div className={cn('animate-card rounded-2xl bg-glass shadow-glass', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1 border-b border-mint px-6 py-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('font-display text-[24px] font-medium leading-[1.17] tracking-[-0.01em] text-ice', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-[14px] leading-snug text-steel', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-6 py-6', className)} {...props} />;
}
