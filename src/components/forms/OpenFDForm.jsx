import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { Field, Input, Select } from '../ui/input.jsx';
import { openFixedDeposit } from '../../api/fixedDepositApi.js';
import { errorMessage } from '../../lib/utils.js';
import { formatMoney } from '../../lib/format.js';

export default function OpenFDForm({ account, plans, onDone }) {
  const [planId, setPlanId] = useState('');
  const [principal, setPrincipal] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const plan = plans.find((p) => String(p.fd_plan_id) === planId);
  const value = Number(principal);
  const valid = /^\d+(\.\d{1,2})?$/.test(principal) && value > 0;
  const balance = Number(account.balance);
  const minimum = Number(account.minimum_balance);
  const monthly = plan && valid ? (value * Number(plan.interest_rate) / 100) * (30 / 365) : null;
  const tooBig = valid && balance - value < minimum;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResult('');
    try {
      const data = await openFixedDeposit({ account_id: account.account_id, fd_plan_id: Number(planId), principal_amount: principal });
      setResult(`Fixed Deposit opened. It matures on ${data.maturity_date}.`);
      setPrincipal('');
      setPlanId('');
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
        <Field label="Tenure" htmlFor="fd-plan">
          <Select id="fd-plan" value={planId} onChange={(e) => setPlanId(e.target.value)} required>
            <option value="">Select a tenure</option>
            {plans.map((p) => (
              <option key={p.fd_plan_id} value={p.fd_plan_id}>
                {p.tenure_months >= 12 ? `${p.tenure_months / 12} year${p.tenure_months > 12 ? 's' : ''}` : `${p.tenure_months} months`} - {Number(p.interest_rate)}% p.a.
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Amount to deposit (LKR)" htmlFor="fd-principal" hint={`Available above the plan minimum: LKR ${formatMoney(Math.max(0, balance - minimum))}`}>
          <Input id="fd-principal" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value.trim())} placeholder="0.00" required />
        </Field>
      </div>
      {monthly !== null && (
        <Alert tone="info">
          Interest of about LKR {formatMoney(monthly)} is paid into the savings account every 30 days. The amount is taken out of the savings balance now
          and returned at maturity.
        </Alert>
      )}
      {tooBig && <Alert tone="warning">The savings balance would fall below the plan minimum of LKR {formatMoney(minimum)}.</Alert>}
      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{result}</Alert>
      <Button type="submit" disabled={busy || !planId || !valid}>{busy ? 'Opening...' : 'Open Fixed Deposit'}</Button>
    </form>
  );
}
