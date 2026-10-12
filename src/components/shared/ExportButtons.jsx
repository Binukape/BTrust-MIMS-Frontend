import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { Alert } from '../ui/alert.jsx';
import { downloadReport } from '../../api/reportApi.js';
import { errorMessage } from '../../lib/utils.js';

export default function ExportButtons({ type, params, disabled }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function run(format) {
    setBusy(format);
    setError('');
    try {
      await downloadReport(type, format, params);
    } catch (err) {
      if (err?.response?.data instanceof Blob) {
        try {
          setError(JSON.parse(await err.response.data.text()).message);
        } catch {
          setError('Export failed');
        }
      } else {
        setError(errorMessage(err, 'Export failed'));
      }
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={disabled || busy !== ''} onClick={() => run('csv')}>
          <Download size={14} /> {busy === 'csv' ? 'Preparing...' : 'CSV'}
        </Button>
        <Button variant="outline" size="sm" disabled={disabled || busy !== ''} onClick={() => run('pdf')}>
          <FileText size={14} /> {busy === 'pdf' ? 'Preparing...' : 'PDF'}
        </Button>
      </div>
      <Alert tone="error">{error}</Alert>
    </div>
  );
}
