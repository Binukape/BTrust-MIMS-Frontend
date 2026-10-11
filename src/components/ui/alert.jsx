import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';

const styles = {
  error: { box: 'bg-coral/10 shadow-[inset_0_0_0_1px_rgb(228_109_76/0.45)]', icon: AlertCircle, iconClass: 'text-coral' },
  success: { box: 'bg-mint shadow-edge', icon: CheckCircle2, iconClass: 'text-ice' },
  info: { box: 'bg-mist shadow-edge', icon: Info, iconClass: 'text-fog' },
  warning: { box: 'bg-transparent shadow-edge-strong', icon: AlertCircle, iconClass: 'text-coral' },
};

export function Alert({ tone = 'info', children, className }) {
  if (!children) return null;
  const { box, icon: Icon, iconClass } = styles[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('animate-alert flex items-start gap-3 rounded-[10px] px-4 py-3 text-[14px] text-ink', box, className)}>
      <Icon size={18} className={cn('mt-0.5 shrink-0', iconClass)} />
      <div className="leading-snug">{children}</div>
    </div>
  );
}
