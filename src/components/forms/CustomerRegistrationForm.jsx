import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { Field, Input } from '../ui/input.jsx';
import { registerCustomer } from '../../api/customerApi.js';
import { errorMessage } from '../../lib/utils.js';
import { todayText } from '../../lib/format.js';

const empty = { full_name: '', nic_number: '', address: '', phone: '', date_of_birth: '', username: '', password: '' };

export default function CustomerRegistrationForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setDone('');
    try {
      const created = await registerCustomer({ ...form, nic_number: form.nic_number.trim().toUpperCase() });
      setDone(`${created.full_name} is registered under you (customer #${created.customer_id}). You can now open a savings account for them.`);
      setForm(empty);
      onCreated?.(created);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="c-name"><Input id="c-name" value={form.full_name} onChange={set('full_name')} required maxLength={100} /></Field>
        <Field label="NIC number" htmlFor="c-nic" hint="12 digits, or 9 digits followed by V or X">
          <Input id="c-nic" value={form.nic_number} onChange={set('nic_number')} required maxLength={12} />
        </Field>
        <Field label="Address" htmlFor="c-address" className="sm:col-span-2"><Input id="c-address" value={form.address} onChange={set('address')} required maxLength={255} /></Field>
        <Field label="Phone" htmlFor="c-phone"><Input id="c-phone" value={form.phone} onChange={set('phone')} required maxLength={20} /></Field>
        <Field label="Date of birth" htmlFor="c-dob" hint="Decides which savings plans the customer is eligible for">
          <Input id="c-dob" type="date" max={todayText()} value={form.date_of_birth} onChange={set('date_of_birth')} required />
        </Field>
        <Field label="Username" htmlFor="c-user" hint="Letters, digits, dot, dash, underscore">
          <Input id="c-user" value={form.username} onChange={set('username')} required minLength={3} maxLength={50} autoComplete="off" />
        </Field>
        <Field label="Initial password" htmlFor="c-pass" hint="At least 8 characters. Give it to the customer.">
          <Input id="c-pass" type="password" value={form.password} onChange={set('password')} required minLength={8} autoComplete="new-password" />
        </Field>
      </div>
      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{done}</Alert>
      <Button type="submit" disabled={busy}>{busy ? 'Registering...' : 'Register customer'}</Button>
    </form>
  );
}
