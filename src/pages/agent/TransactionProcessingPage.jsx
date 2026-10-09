import { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Field, Select } from '../../components/ui/input.jsx';
import DepositWithdrawForm from '../../components/forms/DepositWithdrawForm.jsx';
import { listCustomers } from '../../api/customerApi.js';
import { listAccounts } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';

export default function TransactionProcessingPage() {
  const customers = useLoad(() => listCustomers(), []);
  const [customerId, setCustomerId] = useState('');
  const accounts = useLoad(() => listAccounts({ customer_id: customerId }), [customerId], { enabled: Boolean(customerId) });
  const active = (accounts.data || []).filter((a) => a.status === 'ACTIVE');

  return (
    <>
      <PageHeader title="Process a transaction" description="Deposit or withdraw on behalf of one of your customers. The transaction is recorded under your name." />
      <Alert tone="error" className="mb-4">{customers.error || accounts.error}</Alert>
      <Card>
        <CardContent className="space-y-5">
          <Field label="Customer" htmlFor="tp-customer">
            <Select id="tp-customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Select a customer</option>
              {(customers.data || []).map((c) => <option key={c.customer_id} value={c.customer_id}>{c.full_name} ({c.nic_number})</option>)}
            </Select>
          </Field>
          {customerId && accounts.data && active.length === 0 && <Alert tone="info">This customer has no active accounts.</Alert>}
          {active.length > 0 && <DepositWithdrawForm key={customerId} accounts={active} defaultAccountId={active[0].account_id} onDone={accounts.reload} />}
        </CardContent>
      </Card>
    </>
  );
}
