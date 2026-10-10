import PageHeader from '../../components/shared/PageHeader.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import CustomerRegistrationForm from '../../components/forms/CustomerRegistrationForm.jsx';
import OpenAccountForm from '../../components/forms/OpenAccountForm.jsx';
import { listCustomers } from '../../api/customerApi.js';
import { listSavingsPlans } from '../../api/accountApi.js';
import { useLoad } from '../../lib/useLoad.js';

export default function CustomerRegistrationPage() {
  const customers = useLoad(() => listCustomers(), []);
  const plans = useLoad(() => listSavingsPlans(), []);

  return (
    <>
      <PageHeader title="Register a customer and open an account" description="New customers are registered by their agent in person, then given a savings account." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Register a new customer</CardTitle>
            <CardDescription>The customer becomes permanently assigned to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerRegistrationForm onCreated={() => customers.reload()} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Open a savings account</CardTitle>
            <CardDescription>The plan must suit the customer's age. Joint accounts need two or more holders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert tone="error" className="mb-3">{customers.error || plans.error}</Alert>
            {customers.data && plans.data && (customers.data.length === 0
              ? <Alert tone="info">Register a customer first.</Alert>
              : <OpenAccountForm customers={customers.data} plans={plans.data} />)}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
