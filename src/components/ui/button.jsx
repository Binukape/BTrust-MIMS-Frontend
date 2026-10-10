import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-[background-color,box-shadow,color,transform,opacity,filter] duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-edge-strong disabled:pointer-events-none disabled:opacity-45 cursor-pointer whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'rounded-full bg-mist text-white shadow-edge hover:bg-mint',
        outline: 'rounded-full bg-transparent text-ink shadow-edge hover:bg-mist',
        ghost: 'rounded-full text-ink hover:bg-mist',
        destructive: 'rounded-full bg-transparent text-coral shadow-[inset_0_0_0_1px_rgb(228_109_76/0.45)] hover:bg-mist',
        subtle: 'rounded-full bg-mist text-ink hover:bg-mint',
        violet: 'rounded-md bg-violet text-white hover:brightness-110',
      },
      size: {
        default: 'h-10 px-5 text-[14px]',
        sm: 'h-8 px-4 text-[13px]',
        icon: 'h-9 w-9 text-[14px]',
        form: 'h-11 px-6 text-[15px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export function Button({ className, variant, size, type = 'button', ...props }) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
