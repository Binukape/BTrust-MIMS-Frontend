import { Loading } from '../../components/ui/skeleton.jsx';
import { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Field, Select } from '../../components/ui/input.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';
import { listAccounts } from '../../api/accountApi.js';
import { listTransactions } from '../../api/transactionApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { formatDateTime, formatMoney, titleCase } from '../../lib/format.js';

const CREDITS = ['DEPOSIT', 'SAVINGS_INTEREST_CREDIT', 'FD_INTEREST_CREDIT', 'FD_MATURITY_PAYOUT', 'FD_EARLY_CLOSURE_PAYOUT'];
const TYPES = ['DEPOSIT', 'WITHDRAWAL', 'SAVINGS_INTEREST_CREDIT', 'FD_INTEREST_CREDIT', 'FD_MATURITY_PAYOUT', 'FD_OPENING_DEBIT', 'FD_EARLY_CLOSURE_PAYOUT', 'FD_EARLY_CLOSURE_ADJUSTMENT'];

export function TransactionHistory({ accounts }) {
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const [applied, setApplied] = useState({ from: '', to: '' });

  const params = { account_id: accountId };
  if (applied.from) params.from = applied.from;
  if (applied.to) params.to = applied.to;
  if (type) params.type = type;

  const rows = useLoad(() => listTransactions(params), [accountId, type, applied.from, applied.to], { enabled: Boolean(accountId) });

  const columns = [
    { key: 'transaction_timestamp', label: 'Date and time', render: (r) => formatDateTime(r.transaction_timestamp) },
    { key: 'reference_number', label: 'Reference' },
    { key: 'transaction_type', label: 'Type', render: (r) => <Badge tone={CREDITS.includes(r.transaction_type) ? 'green' : 'amber'}>{titleCase(r.transaction_type)}</Badge> },
    { key: 'amount', label: 'Amount (LKR)', align: 'right', render: (r) => `${CREDITS.includes(r.transaction_type) ? '+' : '-'} ${formatMoney(r.amount)}` },
    { key: 'agent_name', label: 'Processed by', render: (r) => r.agent_name || 'Self-service / system' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Account" htmlFor="h-account">
              <Select id="h-account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                <option value="">Select an account</option>
                {accounts.map((a) => <option key={a.account_id} value={a.account_id}>{a.account_number} - {a.holder_names}</option>)}
              </Select>
            </Field>
            <Field label="Type" htmlFor="h-type">
              <Select id="h-type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                {TYPES.map((t) => <option key={t} value={t}>{titleCase(t)}</option>)}
              </Select>
            </Field>
          </div>
          <DateRangeFilter from={range.from} to={range.to} onChange={setRange} onApply={() => setApplied({ ...range })}
            onClear={() => { setRange({ from: '', to: '' }); setApplied({ from: '', to: '' }); }} />
        </CardContent>
      </Card>
      <Alert tone="error">{rows.error}</Alert>
      {accountId && (
        <Card>
          <CardContent>
            <DataTable columns={columns} rows={rows.data} loading={rows.loading} empty="No transactions match your filters." searchable searchPlaceholder="Search by reference or type..." rowKey="transaction_id" />
            <p className="mt-2 text-[13px] text-steel">Shows the latest 500 matching transactions.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TransactionHistoryPage() {
  const { data, loading, error } = useLoad(() => listAccounts(), []);
  return (
    <>
      <PageHeader title="Transaction history" description="Every deposit, withdrawal, interest credit and Fixed Deposit movement on your accounts." />
      <Alert tone="error" className="mb-4">{error}</Alert>
      {loading && <Loading />}
      {data && <TransactionHistory accounts={data} />}
    </>
  );
}
