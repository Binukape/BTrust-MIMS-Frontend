import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Dialog, ConfirmDialog } from '../../components/ui/dialog.jsx';
import { Field, Input } from '../../components/ui/input.jsx';
import { listBranches, createBranch, updateBranch, deleteBranch } from '../../api/branchApi.js';
import { useLoad } from '../../lib/useLoad.js';
import { errorMessage } from '../../lib/utils.js';

const blank = { branch_name: '', branch_address: '', branch_phone: '' };

export default function BranchManagementPage() {
  const branches = useLoad(() => listBranches(), []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState({ tone: '', text: '' });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openCreate() {
    setForm(blank);
    setFormError('');
    setEditing({ branch_id: null });
  }

  function openEdit(row) {
    setForm({ branch_name: row.branch_name, branch_address: row.branch_address, branch_phone: row.branch_phone });
    setFormError('');
    setEditing(row);
  }

  async function save() {
    setBusy(true);
    setFormError('');
    try {
      if (editing.branch_id) await updateBranch(editing.branch_id, form);
      else await createBranch(form);
      setMessage({ tone: 'success', text: editing.branch_id ? 'Branch updated.' : 'Branch created.' });
      setEditing(null);
      branches.reload();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await deleteBranch(removing.branch_id);
      setMessage({ tone: 'success', text: `${removing.branch_name} deleted.` });
      branches.reload();
    } catch (err) {
      setMessage({ tone: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
      setRemoving(null);
    }
  }

  const columns = [
    { key: 'branch_name', label: 'Branch' },
    { key: 'branch_address', label: 'Address' },
    { key: 'branch_phone', label: 'Phone' },
    { key: 'agent_count', label: 'Agents', align: 'right' },
    { key: 'account_count', label: 'Accounts', align: 'right' },
    {
      key: 'actions', label: '', render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Pencil size={13} /> Edit</Button>
          <Button size="sm" variant="ghost" className="text-coral" onClick={() => setRemoving(r)}><Trash2 size={13} /> Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Branches" description="A branch that still has agents or accounts cannot be deleted. Every change is recorded in the audit log."
        actions={<Button onClick={openCreate}><Plus size={14} /> New branch</Button>} />
      <Alert tone={message.tone || 'info'} className="mb-4">{message.text}</Alert>
      <Alert tone="error" className="mb-4">{branches.error}</Alert>
      <Card><CardContent><DataTable columns={columns} rows={branches.data} loading={branches.loading} rowKey="branch_id" searchable searchPlaceholder="Search branches..." /></CardContent></Card>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.branch_id ? 'Edit branch' : 'New branch'}
        footer={<><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={busy}>{busy ? 'Saving...' : 'Save'}</Button></>}>
        <div className="space-y-3">
          <Field label="Branch name" htmlFor="b-name"><Input id="b-name" value={form.branch_name} onChange={set('branch_name')} maxLength={100} /></Field>
          <Field label="Address" htmlFor="b-address"><Input id="b-address" value={form.branch_address} onChange={set('branch_address')} maxLength={255} /></Field>
          <Field label="Telephone" htmlFor="b-phone"><Input id="b-phone" value={form.branch_phone} onChange={set('branch_phone')} maxLength={20} /></Field>
          <Alert tone="error">{formError}</Alert>
        </div>
      </Dialog>

      <ConfirmDialog open={Boolean(removing)} title="Delete branch?" confirmLabel="Delete" destructive busy={busy} onConfirm={remove} onClose={() => setRemoving(null)}>
        <p className="text-[14px] text-steel">Delete <b>{removing?.branch_name}</b>? This only works if it has no agents or accounts.</p>
      </ConfirmDialog>
    </>
  );
}
