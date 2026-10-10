const moneyFormat = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '-';
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : moneyFormat.format(n);
}

export function formatDateTime(value) {
  if (!value) return '-';
  return String(value).slice(0, 16).replace('T', ' ');
}

export function formatDate(value) {
  return value ? String(value).slice(0, 10) : '-';
}

export function titleCase(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function todayText() {
  const sl = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return sl.toISOString().slice(0, 10);
}

export function isBusinessHours() {
  const sl = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const minutes = sl.getUTCHours() * 60 + sl.getUTCMinutes();
  return minutes >= 9 * 60 && minutes <= 17 * 60;
}

export function ageOn(dateOfBirth, onDate = todayText()) {
  const [by, bm, bd] = String(dateOfBirth).slice(0, 10).split('-').map(Number);
  const [ty, tm, td] = onDate.split('-').map(Number);
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) age -= 1;
  return age;
}
