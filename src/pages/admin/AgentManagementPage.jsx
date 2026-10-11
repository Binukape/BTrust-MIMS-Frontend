import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Dialog } from '../../components/ui/dialog.jsx';
import { Field, Input, Select } from '../../components/ui/input.jsx';
import { listAgents, createAgent, updateAgent } from '../../api/agentApi.js';
import { listBranches } from '../../api/branchApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { errorMessage } from '../../lib/utils.js';
import { formatDate } from '../../lib/format.js';

const blank = { branch_id: '', agent_name: '', agent_nic: '', username: '', password: '' };

export default function AgentManagementPage() {
  const agents = useLoad(() => listAgents(), []);
  const branches = useLoad(() => listBranches(), []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const isEdit = Boolean(editing?.agent_id);

  function openCreate() {
    setForm(blank);
    setFormError('');
    setEditing({ agent_id: null });
  }

  function openEdit(row) {
    setForm({ branch_id: String(row.branch_id), agent_name: row.agent_name, agent_nic: row.agent_nic, username: row.username, password: '' });
    setFormError('');
    setEditing(row);
  }

  async function save() {
    setBusy(true);
    setFormError('');
    try {
      if (isEdit) {
        const body = { agent_name: form.agent_name, agent_nic: form.agent_nic, username: form.username };
        if (form.password) body.password = form.password;
        await updateAgent(editing.agent_id, body);
      } else {
        await createAgent({ ...form, branch_id: Number(form.branch_id) });
      }
      setMessage(isEdit ? 'Agent updated.' : 'Agent created. Give them their username and password.');
      setEditing(null);
      agents.reload();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    { key: 'agent_name', label: 'Agent' },
    { key: 'branch_name', label: 'Branch' },
    { key: 'agent_nic', label: 'NIC' },
    { key: 'username', label: 'Username' },
    { key: 'customer_count', label: 'Customers', align: 'right' },
    { key: 'created_at', label: 'Created', render: (r) => formatDate(r.created_at) },
    { key: 'actions', label: '', render: (r) => <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Pencil size={13} /> Edit</Button> },
  ];

  return (
    <>
      <PageHeader title="Agents" description="Each agent belongs to exactly one branch, which cannot be changed later. Every change is recorded in the audit log."
        actions={<Button onClick={openCreate}><Plus size={14} /> New agent</Button>} />
      <Alert tone="success" className="mb-4">{message}</Alert>
      <Alert tone="error" className="mb-4">{agents.error || branches.error}</Alert>
      <Card><CardContent><DataTable columns={columns} rows={agents.data} loading={agents.loading} rowKey="agent_id" searchable searchPlaceholder="Search agents..." /></CardContent></Card>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} title={isEdit ? 'Edit agent' : 'New agent'}
        footer={<><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={busy}>{busy ? 'Saving...' : 'Save'}</Button></>}>
        <div className="space-y-3">
          <Field label="Branch" htmlFor="a-branch" hint={isEdit ? 'An agent cannot be moved to a different branch.' : undefined}>
            <Select id="a-branch" value={form.branch_id} onChange={set('branch_id')} disabled={isEdit}>
              <option value="">Select a branch</option>
              {(branches.data || []).map((b) => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
            </Select>
          </Field>
          <Field label="Full name" htmlFor="a-name"><Input id="a-name" value={form.agent_name} onChange={set('agent_name')} maxLength={100} /></Field>
          <Field label="NIC number" htmlFor="a-nic"><Input id="a-nic" value={form.agent_nic} onChange={set('agent_nic')} maxLength={12} /></Field>
          <Field label="Username" htmlFor="a-user"><Input id="a-user" value={form.username} onChange={set('username')} autoComplete="off" /></Field>
          <Field label={isEdit ? 'New password (leave empty to keep the current one)' : 'Password'} htmlFor="a-pass" hint="At least 8 characters">
            <Input id="a-pass" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
          </Field>
          <Alert tone="error">{formError}</Alert>
        </div>
      </Dialog>
    </>
  );
}
