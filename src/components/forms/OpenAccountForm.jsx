import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { Field, Input, Select } from '../ui/input.jsx';
import { openAccount } from '../../api/accountApi.js';
import { errorMessage } from '../../lib/utils.js';
import { ageOn, formatMoney } from '../../lib/format.js';

function eligible(plan, customer) {
  if (!plan || plan.plan_name === 'Joint') return true;
  const age = ageOn(customer.date_of_birth);
  if (plan.min_age !== null && age < plan.min_age) return false;
  if (plan.max_age !== null && age > plan.max_age) return false;
  return true;
}

export default function OpenAccountForm({ customers, plans, onOpened, presetCustomerId }) {
  const [planId, setPlanId] = useState('');
  const [holders, setHolders] = useState(presetCustomerId ? [String(presetCustomerId)] : []);
  const [deposit, setDeposit] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const plan = plans.find((p) => String(p.plan_id) === planId);
  const joint = plan?.plan_name === 'Joint';

  function pick(id, checked) {
    if (joint) setHolders((h) => (checked ? [...h, id] : h.filter((x) => x !== id)));
    else setHolders(id ? [id] : []);
  }

  const ready = plan && (joint ? holders.length >= 2 : holders.length === 1)
    && holders.every((id) => eligible(plan, customers.find((c) => String(c.customer_id) === id)));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setDone('');
    try {
      const body = { plan_id: Number(planId), holder_customer_ids: holders.map(Number) };
      if (deposit.trim()) body.initial_deposit = deposit.trim();
      const account = await openAccount(body);
      setDone(`Account ${account.account_number} opened (${account.plan_name}).${account.note ? ` ${account.note}` : ''}`);
      setHolders(presetCustomerId ? [String(presetCustomerId)] : []);
      setDeposit('');
      onOpened?.(account);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Savings plan" htmlFor="oa-plan">
        <Select id="oa-plan" value={planId} onChange={(e) => { setPlanId(e.target.value); setHolders(presetCustomerId ? [String(presetCustomerId)] : []); }} required>
          <option value="">Select a plan</option>
          {plans.map((p) => (
            <option key={p.plan_id} value={p.plan_id}>
              {p.plan_name} - {Number(p.interest_rate)}% p.a., minimum LKR {formatMoney(p.minimum_balance)}
            </option>
          ))}
        </Select>
      </Field>

      {plan && (
        <Field label={joint ? 'Account holders (select two or more)' : 'Account holder'} hint="Only your own customers are listed. Customers outside the plan's age range are disabled.">
          {joint ? (
            <div className="max-h-44 space-y-1 overflow-auto rounded-2xl border border-mint p-2">
              {customers.map((c) => (
                <label key={c.customer_id} className="flex items-center gap-2 text-[14px]">
                  <input type="checkbox" checked={holders.includes(String(c.customer_id))} onChange={(e) => pick(String(c.customer_id), e.target.checked)} />
                  {c.full_name} <span className="text-fog">({c.nic_number})</span>
                </label>
              ))}
            </div>
          ) : (
            <Select value={holders[0] || ''} onChange={(e) => pick(e.target.value)} required aria-label="Account holder">
              <option value="">Select a customer</option>
              {customers.map((c) => {
                const ok = eligible(plan, c);
                return (
                  <option key={c.customer_id} value={c.customer_id} disabled={!ok}>
                    {c.full_name} (age {ageOn(c.date_of_birth)}){ok ? '' : ' - not eligible'}
                  </option>
                );
              })}
            </Select>
          )}
        </Field>
      )}

      <Field label="Opening deposit (LKR, optional)" htmlFor="oa-deposit" hint="Taken as a normal deposit, so it is only accepted between 9:00 AM and 5:00 PM">
        <Input id="oa-deposit" inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value.trim())} placeholder="0.00" />
      </Field>

      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{done}</Alert>
      <Button type="submit" disabled={busy || !ready}>{busy ? 'Opening...' : 'Open account'}</Button>
    </form>
  );
}
