import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { Field, Input, Select } from '../ui/input.jsx';
import { deposit, withdraw } from '../../api/transactionApi.js';
import { errorMessage } from '../../lib/utils.js';
import { formatMoney, isBusinessHours } from '../../lib/format.js';

const DAILY_LIMIT = 100000;

export default function DepositWithdrawForm({ accounts, defaultAccountId, onDone }) {
  const [accountId, setAccountId] = useState(defaultAccountId ? String(defaultAccountId) : '');
  const [kind, setKind] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const account = accounts.find((a) => String(a.account_id) === accountId);
  const value = Number(amount);
  const validAmount = /^\d+(\.\d{1,2})?$/.test(amount) && value > 0;
  const balance = account ? Number(account.balance) : 0;
  const minimum = account ? Number(account.minimum_balance) : 0;
  const newBalance = kind === 'deposit' ? balance + value : balance - value;

  const warnings = [];
  if (!isBusinessHours()) warnings.push('Transactions are only accepted between 9:00 AM and 5:00 PM (Sri Lanka time).');
  if (account && validAmount && kind === 'withdraw') {
    if (value > DAILY_LIMIT) warnings.push(`The daily withdrawal limit is LKR ${formatMoney(DAILY_LIMIT)} per account.`);
    if (newBalance < minimum) warnings.push(`This would leave the balance below the ${account.plan_name} plan minimum of LKR ${formatMoney(minimum)}.`);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const action = kind === 'deposit' ? deposit : withdraw;
      const data = await action(Number(accountId), amount);
      setResult(`${kind === 'deposit' ? 'Deposit' : 'Withdrawal'} of LKR ${formatMoney(amount)} recorded. Reference ${data.reference_number}`);
      setAmount('');
      onDone?.();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Account" htmlFor="tx-account">
          <Select id="tx-account" value={accountId} onChange={(e) => { setAccountId(e.target.value); setResult(null); }} required>
            <option value="">Select an account</option>
            {accounts.map((a) => (
              <option key={a.account_id} value={a.account_id}>{a.account_number} - {a.holder_names}</option>
            ))}
          </Select>
        </Field>
        <Field label="Transaction" htmlFor="tx-kind">
          <Select id="tx-kind" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdrawal</option>
          </Select>
        </Field>
        <Field label="Amount (LKR)" htmlFor="tx-amount" hint="Up to 2 decimals">
          <Input id="tx-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.trim())} placeholder="0.00" required />
        </Field>
        {account && (
          <div className="rounded-2xl bg-mist px-3 py-2 text-[14px]">
            <div className="flex justify-between"><span className="text-steel">Current balance</span><span className="font-medium tabular-nums">LKR {formatMoney(balance)}</span></div>
            <div className="flex justify-between"><span className="text-steel">Balance after</span>
              <span className={`font-medium tabular-nums ${validAmount && newBalance < minimum && kind === 'withdraw' ? 'text-coral' : ''}`}>
                {validAmount ? `LKR ${formatMoney(newBalance)}` : '-'}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-steel">Plan minimum</span><span className="tabular-nums">LKR {formatMoney(minimum)}</span></div>
          </div>
        )}
      </div>
      {warnings.map((w) => <Alert key={w} tone="warning">{w}</Alert>)}
      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{result}</Alert>
      <Button type="submit" disabled={busy || !accountId || !validAmount}>
        {busy ? 'Processing...' : kind === 'deposit' ? 'Make deposit' : 'Make withdrawal'}
      </Button>
    </form>
  );
}
