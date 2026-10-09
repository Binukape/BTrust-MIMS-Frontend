import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { StatusBadge } from '../ui/badge.jsx';
import { ConfirmDialog } from '../ui/dialog.jsx';
import { Field, Select } from '../ui/input.jsx';
import DataTable from './DataTable.jsx';
import OpenFDForm from '../forms/OpenFDForm.jsx';
import { listFixedDeposits, earlyClosurePreview, closeFixedDepositEarly } from '../../api/fixedDepositApi.js';
import { listFdPlans } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { errorMessage } from '../../lib/utils.js';
import { formatDate, formatMoney } from '../../lib/format.js';

export default function FixedDepositManager({ accounts, reloadAccounts }) {
  const [accountId, setAccountId] = useState('');
  const [closing, setClosing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ tone: '', text: '' });

  const account = accounts.find((a) => String(a.account_id) === accountId);
  const plans = useLoad(() => listFdPlans(), []);
  const fds = useLoad(() => listFixedDeposits(accountId), [accountId], { enabled: Boolean(accountId) });

  const active = (fds.data || []).find((f) => f.status === 'ACTIVE');

  async function askClose(fd) {
    setMessage({ tone: '', text: '' });
    try {
      setPreview(await earlyClosurePreview(fd.fd_id));
      setClosing(fd);
    } catch (err) {
      setMessage({ tone: 'error', text: errorMessage(err) });
    }
  }

  async function confirmClose() {
    setBusy(true);
    try {
      const result = await closeFixedDepositEarly(closing.fd_id);
      setMessage({ tone: 'success', text: `Fixed Deposit closed. Penalty LKR ${formatMoney(result.penalty_charged)}; LKR ${formatMoney(result.net_amount_credited)} was credited to the savings account.` });
      setClosing(null);
      fds.reload();
      reloadAccounts?.();
    } catch (err) {
      setMessage({ tone: 'error', text: errorMessage(err) });
      setClosing(null);
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    { key: 'fd_id', label: 'FD' },
    { key: 'tenure_months', label: 'Tenure', render: (r) => `${r.tenure_months} months` },
    { key: 'principal_amount', label: 'Principal (LKR)', align: 'right', render: (r) => formatMoney(r.principal_amount) },
    { key: 'interest_rate_snapshot', label: 'Rate', align: 'right', render: (r) => `${Number(r.interest_rate_snapshot)}%` },
    { key: 'start_date', label: 'Opened', render: (r) => formatDate(r.start_date) },
    { key: 'maturity_date', label: 'Matures', render: (r) => formatDate(r.maturity_date) },
    { key: 'next_payout_date', label: 'Next payout', render: (r) => (r.status === 'ACTIVE' ? formatDate(r.next_payout_date) : '-') },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', label: '', render: (r) => (r.status === 'ACTIVE'
        ? <Button size="sm" variant="outline" onClick={() => askClose(r)}>Close early</Button>
        : null),
    },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent>
          <Field label="Savings account" htmlFor="fd-account">
            <Select id="fd-account" value={accountId} onChange={(e) => { setAccountId(e.target.value); setMessage({ tone: '', text: '' }); }}>
              <option value="">Select an account</option>
              {accounts.map((a) => <option key={a.account_id} value={a.account_id}>{a.account_number} - {a.holder_names} ({a.status})</option>)}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Alert tone={message.tone || 'info'}>{message.text}</Alert>

      {account && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Fixed Deposits on {account.account_number}</CardTitle>
              <CardDescription>Only one Fixed Deposit can be active on an account at a time.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert tone="error" className="mb-3">{fds.error}</Alert>
              <DataTable columns={columns} rows={fds.data} loading={fds.loading} empty="No Fixed Deposits on this account yet." rowKey="fd_id" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open a Fixed Deposit</CardTitle>
              <CardDescription>
                {active ? 'This account already has an active Fixed Deposit. Close or wait for it to mature before opening another.'
                  : account.status !== 'ACTIVE' ? 'A Fixed Deposit needs an ACTIVE savings account.'
                    : 'The amount is moved out of the savings balance and returned, with interest paid monthly, at maturity.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!active && account.status === 'ACTIVE' && plans.data && (
                <OpenFDForm key={account.account_id} account={account} plans={plans.data} onDone={() => { fds.reload(); reloadAccounts?.(); }} />
              )}
            </CardContent>
          </Card>
        </>
      )}

      <ConfirmDialog open={Boolean(closing)} title="Close Fixed Deposit early?" confirmLabel="Close early" destructive busy={busy} onConfirm={confirmClose} onClose={() => setClosing(null)}>
        {preview && (
          <div className="space-y-2 text-[14px]">
            <p>Closing before maturity costs a flat penalty of {preview.penalty_days} days of interest.</p>
            <div className="rounded-2xl bg-mist p-3">
              <div className="flex justify-between"><span>Principal returned</span><span className="tabular-nums">LKR {formatMoney(preview.principal)}</span></div>
              <div className="flex justify-between"><span>Penalty</span><span className="tabular-nums text-coral">- LKR {formatMoney(preview.penalty)}</span></div>
              <div className="mt-1 flex justify-between border-t border-mint pt-1 font-medium"><span>Credited to savings</span><span className="tabular-nums">LKR {formatMoney(preview.net_credited)}</span></div>
            </div>
            <p className="text-steel">Interest already paid out is not taken back. This cannot be undone.</p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
