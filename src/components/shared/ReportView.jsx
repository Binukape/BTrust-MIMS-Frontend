import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Alert } from '../ui/alert.jsx';
import DataTable from './DataTable.jsx';
import DateRangeFilter from './DateRangeFilter.jsx';
import ExportButtons from './ExportButtons.jsx';
import { getReport } from '../../api/reportApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { formatMoney, titleCase } from '../../lib/format.js';
import { cn } from '../../lib/utils.js';

const INTEREST_NAMES = {
  SAVINGS_INTEREST_CREDIT: 'Savings interest',
  FD_INTEREST_CREDIT: 'Fixed Deposit interest',
  FD_MATURITY_INTEREST: 'Fixed Deposit maturity interest',
};

export default function ReportView({ reports }) {
  const [type, setType] = useState(reports[0].key);
  const [range, setRange] = useState({ from: '', to: '' });
  const [applied, setApplied] = useState({ from: '', to: '' });

  const params = {};
  if (applied.from) params.from = applied.from;
  if (applied.to) params.to = applied.to;

  const { data, loading, error } = useLoad(() => getReport(type, params), [type, applied.from, applied.to]);

  const columns = (data?.columns || []).map((c) => ({
    ...c,
    render: (row) => {
      const value = row[c.key];
      if (c.label.includes('(LKR)')) return formatMoney(value);
      if (c.key === 'interest_type') return INTEREST_NAMES[value] || titleCase(value);
      return value ?? '-';
    },
  }));

  return (
    <div className="space-y-6">
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-mist p-1 shadow-edge" role="tablist" aria-label="Reports">
        {reports.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={type === r.key}
            onClick={() => setType(r.key)}
            className={cn(
              'cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium transition-colors',
              type === r.key ? 'bg-mint text-white shadow-edge' : 'text-steel hover:text-ink',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Card key={type}>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>{data?.title || reports.find((r) => r.key === type).label}</CardTitle>
              <CardDescription>{data ? `${data.period}` : 'Loading report...'}</CardDescription>
            </div>
            <div className="flex items-start gap-3">
              {data && <Badge tone="slate">{data.scope}</Badge>}
              <ExportButtons type={type} params={params} disabled={loading || !data} />
            </div>
          </div>
          <DateRangeFilter from={range.from} to={range.to} onChange={setRange} onApply={() => setApplied({ ...range })}
            onClear={() => { setRange({ from: '', to: '' }); setApplied({ from: '', to: '' }); }} />
        </CardHeader>
        <CardContent>
          <Alert tone="error" className="mb-4">{error}</Alert>
          <DataTable columns={columns} rows={data?.rows} loading={loading} empty="No data for the selected period." searchable searchPlaceholder="Filter rows..." />
        </CardContent>
      </Card>
    </div>
  );
}
