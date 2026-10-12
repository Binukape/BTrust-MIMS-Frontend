import { cn } from '../../lib/utils.js';

const tones = {
  green: 'bg-mint text-ink',
  amber: 'bg-transparent text-fog shadow-edge-strong',
  slate: 'bg-mist text-steel shadow-edge',
  blue: 'bg-mist text-ice shadow-edge',
  red: 'bg-transparent text-coral shadow-[inset_0_0_0_1px_rgb(228_109_76/0.45)]',
};

export function Badge({ tone = 'slate', className, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium leading-none', tones[tone], className)}
      {...props}
    />
  );
}

export function StatusBadge({ status }) {
  const tone = { ACTIVE: 'green', DORMANT: 'amber', CLOSED: 'slate', MATURED: 'blue' }[status] || 'slate';
  return <Badge tone={tone}>{status}</Badge>;
}
