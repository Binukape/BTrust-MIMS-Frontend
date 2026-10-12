import { Field, Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';

export default function DateRangeFilter({ from, to, onChange, onApply, onClear, extra }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field label="From" htmlFor="range-from">
        <Input id="range-from" type="date" value={from} onChange={(e) => onChange({ from: e.target.value, to })} />
      </Field>
      <Field label="To" htmlFor="range-to">
        <Input id="range-to" type="date" value={to} onChange={(e) => onChange({ from, to: e.target.value })} />
      </Field>
      {extra}
      <Button onClick={onApply}>Apply</Button>
      <Button variant="ghost" onClick={onClear}>Clear</Button>
    </div>
  );
}
