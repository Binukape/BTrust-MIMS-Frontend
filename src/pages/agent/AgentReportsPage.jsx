import PageHeader from '../../components/shared/PageHeader.jsx';
import ReportView from '../../components/shared/ReportView.jsx';

const REPORTS = [
  { key: 'agent-wise', label: 'Agent-wise transactions' },
  { key: 'account-wise', label: 'Account-wise summary' },
  { key: 'active-fds', label: 'Active Fixed Deposits' },
  { key: 'customer-activity', label: 'Customer activity' },
];

export default function AgentReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Figures for your assigned customers only. Export any report as CSV or PDF." />
      <ReportView reports={REPORTS} />
    </>
  );
}
