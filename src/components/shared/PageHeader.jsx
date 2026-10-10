import { useAuth } from '../../context/AuthContext.jsx';

const PORTAL = { customer: 'Customer portal', agent: 'Agent portal', admin: 'Administration' };

export default function PageHeader({ title, description, actions }) {
  const { user } = useAuth();
  return (
    <div className="animate-item mb-12 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <div className="eyebrow mb-4 flex items-center gap-4">
          <span>{PORTAL[user?.role] || 'B-Trust'}</span>
          <span className="h-px w-16 bg-gradient-to-r from-mint to-transparent" aria-hidden="true" />
        </div>
        <h1 className="font-display text-[44px] font-medium leading-[1.16] text-skywash">{title}</h1>
        {description && <p className="mt-4 text-[17px] leading-snug text-fog">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
