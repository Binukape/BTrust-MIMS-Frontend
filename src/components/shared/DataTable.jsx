import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { cn } from '../../lib/utils.js';

export default function DataTable({
  columns, rows, loading, empty = 'Nothing to show yet.', searchable = false, searchPlaceholder = 'Search...', rowKey, onRowClick, selectedKey,
}) {
  const [term, setTerm] = useState('');

  const visible = useMemo(() => {
    if (!searchable || !term.trim() || !rows) return rows || [];
    const needle = term.trim().toLowerCase();
    return rows.filter((row) => columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(needle)));
  }, [rows, term, searchable, columns]);

  return (
    <div>
      {searchable && (
        <div className="relative mb-4 max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-steel" />
          <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder={searchPlaceholder} className="pl-10" aria-label="Search table" />
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl shadow-edge">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-mist">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={cn('eyebrow whitespace-nowrap px-4 py-3 !text-[11px]', c.align === 'right' && 'text-right')}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-mint">
            {loading && [0, 1, 2, 3, 4].map((n) => (
              <tr key={`sk-${n}`}>
                {columns.map((c, ci) => (
                  <td key={c.key} className="px-4 py-4">
                    <Skeleton className="h-4" style={{ width: `${55 + ((n * 17 + ci * 23) % 40)}%`, animationDelay: `${(n + ci) * 90}ms` }} />
                  </td>
                ))}
              </tr>
            ))}
            {!loading && visible.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-steel">{empty}</td></tr>
            )}
            {!loading && visible.map((row, index) => {
              const key = rowKey ? row[rowKey] : index;
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={{ '--i': Math.min(index, 14) }}
                  className={cn('animate-row', onRowClick && 'cursor-pointer hover:bg-mist', selectedKey !== undefined && selectedKey === key && 'bg-mist')}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-4 py-3 align-top text-ink', c.align === 'right' && 'text-right tabular-nums')}>
                      {c.render ? c.render(row) : (row[c.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
