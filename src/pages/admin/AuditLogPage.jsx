import { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Field, Select } from '../../components/ui/input.jsx';
import { getAuditLog } from '../../api/reportApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { formatDateTime } from '../../lib/format.js';

function changes(row) {
  const oldV = row.old_values && typeof row.old_values === 'string' ? JSON.parse(row.old_values) : row.old_values;
  const newV = row.new_values && typeof row.new_values === 'string' ? JSON.parse(row.new_values) : row.new_values;
  if (row.action === 'INSERT') return Object.entries(newV || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
  if (row.action === 'DELETE') return Object.entries(oldV || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
  return Object.keys(newV || {})
    .filter((k) => String(oldV?.[k]) !== String(newV[k]))
    .map((k) => (k === 'password_changed' ? 'password changed' : `${k}: ${oldV?.[k] ?? '-'} -> ${newV[k]}`))
    .join('; ') || 'no visible change';
}

export default function AuditLogPage() {
  const [table, setTable] = useState('');
  const { data, loading, error } = useLoad(() => getAuditLog(table ? { table } : {}), [table]);

  const columns = [
    { key: 'changed_at', label: 'When (Sri Lanka time)', render: (r) => formatDateTime(r.changed_at) },
    { key: 'admin_name', label: 'Administrator' },
    { key: 'action', label: 'Action', render: (r) => <Badge tone={r.action === 'DELETE' ? 'red' : r.action === 'INSERT' ? 'green' : 'blue'}>{r.action}</Badge> },
    { key: 'table_name', label: 'Table' },
    { key: 'record_id', label: 'Row', align: 'right' },
    { key: 'details', label: 'What changed', render: changes },
  ];

  return (
    <>
      <PageHeader title="Audit log" description="Every administrative change to branches, agents and savings plans, with who made it and when. The log cannot be edited or deleted." />
      <Card>
        <CardContent className="space-y-4">
          <Field label="Table" htmlFor="audit-table" className="max-w-xs">
            <Select id="audit-table" value={table} onChange={(e) => setTable(e.target.value)}>
              <option value="">All tables</option>
              <option value="branch">Branches</option>
              <option value="agent">Agents</option>
              <option value="savings_plan">Savings plans</option>
            </Select>
          </Field>
          <Alert tone="error">{error}</Alert>
          <DataTable columns={columns} rows={data} loading={loading} rowKey="log_id" empty="Nothing has been logged yet." searchable searchPlaceholder="Search the log..." />
          <p className="text-[13px] text-steel">Shows the latest 300 entries.</p>
        </CardContent>
      </Card>
    </>
  );
}
