import { Loading } from '../../components/ui/skeleton.jsx';
import PageHeader from '../../components/shared/PageHeader.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import DepositWithdrawForm from '../../components/forms/DepositWithdrawForm.jsx';
import { listAccounts } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';

export default function DepositWithdrawPage() {
  const { data, loading, error, reload } = useLoad(() => listAccounts(), []);
  const active = (data || []).filter((a) => a.status === 'ACTIVE');

  return (
    <>
      <PageHeader title="Deposit / Withdraw" description="Daily withdrawal limit LKR 100,000 per account. Open 9:00 AM - 5:00 PM, every day." />
      <Alert tone="error" className="mb-4">{error}</Alert>
      <Card>
        <CardContent>
          {loading && <Loading />}
          {data && active.length === 0 && <Alert tone="info">You have no active accounts to transact on.</Alert>}
          {active.length > 0 && <DepositWithdrawForm accounts={active} defaultAccountId={active[0].account_id} onDone={reload} />}
        </CardContent>
      </Card>
    </>
  );
}
