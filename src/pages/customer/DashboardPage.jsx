import { Link } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { CardSkeleton } from '../../components/ui/skeleton.jsx';
import { Badge, StatusBadge } from '../../components/ui/badge.jsx';
import { listAccounts, getAccount } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { formatDate, formatMoney } from '../../lib/format.js';

async function loadDetailed() {
  const accounts = await listAccounts();
  return Promise.all(accounts.map((a) => getAccount(a.account_id)));
}

const pillLink = 'inline-flex h-8 items-center rounded-full px-4 text-[13px] font-medium no-underline transition-colors';

export default function DashboardPage() {
  const { data, loading, error } = useLoad(loadDetailed, []);

  return (
    <>
      <PageHeader title="My accounts" description="Your savings accounts, balances and Fixed Deposits." />
      <Alert tone="error" className="mb-6">{error}</Alert>
      {loading && <CardSkeleton />}
      {data && data.length === 0 && <Alert tone="info">You have no savings accounts yet. Please visit your agent to open one.</Alert>}
      <div className="grid gap-8 md:grid-cols-2">
        {(data || []).map((a, index) => {
          const fd = a.fixed_deposits.find((f) => f.status === 'ACTIVE');
          return (
            <Card key={a.account_id} style={{ '--i': index }}>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-[96px] w-[160px] shrink-0 flex-col justify-between rounded-2xl bg-mist p-4 shadow-glass">
                    <span className="eyebrow !text-[11px]">{a.plan_name}</span>
                    <span className="font-display text-[22px] font-medium leading-none tracking-wider text-skywash">{a.account_number.slice(-8)}</span>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div>
                  <div className="eyebrow !text-[11px]">Balance</div>
                  <div className="mt-1 whitespace-nowrap font-display text-[36px] font-medium leading-[1.15] text-white tabular-nums">LKR {formatMoney(a.balance)}</div>
                  <div className="mt-2 text-[13px] text-steel">
                    {a.account_number} - {a.holder_names} - {a.branch_name}
                  </div>
                  <div className="text-[13px] text-steel">Earns {Number(a.plan_rate)}% a year. Minimum balance LKR {formatMoney(a.minimum_balance)}.</div>
                </div>

                {fd ? (
                  <div className="rounded-2xl bg-mist px-5 py-4 shadow-edge">
                    <Badge tone="green">Active Fixed Deposit</Badge>
                    <div className="mt-2 font-medium text-white">LKR {formatMoney(fd.principal_amount)} at {Number(fd.interest_rate_snapshot)}%</div>
                    <div className="text-[13px] text-steel">Matures {formatDate(fd.maturity_date)} - next interest payout {formatDate(fd.next_payout_date)}</div>
                  </div>
                ) : (
                  <div className="text-[14px] text-steel">No active Fixed Deposit.</div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Link to="/customer/transact" className={`${pillLink} bg-mint text-white shadow-edge hover:bg-navy`} style={{ color: '#fff' }}>Deposit / Withdraw</Link>
                  <Link to="/customer/fixed-deposits" className={`${pillLink} text-ink shadow-edge hover:bg-mist`}>Fixed Deposits</Link>
                  <Link to="/customer/history" className={`${pillLink} text-ink shadow-edge hover:bg-mist`}>History</Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
