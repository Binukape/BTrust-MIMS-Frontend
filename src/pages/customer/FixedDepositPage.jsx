import { Loading } from '../../components/ui/skeleton.jsx';
import PageHeader from '../../components/shared/PageHeader.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import FixedDepositManager from '../../components/shared/FixedDepositManager.jsx';
import { listAccounts } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';

export default function FixedDepositPage() {
  const { data, loading, error, reload } = useLoad(() => listAccounts(), []);

  return (
    <>
      <PageHeader title="Fixed Deposits" description="Open a Fixed Deposit, see its next interest payout, or close it early." />
      <Alert tone="error" className="mb-4">{error}</Alert>
      {loading && <Loading />}
      {data && <FixedDepositManager accounts={data} reloadAccounts={reload} />}
    </>
  );
}
