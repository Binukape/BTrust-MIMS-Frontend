import { cn } from '../../lib/utils.js';

const fieldClass =
  'flex h-11 w-full rounded-md bg-mist px-3 text-[15px] text-white shadow-edge placeholder:text-fog/60 focus-visible:outline-none focus-visible:shadow-edge-strong disabled:cursor-not-allowed disabled:opacity-50';

export function Input({ className, ...props }) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(fieldClass, 'pr-8', className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('mb-2 block text-[14px] font-medium text-fog', className)} {...props}>
      {children}
    </label>
  );
}

export function Field({ label, htmlFor, hint, children, className }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && <p className="mt-2 text-[12px] leading-snug text-steel">{hint}</p>}
    </div>
  );
}
