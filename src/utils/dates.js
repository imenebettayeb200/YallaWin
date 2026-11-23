export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Local YYYY-MM-DD (no timezone shift). */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Combines "YYYY-MM-DD" and "HH:MM" into a local Date. */
export function combineDateTime(isoDate, time) {
  const date = parseISODate(isoDate);
  if (!date) return null;
  const [h, min] = (time || '00:00').split(':').map(Number);
  date.setHours(h || 0, min || 0, 0, 0);
  return date;
}
