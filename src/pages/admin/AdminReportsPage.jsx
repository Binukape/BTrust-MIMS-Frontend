import PageHeader from '../../components/shared/PageHeader.jsx';
import ReportView from '../../components/shared/ReportView.jsx';

const REPORTS = [
  { key: 'agent-wise', label: '1. Agent-wise' },
  { key: 'account-wise', label: '2. Account-wise' },
  { key: 'active-fds', label: '3. Active FDs' },
  { key: 'interest-distribution', label: '4. Monthly interest' },
  { key: 'customer-activity', label: '5. Customer activity' },
];

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Bank-wide figures. Filter by date range and export as CSV or PDF." />
      <ReportView reports={REPORTS} />
    </>
  );
}
