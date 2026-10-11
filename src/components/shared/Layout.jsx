import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../ui/button.jsx';
import { cn } from '../../lib/utils.js';

const NAV = {
  customer: [
    { to: '/customer', label: 'My accounts', end: true },
    { to: '/customer/transact', label: 'Deposit / Withdraw' },
    { to: '/customer/fixed-deposits', label: 'Fixed Deposits' },
    { to: '/customer/history', label: 'History' },
  ],
  agent: [
    { to: '/agent', label: 'My customers', end: true },
    { to: '/agent/register', label: 'Register & open account' },
    { to: '/agent/transact', label: 'Transactions' },
    { to: '/agent/fixed-deposits', label: 'Fixed Deposits' },
    { to: '/agent/reports', label: 'Reports' },
  ],
  admin: [
    { to: '/admin', label: 'Branches', end: true },
    { to: '/admin/agents', label: 'Agents' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/audit', label: 'Audit log' },
  ],
};

const ROLE_LABEL = { customer: 'Customer', agent: 'Agent', admin: 'Administrator' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  function signOut() {
    setLeaving(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 380);
  }

  return (
    <div className={cn('min-h-screen transition-[opacity,filter,transform] duration-[380ms] ease-in', leaving && 'pointer-events-none -translate-y-2 opacity-0 blur-sm')}>
      <header className="animate-portal-fade sticky top-0 z-40 border-b border-mint bg-canvas/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
          <span className="font-display text-[26px] font-medium leading-none text-skywash">B-Trust</span>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:w-auto" aria-label="Main">
            {NAV[user.role].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors',
                    isActive ? 'bg-mint text-white shadow-edge' : 'text-steel hover:bg-mist hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-[14px] font-medium text-white">{user.name}</div>
              <div className="eyebrow !text-[11px]">{ROLE_LABEL[user.role]}</div>
            </div>
            <Button onClick={signOut}>
              <LogOut size={15} /> Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-14">
        <Outlet />
      </main>
    </div>
  );
}
