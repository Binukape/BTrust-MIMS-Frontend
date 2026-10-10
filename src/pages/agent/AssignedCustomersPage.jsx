import { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Button } from '../../components/ui/button.jsx';
import { StatusBadge } from '../../components/ui/badge.jsx';
import { ConfirmDialog } from '../../components/ui/dialog.jsx';
import { listCustomers } from '../../api/customerApi.js';
import { listAccounts, changeAccountStatus, closeAccount } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { errorMessage } from '../../lib/utils.js';
import { formatDate, formatMoney } from '../../lib/format.js';

export default function AssignedCustomersPage() {
  const customers = useLoad(() => listCustomers(), []);
  const [selected, setSelected] = useState(null);
  const accounts = useLoad(() => listAccounts({ customer_id: selected.customer_id }), [selected?.customer_id], { enabled: Boolean(selected) });
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ tone: '', text: '' });

  async function runAction() {
    setBusy(true);
    try {
      if (action.kind === 'CLOSED') await closeAccount(action.account.account_id);
      else await changeAccountStatus(action.account.account_id, action.kind);
      setMessage({ tone: 'success', text: `Account ${action.account.account_number} is now ${action.kind}.` });
      accounts.reload();
    } catch (err) {
      setMessage({ tone: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
      setAction(null);
    }
  }

  const customerColumns = [
    { key: 'full_name', label: 'Name' },
    { key: 'nic_number', label: 'NIC' },
    { key: 'phone', label: 'Phone' },
    { key: 'date_of_birth', label: 'Date of birth', render: (r) => formatDate(r.date_of_birth) },
    { key: 'username', label: 'Username' },
    { key: 'account_count', label: 'Accounts', align: 'right' },
  ];

  const accountColumns = [
    { key: 'account_number', label: 'Account' },
    { key: 'plan_name', label: 'Plan' },
    { key: 'holder_names', label: 'Holder(s)' },
    { key: 'balance', label: 'Balance (LKR)', align: 'right', render: (r) => formatMoney(r.balance) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'active_fd_id', label: 'Active FD', render: (r) => (r.active_fd_id ? `FD #${r.active_fd_id}` : '-') },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          {r.status === 'ACTIVE' && <Button size="sm" variant="outline" onClick={() => setAction({ account: r, kind: 'DORMANT' })}>Mark dormant</Button>}
          {r.status === 'DORMANT' && <Button size="sm" variant="outline" onClick={() => setAction({ account: r, kind: 'ACTIVE' })}>Reactivate</Button>}
          {r.status !== 'CLOSED' && <Button size="sm" variant="ghost" className="text-coral" onClick={() => setAction({ account: r, kind: 'CLOSED' })}>Close</Button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My customers" description="Only customers assigned to you are shown. Select a customer to see and manage their accounts." />
      <Alert tone="error" className="mb-4">{customers.error}</Alert>
      <Card>
        <CardContent>
          <DataTable columns={customerColumns} rows={customers.data} loading={customers.loading} searchable searchPlaceholder="Search name, NIC or username..."
            rowKey="customer_id" onRowClick={(r) => { setSelected(r); setMessage({ tone: '', text: '' }); }} selectedKey={selected?.customer_id} empty="No customers assigned to you yet." />
        </CardContent>
      </Card>

      {selected && (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>{selected.full_name} - accounts</CardTitle>
            <CardDescription>Dormant and closed accounts cannot take deposits or withdrawals. An account with an active Fixed Deposit cannot be made dormant or closed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert tone={message.tone || 'info'}>{message.text}</Alert>
            <Alert tone="error">{accounts.error}</Alert>
            <DataTable columns={accountColumns} rows={accounts.data} loading={accounts.loading} rowKey="account_id" empty="This customer has no accounts yet." />
          </CardContent>
        </Card>
      )}

      <ConfirmDialog open={Boolean(action)} title={action ? `${action.kind === 'CLOSED' ? 'Close' : action.kind === 'DORMANT' ? 'Mark dormant' : 'Reactivate'} account ${action.account.account_number}?` : ''}
        confirmLabel="Yes, continue" destructive={action?.kind === 'CLOSED'} busy={busy} onConfirm={runAction} onClose={() => setAction(null)}>
        <p className="text-[14px] text-steel">
          {action?.kind === 'CLOSED' ? 'A closed account cannot be reopened. Its history is kept permanently.' : action?.kind === 'DORMANT' ? 'The account will stop accepting transactions and interest until it is reactivated.' : 'The account will accept transactions and earn interest again.'}
        </p>
      </ConfirmDialog>
    </>
  );
}
